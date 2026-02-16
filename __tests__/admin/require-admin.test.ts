import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    const err = new Error("NEXT_REDIRECT");
    (err as Error & { digest: string }).digest = "NEXT_REDIRECT";
    throw err;
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login when user is not authenticated", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
      from: vi.fn(),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const { requireAdmin } = await import("@/lib/admin/require-admin");
    await expect(requireAdmin("en")).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/en/auth/login");
  });

  it("redirects to locale root when user is authenticated but not admin", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const fromMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "user-1", role: "user" },
            error: null,
          }),
        }),
      }),
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", email: "u@test.com" } },
          error: null,
        }),
      },
      from: fromMock,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const { requireAdmin } = await import("@/lib/admin/require-admin");
    await expect(requireAdmin("en")).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/en/protected");
  });

  it("does not redirect when user is admin", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const fromMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "admin-1", role: "admin", created_at: "", updated_at: "" },
            error: null,
          }),
        }),
      }),
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "admin-1", email: "admin@test.com" } },
          error: null,
        }),
      },
      from: fromMock,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const { requireAdmin } = await import("@/lib/admin/require-admin");
    const result = await requireAdmin("en");

    expect(redirect).not.toHaveBeenCalled();
    expect(result.user.id).toBe("admin-1");
    expect(result.profile.role).toBe("admin");
  });
});
