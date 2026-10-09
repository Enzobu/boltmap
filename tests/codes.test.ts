import { describe, expect, it } from "vitest";
import { generateFourDigitCode } from "@/lib/codes";

describe("generateFourDigitCode", () => {
  it("always returns four numeric digits from 1000 to 9999", () => {
    for (let index = 0; index < 200; index += 1) {
      const code = generateFourDigitCode();
      expect(code).toMatch(/^\d{4}$/);
      expect(Number(code)).toBeGreaterThanOrEqual(1000);
      expect(Number(code)).toBeLessThanOrEqual(9999);
    }
  });
});
