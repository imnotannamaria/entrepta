import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabNav, TabNavLink } from "../primitives/tabs";
import { Titlebar } from "./titlebar";

describe("Titlebar", () => {
  it("is 40px tall with decorative window dots hidden from screen readers", () => {
    const { container } = render(<Titlebar />);
    expect(container.firstChild).toHaveClass("h-10");
    const dots = container.querySelector("[data-traffic-lights]");
    expect(dots).toHaveAttribute("aria-hidden");
    expect(dots?.querySelectorAll("button")).toHaveLength(0);
  });

  it("holds a tab nav and meta", () => {
    render(
      <Titlebar meta={<span>main</span>}>
        <TabNav aria-label="Pages">
          <TabNavLink href="/" active>
            home.tsx
          </TabNavLink>
        </TabNav>
      </Titlebar>
    );
    expect(screen.getByRole("navigation", { name: "Pages" })).toBeInTheDocument();
    expect(screen.getByText("main")).toBeInTheDocument();
  });
});
