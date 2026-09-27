import registry from "@entrepta/registry/package.json";

/**
 * The published version, read from the registry's package.json. The Changesets
 * version PR bumps it, so the site's labels move with each release by themselves.
 */
export const VERSION = registry.version;

/** Major and minor, for the labels in the chrome: "v2.1". */
export const VERSION_LABEL = `v${VERSION.split(".").slice(0, 2).join(".")}`;
