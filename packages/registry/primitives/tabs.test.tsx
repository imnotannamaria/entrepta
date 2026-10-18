import { HouseIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TabNav, TabNavLink, Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

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

  it("has no close button: a tab is picked, not closed", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Only</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("draws nothing before a tab with no icon, unless the strip has an indicator", () => {
    const { rerender } = render(<TestTabs />);
    expect(screen.getByRole("tab", { name: /Tab A/ }).textContent).toBe("Tab A");
    rerender(
      <Tabs defaultValue="a" indicator={<b data-mine>◆</b>}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const [mineA, mineB] = [...document.querySelectorAll("[data-mine]")];
    expect(mineA.parentElement).not.toHaveClass("invisible");
    expect(mineB.parentElement).toHaveClass("invisible");
  });

  it("draws one brand underline, under the active tab, and moves it on switch", async () => {
    const { container } = render(<TestTabs />);
    expect(container.querySelectorAll("[data-tab-underline]")).toHaveLength(1);
    await userEvent.click(screen.getByRole("tab", { name: /Tab B/ }));
    const underline = container.querySelectorAll("[data-tab-underline]");
    expect(underline).toHaveLength(1);
    expect(underline[0].parentElement).toContainElement(screen.getByRole("tab", { name: /Tab B/ }));
  });

  it("keeps its own height instead of collapsing to the labels", () => {
    const { container } = render(<TestTabs />);
    expect(container.querySelector('[role="tablist"]')?.parentElement).toHaveClass("min-h-10");
  });
});

describe("TabNav", () => {
  it("is a named nav landmark of links, with the active one marked as the current page", () => {
    render(
      <TabNav aria-label="Pages">
        <TabNavLink href="/" active>
          home.tsx
        </TabNavLink>
        <TabNavLink href="/about">about.md</TabNavLink>
      </TabNav>
    );
    expect(screen.getByRole("navigation", { name: "Pages" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home\.tsx/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /about\.md/ })).not.toHaveAttribute("aria-current");
  });

  it("renders your router's link with asChild", () => {
    render(
      <TabNav aria-label="Pages">
        <TabNavLink asChild active>
          <a href="/blog" data-router-link>
            blog/
          </a>
        </TabNavLink>
      </TabNav>
    );
    const link = screen.getByRole("link", { name: /blog\// });
    expect(link).toHaveAttribute("data-router-link");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.textContent).toBe("blog/");
  });
});

describe("tab names on phones", () => {
  it("keeps an inactive icon tab's name for screen readers when it is hidden on screen", () => {
    render(
      <TabNav aria-label="Pages">
        <TabNavLink href="/" icon={HouseIcon} active>
          home.tsx
        </TabNavLink>
        <TabNavLink href="/about" icon={HouseIcon}>
          about.md
        </TabNavLink>
      </TabNav>
    );
    // display:none would drop the name from the accessibility tree too, leaving an icon-only
    // link with no name. sr-only hides it visually and keeps it announced.
    const name = screen.getByText("about.md");
    expect(name).toHaveClass("sr-only", "sm:not-sr-only");
    expect(name).not.toHaveClass("hidden");
    expect(screen.getByRole("link", { name: "about.md" })).toBeInTheDocument();
  });
});

describe("the row", () => {
  it("pins `end` to the far end and keeps `after` next to the last tab", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList after={<button type="button">+</button>} end={<span>main</span>}>
          <TabsTrigger value="a">a.tsx</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText("main").parentElement).toHaveClass("ml-auto", "shrink-0");
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  it("grows a Phosphor icon on hover and fills it when active", () => {
    function FakeIcon(props: { weight?: string; className?: string }) {
      return <svg data-weight={props.weight} className={props.className} />;
    }
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" icon={FakeIcon as never}>
            a.tsx
          </TabsTrigger>
          <TabsTrigger value="b" icon={FakeIcon as never}>
            b.tsx
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const [active, idle] = container.querySelectorAll("svg");
    expect(active).toHaveAttribute("data-weight", "fill");
    expect(idle).toHaveAttribute("data-weight", "regular");
    expect(idle).toHaveClass("group-hover:scale-115");
  });
});
