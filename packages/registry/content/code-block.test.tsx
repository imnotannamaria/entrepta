import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";

const SAMPLE = "npx entrepta init --theme=ivy";

function mockClipboard() {
  const writeText = vi.fn(async () => undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

describe("CodeBlock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the raw code inside a <code> element when no children are provided", () => {
    render(<CodeBlock code={SAMPLE} />);
    expect(screen.getByText(SAMPLE)).toBeInTheDocument();
    expect(screen.getByText(SAMPLE).tagName.toLowerCase()).toBe("code");
  });

  it("renders custom children instead of the raw code when provided", () => {
    render(
      <CodeBlock code={SAMPLE}>
        <span data-testid="custom">rich content</span>
      </CodeBlock>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    // Raw code text is not rendered when children take over the body
    expect(screen.queryByText(SAMPLE)).not.toBeInTheDocument();
  });

  it("shows filename, meta and language labels in the chrome", () => {
    render(<CodeBlock code={SAMPLE} filename="install.sh" meta="~/your-app" language="bash" />);
    expect(screen.getByText("install.sh")).toBeInTheDocument();
    expect(screen.getByText("~/your-app")).toBeInTheDocument();
    expect(screen.getByText("bash")).toBeInTheDocument();
  });

  it("renders three macOS-style dots when variant is terminal", () => {
    const { container } = render(<CodeBlock code={SAMPLE} variant="terminal" />);
    const dots = container.querySelectorAll("[aria-hidden] span.rounded-full");
    expect(dots.length).toBe(3);
  });

  it("does not render macOS dots in default variant", () => {
    const { container } = render(<CodeBlock code={SAMPLE} variant="default" />);
    const dots = container.querySelectorAll("[aria-hidden] span.rounded-full");
    expect(dots.length).toBe(0);
  });

  it("hides the chrome entirely when no labels and copy disabled", () => {
    const { container } = render(<CodeBlock code={SAMPLE} showCopy={false} />);
    // No chrome → no copy button, no filename
    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
    // No header div with the bottom border
    const header = container.querySelector(".border-b");
    expect(header).toBeNull();
  });

  it("copies the code to the clipboard when the copy button is clicked", async () => {
    const writeText = mockClipboard();
    render(<CodeBlock code={SAMPLE} />);
    const button = screen.getByRole("button", { name: /copy code/i });
    fireEvent.click(button);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(SAMPLE));
  });

  it("swaps to the 'copied' state after a successful copy and reverts after the timeout", async () => {
    mockClipboard();
    render(<CodeBlock code={SAMPLE} copyTimeout={50} />);
    const button = screen.getByRole("button", { name: /copy code/i });
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute("data-state", "copied"));
    expect(button).toHaveAccessibleName("Copied");

    await waitFor(() => expect(button).toHaveAttribute("data-state", "idle"), { timeout: 500 });
  });

  it("does not throw when navigator.clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    render(<CodeBlock code={SAMPLE} />);
    const button = screen.getByRole("button", { name: /copy code/i });
    expect(() => fireEvent.click(button)).not.toThrow();
    // Still flips to copied state since we don't gate on a working clipboard
    await waitFor(() => expect(button).toHaveAttribute("data-state", "copied"));
  });

  it("renders the copy button by default but hides it when showCopy is false", () => {
    const { rerender } = render(<CodeBlock code={SAMPLE} />);
    expect(screen.getByRole("button", { name: /copy code/i })).toBeInTheDocument();
    rerender(<CodeBlock code={SAMPLE} showCopy={false} />);
    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
  });

  it("forwards the ref to the root element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CodeBlock ref={ref} code={SAMPLE} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges the className on the root element", () => {
    const { container } = render(<CodeBlock code={SAMPLE} className="custom-extra" />);
    expect(container.firstChild).toHaveClass("custom-extra");
  });
});
