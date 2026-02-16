import { describe, it, expect, vi, beforeEach } from "vitest";

const mockInsert = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    single: vi.fn().mockResolvedValue({ data: { id: "new-id" }, error: null }),
  }),
});
const mockUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ error: null }),
});
const mockDelete = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ error: null }),
});

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/admin/require-admin", () => ({
  requireAdmin: vi.fn().mockResolvedValue({
    user: { id: "admin-1" },
    profile: { role: "admin" },
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("admin actions", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const admin = await import("@/lib/supabase/admin");
    vi.mocked(admin.createAdminClient).mockReturnValue({
      from: vi.fn().mockImplementation(() => ({
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
      })),
    } as ReturnType<typeof admin.createAdminClient>);
  });

  it("createAdminRecord inserts with form data and returns success", async () => {
    const { createManageRecord } = await import("@/app/[locale]/protected/actions/manage");
    const formData = new FormData();
    formData.set("locale", "en");
    formData.set("name_mm", "Test Region");
    formData.set("name_en", "Test");
    formData.set("sort_order", "0");

    const result = await createManageRecord("regions", formData);

    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalled();
  });

  it("deleteManageRecord deletes by id and returns success", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const deleteChain = vi.fn().mockReturnValue({ eq: eqMock });
    const admin = await import("@/lib/supabase/admin");
    vi.mocked(admin.createAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ delete: deleteChain }),
    } as ReturnType<typeof admin.createAdminClient>);

    const { deleteManageRecord } = await import("@/app/[locale]/protected/actions/manage");
    const result = await deleteManageRecord("regions", "1", "en");

    expect(result.success).toBe(true);
    expect(deleteChain).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", "1");
  });

  it("deleteAdminRecord returns error message on FK constraint failure", async () => {
    const eqMock = vi.fn().mockResolvedValue({
      error: { message: "violates foreign key constraint" },
    });
    const deleteChain = vi.fn().mockReturnValue({ eq: eqMock });
    const admin = await import("@/lib/supabase/admin");
    vi.mocked(admin.createAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ delete: deleteChain }),
    } as ReturnType<typeof admin.createAdminClient>);

    const { deleteManageRecord } = await import("@/app/[locale]/protected/actions/manage");
    const result = await deleteManageRecord("regions", "1", "en");

    expect(result.success).toBe(false);
    expect("error" in result && result.error).toContain("in use");
  });
});
