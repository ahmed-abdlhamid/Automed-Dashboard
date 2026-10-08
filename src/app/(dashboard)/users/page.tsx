import { redirect } from "next/navigation";
import { getAdminUsers } from "@/lib/users.server";
import {
  getCurrentProjectRole,
} from "@/lib/project";
import UsersView from "./UsersView";

export default async function UsersPage() {
  const role =
    await getCurrentProjectRole();

  if (role !== "admin") {
    redirect("/");
  }

  const users =
    await getAdminUsers();

  return (
    <UsersView
      users={users}
    />
  );
}