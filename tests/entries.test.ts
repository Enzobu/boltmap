import { describe, expect, it } from "vitest";
import { filterEntries } from "@/lib/entries";

const entries = [
  { code: "4681", name: "Cache sous berceau" },
  { code: "2417", name: "Boîte à air" },
  { code: "8330", name: "Support alternateur" },
];

describe("filterEntries", () => {
  it("returns all entries for an empty query", () => {
    expect(filterEntries(entries, "")).toHaveLength(3);
  });

  it("filters by code", () => {
    expect(filterEntries(entries, "4681")).toEqual([entries[0]]);
  });

  it("filters by name case-insensitively", () => {
    expect(filterEntries(entries, "ALTERNATEUR")).toEqual([entries[2]]);
  });
});
