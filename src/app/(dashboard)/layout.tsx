import Shell from "@/components/Shell";
import {
  getAccessibleProjects,
  getCurrentProjectId,
  isCurrentUserAdmin,
  getCurrentUserDisplayName,
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
    userName,
  ] = await Promise.all([
    getAccessibleProjects(),
    getCurrentProjectId(),
    isCurrentUserAdmin(),
    getCurrentUserDisplayName(),
  ]);

  return (
    <Shell
      userName={userName}
      projects={projects}
      currentProjectId={currentProjectId}
      isAdmin={isAdmin}
    >
      {children}
    </Shell>
  );
}