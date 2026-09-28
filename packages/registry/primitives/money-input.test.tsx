import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { FormatProvider } from "../hooks/use-format";
import { Field } from "./field";
import { MoneyInput, type MoneyInputProps } from "./money-input";

type Props = Partial<MoneyInputProps> & { initial?: number | null };

/** A controlled MoneyInput that prints what it holds. */
function Harness({ initial = null, ...props }: Props) {
  const [value, setValue] = React.useState<number | null>(initial);
  return (
    <>
      <MoneyInput
        aria-label="amount"
        currency="BRL"
        locale="pt-BR"
        value={value}
        onValueChange={setValue}
        {...props}
      />
      <output>{value === null ? "empty" : String(value)}</output>
    </>
  );
}

const input = () => screen.getByRole("textbox", { name: "amount" }) as HTMLInputElement;
const held = () => screen.getByRole("status").textContent;

describe("MoneyInput, cents first", () => {
  it("enters digits from the right, like a cash machine", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(input(), "123456");
    expect(held()).toBe("123456");
    expect(input().value).toBe("1.234,56");
  });

  it("takes the last digit away on backspace, and empties at the end", async () => {
    const user = userEvent.setup();
    render(<Harness initial={1234} />);
    await user.type(input(), "{Backspace}");
    expect(held()).toBe("123");
    expect(input().value).toBe("1,23");
    await user.type(input(), "{Backspace}{Backspace}{Backspace}");
    expect(held()).toBe("0");
    await user.clear(input());
    expect(held()).toBe("empty");
  });

  it("ignores a minus unless negatives are allowed, then flips the sign with it", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Harness initial={500} />);
    await user.type(input(), "-");
    expect(held()).toBe("500");
    unmount();
    render(<Harness initial={500} allowNegative />);
    await user.type(input(), "-");
    expect(held()).toBe("-500");
  });

  it("keeps the caret at the end, so a click in the middle does not scramble the digits", async () => {
    const user = userEvent.setup();
    render(<Harness initial={123456} />);
    input().focus();
    input().setSelectionRange(2, 2);
    fireEvent.select(input());
    expect(input().selectionStart).toBe(input().value.length);
    await user.type(input(), "7");
    expect(held()).toBe("1234567");
  });

  it("shows zero in the locale as the placeholder", () => {
    render(<Harness />);
    expect(input()).toHaveAttribute("placeholder", "0,00");
  });
});

describe("MoneyInput, free entry", () => {
  it("keeps the text as typed while typing and formats it on blur", async () => {
    const user = userEvent.setup();
    render(<Harness entry="free" />);
    await user.type(input(), "1234,5");
    expect(input().value).toBe("1234,5");
    expect(held()).toBe("123450");
    await user.tab();
    expect(input().value).toBe("1.234,50");
  });
});

describe("MoneyInput, paste", () => {
  it.each(["cents-first", "free"] as const)(
    "reads a pasted amount in any format (%s)",
    async (entry) => {
      const user = userEvent.setup();
      render(<Harness entry={entry} />);
      await user.click(input());
      await user.paste("R$ 1.234,56");
      expect(held()).toBe("123456");
      await user.clear(input());
      await user.paste("1,234.56");
      expect(held()).toBe("123456");
    }
  );

  it("does not paste a negative where negatives are not allowed", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(input());
    await user.paste("-12,00");
    expect(held()).toBe("1200");
  });
});

describe("MoneyInput, around it", () => {
  it("shows the symbol where the locale puts it, hidden from screen readers", () => {
    const { container, rerender } = render(
      <MoneyInput
        aria-label="amount"
        currency="EUR"
        locale="de-DE"
        value={100}
        onValueChange={() => {}}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.lastElementChild?.previousElementSibling).toHaveTextContent("€");
    rerender(
      <MoneyInput
        aria-label="amount"
        currency="USD"
        locale="en-US"
        value={100}
        onValueChange={() => {}}
      />
    );
    expect(wrapper.firstElementChild).toHaveTextContent("$");
    expect(wrapper.firstElementChild).toHaveAttribute("aria-hidden");
  });

  it("names the currency for screen readers, in the field's language", () => {
    render(<Harness />);
    expect(input()).toHaveAccessibleDescription("Real brasileiro");
  });

  it("gets its label, error and invalid state from a Field", () => {
    render(
      <FormatProvider currency="USD">
        <Field id="price" label="price" error="Enter an amount">
          <MoneyInput value={null} onValueChange={() => {}} />
        </Field>
      </FormatProvider>
    );
    const field = screen.getByRole("textbox", { name: "price" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(/Enter an amount/);
    expect(field).toHaveAccessibleDescription(/US dollar/i);
  });

  it("uses the Input's frame, so it looks like every other field", () => {
    const { container } = render(<Harness size="lg" />);
    expect(container.firstChild).toHaveClass(
      "h-12",
      "bg-[var(--bg-field)]",
      "focus-within:border-[var(--fg-brand)]"
    );
    expect(input()).toHaveClass("text-heading-md", "tabular-nums");
  });
});
