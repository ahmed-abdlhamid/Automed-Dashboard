"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { isValidDashboardSettings } from "@/config/project-dashboard";

export async function saveProjectDashboardSettings(projectId: string, value: unknown): Promise<{ ok: boolean }> {
  if (typeof projectId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)
    || !isValidDashboardSettings(value)) return { ok: false };
  const user = await getAuthenticatedUser();
  if (!user) return { ok: false };
  const supabase = await createSupabaseServerClient();
  const { data: membership, error: membershipError } = await supabase.from("project_members")
    .select("role").eq("project_id", projectId).eq("user_id", user.id).maybeSingle();
  if (membershipError || membership?.role !== "admin") return { ok: false };
  const { data, error } = await supabase.from("project_dashboard_settings")
    .upsert({ project_id: projectId, category: value.category, specialty: value.specialty }, { onConflict: "project_id" })
    .select("project_id").single();
  if (error || !data) return { ok: false };
  revalidatePath("/", "layout");
  return { ok: true };
}
