import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemeScript, ThemeSwitcher } from "./theme-switcher";

const THEMES = [
  { id: "entrepta", label: "entrepta", color: "#7C6BFF", lightColor: "#6B5BFF" },
  { id: "blossom", label: "blossom", color: "#CC2E36" },
  { id: "ivy", label: "ivy", color: "#35A365" },
] as const;

function clearStorage() {
  for (const key of ["entrepta:theme", "entrepta:mode"]) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
}

beforeEach(() => {
  clearStorage();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-mode");
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-mode");
});

describe("ThemeSwitcher", () => {
  it("renders the trigger collapsed by default", () => {
    render(<ThemeSwitcher themes={THEMES} />);
    const trigger = screen.getByRole("button", { name: /Theme: entrepta/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: /blossom/i })).not.toBeInTheDocument();
  });

  it("opens the panel and lists every theme", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher themes={THEMES} />);
    await user.click(screen.getByRole("button", { name: /Theme: entrepta/i }));
    const panel = screen.getByLabelText("Theme settings");
    for (const t of THEMES) {
      expect(
        within(panel).getByRole("button", { name: new RegExp(t.label, "i") })
      ).toBeInTheDocument();
    }
  });

  it("selecting a theme updates data-theme and closes the panel", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher themes={THEMES} />);
    await user.click(screen.getByRole("button", { name: /Theme: entrepta/i }));
    const panel = screen.getByLabelText("Theme settings");
    await user.click(within(panel).getByRole("button", { name: /blossom/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("blossom");
    expect(screen.queryByLabelText("Theme settings")).not.toBeInTheDocument();
  });

  it("Escape closes the open panel", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher themes={THEMES} />);
    await user.click(screen.getByRole("button", { name: /Theme: entrepta/i }));
    expect(screen.getByLabelText("Theme settings")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByLabelText("Theme settings")).not.toBeInTheDocument();
  });

  it("toggles mode from the panel", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher themes={THEMES} />);
    await user.click(screen.getByRole("button", { name: /Theme: entrepta/i }));
    await user.click(screen.getByRole("button", { name: /→ light/i }));
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
  });

  it("hideModeToggle removes the mode section and the trigger label", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher themes={THEMES} hideModeToggle />);
    const trigger = screen.getByRole("button", { name: /Theme: entrepta\. Click to change\./i });
    await user.click(trigger);
    expect(screen.queryByRole("button", { name: /→ light/i })).not.toBeInTheDocument();
  });

  it("position prop changes the anchor class", () => {
    const { container } = render(<ThemeSwitcher themes={THEMES} position="top-left" />);
    const root = container.querySelector("[data-theme-switcher]");
    expect(root).not.toBeNull();
    expect(root?.className).toMatch(/top-5/);
    expect(root?.className).toMatch(/left-5/);
  });
});

describe("ThemeScript", () => {
  it("emits an inline script that reads the default storage key", () => {
    const { container } = render(<ThemeScript />);
    const script = container.querySelector("script");
    expect(script?.innerHTML).toContain("entrepta:theme");
    expect(script?.innerHTML).toContain("entrepta:mode");
  });

  it("respects a custom storageKey", () => {
    const { container } = render(<ThemeScript storageKey="myapp" />);
    const script = container.querySelector("script");
    expect(script?.innerHTML).toContain("myapp:theme");
  });
});
