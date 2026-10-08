import { getOverview } from "@/lib/data.server";
import { getCurrentProjectId } from "@/lib/project";
import AutomationView from "./AutomationView";

export default async function AutomationPage() {
  const projectId = await getCurrentProjectId();
  const data = await getOverview(projectId);

  return <AutomationView data={data} />;
}
