import { getOverview } from "@/lib/data.server";
import {
  getCurrentProject,
  getCurrentProjectRole,
  getCurrentUserDisplayName,
} from "@/lib/project";
import OverviewView from "./OverviewView";

export default async function OverviewPage() {
  const projectPromise = getCurrentProject();
  const dataPromise = projectPromise.then(project => getOverview(project?.id || ""));
  const [
    project,
    role,
    userName,
  ] = await Promise.all([
    projectPromise,
    getCurrentProjectRole(),
    getCurrentUserDisplayName(),
  ]);

  const data = await dataPromise;

  return (
    <OverviewView
      greetingHour={Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Cairo" }).format(new Date()))}
      data={data}
      project={project}
      role={role}
      userName={userName}
    />
  );
}