import { Tabs, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WindowBar } from "./window-bar";

describe("WindowBar", () => {
  it("adds decorative window dots hidden from screen readers, with no buttons", () => {
    const { container } = render(
      <WindowBar>
        <Tabs defaultValue="a">
          <TabsList aria-label="Files" className="min-w-0 flex-1 border-b-0">
            <TabsTrigger value="a">home.tsx</TabsTrigger>
          </TabsList>
        </Tabs>
      </WindowBar>
    );
    const dots = container.querySelector("[data-window-dots]");
    expect(dots).toHaveAttribute("aria-hidden");
    expect(dots?.querySelectorAll("button")).toHaveLength(0);
    expect(screen.getByRole("tablist", { name: "Files" })).toBeInTheDocument();
  });

  it("shows end as meta from 768px", () => {
    render(
      <WindowBar end={<span>main</span>}>
        <span>tabs</span>
      </WindowBar>
    );
    expect(screen.getByText("main").parentElement).toHaveClass("hidden", "md:flex");
  });
});
