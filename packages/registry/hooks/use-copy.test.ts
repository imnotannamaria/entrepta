import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopy } from "./use-copy";

const writeText = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockReset().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

afterEach(() => {
  vi.useRealTimers();
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("useCopy", () => {
  it("copies, says so, then settles back to idle", async () => {
    const { result } = renderHook(() => useCopy(1000));
    await act(() => result.current.copy("npx @entrepta/cli@latest init"));
    expect(writeText).toHaveBeenCalledWith("npx @entrepta/cli@latest init");
    expect(result.current.state).toBe("copied");
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.state).toBe("idle");
  });

  it("reports a failure instead of claiming the copy happened", async () => {
    writeText.mockRejectedValue(new DOMException("denied", "NotAllowedError"));
    const { result } = renderHook(() => useCopy());
    let ok = true;
    await act(async () => {
      ok = await result.current.copy("secret");
    });
    expect(ok).toBe(false);
    expect(result.current.state).toBe("error");
  });

  it("fails cleanly where there is no clipboard, such as an insecure origin", async () => {
    Reflect.deleteProperty(navigator, "clipboard");
    const { result } = renderHook(() => useCopy());
    await act(() => result.current.copy("text"));
    expect(result.current.state).toBe("error");
  });

  it("copies text that arrives from an async source, and fails when it does not", async () => {
    const { result } = renderHook(() => useCopy());
    await act(() => result.current.copy(async () => "# fetched markdown"));
    expect(writeText).toHaveBeenCalledWith("# fetched markdown");
    await act(() =>
      result.current.copy(async () => {
        throw new Error("fetch failed");
      })
    );
    expect(result.current.state).toBe("error");
  });
});
