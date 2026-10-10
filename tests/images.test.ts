import { describe, expect, it } from "vitest";
import { detectImageType } from "@/lib/images";

describe("detectImageType", () => {
  it("detects JPEG files", () => {
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toEqual({
      extension: "jpg",
      mimeType: "image/jpeg",
    });
  });

  it("detects PNG files", () => {
    expect(
      detectImageType(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toEqual({
      extension: "png",
      mimeType: "image/png",
    });
  });

  it("detects WebP files", () => {
    expect(
      detectImageType(
        new Uint8Array([
          0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
        ]),
      ),
    ).toEqual({
      extension: "webp",
      mimeType: "image/webp",
    });
  });

  it("rejects unsupported content", () => {
    expect(detectImageType(new Uint8Array([1, 2, 3, 4]))).toBeNull();
  });
});
