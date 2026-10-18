import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Diamond } from "../content/diamond";
import { Metric } from "../data/metric";
import { CardLabel } from "../primitives/card";
import { Dialog, DialogContent, DialogLabel, DialogTitle } from "../primitives/dialog";
import { Field, FieldLabel } from "../primitives/field";

function FakeIcon(props: { className?: string; "aria-hidden"?: boolean }) {
  return <svg data-fake-icon aria-hidden={props["aria-hidden"]} className={props.className} />;
}
const icon = FakeIcon as never;

/** A label draws nothing before its text, unless you pass an icon: `icon={<Diamond />}` is the ◆. */
describe("label icons", () => {
  it("CardLabel draws nothing before its text, and the icon when given", () => {
    const { container, rerender } = render(<CardLabel>layout</CardLabel>);
    expect(container.textContent).toBe("layout");
    expect(container.querySelector("svg, [aria-hidden]")).toBeNull();
    rerender(<CardLabel icon={icon}>layout</CardLabel>);
    const svg = container.querySelector("[data-fake-icon]");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("text-[var(--fg-brand)]");
  });

  it("brings the ◆ back when you pass it as the icon", () => {
    const { container } = render(<CardLabel icon={<Diamond />}>layout</CardLabel>);
    expect(container.textContent).toContain("◆");
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("FieldLabel, DialogLabel and Metric draw nothing before their text by default", () => {
    render(
      <>
        <FieldLabel htmlFor="x">email</FieldLabel>
        <Metric label="spent" value="12" />
      </>
    );
    expect(document.querySelector("label")?.textContent).toBe("email");
    expect(document.querySelector("dt")?.textContent).toBe("spent");
  });

  it("DialogLabel takes an icon", () => {
    render(
      <Dialog open>
        <DialogContent aria-describedby={undefined}>
          <DialogLabel icon={icon}>agents.md</DialogLabel>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const label = document.querySelector("[data-fake-icon]")?.parentElement;
    expect(label?.textContent).toBe("agents.md");
  });

  it("Field passes its icon to the label", () => {
    const { container } = render(
      <Field id="email" label="email" icon={icon}>
        <input />
      </Field>
    );
    expect(container.querySelector("label [data-fake-icon]")).not.toBeNull();
    expect(container.querySelector("label")?.textContent).toBe("email");
  });
});
