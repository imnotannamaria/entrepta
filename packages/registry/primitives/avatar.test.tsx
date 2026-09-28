import { RobotIcon } from "@phosphor-icons/react";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Avatar, AvatarGroup } from "./avatar";

const initials = (container: HTMLElement) =>
  container.querySelector("[aria-hidden='true']")?.textContent;

describe("Avatar", () => {
  it("shows the initials of the first and last word", () => {
    const { container, rerender } = render(<Avatar name="Anna Maria Souza" />);
    expect(initials(container)).toBe("AS");
    rerender(<Avatar name="entrepta" />);
    expect(initials(container)).toBe("E");
    rerender(<Avatar name="@anna_maria" />);
    expect(initials(container)).toBe("AM");
    rerender(<Avatar name="élodie durand" />);
    expect(initials(container)).toBe("ÉD");
  });

  it("is one image to a screen reader, named by name and status", () => {
    const { rerender } = render(<Avatar name="Anna Maria" />);
    expect(screen.getByRole("img", { name: "Anna Maria" })).toBeInTheDocument();
    rerender(<Avatar name="Anna Maria" status="away" />);
    expect(screen.getByRole("img", { name: "Anna Maria, away" })).toBeInTheDocument();
  });

  it("steps out of the accessibility tree with aria-hidden, beside a written name", () => {
    const { container } = render(<Avatar name="Anna Maria" aria-hidden />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.firstChild).not.toHaveAttribute("aria-label");
  });

  it("keeps the initials under the image until it loads, then hides them", () => {
    const { container } = render(<Avatar name="Anna Maria" src="/me.jpg" />);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img).toHaveAttribute("alt", "");
    expect(screen.getByText("AM")).not.toHaveClass("invisible");
    fireEvent.load(img);
    // a transparent image would otherwise show the letters through it
    expect(screen.getByText("AM")).toHaveClass("invisible");
  });

  it("drops a broken image and keeps the initials", () => {
    const { container } = render(<Avatar name="Anna Maria" src="/missing.jpg" />);
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("AM")).not.toHaveClass("invisible");
  });

  it("tries again when the src changes after a failure", () => {
    const { container, rerender } = render(<Avatar name="Anna Maria" src="/missing.jpg" />);
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    rerender(<Avatar name="Anna Maria" src="/me.jpg" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/me.jpg");
  });

  describe("an image that settled before hydration", () => {
    const proto = HTMLImageElement.prototype;
    const restore: (() => void)[] = [];
    function settle(width: number) {
      for (const [key, value] of [
        ["complete", true],
        ["naturalWidth", width],
      ] as const) {
        const original = Object.getOwnPropertyDescriptor(proto, key);
        Object.defineProperty(proto, key, { configurable: true, get: () => value });
        restore.push(() => {
          if (original) Object.defineProperty(proto, key, original);
          else Reflect.deleteProperty(proto, key);
        });
      }
    }
    afterEach(() => {
      for (const undo of restore.splice(0)) undo();
    });

    it("counts as loaded when it has pixels", () => {
      settle(64);
      render(<Avatar name="Anna Maria" src="/me.jpg" />);
      expect(screen.getByText("AM")).toHaveClass("invisible");
    });

    it("counts as failed when it has none", () => {
      settle(0);
      const { container } = render(<Avatar name="Anna Maria" src="/missing.jpg" />);
      expect(container.querySelector("img")).not.toBeInTheDocument();
      expect(screen.getByText("AM")).not.toHaveClass("invisible");
    });
  });

  it("takes an icon in place of the initials, for a thing", () => {
    const { container } = render(<Avatar name="deploy bot" shape="square" icon={RobotIcon} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("DB")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "deploy bot" })).toBeInTheDocument();
  });

  it("is a circle by default and a square with a radius that follows the size", () => {
    const face = (container: HTMLElement) => container.firstChild?.firstChild as HTMLElement;
    const { container, rerender } = render(<Avatar name="a" />);
    expect(face(container)).toHaveClass("rounded-full");
    rerender(<Avatar name="a" shape="square" size="sm" />);
    expect(face(container)).toHaveClass("rounded-[var(--radius-sm)]");
    rerender(<Avatar name="a" shape="square" size="xl" />);
    expect(face(container)).toHaveClass("rounded-[var(--radius-xl)]", "text-display-md");
  });

  it("lays the neutral fill, or the brand tint, over the surface's own color", () => {
    const face = (container: HTMLElement) => container.firstChild?.firstChild as HTMLElement;
    const { container, rerender } = render(<Avatar name="a" />);
    // opaque underneath, so an overlapped avatar does not show through the tint
    expect(face(container)).toHaveClass(
      "bg-[var(--avatar-cutout,var(--bg-canvas))]",
      "bg-[image:linear-gradient(var(--bg-hover-strong),var(--bg-hover-strong))]",
      "text-[var(--fg-secondary)]"
    );
    rerender(<Avatar name="a" color="brand" />);
    expect(face(container)).toHaveClass(
      "bg-[var(--avatar-cutout,var(--bg-canvas))]",
      "bg-[image:linear-gradient(var(--bg-surface-brand),var(--bg-surface-brand))]",
      "text-[var(--fg-brand-text)]"
    );
  });

  it("draws the status as a dot cut out of the surface", () => {
    const { container } = render(<Avatar name="a" status="online" />);
    const dot = container.querySelector("[data-status='online']");
    expect(dot).toHaveClass("bg-[var(--status-success)]", "ring-2");
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it("takes the four sizes Wristkit uses: 24, 32, 48 and 96px", () => {
    const { container, rerender } = render(<Avatar name="a" size="sm" />);
    for (const [size, box] of [
      ["sm", "size-6"],
      ["md", "size-8"],
      ["lg", "size-12"],
      ["xl", "size-24"],
    ] as const) {
      rerender(<Avatar name="a" size={size} />);
      expect(container.firstChild).toHaveClass(box);
    }
  });

  it("rings the active profile in the brand, standing off by the cutout color", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Ana Lima" emphasis="ring" />
      </AvatarGroup>
    );
    const face = container.querySelector("[role=img]")?.firstChild;
    // the emphasis ring wins over the group's cutout ring, and its offset does the cutting
    expect(face).toHaveClass("ring-[var(--fg-brand)]", "ring-offset-2");
    expect(face).not.toHaveClass("ring-[var(--avatar-cutout,var(--bg-canvas))]");
  });

  it("forwards its ref and merges className on the outer box", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { container } = render(<Avatar ref={ref} name="a" size="lg" className="mr-2" />);
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveClass("size-12", "mr-2");
  });
});

