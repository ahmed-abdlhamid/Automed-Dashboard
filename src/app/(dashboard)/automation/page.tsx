import { readAllRows } from "@/lib/supabase/pagination";
import { redirect } from "next/navigation";
import {
  getAccessibleProjects,
  getCurrentProject,
  getCurrentProjectRole,
} from "@/lib/project";
import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase/server";
import AutomationView from "./AutomationView";

export const dynamic = "force-dynamic";

export default async function AutomationPage() {
  const role = await getCurrentProjectRole();

  if (role !== "admin") {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/");
  }

  const { data: adminMemberships, error } = await readAllRows(offset => supabase
    .from("project_members")
    .select("project_id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("role", "admin").order("project_id").range(offset, offset + 999));

  if (error) {
    throw new Error("Failed to load admin project memberships: " + error.message);
  }

  const adminProjectIds = new Set((adminMemberships ?? []).map((item) => item.project_id));
  const projects = (await getAccessibleProjects()).filter((project) => adminProjectIds.has(project.id));

  if (projects.length === 0) {
    redirect("/");
  }

  const currentProject = await getCurrentProject();
  const initialProjectId = currentProject && projects.some((project) => project.id === currentProject.id)
    ? currentProject.id
    : projects[0].id;

  return (
    <AutomationView
      projects={projects.map((project) => ({ id: project.id, name: project.name }))}
      initialProjectId={initialProjectId}
    />
  );
}
