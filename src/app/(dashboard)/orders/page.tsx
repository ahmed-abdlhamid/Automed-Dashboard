import { getOrders } from "@/lib/data.server";
import { getCurrentProjectId } from "@/lib/project";
import OrdersView from "./OrdersView";

export default async function OrdersPage() {
  const projectId =
    await getCurrentProjectId();

  const orders = await getOrders(projectId);

  return <OrdersView orders={orders} />;
}