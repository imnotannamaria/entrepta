import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<Input placeholder="Type" />);
    const input = screen.getByPlaceholderText("Type");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });

  it("calls onChange handler", async () => {
    const onChange = vi.fn();
    render(<Input placeholder="cb" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText("cb"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders search icon when variant=search", () => {
    const { container } = render(<Input variant="search" placeholder="search" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders $ prefix and ⌘K kbd hint when variant=command", () => {
    render(<Input variant="command" placeholder="cmd" />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("⌘")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("applies default border class", () => {
    const { container } = render(<Input placeholder="x" />);
    expect(container.firstChild).toHaveClass("border-[var(--border-strong)]");
  });

  it("applies error border when state=error", () => {
    const { container } = render(<Input state="error" placeholder="err" />);
    expect(container.firstChild).toHaveClass("border-[var(--status-error)]");
  });

  it("applies sm size class", () => {
    const { container } = render(<Input size="sm" placeholder="sm" />);
    expect(container.firstChild).toHaveClass("h-8");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Input placeholder="md" />);
    expect(container.firstChild).toHaveClass("h-10");
  });

  it("applies lg size class", () => {
    const { container } = render(<Input size="lg" placeholder="lg" />);
    expect(container.firstChild).toHaveClass("h-12");
  });

  it("forwards ref to input element", () => {
    const ref = { current: null };
    render(<Input ref={ref} placeholder="ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("merges custom className", () => {
    const { container } = render(<Input className="my-class" placeholder="x" />);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
