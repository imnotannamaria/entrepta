import { describe, expect, it } from "vitest";
import { COMPONENTS } from "../registry/components.js";
import { REMOVED, removedMessage } from "../registry/removed.js";

const TABLE = { gone: { version: "4.0.0", note: 'Use EmptyState with size="page".' } };

describe("removed items", () => {
  it("names the version, a way forward and the guide", () => {
    const message = removedMessage("gone", TABLE);
    expect(message).toContain("removed in 4.0.0");
    expect(message).toContain("EmptyState");
    expect(message).toContain("/docs/migrating-to-v4");
  });

  it("knows nothing about a name that never existed, or an inherited key", () => {
    expect(removedMessage("nonexistent", TABLE)).toBeUndefined();
    expect(removedMessage("constructor", TABLE)).toBeUndefined();
  });

  it("names every item the editor look took with it", () => {
    for (const name of ["status-bar", "chrome-message", "sect-head", "page-outline", "doc-parts"]) {
      expect(removedMessage(name)).toContain(`"${name}" was removed in 4.0.0`);
    }
  });

  it("never lists an item the registry still ships", () => {
    const shipped = new Set(COMPONENTS.map((c) => c.name));
    expect(Object.keys(REMOVED).filter((name) => shipped.has(name))).toEqual([]);
  });
});
