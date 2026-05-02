import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function TestTabs() {
  return (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
        <TabsTrigger value="c" disabled>
          Tab C
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content A</TabsContent>
      <TabsContent value="b">Content B</TabsContent>
      <TabsContent value="c">Content C</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders all tab triggers", () => {
    render(<TestTabs />);
    expect(screen.getByRole("tab", { name: "Tab A" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab B" })).toBeInTheDocument();
  });

  it("shows the default tab content", () => {
    render(<TestTabs />);
    expect(screen.getByText("Content A")).toBeInTheDocument();
  });

  it("switches content when a different tab is clicked", async () => {
    render(<TestTabs />);
    await userEvent.click(screen.getByRole("tab", { name: "Tab B" }));
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("marks the active tab with aria-selected", () => {
    render(<TestTabs />);
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("aria-selected", "true");
  });

  it("disabled tab cannot be clicked", () => {
    render(<TestTabs />);
    expect(screen.getByRole("tab", { name: "Tab C" })).toBeDisabled();
  });

  it("calls onValueChange when tab changes", async () => {
    const onChange = vi.fn();
    render(
      <Tabs defaultValue="a" onValueChange={onChange}>
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
      </Tabs>
    );
    await userEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("renders close button on tab when onClose is provided", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" onClose={() => {}}>
            Closable
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});
