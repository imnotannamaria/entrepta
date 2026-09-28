import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PromptInput } from "./prompt-input";

describe("PromptInput", () => {
  it("sends the trimmed text on Cmd or Ctrl and Enter, and keeps Enter for a new line", async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const field = screen.getByRole("textbox", { name: "Message" });
    await userEvent.type(field, "  where did the money go{Enter}this month  ");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(field).toHaveValue("  where did the money go\nthis month  ");
    await userEvent.keyboard("{Meta>}{Enter}{/Meta}");
    expect(onSubmit).toHaveBeenCalledWith("where did the money go\nthis month");
    expect(field).toHaveValue("");
  });

  it("never sends an empty message", async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    await userEvent.type(screen.getByRole("textbox"), "   {Control>}{Enter}{/Control}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("turns send into stop while a reply streams", async () => {
    const onStop = vi.fn();
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} streaming onStop={onStop} defaultValue="more" />);
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalled();
    await userEvent.type(screen.getByRole("textbox"), "{Control>}{Enter}{/Control}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends a suggestion with a click", async () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit} suggestions={["Spending this month", "Biggest category"]} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Biggest category" }));
    expect(onSubmit).toHaveBeenCalledWith("Biggest category");
  });

  it("grows with its text up to a limit", async () => {
    render(<PromptInput onSubmit={() => {}} maxHeight={120} />);
    const field = screen.getByRole("textbox") as HTMLTextAreaElement;
    Object.defineProperty(field, "scrollHeight", { configurable: true, value: 300 });
    await userEvent.type(field, "a");
    expect(field.style.height).toBe("120px");
  });
});
