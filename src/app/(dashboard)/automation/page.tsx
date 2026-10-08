import { redirect } from "next/navigation";
import {
  getCurrentProject,
  getCurrentProjectRole,
} from "@/lib/project";
import AutomationView from "./AutomationView";

export default async function AutomationPage() {
  const role =
    await getCurrentProjectRole();

  if (role !== "admin") {
    redirect("/");
  }

  const project =
    await getCurrentProject();

  return (
    <AutomationView
      projectName={
        project?.name || "Current project"
      }
    />
  );
}