import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { hasMinRole } from "@/lib/roles";
import AppManager from "./AppManager";

export default async function AdminAppsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!hasMinRole(session.user.role, "MANAGER")) redirect("/dashboard");

  const apps = await prisma.portalApp.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-fs-espresso">
          Manage Apps
        </h1>
        <p className="mt-1 text-sm text-fs-copper">
          Add, edit, or remove apps from the portal
        </p>
      </div>
      <AppManager initialApps={apps} />
    </div>
  );
}
