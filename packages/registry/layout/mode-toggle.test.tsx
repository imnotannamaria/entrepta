import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ModeScript, ModeToggle } from "./mode-toggle";

function clearStorage() {
  for (const key of ["entrepta:mode", "myapp:mode"]) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
}

beforeEach(() => {
  clearStorage();
  document.documentElement.removeAttribute("data-mode");
});

afterEach(() => {
  document.documentElement.removeAttribute("data-mode");
});

describe("ModeToggle", () => {
  it("renders a button labelled with the current and next mode", () => {
    render(<ModeToggle />);
    const button = screen.getByRole("button", { name: /Mode: dark\. Switch to light\./i });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles data-mode and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
    expect(window.localStorage.getItem("entrepta:mode")).toBe("light");

    await user.click(screen.getByRole("button"));
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });

  it("calls onModeChange with the new mode", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(<ModeToggle onModeChange={onModeChange} />);
    await user.click(screen.getByRole("button"));
    expect(onModeChange).toHaveBeenCalledWith("light");
  });

  it("hydrates from localStorage", () => {
    window.localStorage.setItem("entrepta:mode", "light");
    render(<ModeToggle />);
    expect(screen.getByRole("button", { name: /Mode: light\. Switch to dark\./i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("labeled variant shows the mode name", () => {
    render(<ModeToggle variant="labeled" />);
    expect(screen.getByRole("button")).toHaveTextContent("dark");
  });

  it("icon variant renders no text label", () => {
    render(<ModeToggle />);
    expect(screen.getByRole("button")).not.toHaveTextContent("dark");
  });

  it("renders inline by default and floats with position", () => {
    const { rerender } = render(<ModeToggle />);
    expect(screen.getByRole("button").className).not.toMatch(/fixed/);
    rerender(<ModeToggle position="top-left" />);
    const floating = screen.getByRole("button");
    expect(floating.className).toMatch(/fixed/);
    expect(floating.className).toMatch(/top-5/);
    expect(floating.className).toMatch(/left-5/);
  });

  it("respects a custom storageKey", async () => {
    const user = userEvent.setup();
    render(<ModeToggle storageKey="myapp" />);
    await user.click(screen.getByRole("button"));
    expect(window.localStorage.getItem("myapp:mode")).toBe("light");
    expect(window.localStorage.getItem("entrepta:mode")).toBeNull();
  });

  it("a consumer onClick can preventDefault to block the toggle", async () => {
    const user = userEvent.setup();
    render(<ModeToggle onClick={(event) => event.preventDefault()} />);
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });
});

describe("ModeScript", () => {
  it("emits an inline script that reads the default storage key", () => {
    const { container } = render(<ModeScript />);
    expect(container.querySelector("script")?.innerHTML).toContain("entrepta:mode");
  });

  it("respects a custom storageKey", () => {
    const { container } = render(<ModeScript storageKey="myapp" />);
    expect(container.querySelector("script")?.innerHTML).toContain("myapp:mode");
  });
});
