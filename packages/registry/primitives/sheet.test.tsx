import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./sheet";

function Example({
  dirty = false,
  onOpenChange,
  side,
}: {
  dirty?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "right" | "bottom";
}) {
  return (
    <Sheet dirty={dirty} onOpenChange={onOpenChange}>
      <SheetTrigger>new entry</SheetTrigger>
      <SheetContent
        side={side}
        title="New entry"
        description="It lands at the top of the list."
        footer={
          <>
            <SheetClose asChild>
              <Button variant="ghost">cancel</Button>
            </SheetClose>
            <Button>save</Button>
          </>
        }
      >
        <input aria-label="name" />
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("opens as a dialog named by its title, with its description and footer", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "new entry" }));
    const sheet = screen.getByRole("dialog", { name: "New entry" });
    expect(sheet).toHaveAccessibleDescription("It lands at the top of the list.");
    expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
  });

  it("is a side panel from 640px and a bottom sheet below it", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Example />);
    await user.click(screen.getByRole("button", { name: "new entry" }));
    let sheet = screen.getByRole("dialog");
    expect(sheet).toHaveClass("bottom-0", "sm:right-0", "sm:h-dvh", "motion-sheet");
    expect(sheet).toHaveClass("bg-[var(--bg-overlay)]", "sheen");
    rerender(<Example side="bottom" />);
    sheet = screen.getByRole("dialog");
    expect(sheet).not.toHaveClass("sm:right-0");
  });

  it("closes on Esc when nothing changed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "new entry" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("asks before throwing changes away, inside the sheet, with focus on keeping them", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example dirty onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "new entry" }));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Discard your changes?");
    expect(screen.getByRole("button", { name: "Keep editing" })).toHaveFocus();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    await user.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
  });

  it("asks from the close button too, and discards on request", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example dirty onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "new entry" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("works controlled", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <>
          <span>{open ? "open" : "closed"}</span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent title="Edit">body</SheetContent>
          </Sheet>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByText("open")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByText("closed")).toBeInTheDocument();
  });
});
