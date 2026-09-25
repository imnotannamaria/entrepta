import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster, toast } from "./toast";

async function show(fire: () => void) {
  render(<Toaster />);
  await act(async () => {
    fire();
  });
}

function toastEl(title: string) {
  return screen.getByText(title).closest("[data-sonner-toast]") as HTMLElement;
}

describe("Toaster", () => {
  afterEach(() => {
    act(() => {
      toast.dismiss();
    });
  });

  it("renders a toast with its title and description", async () => {
    await show(() => toast("Snapshot saved", { description: "~/snapshot.json" }));
    expect(await screen.findByText("Snapshot saved")).toBeInTheDocument();
    expect(screen.getByText("~/snapshot.json")).toBeInTheDocument();
  });

  it("is unstyled by sonner and dressed on the overlay surface", async () => {
    await show(() => toast("Plain"));
    await screen.findByText("Plain");
    const el = toastEl("Plain");
    expect(el).toHaveAttribute("data-styled", "false");
    expect(el).toHaveClass("bg-[var(--bg-overlay)]", "shadow-[var(--shadow-overlay)]");
  });

  it("carries the status in a tinted icon tile, not a colored edge", async () => {
    await show(() => toast.success("Build passed"));
    await screen.findByText("Build passed");
    const el = toastEl("Build passed");
    expect(el).toHaveAttribute("data-type", "success");
    expect(el.className).not.toMatch(/border-l/);
    const icon = el.querySelector("[data-icon]");
    expect(icon).toHaveClass(
      "group-data-[type=success]/toast:bg-[var(--status-success-soft)]",
      "group-data-[type=success]/toast:text-[var(--status-success-fg)]"
    );
    expect(icon?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("has a close button with an accessible name", async () => {
    await show(() => toast.error("Type error"));
    await screen.findByText("Type error");
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});
