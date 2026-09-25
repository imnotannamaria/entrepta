import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { setReducedMotion } from "../test/media";
import { TypeIn } from "./type-in";

afterEach(() => setReducedMotion(false));

const SENTENCE = "Copy-paste components into your repo.";

describe("TypeIn", () => {
  it("has the whole sentence in the DOM from the first render", () => {
    const { container } = render(<TypeIn text={SENTENCE} />);
    expect(container.querySelector(".sr-only")?.textContent).toBe(SENTENCE);
    expect(container.querySelector("[data-type-in]")?.textContent).toBe(SENTENCE);
  });

  it("is read as one sentence, not a stream of letters", () => {
    render(<TypeIn as="h1" text={SENTENCE} />);
    expect(screen.getByRole("heading", { level: 1, name: SENTENCE })).toBeInTheDocument();
    const pieces = document.querySelector("[data-type-in]");
    expect(pieces).toHaveAttribute("aria-hidden", "true");
  });

  it("splits by character or by word, keeping the spaces", () => {
    const { container, rerender } = render(<TypeIn text="ab cd" />);
    expect(container.querySelectorAll("[data-type-in] > span")).toHaveLength(5);
    rerender(<TypeIn text="ab cd" by="word" />);
    const words = container.querySelectorAll("[data-type-in] > span");
    expect(Array.from(words, (w) => w.textContent)).toEqual(["ab", " ", "cd"]);
  });

  it("sets the emphasis in serif italic on the brand text ink", () => {
    const { container } = render(
      <TypeIn text="Build with entrepta." emphasis="entrepta" by="word" />
    );
    const em = Array.from(container.querySelectorAll<HTMLElement>("[data-type-in] > span")).find(
      (s) => s.textContent === "entrepta"
    );
    expect(em?.style.fontStyle).toBe("italic");
    expect(em?.style.color).toBe("var(--fg-brand-text)");
  });

  it("starts each piece lowered, and flat with reduced motion", () => {
    const { container, unmount } = render(<TypeIn text="ab" />);
    const first = container.querySelector<HTMLElement>("[data-type-in] > span");
    expect(first?.style.transform).toContain("0.25em");
    unmount();

    setReducedMotion(true);
    const reduced = render(<TypeIn text="ab" />);
    const flat = reduced.container.querySelector<HTMLElement>("[data-type-in] > span");
    expect(flat?.style.transform ?? "").not.toContain("0.25em");
  });
});
