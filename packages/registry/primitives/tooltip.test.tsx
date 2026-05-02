import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from "./tooltip";

// Radix Tooltip relies on pointer events not supported in jsdom.
// Tests use defaultOpen to verify rendering without triggering events.

function OpenTooltip({ content = "Tooltip text", shortcut = "" }) {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <button type="button">Trigger</button>
        </TooltipTrigger>
        <TooltipContent>
          {content}
          {shortcut && <TooltipShortcut>{shortcut}</TooltipShortcut>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("renders the trigger element", () => {
    render(<OpenTooltip />);
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
  });

  it("renders tooltip content when open", () => {
    render(<OpenTooltip />);
    // Radix renders text twice: visible + visually-hidden a11y copy
    expect(screen.getAllByText("Tooltip text").length).toBeGreaterThanOrEqual(1);
  });

  it("renders shortcut inside tooltip content", () => {
    render(<OpenTooltip content="Save" shortcut="⌘S" />);
    expect(screen.getAllByText("Save").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("⌘S").length).toBeGreaterThanOrEqual(1);
  });

  it("shortcut has muted tracking-widest style class", () => {
    render(<OpenTooltip content="Go" shortcut="⌘K" />);
    const shortcuts = screen.getAllByText("⌘K");
    const styled = shortcuts.find((el) => el.classList.contains("tracking-widest"));
    expect(styled).toBeInTheDocument();
  });

  it("renders closed tooltip — content not in DOM", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Hidden content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });
});
