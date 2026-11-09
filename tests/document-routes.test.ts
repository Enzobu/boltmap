import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  projectFindFirst: vi.fn(),
  documentFindMany: vi.fn(),
  documentCreate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireUserId: mocks.requireUserId }));
vi.mock("@/lib/db", () => ({
  db: {
    project: { findFirst: mocks.projectFindFirst },
    document: { findMany: mocks.documentFindMany, create: mocks.documentCreate },
  },
}));

import { GET, POST } from "@/app/api/projects/[projectId]/documents/route";

const context = { params: Promise.resolve({ projectId: "project-1" }) };

describe("project documents API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUserId.mockResolvedValue("owner-1");
    mocks.projectFindFirst.mockResolvedValue({ id: "project-1" });
    mocks.documentFindMany.mockResolvedValue([]);
    mocks.documentCreate.mockResolvedValue({ id: "document-1", code: "EGH", title: "Soupapes", files: [] });
  });

  it("requires authentication for reading and creating", async () => {
    mocks.requireUserId.mockResolvedValue(null);
    expect((await GET(new Request("http://localhost"), context)).status).toBe(401);
    expect((await POST(new Request("http://localhost", { method: "POST", body: "{}" }), context)).status).toBe(401);
    expect(mocks.projectFindFirst).not.toHaveBeenCalled();
  });

  it("does not reveal or modify another user's project", async () => {
    mocks.projectFindFirst.mockResolvedValue(null);
    expect((await GET(new Request("http://localhost"), context)).status).toBe(404);
    expect((await POST(new Request("http://localhost", { method: "POST", body: "{}" }), context)).status).toBe(404);
    expect(mocks.documentFindMany).not.toHaveBeenCalled();
    expect(mocks.documentCreate).not.toHaveBeenCalled();
  });

  it("filters documents by the requested project after checking owner", async () => {
    expect((await GET(new Request("http://localhost"), context)).status).toBe(200);
    expect(mocks.projectFindFirst).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "owner-1" },
      select: { id: true },
    });
    expect(mocks.documentFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { projectId: "project-1" },
    }));
  });

  it("generates a server-owned code and rejects injected codes", async () => {
    const valid = await POST(new Request("http://localhost", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Soupapes", notes: "Ordre 1 à 16" }),
    }), context);
    expect(valid.status).toBe(201);
    expect(mocks.documentCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ projectId: "project-1", title: "Soupapes", code: expect.stringMatching(/^[A-Z]{3}$/) }),
    }));
    const invalid = await POST(new Request("http://localhost", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Soupapes", code: "EGH" }),
    }), context);
    expect(invalid.status).toBe(400);
  });
});
