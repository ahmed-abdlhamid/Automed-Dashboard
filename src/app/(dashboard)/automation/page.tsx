import { redirect } from "next/navigation";
import { getOverview } from "@/lib/data.server";
import {
  getCurrentProjectId,
  getCurrentProjectRole,
} from "@/lib/project";
import AutomationView from "./AutomationView";

export default async function AutomationPage() {
  const role =
    await getCurrentProjectRole();

  if (role !== "admin") {
    redirect("/");
  }

  const projectId =
    await getCurrentProjectId();

  const data =
    await getOverview(projectId);

  return (
    <AutomationView
      data={data}
    />
  );
}