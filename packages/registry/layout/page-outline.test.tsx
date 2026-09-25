import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageOutline } from "./page-outline";

const ITEMS = [
  { id: "intro", label: "intro", level: 1 as const },
  { id: "career", label: "career", level: 2 as const, count: 3 },
];

afterEach(() => {
  document.body.innerHTML = "";
});

describe("PageOutline", () => {
  it("is a named nav, hidden below 1100px", () => {
    render(<PageOutline items={ITEMS} file="about.md" />);
    const nav = screen.getByRole("navigation", { name: "Page outline" });
    expect(nav).toHaveClass("hidden", "min-[1100px]:block", "sticky");
  });

  it("lists the sections with hidden markdown prefixes and counts", () => {
    render(<PageOutline items={ITEMS} file="about.md" />);
    expect(screen.getByRole("link", { name: /career/ })).toHaveAttribute("href", "#career");
    expect(screen.getByText("##")).toHaveAttribute("aria-hidden");
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("about.md")).toBeInTheDocument();
  });

  it("marks the first section as the current location to start", () => {
    render(<PageOutline items={ITEMS} file="about.md" />);
    expect(screen.getByRole("link", { name: /intro/ })).toHaveAttribute("aria-current", "location");
  });

  it("follows the scroll to the innermost visible section", async () => {
    // career is nested in intro; the test observer reports both as in view
    document.body.innerHTML = '<section id="intro"><section id="career"></section></section>';
    render(<PageOutline items={ITEMS} file="about.md" />);
    await vi.waitFor(() =>
      expect(screen.getByRole("link", { name: /career/ })).toHaveAttribute(
        "aria-current",
        "location"
      )
    );
    expect(screen.getByRole("link", { name: /intro/ })).not.toHaveAttribute("aria-current");
  });

  it("scrolls the given container on click, with the offset", async () => {
    const container = document.createElement("main");
    const target = document.createElement("section");
    target.id = "career";
    container.append(target);
    document.body.append(container);
    container.scrollTo = vi.fn();
    target.getBoundingClientRect = () => ({ top: 500 }) as DOMRect;
    container.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;

    render(<PageOutline items={ITEMS} file="about.md" scrollContainer={() => container} />);
    await userEvent.click(screen.getByRole("link", { name: /career/ }));
    expect(container.scrollTo).toHaveBeenCalledWith({ top: 436, behavior: "smooth" });
    expect(screen.getByRole("link", { name: /career/ })).toHaveAttribute(
      "aria-current",
      "location"
    );
  });

  it("lights the last section in view once the container scrolls to the bottom", async () => {
    const main = document.createElement("main");
    main.innerHTML = '<section id="intro"></section><section id="career"></section>';
    document.body.append(main);
    Object.defineProperties(main, {
      scrollTop: { value: 600, configurable: true },
      clientHeight: { value: 400, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
    });
    (main.querySelector("#career") as HTMLElement).getBoundingClientRect = () =>
      ({ top: 300 }) as DOMRect;

    render(<PageOutline items={ITEMS} file="about.md" scrollContainer={() => main} />);
    main.dispatchEvent(new Event("scroll"));
    await vi.waitFor(() =>
      expect(screen.getByRole("link", { name: /career/ })).toHaveAttribute(
        "aria-current",
        "location"
      )
    );
  });
});
