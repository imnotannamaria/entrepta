import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TabBar, TabBarItem } from "./tab-bar";

describe("TabBar", () => {
  it("renders the diamond logo mark", () => {
    const { container } = render(
      <TabBar>
        <TabBarItem>file.tsx</TabBarItem>
      </TabBar>
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders tab item label", () => {
    render(
      <TabBar>
        <TabBarItem>index.tsx</TabBarItem>
      </TabBar>
    );
    expect(screen.getByText("index.tsx")).toBeInTheDocument();
  });

  it("renders multiple tabs", () => {
    render(
      <TabBar>
        <TabBarItem>file-a.tsx</TabBarItem>
        <TabBarItem>file-b.tsx</TabBarItem>
      </TabBar>
    );
    expect(screen.getByText("file-a.tsx")).toBeInTheDocument();
    expect(screen.getByText("file-b.tsx")).toBeInTheDocument();
  });

  it("applies active style when active prop is set", () => {
    const { container } = render(
      <TabBar>
        <TabBarItem active>active.tsx</TabBarItem>
      </TabBar>
    );
    const item = container.querySelector("[class*='border-[var(--fg-brand)]']");
    expect(item).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided", () => {
    render(
      <TabBar>
        <TabBarItem>no-close.tsx</TabBarItem>
      </TabBar>
    );
    expect(screen.queryByRole("button", { name: "Close tab" })).not.toBeInTheDocument();
  });

  it("renders close button when onClose is provided", () => {
    render(
      <TabBar>
        <TabBarItem onClose={() => {}}>closable.tsx</TabBarItem>
      </TabBar>
    );
    expect(screen.getByRole("button", { name: "Close tab" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <TabBar>
        <TabBarItem onClose={onClose}>closable.tsx</TabBarItem>
      </TabBar>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close tab" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClick when tab label area is clicked", async () => {
    const onClick = vi.fn();
    render(
      <TabBar>
        <TabBarItem onClick={onClick}>clickable.tsx</TabBarItem>
      </TabBar>
    );
    await userEvent.click(screen.getByText("clickable.tsx"));
    expect(onClick).toHaveBeenCalled();
  });
});
