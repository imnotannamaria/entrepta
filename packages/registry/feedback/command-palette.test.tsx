import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFoot,
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

  it("renders the esc kbd chip by default and closes when clicked", async () => {
    const onOpenChange = vi.fn();
    render(
      <CommandDialog open onOpenChange={onOpenChange}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
      </CommandDialog>
    );
    const esc = screen.getByRole("button", { name: /close command palette/i });
    expect(esc).toBeInTheDocument();
    expect(esc.textContent).toBe("esc");
    await userEvent.click(esc);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("hides the esc chip when showEsc is false", () => {
    render(
      <CommandDialog open onOpenChange={() => {}}>
        <Command>
          <CommandInput placeholder="Search..." showEsc={false} />
          <CommandList />
        </Command>
      </CommandDialog>
    );
    expect(
      screen.queryByRole("button", { name: /close command palette/i })
    ).not.toBeInTheDocument();
  });

  it("CommandFoot renders default keyboard hints", () => {
    render(
      <CommandDialog open onOpenChange={() => {}}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList />
          <CommandFoot />
        </Command>
      </CommandDialog>
    );
    expect(screen.getByText(/⌘K to close/)).toBeInTheDocument();
  });

  it("CommandFoot accepts custom children", () => {
    render(
      <CommandDialog open onOpenChange={() => {}}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList />
          <CommandFoot>
            <span>12 results</span>
            <span>powered by cmdk</span>
          </CommandFoot>
        </Command>
      </CommandDialog>
    );
    expect(screen.getByText("12 results")).toBeInTheDocument();
    expect(screen.getByText("powered by cmdk")).toBeInTheDocument();
  });
});
