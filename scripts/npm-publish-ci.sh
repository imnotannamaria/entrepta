#!/usr/bin/env bash
set -euo pipefail

# Publishes @entrepta/registry and @entrepta/cli from CI, in that order.
#
# changeset publish always shells out to `pnpm publish` when a pnpm-lock.yaml
# is present, with no flag to override that. pnpm publish in turn delegates
# the actual network call to whatever npm binary is on PATH — but that
# passthrough does not reliably perform npm's OIDC trusted publishing
# handshake. See https://github.com/pnpm/pnpm/issues/9812, comment from
# atmask on 2026-01-14: identical npm 11.6 + Node 24 setup published fine
# with plain `npm publish` and 404'd with `pnpm publish`.
#
# So this script packs with pnpm, which correctly rewrites workspace:* to a
# real version in the tarball, and publishes with npm, which is where OIDC
# is well supported. Run by .github/workflows/release.yml as the changesets
# custom publish script — see that file for why.
#
# changesets/action passes this script CHANGESETS_OUTPUT as an env var. Each
# ndjson line appended there tells the action which git tags to create and
# push, the same thing `changeset publish` would do internally.

cd "$(dirname "$0")/.."

PACKAGE_DIRS=(packages/registry packages/cli)

for pkg_dir in "${PACKAGE_DIRS[@]}"; do
  name="$(node -p "require('./${pkg_dir}/package.json').name")"
  version="$(node -p "require('./${pkg_dir}/package.json').version")"

  if npm view "${name}@${version}" version >/dev/null 2>&1; then
    echo "skip ${name}@${version} — already on npm"
    continue
  fi

  echo "packing ${name}@${version}"
  tmpdir="$(mktemp -d)"
  pnpm --filter "${name}" pack --pack-destination "${tmpdir}"
  tarball="$(find "${tmpdir}" -maxdepth 1 -name '*.tgz' | head -1)"
  if [[ -z "${tarball}" ]]; then
    echo "pnpm pack produced no tarball for ${name}" >&2
    exit 1
  fi

  echo "publishing ${name}@${version}"
  npm publish "${tarball}" --access public --provenance

  if [[ -n "${CHANGESETS_OUTPUT:-}" ]]; then
    printf '{"type":"git-tag","tag":"%s@%s","packageName":"%s"}\n' \
      "${name}" "${version}" "${name}" >>"${CHANGESETS_OUTPUT}"
  fi
done
