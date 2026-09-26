import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChromeMessage } from "./chrome-message";

describe("ChromeMessage", () => {
  it("renders the command, output, title as h1, note and action", () => {
    render(
      <ChromeMessage
        command="cat ./missing"
        output="cat: ./missing: No such file"
        title="Page not found."
        note="it moved, or never existed"
        action={<a href="/">go home</a>}
      />
    );
    expect(screen.getByText("cat ./missing")).toBeInTheDocument();
    expect(screen.getByText("cat: ./missing: No such file")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Page not found." })).toBeInTheDocument();
    expect(screen.getByText("it moved, or never existed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "go home" })).toBeInTheDocument();
  });

  it("colors the prompt by accent and hides it from screen readers", () => {
    const { rerender } = render(<ChromeMessage command="x" title="t" note="n" />);
    const prompt = () => screen.getByText("$");
    expect(prompt()).toHaveClass("text-[var(--fg-brand)]");
    expect(prompt()).toHaveAttribute("aria-hidden");
    rerender(<ChromeMessage command="x" title="t" note="n" accent="error" />);
    expect(prompt()).toHaveClass("text-[var(--status-error-fg)]");
  });

  it("renders children between the note and the action", () => {
    render(
      <ChromeMessage command="x" title="t" note="n" action={<button type="button">retry</button>}>
        <p>digest: abc123</p>
      </ChromeMessage>
    );
    const digest = screen.getByText("digest: abc123");
    const retry = screen.getByRole("button", { name: "retry" });
    expect(digest.compareDocumentPosition(retry) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
