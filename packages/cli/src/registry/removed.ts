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
export const REMOVED: Record<string, Removal> = {
  "status-bar": {
    version: "4.0.0",
    note: "It moved into the docs app, with the rest of the editor look.",
  },
  "chrome-message": { version: "4.0.0", note: 'Use EmptyState with size="page".' },
  "sect-head": { version: "4.0.0", note: "It left with the editor look." },
  "page-outline": { version: "4.0.0", note: "It left with the editor look." },
  "doc-parts": { version: "4.0.0", note: "It left with the editor look." },
  diamond: { version: "4.0.0", note: "No component draws the ◆ anymore. Pass an icon instead." },
  spotlight: { version: "4.0.0", note: "The glow that follows the cursor is gone." },
  "spotlight-card": {
    version: "4.0.0",
    note: "Use Card. The glow that follows the cursor is gone.",
  },
};

export function removedMessage(
  name: string,
  table: Record<string, Removal> = REMOVED
): string | undefined {
  const entry = Object.hasOwn(table, name) ? table[name] : undefined;
  if (!entry) return undefined;
  return `"${name}" was removed in ${entry.version}. ${entry.note} See ${GUIDE}`;
}
