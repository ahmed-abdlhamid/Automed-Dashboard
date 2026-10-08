import { getOverview } from "@/lib/data.server";
import { getCurrentProjectId } from "@/lib/project";
import AnalyticsView from "./AnalyticsView";

export default async function AnalyticsPage() {
  const projectId = await getCurrentProjectId();
  const data = await getOverview(projectId);

  return <AnalyticsView data={data} />;
}
