import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("holds prose in sans, with a mono placeholder", () => {
    render(<Textarea placeholder="// your message" />);
    const textarea = screen.getByPlaceholderText("// your message");
    expect(textarea).toHaveClass("font-sans", "text-body-md", "placeholder:font-mono");
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("marks the error state as invalid", () => {
    render(<Textarea state="error" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveClass("border-[var(--status-error)]");
  });

  it("is not invalid by default", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("forwards the ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
