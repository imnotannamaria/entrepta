import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Categories({ onEdit = () => {} }: { onEdit?: () => void }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="home">
        <AccordionTrigger
          trailing={<span>$1,923.80</span>}
          actions={
            <button type="button" onClick={onEdit}>
              Edit home
            </button>
          }
        >
          home
        </AccordionTrigger>
        <AccordionContent>rent and groceries</AccordionContent>
      </AccordionItem>
      <AccordionItem value="out">
        <AccordionTrigger>out</AccordionTrigger>
        <AccordionContent>coffee and cinema</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("opens a section from its header and says so", async () => {
    render(<Categories />);
    const home = screen.getByRole("button", { name: "home $1,923.80" });
    expect(home).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(home);
    expect(home).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("rent and groceries")).toBeVisible();
  });

  it("puts each header in a heading", () => {
    render(<Categories />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  it("keeps the actions outside the toggle", async () => {
    const onEdit = vi.fn();
    render(<Categories onEdit={onEdit} />);
    const edit = screen.getByRole("button", { name: "Edit home" });
    expect(screen.getByRole("button", { name: /^home/ })).not.toContainElement(edit);
    await userEvent.click(edit);
    expect(onEdit).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /^home/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("moves between headers with the arrow keys", async () => {
    render(<Categories />);
    await userEvent.click(screen.getByRole("button", { name: /^home/ }));
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "out" })).toHaveFocus();
  });

  it("animates its height through the collapse class", async () => {
    render(<Categories />);
    await userEvent.click(screen.getByRole("button", { name: /^home/ }));
    const region = screen.getByRole("region");
    expect(region).toHaveClass("motion-collapse");
    expect(region.className).toContain("[--collapse-height:var(--radix-accordion-content-height)]");
  });
});
