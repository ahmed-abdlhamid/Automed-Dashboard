import Shell from "@/components/Shell";
import {
  getAccessibleProjects,
  getCurrentProjectId,
  getCurrentUserDisplayName,
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
    userName,
  ] = await Promise.all([
    getAccessibleProjects(),
    getCurrentProjectId(),
    isCurrentUserAdmin(),
    getCurrentUserDisplayName(),
  ]);

  return (
    <Shell
      projects={projects}
      currentProjectId={currentProjectId}
      isAdmin={isAdmin}
      userName={userName}
    >
      {children}
    </Shell>
  );
}