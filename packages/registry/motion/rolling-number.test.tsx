import { act, render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RollingNumber, useRollOnHover } from "./rolling-number";

describe("RollingNumber", () => {
  it("keeps the real value in an sr-only copy", () => {
    const { container } = render(<RollingNumber value={128} />);
    expect(container.querySelector(".sr-only")?.textContent).toBe("128");
  });

  it("draws one hidden strip of 0 to 9, twice, per digit", () => {
    const { container } = render(<RollingNumber value={42} />);
    const strips = container.querySelectorAll(':scope > span > span[aria-hidden="true"]');
    expect(strips).toHaveLength(2);
    const cells = strips[0].querySelector(":scope > span")?.children ?? [];
    expect(Array.from(cells, (c) => c.textContent).join("")).toBe("01234567890123456789");
  });

  it("leaves characters that are not digits standing still", () => {
    const { container } = render(<RollingNumber value="1,024" />);
    expect(container.querySelector(".sr-only")?.textContent).toBe("1,024");
    const comma = Array.from(container.querySelectorAll("span")).find((s) => s.textContent === ",");
    expect(comma).toHaveAttribute("aria-hidden");
  });
});

describe("useRollOnHover", () => {
  it("spends the entrance delay once, then rolls without waiting", () => {
    const { result } = renderHook(() => useRollOnHover(0.7));
    expect(result.current).toMatchObject({ cycle: 0, delay: 0.7 });

    act(() => result.current.handlers.onMouseEnter());
    expect(result.current).toMatchObject({ cycle: 1, delay: 0 });

    act(() => result.current.handlers.onMouseLeave());
    expect(result.current).toMatchObject({ cycle: 0, delay: 0 });
  });
});
