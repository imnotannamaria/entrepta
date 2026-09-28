import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { ListGroup, ListRow } from "./list-row";

describe("ListRow", () => {
  it("is a list item with its title, meta and trailing value", () => {
    render(
      <ul>
        <ListRow title="Coffee" meta="card · 08:12" trailing="$4.50" trailingMeta="pending" />
      </ul>
    );
    const row = screen.getByRole("listitem");
    expect(within(row).getByText("Coffee")).toBeInTheDocument();
    expect(within(row).getByText("card · 08:12")).toHaveClass("text-[var(--fg-muted)]");
    expect(within(row).getByText("$4.50")).toHaveClass("shrink-0");
  });

  it("makes the whole row a link through its title, with the actions outside it", () => {
    render(
      <ul>
        <ListRow title="Rent" href="/entries/1" actions={<button type="button">more</button>} />
      </ul>
    );
    const link = screen.getByRole("link", { name: "Rent" });
    expect(link).toHaveAttribute("href", "/entries/1");
    expect(link.className).toContain("after:absolute");
    // the actions are not inside the link, so neither interactive sits inside the other
    expect(link).not.toContainElement(screen.getByRole("button", { name: "more" }));
    expect(screen.getByRole("button", { name: "more" }).parentElement).toHaveClass("z-[1]");
  });

  it("uses a router's link when given one", () => {
    const Router = ({
      href,
      children,
      className,
    }: { href: string; children?: React.ReactNode; className?: string }) => (
      <a href={href} data-router className={className}>
        {children}
      </a>
    );
    render(
      <ul>
        <ListRow title="Rent" href="/entries/1" linkComponent={Router} />
      </ul>
    );
    expect(screen.getByRole("link", { name: "Rent" })).toHaveAttribute("data-router");
  });

  it("makes the row a button when it only has a click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ul>
        <ListRow title="Open the entry" onClick={onClick} />
      </ul>
    );
    await user.click(screen.getByRole("button", { name: "Open the entry" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("marks a selected row with the brand tint, and a muted one with softer text", () => {
    render(
      <ul>
        <ListRow title="a" selected />
        <ListRow title="b" muted />
      </ul>
    );
    const [a, b] = screen.getAllByRole("listitem");
    expect(a).toHaveClass("bg-[var(--bg-surface-brand)]");
    expect(within(b).getByText("b").parentElement).toHaveClass("text-[var(--fg-secondary)]");
  });

  it("truncates the title and the meta, never the trailing value", () => {
    render(
      <ul>
        <ListRow title="A very long title" meta="and a long meta line" trailing="$1,234.56" />
      </ul>
    );
    expect(screen.getByText("A very long title")).toHaveClass("truncate");
    expect(screen.getByText("and a long meta line")).toHaveClass("truncate");
    expect(screen.getByText("$1,234.56")).toHaveClass("shrink-0");
    expect(screen.getByText("$1,234.56")).not.toHaveClass("truncate");
  });
});

describe("ListGroup", () => {
  it("is a section named by its heading, over a list of rows", () => {
    render(
      <ListGroup label="Yesterday" total="−$52.40">
        <ListRow title="Coffee" />
        <ListRow title="Lunch" />
      </ListGroup>
    );
    const group = screen.getByRole("region", { name: "Yesterday" });
    expect(within(group).getAllByRole("listitem")).toHaveLength(2);
    expect(within(group).getByText("−$52.40")).toBeInTheDocument();
  });

  it("sticks its heading, on the cutout color, at the offset given", () => {
    render(
      <ListGroup label="Today" stickyTop={56}>
        <ListRow title="Coffee" />
      </ListGroup>
    );
    const bar = screen.getByRole("heading", { name: "Today" }).parentElement as HTMLElement;
    expect(bar).toHaveClass("sticky", "bg-[var(--cutout,var(--bg-canvas))]");
    expect(bar.style.top).toBe("56px");
  });
});
