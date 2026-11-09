import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireUserId, findMany } = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireUserId }));
vi.mock("@/lib/db", () => ({ db: { entry: { findMany } } }));

import { GET } from "@/app/api/entries/search/route";

describe("global search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireUserId.mockResolvedValue("owner-1");
    findMany.mockResolvedValue([]);
  });

  it("rejects unauthenticated requests", async () => {
    requireUserId.mockResolvedValue(null);
    const response = await GET(new Request("http://localhost/api/entries/search?q=1234"));
    expect(response.status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("does not query the database for empty searches", async () => {
    const response = await GET(new Request("http://localhost/api/entries/search?q=%20"));
    expect(await response.json()).toEqual({ results: [] });
    expect(findMany).not.toHaveBeenCalled();
  });

  it("rejects overly long searches", async () => {
    const response = await GET(new Request(`http://localhost/api/entries/search?q=${"a".repeat(181)}`));
    expect(response.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("scopes code and name matching to the signed-in user's projects", async () => {
    const response = await GET(new Request("http://localhost/api/entries/search?q=bobine"));
    expect(response.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { userId: "owner-1" },
        OR: [
          { code: { contains: "bobine" } },
          { name: { contains: "bobine" } },
        ],
      },
      take: 100,
    }));
  });

  it("returns a project label and entry data without a nested project record", async () => {
    findMany.mockResolvedValue([{
      id: "entry-1", code: "1234", name: "Vis bobine", projectId: "project-2",
      archivedAt: null, images: [], project: { id: "project-2", name: "Nouveau moteur" },
    }]);
    const response = await GET(new Request("http://localhost/api/entries/search?q=1234"));
    expect(await response.json()).toEqual({
      results: [{
        entry: { id: "entry-1", code: "1234", name: "Vis bobine", projectId: "project-2", archivedAt: null, images: [] },
        project: { id: "project-2", name: "Nouveau moteur" },
      }],
    });
  });
});
