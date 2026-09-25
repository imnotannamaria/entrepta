import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLoading } from "./page-loading";

describe("PageLoading", () => {
  it("announces itself once, as a status", () => {
    render(<PageLoading command="ls ./log" label="the log" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading the log");
  });

  it("has the command in the DOM from the first render, typed by CSS", () => {
    const { container } = render(<PageLoading command="ls ./log" label="the log" />);
    const typed = container.querySelector<HTMLElement>(".type-line");
    expect(typed?.textContent).toBe("ls ./log");
    expect(typed?.style.getPropertyValue("--type-chars")).toBe("8");
  });

  it("hides the decoration from screen readers", () => {
    const { container } = render(<PageLoading command="ls" label="x" crumb="log" />);
    expect(container.querySelector("[aria-hidden]")).toContainElement(screen.getByText("log"));
  });

  it("shows the steps only after the wait runs long, as .type-late with rounded delays", () => {
    const { container } = render(
      <PageLoading command="ls" label="x" steps={["reading entries", "reading covers"]} />
    );
    const late = container.querySelectorAll<HTMLElement>(".type-late");
    expect(late).toHaveLength(2);
    expect(late[0].style.getPropertyValue("--type-delay")).toBe("2.2s");
    expect(late[1].style.getPropertyValue("--type-delay")).toBe("2.8s");
  });
});
