import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileDropzone, accepts, formatBytes } from "./file-dropzone";

const png = (name: string, size: number) => {
  const file = new File(["x"], name, { type: "image/png" });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("FileDropzone", () => {
  it("is a real file input with its label, which a click or the keyboard opens", () => {
    render(<FileDropzone onFiles={() => {}} accept="image/*" />);
    const input = screen.getByLabelText(/Drop files here/);
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).not.toHaveAttribute("tabindex", "-1");
  });

  it("hands over the files that pass", async () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} accept="image/*" maxSize={5_000_000} multiple />);
    await userEvent.upload(screen.getByLabelText(/Drop files here/), [png("a.png", 1000)]);
    expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: "a.png" })]);
  });

  it("says a file is over the limit, and what the limit is", () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} maxSize={5_000_000} />);
    fireEvent.drop(screen.getByText(/Drop files here/).closest("label") as HTMLElement, {
      dataTransfer: { files: [png("big.png", 12_000_000)] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("big.png is 12 MB; the limit is 5 MB.");
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("says a file is not a type it takes", () => {
    render(<FileDropzone onFiles={() => {}} accept=".pdf" />);
    fireEvent.drop(screen.getByText(/Drop files here/).closest("label") as HTMLElement, {
      dataTransfer: { files: [png("a.png", 10)] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("a.png is not a type this takes (.pdf).");
  });

  it("lights up while a file is dragged over it", () => {
    render(<FileDropzone onFiles={() => {}} />);
    const zone = screen.getByText(/Drop files here/).closest("label") as HTMLElement;
    fireEvent.dragEnter(zone);
    expect(zone).toHaveAttribute("data-over");
    expect(zone).toHaveTextContent("Drop to add");
    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveAttribute("data-over");
  });

  it("lists the files: uploading with a progress bar, done, failed, each removable", async () => {
    const onRemove = vi.fn();
    render(
      <FileDropzone
        onFiles={() => {}}
        onRemove={onRemove}
        items={[
          { id: "1", name: "a.png", size: 320_000, progress: 0.4 },
          { id: "2", name: "b.png", size: 1_200_000 },
          { id: "3", name: "c.png", size: 10, error: "The server said no." },
        ]}
      />
    );
    expect(screen.getByRole("progressbar", { name: "Uploading a.png" })).toHaveAttribute(
      "aria-valuenow",
      "40"
    );
    expect(screen.getByText("The server said no.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove b.png" }));
    expect(onRemove).toHaveBeenCalledWith("2");
  });

  it("matches types, wildcards and extensions, and sizes in words", () => {
    expect(accepts(png("a.png", 1), "image/*")).toBe(true);
    expect(accepts(png("a.png", 1), ".png,.jpg")).toBe(true);
    expect(accepts(png("a.png", 1), "application/pdf")).toBe(false);
    expect(formatBytes(320_000, "en-US")).toBe("320 kB");
    expect(formatBytes(1_250_000, "en-US")).toBe("1.3 MB");
  });
});
