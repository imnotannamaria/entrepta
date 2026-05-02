import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDestructiveItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown";

function TestDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>
          Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuDestructiveItem>Delete</DropdownMenuDestructiveItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("does not show menu content initially", () => {
    render(<TestDropdown />);
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("shows menu items when trigger is clicked", async () => {
    render(<TestDropdown />);
    await userEvent.click(screen.getByText("Open menu"));
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders label and separator", async () => {
    render(<TestDropdown />);
    await userEvent.click(screen.getByText("Open menu"));
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders shortcut text", async () => {
    render(<TestDropdown />);
    await userEvent.click(screen.getByText("Open menu"));
    expect(screen.getByText("⌘,")).toBeInTheDocument();
  });

  it("renders destructive item", async () => {
    render(<TestDropdown />);
    await userEvent.click(screen.getByText("Open menu"));
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onSelect when item is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await userEvent.click(screen.getByText("Open"));
    await userEvent.click(screen.getByText("Action"));
    expect(onSelect).toHaveBeenCalled();
  });
});
