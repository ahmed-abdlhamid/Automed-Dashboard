import Shell from "@/components/Shell";
import { getProjects } from "@/lib/data.server";
import {
  getCurrentProjectId,
  isCurrentUserAdmin,
} from "@/lib/project";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    projects,
    currentProjectId,
    isAdmin,
  ] = await Promise.all([
    getProjects(),
    getCurrentProjectId(),
    isCurrentUserAdmin(),
  ]);

  return (
    <Shell
      projects={projects}
      currentProjectId={currentProjectId}
      isAdmin={isAdmin}
    >
      {children}
    </Shell>
  );
}
