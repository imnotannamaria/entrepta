import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Field } from "./field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

function Example(props: { error?: string; onValueChange?: (v: string) => void }) {
  return (
    <Field id="size" label="export size" error={props.error}>
      <Select onValueChange={props.onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a size…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>phone</SelectLabel>
            <SelectItem value="story" hint="1080×1920">
              story
            </SelectItem>
            <SelectItem value="square" hint="1080×1080">
              square
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

describe("Select", () => {
  it("is a combobox named by its Field label, showing the placeholder", () => {
    render(<Example />);
    const trigger = screen.getByRole("combobox", { name: "export size" });
    expect(trigger).toHaveTextContent("Pick a size…");
  });

  it("opens with the keyboard, picks a value and shows it without the hint", async () => {
    const user = userEvent.setup();
    const picked: string[] = [];
    render(<Example onValueChange={(v) => picked.push(v)} />);
    const trigger = screen.getByRole("combobox", { name: "export size" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: /square/ }));
    expect(picked).toEqual(["square"]);
    expect(trigger).toHaveTextContent("square");
    expect(trigger).not.toHaveTextContent("1080×1080");
  });

  it("takes the error and invalid state from a Field", () => {
    render(<Example error="Pick a size" />);
    const trigger = screen.getByRole("combobox", { name: "export size" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Pick a size");
  });

  it("looks like the other fields and lists on the overlay surface", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveClass("bg-[var(--bg-field)]", "h-10");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toHaveClass("bg-[var(--bg-overlay)]", "motion-pop");
  });
});
