import { randomInt } from "node:crypto";

export function generateFourDigitCode(): string {
  return randomInt(1000, 10000).toString();
}
