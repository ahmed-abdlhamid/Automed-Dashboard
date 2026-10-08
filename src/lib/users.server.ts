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
    supabase
      .from("profiles")
      .select(
        "id, email, full_name, created_at"
      )
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("project_members")
      .select(
        "user_id, project_id, role"
      ),

    supabase
      .from("projects")
      .select("id, name")
      .order("created_at", {
        ascending: true,
      }),
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

  return profiles.map(
    (profile) => ({
      id: profile.id,

      email: profile.email,

      fullName:
        profile.full_name,

      createdAt:
        profile.created_at,

      memberships:
        memberships
          .filter(
            (membership) =>
              membership.user_id ===
              profile.id
          )
          .map(
            (membership) => ({
              projectId:
                membership.project_id,

              projectName:
                projects.find(
                  (project) =>
                    project.id ===
                    membership.project_id
                )?.name ||
                membership.project_id,

              role:
                membership.role,
            })
          ),
    })
  );
}