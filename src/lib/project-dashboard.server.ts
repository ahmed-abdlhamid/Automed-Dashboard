import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidDashboardSettings, type ProjectDashboardSettings } from "@/config/project-dashboard";

export const getProjectDashboardSettings = cache(async (projectId: string): Promise<{
  settings: ProjectDashboardSettings | null; available: boolean;
}> => {
  if (!projectId) return { settings: null, available: false };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("project_dashboard_settings")
    .select("category, specialty").eq("project_id", projectId).maybeSingle();
  if (error) return { settings: null, available: false };
  return { settings: isValidDashboardSettings(data) ? data : null, available: true };
});
