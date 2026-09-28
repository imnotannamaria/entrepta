import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SecretField, maskSecret } from "./secret-field";

const KEY = "sk_live_51H8xQ2eZvKYlo2C4f2a";

describe("SecretField", () => {
  it("masks all but the prefix and the last four, and keeps the real value out of the DOM", () => {
    render(<SecretField name="API key" value={KEY} />);
    const field = screen.getByRole("textbox", { name: "API key" });
    expect(field).toHaveValue("sk_live_••••••••4f2a");
    expect(field).toHaveAttribute("readonly");
    expect(maskSecret("abcd")).toBe("••••••••");
  });

  it("reveals and hides it with a pressed toggle named after it", async () => {
    render(<SecretField name="API key" value={KEY} />);
    const toggle = screen.getByRole("button", { name: "Show API key" });
    await userEvent.click(toggle);
    expect(screen.getByRole("textbox")).toHaveValue(KEY);
    expect(screen.getByRole("button", { name: "Hide API key" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("copies the real value, even masked, and says so politely", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { container } = render(<SecretField name="API key" value={KEY} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy API key" }));
    expect(writeText).toHaveBeenCalledWith(KEY);
    expect(container.querySelector("[aria-live=polite]")).toHaveTextContent("Copied");
  });

  it("says when a copy failed instead of pretending", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    const { container } = render(<SecretField name="API key" value={KEY} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy API key" }));
    expect(container.querySelector("[aria-live=polite]")).toHaveTextContent("Could not copy");
  });

  it("drops the copy button when expired and shows the message and the action", () => {
    render(
      <SecretField
        name="API key"
        value={KEY}
        expired={{ message: "Expired 2 days ago", action: <button type="button">New key</button> }}
      />
    );
    expect(screen.queryByRole("button", { name: "Copy API key" })).not.toBeInTheDocument();
    expect(screen.getByText("Expired 2 days ago")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New key" })).toBeInTheDocument();
  });
});
