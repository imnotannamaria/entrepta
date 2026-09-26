import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabel } from "../primitives/card";
import { Dialog, DialogContent, DialogLabel, DialogTitle } from "../primitives/dialog";
import { Field } from "../primitives/field";

function FakeIcon(props: { className?: string; "aria-hidden"?: boolean }) {
  return <svg data-fake-icon aria-hidden={props["aria-hidden"]} className={props.className} />;
}
const icon = FakeIcon as never;

/** A label can trade its ◆ for an icon that names what it labels. Never both. */
describe("label icons", () => {
  it("CardLabel shows the ◆ by default and the icon in its place when given", () => {
    const { container, rerender } = render(<CardLabel>layout</CardLabel>);
    expect(container.textContent).toContain("◆");
    rerender(<CardLabel icon={icon}>layout</CardLabel>);
    expect(container.textContent).not.toContain("◆");
    const svg = container.querySelector("[data-fake-icon]");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("text-[var(--fg-brand)]");
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
