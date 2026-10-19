import Shell from "@/components/Shell";
import {
  getAccessibleProjects,
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
    getAccessibleProjects(),
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