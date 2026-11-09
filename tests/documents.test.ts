import { describe, expect, it, vi } from "vitest";
import { generateDocumentCode, isDocumentCode, validateDocumentFile } from "@/lib/documents";
import { documentSchema, documentPatchSchema } from "@/lib/validation";

describe("documentation codes", () => {
  it("generates a code containing exactly three uppercase letters", () => {
    for (let index = 0; index < 50; index += 1) {
      expect(isDocumentCode(generateDocumentCode())).toBe(true);
    }
  });

  it("rejects codes that are not exactly three uppercase letters", () => {
    expect(isDocumentCode("ABC")).toBe(true);
    expect(isDocumentCode("AB1")).toBe(false);
    expect(isDocumentCode("abC")).toBe(false);
    expect(isDocumentCode("ABCD")).toBe(false);
  });
});

describe("documentation payloads", () => {
  it("requires a title and caps notes", () => {
    expect(documentSchema.safeParse({ title: "Schéma soupapes", notes: "1 à 16" }).success).toBe(true);
    expect(documentSchema.safeParse({ title: " " }).success).toBe(false);
    expect(documentSchema.safeParse({ title: "Valid", notes: "x".repeat(4001) }).success).toBe(false);
  });

  it("accepts a partial edit but rejects empty edits and codes", () => {
    expect(documentPatchSchema.safeParse({ notes: "Mis à jour" }).success).toBe(true);
    expect(documentPatchSchema.safeParse({}).success).toBe(false);
    expect(documentPatchSchema.safeParse({ code: "XYZ" }).success).toBe(false);
  });
});

describe("documentation attachments", () => {
  it("accepts PDF signatures and ignores declared MIME type", async () => {
    const file = new File([new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55])], "plan.pdf", { type: "text/plain" });
    const result = await validateDocumentFile(file);
    expect(result.mimeType).toBe("application/pdf");
    expect(result.extension).toBe("pdf");
  });

  it("rejects unsupported and empty files", async () => {
    await expect(validateDocumentFile(new File(["hello"], "file.txt"))).rejects.toThrow();
    await expect(validateDocumentFile(new File([], "empty.pdf"))).rejects.toThrow();
  });

  it("rejects files over 15 MiB before reading them", async () => {
    const file = { size: 15 * 1024 * 1024 + 1, arrayBuffer: vi.fn() } as unknown as File;
    await expect(validateDocumentFile(file)).rejects.toThrow("15 Mo");
    expect(file.arrayBuffer).not.toHaveBeenCalled();
  });
});
