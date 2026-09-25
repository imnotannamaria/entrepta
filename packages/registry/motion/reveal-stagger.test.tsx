import { render } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

const seen: { transition?: { delay: number } }[] = [];

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    motion: {
      div: (props: { transition?: { delay: number }; children?: React.ReactNode }) => {
        seen.push(props);
        return <div>{props.children}</div>;
      },
    },
  };
});

const { Reveal } = await import("./reveal");

describe("Reveal stagger", () => {
  it("delays each item by index times step, capped at six items", () => {
    const delays = [0, 3, 6, 20].map((index) => {
      seen.length = 0;
      render(
        <Reveal index={index} step={0.1} delay={0.05}>
          x
        </Reveal>
      );
      return seen.at(-1)?.transition?.delay;
    });
    expect(delays.map((d) => Number(d?.toFixed(2)))).toEqual([0.05, 0.35, 0.65, 0.65]);
  });
});
