import { describe, expect, it } from "vitest";
import { transferEntrySchema } from "@/lib/validation";

describe("transferEntrySchema", () => {
  it("accepts a destination project identifier", () => {
    expect(transferEntrySchema.safeParse({ projectId: "project-new" }).success).toBe(true);
  });

  it("rejects an empty destination identifier", () => {
    expect(transferEntrySchema.safeParse({ projectId: "" }).success).toBe(false);
  });

  it("rejects missing or non-string project identifiers", () => {
    expect(transferEntrySchema.safeParse({}).success).toBe(false);
    expect(transferEntrySchema.safeParse({ projectId: 123 }).success).toBe(false);
  });

  it("rejects unexpected fields that could override entry ownership or code", () => {
    expect(transferEntrySchema.safeParse({ projectId: "other", code: "1234" }).success).toBe(false);
  });
});
