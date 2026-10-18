const GUIDE = "https://entrepta.vercel.app/docs/migrating-to-v4";

interface Removal {
  version: string;
  /** What to do instead, in one short sentence. */
  note: string;
}

/**
 * Items that left the registry. `add` names them and points at the guide, so
 * a removed item does not read like a typo.
 */
export const REMOVED: Record<string, Removal> = {};

export function removedMessage(
  name: string,
  table: Record<string, Removal> = REMOVED
): string | undefined {
  const entry = Object.hasOwn(table, name) ? table[name] : undefined;
  if (!entry) return undefined;
  return `"${name}" was removed in ${entry.version}. ${entry.note} See ${GUIDE}`;
}
