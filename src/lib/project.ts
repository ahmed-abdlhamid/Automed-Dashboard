import { cookies } from "next/headers";
import { dashboardConfig } from "@/config/dashboard.config";
import type { Project } from "./data";
import { getProjects as getServerProjects } from "./data.server";
import { createSupabaseServerClient } from "./supabase/server";

export type ProjectRole = "admin" | "client";

type ProjectMembership = {
  project_id: string;
  role: ProjectRole;
};

async function getCurrentUserMemberships(): Promise<
  ProjectMembership[]
> {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("project_members")
    .select("project_id, role")
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "Supabase project memberships error:",
      error
    );

    return [];
  }

  return (data || []).filter(
    (membership) =>
      membership.role === "admin" ||
      membership.role === "client"
  ) as ProjectMembership[];
}

export async function getAccessibleProjects(): Promise<
  Project[]
> {
  const [
    projects,
    memberships,
  ] = await Promise.all([
    getServerProjects(),
    getCurrentUserMemberships(),
  ]);

  if (memberships.length === 0) {
    return [];
  }

  const accessibleProjectIds =
    new Set(
      memberships.map(
        (membership) =>
          membership.project_id
      )
    );

  return projects.filter(
    (project) =>
      accessibleProjectIds.has(
        project.id
      )
  );
}

export async function getCurrentProjectId(): Promise<string> {
  const memberships =
    await getCurrentUserMemberships();

  const projects =
    await getServerProjects();

  if (
    memberships.length === 0 ||
    projects.length === 0
  ) {
    return dashboardConfig.project.id;
  }

  const accessibleProjectIds =
    new Set(
      memberships.map(
        (membership) =>
          membership.project_id
      )
    );

  const accessibleProjects =
    projects.filter(
      (project) =>
        accessibleProjectIds.has(
          project.id
        )
    );

  if (
    accessibleProjects.length === 0
  ) {
    return dashboardConfig.project.id;
  }

  const cookieStore =
    await cookies();

  const savedProjectId =
    cookieStore.get(
      "automed_project_id"
    )?.value;

  /*
   * The cookie is only a preference.
   * It is never trusted as authorization.
   *
   * A project is selected only when the
   * authenticated user actually belongs
   * to that project.
   */
  const savedProject =
    accessibleProjects.find(
      (project) =>
        project.id ===
        savedProjectId
    );

  if (savedProject) {
    return savedProject.id;
  }

  const configuredProject =
    accessibleProjects.find(
      (project) =>
        project.id ===
        dashboardConfig.project.id
    );

  if (configuredProject) {
    return configuredProject.id;
  }

  return accessibleProjects[0].id;
}

export async function getCurrentProject(): Promise<Project | null> {
  const projectId =
    await getCurrentProjectId();

  const projects =
    await getServerProjects();

  return (
    projects.find(
      (project) =>
        project.id === projectId
    ) ?? null
  );
}

export async function getCurrentProjectRole(): Promise<ProjectRole | null> {
  const [
    memberships,
    projectId,
  ] = await Promise.all([
    getCurrentUserMemberships(),
    getCurrentProjectId(),
  ]);

  const membership =
    memberships.find(
      (item) =>
        item.project_id ===
        projectId
    );

  return (
    membership?.role ?? null
  );
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const role =
    await getCurrentProjectRole();

  return role === "admin";
}

export async function getCurrentUserDisplayName(): Promise<string> {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "User";
  }

  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select(
      "full_name, email"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (
    !error &&
    data?.full_name?.trim()
  ) {
    return data.full_name.trim();
  }

  const email =
    data?.email ||
    user.email ||
    "";

  const localPart =
    email.split("@")[0] ||
    "User";

  return localPart
    .replace(
      /[._-]+/g,
      " "
    )
    .replace(
      /\b\w/g,
      (char: string) =>
        char.toUpperCase()
    );
}