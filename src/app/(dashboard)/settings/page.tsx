import { getCurrentProject, getCurrentProjectRole } from "@/lib/project";
import { getProjectDashboardSettings } from "@/lib/project-dashboard.server";
import SettingsView from "./SettingsView";

export default async function SettingsPage() {
  const [project, role] = await Promise.all([getCurrentProject(), getCurrentProjectRole()]);
  const dashboard = role === "admin" ? await getProjectDashboardSettings(project?.id ?? "") : null;
  return <SettingsView project={project} dashboard={dashboard} />;
}
