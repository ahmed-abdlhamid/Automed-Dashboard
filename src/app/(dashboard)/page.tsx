import { getOverview } from "@/lib/data.server";
import {
  getCurrentProject,
  getCurrentProjectRole,
  getCurrentUserDisplayName,
} from "@/lib/project";
import OverviewView from "./OverviewView";

export default async function OverviewPage() {
  const [
    project,
    role,
    userName,
  ] = await Promise.all([
    getCurrentProject(),
    getCurrentProjectRole(),
    getCurrentUserDisplayName(),
  ]);

  const data = await getOverview(
    project?.id || ""
  );

  return (
    <OverviewView
      data={data}
      project={project}
      role={role}
      userName={userName}
    />
  );
}