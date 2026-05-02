import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command-palette";

function TestPalette({ open = true }: { open?: boolean }) {
  return (
    <CommandDialog open={open} onOpenChange={() => {}}>
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem>Home</CommandItem>
            <CommandItem shortcut="⌘B">Docs</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem icon={<span data-testid="icon" />}>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

describe("CommandDialog", () => {
  it("does not render when open=false", () => {
    render(<TestPalette open={false} />);
    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  it("renders input when open=true", () => {
    render(<TestPalette />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders group headings", () => {
    render(<TestPalette />);
    expect(screen.getByText("Pages")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders command items", () => {
    render(<TestPalette />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders shortcut label on item", () => {
    render(<TestPalette />);
    expect(screen.getByText("⌘B")).toBeInTheDocument();
  });

  it("renders icon on item when provided", () => {
    render(<TestPalette />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("filters items when user types in input", async () => {
    render(<TestPalette />);
    await userEvent.type(screen.getByPlaceholderText("Search..."), "Home");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("Docs")).not.toBeInTheDocument();
  });

  it("shows empty state when no results match", async () => {
    render(<TestPalette />);
    await userEvent.type(screen.getByPlaceholderText("Search..."), "xyznotfound");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("calls onOpenChange when Escape is pressed", async () => {
    const onOpenChange = vi.fn();
    render(
      <CommandDialog open onOpenChange={onOpenChange}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
      </CommandDialog>
    );
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onSelect when an item is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <CommandDialog open onOpenChange={() => {}}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem onSelect={onSelect}>Action</CommandItem>
          </CommandList>
        </Command>
      </CommandDialog>
    );
    await userEvent.click(screen.getByText("Action"));
    expect(onSelect).toHaveBeenCalled();
  });
});
