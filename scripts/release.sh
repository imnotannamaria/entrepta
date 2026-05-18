#!/usr/bin/env bash
set -euo pipefail

# Manual release script for entrepta.
#
# Flow:
#   1. preflight checks (clean tree, on main, in sync, logged in to npm)
#   2. consumes pending changesets → bumps versions + updates CHANGELOG
#   3. build, test, typecheck
#   4. publishes @entrepta/registry, then @entrepta/cli (order matters: cli depends on registry)
#   5. commits version bump and pushes (with tags)
#
# Prereqs: at least one changeset in .changeset/ (created via `pnpm changeset`).

cd "$(dirname "$0")/.."

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "\033[32m✓\033[0m %s\n" "$1"; }
fail() { printf "\033[31m✗\033[0m %s\n" "$1" >&2; exit 1; }
step() { printf "\n\033[36m→\033[0m %s\n" "$1"; }

# ── preflight ────────────────────────────────────────────────────────────

bold "Preflight checks"

if [[ -n "$(git status --porcelain)" ]]; then
  fail "Working tree is not clean. Commit or stash first."
fi
ok "git working tree clean"

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "main" ]]; then
  fail "Not on main (current: $current_branch). Switch to main first."
fi
ok "on main branch"

git fetch origin main --quiet
local_sha="$(git rev-parse HEAD)"
remote_sha="$(git rev-parse origin/main)"
if [[ "$local_sha" != "$remote_sha" ]]; then
  fail "Local main is out of sync with origin/main. Pull or push first."
fi
ok "in sync with origin/main"

if ! npm whoami >/dev/null 2>&1; then
  fail "Not logged in to npm. Run 'npm login' first."
fi
ok "logged in as $(npm whoami)"

pending_changesets="$(find .changeset -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')"
if [[ "$pending_changesets" == "0" ]]; then
  fail "No pending changesets in .changeset/. Run 'pnpm changeset' first."
fi
ok "${pending_changesets} pending changeset(s)"

# ── bump versions ────────────────────────────────────────────────────────

step "Bumping versions from changesets"
pnpm changeset version

registry_version="$(node -p "require('./packages/registry/package.json').version")"
cli_version="$(node -p "require('./packages/cli/package.json').version")"
ok "@entrepta/registry  → ${registry_version}"
ok "@entrepta/cli       → ${cli_version}"

if npm view "@entrepta/registry@${registry_version}" version >/dev/null 2>&1; then
  fail "@entrepta/registry@${registry_version} is already on npm. Something is off — abort."
fi

if npm view "@entrepta/cli@${cli_version}" version >/dev/null 2>&1; then
  fail "@entrepta/cli@${cli_version} is already on npm. Something is off — abort."
fi

# ── build + test ─────────────────────────────────────────────────────────

step "Building"
pnpm build

step "Running tests"
pnpm test

step "Running typecheck"
pnpm typecheck

# ── confirm ──────────────────────────────────────────────────────────────

echo
bold "Ready to publish"
echo "  @entrepta/registry  →  ${registry_version}"
echo "  @entrepta/cli       →  ${cli_version}"
echo
echo "Pending git changes (will be committed after publish):"
git status --short
echo
read -r -p "Continue? You'll be prompted for your 2FA code. [y/N] " answer
if [[ ! "$answer" =~ ^[Yy]$ ]]; then
  echo "Aborted. Reverting version bump..."
  git checkout -- .
  exit 1
fi

# ── publish ──────────────────────────────────────────────────────────────

step "Publishing @entrepta/registry@${registry_version}"
pnpm --filter @entrepta/registry publish --access public --no-git-checks --no-provenance

step "Publishing @entrepta/cli@${cli_version}"
pnpm --filter @entrepta/cli publish --access public --no-git-checks --no-provenance

# ── commit + push ────────────────────────────────────────────────────────

step "Committing version bump"
git add .
git commit -m "chore: release @entrepta/cli@${cli_version} + @entrepta/registry@${registry_version}"

step "Tagging"
git tag "@entrepta/registry@${registry_version}"
git tag "@entrepta/cli@${cli_version}"

step "Pushing to origin"
git push origin main
git push origin --tags

# ── done ─────────────────────────────────────────────────────────────────

echo
ok "Published @entrepta/registry@${registry_version}"
ok "Published @entrepta/cli@${cli_version}"
echo
bold "Verify"
echo "  npm view @entrepta/cli@${cli_version}"
echo "  npx @entrepta/cli@latest init  (in a fresh Next.js project)"
