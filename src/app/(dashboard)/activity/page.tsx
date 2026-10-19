import { getOrders } from "@/lib/data.server";
import { getCurrentProjectId } from "@/lib/project";
import ActivityView from "./ActivityView";

export default async function ActivityPage() {
  const projectId = await getCurrentProjectId();
  const orders = await getOrders(projectId);

  return <ActivityView orders={orders.slice(0, 10)} />;
}
