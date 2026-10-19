import { getOrders } from "@/lib/data.server";
import { getCurrentProjectId } from "@/lib/project";
import ActivityView from "./ActivityView";

export default async function ActivityPage() {
  const projectId = await getCurrentProjectId();
  const orders = await getOrders(projectId, { limit: 10 });

  return <ActivityView orders={orders} />;
}
