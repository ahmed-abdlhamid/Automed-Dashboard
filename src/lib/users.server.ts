import { readAllRows } from "@/lib/supabase/pagination";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  memberships: {
    projectId: string;
    projectName: string;
    role: "admin" | "client";
  }[];
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

type MembershipRow = {
  user_id: string;
  project_id: string;
  role: "admin" | "client";
};

type ProjectRow = {
  id: string;
  name: string;
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase =
    await createSupabaseServerClient();

  const [
    profilesResult,
    membershipsResult,
    projectsResult,
  ] = await Promise.all([
    readAllRows(offset => supabase
      .from("profiles")
      .select(
        "id, email, full_name, created_at", { count: "exact" }
      )
      .order("created_at", {
        ascending: true,
      }).order("id").range(offset, offset + 999)),

    readAllRows(offset => supabase
      .from("project_members")
      .select(
        "user_id, project_id, role", { count: "exact" }
      ).order("user_id").order("project_id").range(offset, offset + 999)),

    readAllRows(offset => supabase
      .from("projects")
      .select("id, name", { count: "exact" })
      .order("created_at", {
        ascending: true,
      }).order("id").range(offset, offset + 999)),
  ]);

  if (profilesResult.error) {
    throw new Error(
      "Failed to load profiles: " +
        profilesResult.error.message
    );
  }

  if (membershipsResult.error) {
    throw new Error(
      "Failed to load memberships: " +
        membershipsResult.error.message
    );
  }

  if (projectsResult.error) {
    throw new Error(
      "Failed to load projects: " +
        projectsResult.error.message
    );
  }

  const profiles =
    profilesResult.data as ProfileRow[];

  const memberships =
    membershipsResult.data as MembershipRow[];

  const projects =
    projectsResult.data as ProjectRow[];

  const projectNames = new Map(projects.map(project => [project.id, project.name]));
  const membershipsByUser = new Map<string, AdminUser["memberships"]>();
  for (const membership of memberships) {
    const entries = membershipsByUser.get(membership.user_id) ?? [];
    entries.push({ projectId: membership.project_id,
      projectName: projectNames.get(membership.project_id) ?? membership.project_id,
      role: membership.role });
    membershipsByUser.set(membership.user_id, entries);
  }
  return profiles.map(profile => ({ id: profile.id, email: profile.email,
    fullName: profile.full_name, createdAt: profile.created_at,
    memberships: membershipsByUser.get(profile.id) ?? [] }));
}
