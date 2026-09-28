import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BentoGrid, BentoItem } from "./bento-grid";

describe("BentoGrid", () => {
  it("is one column on a phone, 6 from sm and 12 from lg", () => {
    const { container } = render(<BentoGrid />);
    expect(container.firstChild).toHaveClass("grid-cols-1", "sm:grid-cols-6", "lg:grid-cols-12");
  });

  it("keeps the markup order, which is the reading order", () => {
    const { container } = render(
      <BentoGrid>
        <BentoItem colSpan={{ lg: 8 }}>first</BentoItem>
        <BentoItem colSpan={{ lg: 4 }}>second</BentoItem>
      </BentoGrid>
    );
    expect(container.textContent).toBe("firstsecond");
    expect(container.firstChild).not.toHaveClass("grid-flow-dense");
  });

  it("spans columns and rows per breakpoint", () => {
    render(
      <BentoGrid>
        <BentoItem colSpan={{ sm: 6, lg: 8 }} rowSpan={{ lg: 2 }}>
          wide
        </BentoItem>
        <BentoItem rowSpan={2}>tall</BentoItem>
      </BentoGrid>
    );
    expect(screen.getByText("wide")).toHaveClass("sm:col-span-6", "lg:col-span-8", "lg:row-span-2");
    expect(screen.getByText("tall")).toHaveClass("sm:col-span-3", "lg:col-span-4", "sm:row-span-2");
  });

  it("makes each tile a size container", () => {
    render(
      <BentoGrid>
        <BentoItem>tile</BentoItem>
      </BentoGrid>
    );
    expect(screen.getByText("tile")).toHaveClass("@container");
  });

  it("renders a tile that must not wait without the entrance", () => {
    render(
      <BentoGrid>
        <BentoItem reveal={false}>now</BentoItem>
      </BentoGrid>
    );
    expect(screen.getByText("now").getAttribute("style")).toBeNull();
  });
});
