import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

describe("checkAdminSchema", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ok: true when all tables are reachable", async () => {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const fromMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });
    vi.mocked(createAdminClient).mockReturnValue({
      from: fromMock,
    } as ReturnType<typeof import("@/lib/supabase/admin").createAdminClient>);

    const { checkAdminSchema } = await import("@/lib/admin/schema-check");
    const result = await checkAdminSchema();

    expect(result.ok).toBe(true);
  });

  it("returns ok: false with reason when a table fails", async () => {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    let callCount = 0;
    const fromMock = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 2) {
            return Promise.resolve({ data: null, error: { message: "relation \"missing_table\" does not exist" } });
          }
          return Promise.resolve({ data: [], error: null });
        }),
      }),
    }));
    vi.mocked(createAdminClient).mockReturnValue({
      from: fromMock,
    } as ReturnType<typeof import("@/lib/supabase/admin").createAdminClient>);

    const { checkAdminSchema } = await import("@/lib/admin/schema-check");
    const result = await checkAdminSchema();

    expect(result.ok).toBe(false);
    expect("reason" in result && result.reason).toContain("does not exist");
  });
});