describe("AvatarGroup", () => {
  const PEOPLE = ["Ana Lima", "Bruno Reis", "Caio Dias", "Duda Melo", "Eva Rios"];

  it("is a list, one avatar per item", () => {
    render(
      <AvatarGroup aria-label="contributors">
        {PEOPLE.map((p) => (
          <Avatar key={p} name={p} />
        ))}
      </AvatarGroup>
    );
    expect(screen.getByRole("list", { name: "contributors" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("folds what is past max into a +N that says how many", () => {
    render(
      <AvatarGroup max={3}>
        {PEOPLE.map((p) => (
          <Avatar key={p} name={p} />
        ))}
      </AvatarGroup>
    );
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByText("+2")).toHaveAttribute("aria-hidden");
    expect(screen.getByText("2 more")).toHaveClass("sr-only");
  });

  it("keeps the +N to three characters", () => {
    render(
      <AvatarGroup max={1}>
        {Array.from({ length: 150 }, (_, i) => `person ${i}`).map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    );
    expect(screen.getByText("99+")).toBeInTheDocument();
    expect(screen.getByText("149 more")).toBeInTheDocument();
  });

  it("sizes every avatar and cuts each out of the one before", () => {
    const { container } = render(
      <AvatarGroup size="sm">
        <Avatar name="Ana Lima" />
        <Avatar name="Bruno Reis" size="lg" />
      </AvatarGroup>
    );
    const [first, second] = screen.getAllByRole("img");
    expect(first).toHaveClass("size-6");
    expect(second).toHaveClass("size-12");
    expect(first.firstChild).toHaveClass("ring-2");
    expect(container.firstChild).toHaveClass("-space-x-1.5");
  });

  it("leaves a lone avatar without the ring", () => {
    const { container } = render(<Avatar name="Ana Lima" />);
    expect(container.firstChild?.firstChild).not.toHaveClass("ring-2");
  });
});
