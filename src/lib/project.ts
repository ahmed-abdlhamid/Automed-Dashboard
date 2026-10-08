import { cookies } from "next/headers";
import { dashboardConfig } from "@/config/dashboard.config";
import type { Project } from "./data";
import { getProjects as getServerProjects } from "./data.server";
import { createSupabaseServerClient } from "./supabase/server";

export type ProjectRole = "admin" | "client";

export async function getCurrentProjectId(): Promise<string> {
  const projects = await getServerProjects();

  if (projects.length === 0) {
    return dashboardConfig.project.id;
  }

  const cookieStore = await cookies();

  const savedProjectId =
    cookieStore.get("automed_project_id")?.value;

  const savedProject = projects.find(
    (project) => project.id === savedProjectId
  );

  if (savedProject) {
    return savedProject.id;
  }

  const configuredProject = projects.find(
    (project) => project.id === dashboardConfig.project.id
  );

  if (configuredProject) {
    return configuredProject.id;
  }

  return projects[0].id;
}

export async function getCurrentProject(): Promise<Project | null> {
  const projectId = await getCurrentProjectId();
  const projects = await getServerProjects();

  return (
    projects.find(
      (project) => project.id === projectId
    ) ?? null
  );
}

export async function getCurrentProjectRole(): Promise<ProjectRole | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const projectId = await getCurrentProjectId();

  const {
    data,
    error,
  } = await supabase
    .from("project_members")
    .select("role")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Supabase project role error:",
      error
    );

    return null;
  }

  if (
    data?.role === "admin" ||
    data?.role === "client"
  ) {
    return data.role;
  }

  return null;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const role = await getCurrentProjectRole();

  return role === "admin";
}

export async function getCurrentUserDisplayName(): Promise<string> {
  const supabase = await createSupabaseServerClient();

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
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && data?.full_name?.trim()) {
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
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char: string) => {
      return char.toUpperCase();
    });
}