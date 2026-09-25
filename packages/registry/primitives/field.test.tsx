import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field, FieldError, FieldLabel } from "./field";
import { Textarea } from "./textarea";

describe("Field", () => {
  it("labels the control through its id", () => {
    render(
      <Field id="email" label="email">
        <input />
      </Field>
    );
    expect(screen.getByLabelText(/email/)).toHaveAttribute("id", "email");
  });

  it("points the control at the hint", () => {
    render(
      <Field id="name" label="name" hint="as it should appear">
        <input />
      </Field>
    );
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("as it should appear");
  });

  it("swaps the hint for an announced error and marks the control invalid", () => {
    render(
      <Field id="msg" label="message" hint="be nice" error="Required">
        <Textarea />
      </Field>
    );
    const control = screen.getByRole("textbox");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAttribute("aria-describedby", "msg-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.queryByText("be nice")).toBeNull();
  });

  it("lets props on the control win", () => {
    render(
      <Field id="a" label="a" error="bad">
        <input id="custom" aria-describedby="elsewhere" />
      </Field>
    );
    const control = screen.getByRole("textbox");
    expect(control).toHaveAttribute("id", "custom");
    expect(control).toHaveAttribute("aria-describedby", "elsewhere");
  });
});

describe("FieldLabel", () => {
  it("shows a hidden diamond and, when required, a hidden star", () => {
    render(
      <FieldLabel htmlFor="x" required>
        name
      </FieldLabel>
    );
    expect(screen.getByText("◆")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden");
  });
});

describe("FieldError", () => {
  it("renders nothing without a message", () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();
  });

  it("prefixes a hidden // in the error color", () => {
    render(<FieldError message="Too short" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("text-[var(--status-error-fg)]");
    expect(alert.querySelector("[aria-hidden]")?.textContent).toBe("// ");
  });
});
