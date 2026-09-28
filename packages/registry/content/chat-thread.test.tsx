import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type ChatMessage, ChatThread } from "./chat-thread";

const BASE: ChatMessage[] = [
  { id: "1", role: "user", content: "Where did the money go?" },
  { id: "2", role: "assistant", content: "Mostly home: rent and groceries." },
];

describe("ChatThread", () => {
  it("is a named section with messages by role", () => {
    render(<ChatThread messages={BASE} />);
    const thread = screen.getByRole("region", { name: "Conversation" });
    const items = within(thread).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("YouWhere did the money go?");
    expect(items[1]).toHaveTextContent("AssistantMostly home");
  });

  it("puts a tool's result in a card with its name", () => {
    render(
      <ChatThread
        messages={[
          ...BASE,
          { id: "3", role: "tool", name: "spending_by_category", content: <table /> },
        ]}
      />
    );
    expect(screen.getByText("spending_by_category")).toBeInTheDocument();
  });

  it("shows a caret while a reply streams, and a failed one says so", () => {
    const { container, rerender } = render(
      <ChatThread
        messages={[...BASE, { id: "3", role: "assistant", content: "Look", status: "streaming" }]}
      />
    );
    expect(container.querySelector(".type-caret")).not.toBeNull();
    rerender(
      <ChatThread
        messages={[...BASE, { id: "3", role: "assistant", content: "Look", status: "error" }]}
      />
    );
    expect(screen.getByText("This message did not arrive.")).toBeInTheDocument();
  });

  it("reads a reply out once, when it finishes, and never the history", () => {
    const { container, rerender } = render(<ChatThread messages={BASE} />);
    const live = container.querySelector("[aria-live=polite]") as HTMLElement;
    expect(live).toHaveTextContent("");
    rerender(
      <ChatThread
        messages={[
          ...BASE,
          { id: "3", role: "assistant", content: "Rent is", status: "streaming" },
        ]}
      />
    );
    expect(live).toHaveTextContent("");
    rerender(
      <ChatThread messages={[...BASE, { id: "3", role: "assistant", content: "Rent is 62%." }]} />
    );
    expect(live).toHaveTextContent("Assistant: Rent is 62%.");
  });

  it("shows the empty slot before the first message", () => {
    render(<ChatThread messages={[]} empty={<p>Ask about your money</p>} />);
    expect(screen.getByText("Ask about your money")).toBeInTheDocument();
  });

  it("reads the reply, not the tool card that follows it", () => {
    const { container, rerender } = render(
      <ChatThread
        messages={[
          ...BASE,
          { id: "3", role: "assistant", content: "Rent is", status: "streaming" },
        ]}
      />
    );
    rerender(
      <ChatThread
        messages={[
          ...BASE,
          { id: "3", role: "assistant", content: "Rent is 62%." },
          { id: "4", role: "tool", name: "spending", content: <p>home 1,243</p> },
        ]}
      />
    );
    expect(container.querySelector("[aria-live=polite]")).toHaveTextContent(
      "Assistant: Rent is 62%."
    );
  });
});
