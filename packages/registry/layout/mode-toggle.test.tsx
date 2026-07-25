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

  it("fades the moon out and the sun in when the mode flips", async () => {
    const user = userEvent.setup();
    const { container } = render(<ModeToggle />);
    const moon = () => container.querySelector(".lucide-moon")?.getAttribute("class") ?? "";
    const sun = () => container.querySelector(".lucide-sun")?.getAttribute("class") ?? "";

    // Both icons stay mounted so the swap can animate; opacity says which one shows.
    expect(moon()).toContain("opacity-100");
    expect(sun()).toContain("opacity-0");

    await user.click(screen.getByRole("button"));
    expect(moon()).toContain("opacity-0");
    expect(sun()).toContain("opacity-100");
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

  it("stays in sync with another toggle on the page", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ModeToggle variant="labeled" data-testid="nav" />
        <ModeToggle variant="labeled" data-testid="corner" />
      </>
    );
    await user.click(screen.getByTestId("nav"));
    expect(screen.getByTestId("nav")).toHaveAttribute("data-mode", "light");
    expect(screen.getByTestId("corner")).toHaveAttribute("data-mode", "light");
    expect(screen.getByTestId("corner")).toHaveTextContent("light");
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
