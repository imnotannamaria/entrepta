import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";
import { Field } from "./field";

const ZONES: ComboboxOption[] = [
  { value: "America/Sao_Paulo", label: "São Paulo", group: "Americas", keywords: ["brazil"] },
  { value: "America/New_York", label: "New York", group: "Americas", hint: "UTC−4" },
  { value: "Europe/Lisbon", label: "Lisbon", group: "Europe" },
  { value: "Asia/Tokyo", label: "Tokyo", group: "Asia", suggested: true },
];

function Single(props: { onChange?: (v: string | null) => void; error?: string }) {
  const [value, setValue] = React.useState<string | null>(null);
  return (
    <Field id="zone" label="time zone" error={props.error}>
      <Combobox
        options={ZONES}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          props.onChange?.(v);
        }}
        placeholder="Pick a time zone…"
        searchPlaceholder="Search time zones…"
        emptyText="No time zones match"
      />
    </Field>
  );
}

function Multiple({ creatable = false }: { creatable?: boolean }) {
  const [options, setOptions] = React.useState<ComboboxOption[]>([
    { value: "food", label: "food" },
    { value: "travel", label: "travel" },
    { value: "work", label: "work" },
  ]);
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <>
      <Combobox
        aria-label="tags"
        multiple
        creatable={creatable}
        onCreate={(label) => {
          setOptions((now) => [...now, { value: label, label }]);
          return label;
        }}
        options={options}
        value={value}
        onValueChange={setValue}
      />
      <output>{value.join(",")}</output>
    </>
  );
}

describe("Combobox", () => {
  it("opens a search over grouped options, from a trigger named by its Field", async () => {
    const user = userEvent.setup();
    render(<Single />);
    const trigger = screen.getByRole("button", { name: "time zone" });
    expect(trigger).toHaveTextContent("Pick a time zone…");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(screen.getByRole("combobox", { name: "Search time zones…" })).toHaveFocus();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("finds by label and by keyword, and says so when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Single />);
    await user.click(screen.getByRole("button", { name: "time zone" }));
    await user.keyboard("brazil");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["São PauloAmericas"]);
    await user.clear(screen.getByRole("combobox", { name: "Search time zones…" }));
    await user.keyboard("zzz");
    expect(screen.getByText("No time zones match")).toBeInTheDocument();
  });

  it("ranks what starts with the search first, and ignores accents", async () => {
    const user = userEvent.setup();
    render(<Single />);
    await user.click(screen.getByRole("button", { name: "time zone" }));
    await user.keyboard("tok");
    // while searching, the group moves to the right of the row
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["TokyosuggestedAsia"]);
    await user.clear(screen.getByRole("combobox", { name: "Search time zones…" }));
    await user.keyboard("sao");
    expect(screen.getAllByRole("option")[0]).toHaveTextContent("São Paulo");
  });

  it("ranks across groups, not within each one", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="zone"
        options={[
          { value: "Antarctica/Vostok", label: "Vostok", group: "Antarctica" },
          { value: "Asia/Tokyo", label: "Tokyo", group: "Asia" },
          { value: "Asia/Vladivostok", label: "Vladivostok", group: "Asia" },
        ]}
        value={null}
        onValueChange={() => {}}
      />
    );
    await user.click(screen.getByRole("button", { name: "zone" }));
    await user.keyboard("tok");
    expect(screen.getAllByRole("option")[0]).toHaveTextContent("Tokyo");
    expect(screen.queryByText("Antarctica", { selector: "[cmdk-group-heading]" })).toBeNull();
  });

  it("does not match letters scattered across words", async () => {
    const user = userEvent.setup();
    render(<Single />);
    await user.click(screen.getByRole("button", { name: "time zone" }));
    // n…y…k in order, but not as a run: fuzzy matching would find New York
    await user.keyboard("nyk");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("picks one value with the keyboard, closes and shows it", async () => {
    const user = userEvent.setup();
    const picked: (string | null)[] = [];
    render(<Single onChange={(v) => picked.push(v)} />);
    await user.click(screen.getByRole("button", { name: "time zone" }));
    await user.keyboard("lisb{Enter}");
    expect(picked).toEqual(["Europe/Lisbon"]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "time zone" })).toHaveTextContent("Lisbon");
  });

  it("marks a suggested option for the person to confirm", async () => {
    const user = userEvent.setup();
    render(<Single />);
    await user.click(screen.getByRole("button", { name: "time zone" }));
    const tokyo = screen.getByRole("option", { name: /Tokyo/ });
    expect(within(tokyo).getByText("suggested")).toBeInTheDocument();
  });

  it("toggles several values, stays open, and shows two chips and a count", async () => {
    const user = userEvent.setup();
    render(<Multiple />);
    await user.click(screen.getByRole("button", { name: "tags" }));
    for (const tag of ["food", "travel", "work"]) {
      await user.click(screen.getByRole("option", { name: new RegExp(tag) }));
    }
    expect(screen.getByRole("status")).toHaveTextContent("food,travel,work");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /food\s*, selected/ })).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: /travel/ }));
    expect(screen.getByRole("status")).toHaveTextContent("food,work");
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "tags" })).toHaveTextContent("foodwork");
  });

  it("creates what was typed when nothing matches it, and selects it", async () => {
    const user = userEvent.setup();
    render(<Multiple creatable />);
    await user.click(screen.getByRole("button", { name: "tags" }));
    await user.keyboard("pet");
    await user.click(screen.getByRole("option", { name: 'Create "pet"' }));
    expect(screen.getByRole("status")).toHaveTextContent("pet");
    await user.keyboard("food");
    expect(screen.queryByRole("option", { name: /Create/ })).not.toBeInTheDocument();
  });

  it("takes the error state from a Field", () => {
    render(<Single error="Pick one" />);
    const trigger = screen.getByRole("button", { name: "time zone" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Pick one");
  });
});
