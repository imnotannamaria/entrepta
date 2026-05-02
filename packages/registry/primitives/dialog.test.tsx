import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function TestDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button type="button">Confirm</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("does not show content before trigger click", () => {
    render(<TestDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens when trigger is clicked", async () => {
    render(<TestDialog />);
    await userEvent.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders title and description when open", async () => {
    render(<TestDialog />);
    await userEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Dialog title")).toBeInTheDocument();
    expect(screen.getByText("Dialog description")).toBeInTheDocument();
  });

  it("closes when the built-in close button is clicked", async () => {
    render(<TestDialog />);
    await userEvent.click(screen.getByText("Open"));
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders with defaultOpen=true", () => {
    render(<TestDialog defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    render(<TestDialog />);
    await userEvent.click(screen.getByText("Open"));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
