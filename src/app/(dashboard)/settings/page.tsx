import { getCurrentProject } from "@/lib/project";
import SettingsView from "./SettingsView";

export default async function SettingsPage() {
  const project =
    await getCurrentProject();

  return (
    <SettingsView
      project={project}
    />
  );
}