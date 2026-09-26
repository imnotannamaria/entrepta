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

  it("shows a real close button on the active tab only", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" onClose={() => {}}>
            Closable
          </TabsTrigger>
          <TabsTrigger value="b" onClose={() => {}}>
            Other
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("button", { name: "Close Closable" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Close Other" })).toBeNull();
    // a sibling of the tab, not nested inside it
    expect(screen.getByRole("tab", { name: /Closable/ }).querySelector("button")).toBeNull();
  });

  it("invokes onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" onClose={onClose}>
            Closable
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close Closable" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders diamond marker on active tab when no icon", () => {
    render(<TestTabs />);
    const activeTab = screen.getByRole("tab", { name: /Tab A/ });
    expect(activeTab.textContent).toContain("◆");
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
    expect(link.textContent).toContain("◆");
  });

  it("closes the active route tab from a sibling button", async () => {
    const onClose = vi.fn();
    render(
      <TabNav aria-label="Pages">
        <TabNavLink href="/blog/post" active onClose={onClose}>
          post.mdx
        </TabNavLink>
      </TabNav>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close post.mdx" }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("variant window", () => {
  it("adds decorative window dots hidden from screen readers, with no buttons", () => {
    const { container } = render(
      <TabNav aria-label="Pages" variant="window">
        <TabNavLink href="/" active>
          home.tsx
        </TabNavLink>
      </TabNav>
    );
    const dots = container.querySelector("[data-window-dots]");
    expect(dots).toHaveAttribute("aria-hidden");
    expect(dots?.querySelectorAll("button")).toHaveLength(0);
    expect(screen.getByRole("navigation", { name: "Pages" })).toBeInTheDocument();
  });

  it("shows end as meta from 768px, and a strip has no dots", () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList variant="window" end={<span>main</span>}>
          <TabsTrigger value="a">a.tsx</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText("main").parentElement).toHaveClass("hidden", "md:flex");
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">b.tsx</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(container.ownerDocument.querySelectorAll("[data-window-dots]")).toHaveLength(1);
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
