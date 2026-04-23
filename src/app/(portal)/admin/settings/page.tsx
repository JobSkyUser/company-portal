import { auth } from "@/lib/auth";
import { hasMinRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { Construction } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!hasMinRole(session.user.role, "MANAGER")) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-fs-espresso">
          Portal Settings
        </h1>
        <p className="mt-1 text-sm text-fs-copper">
          Configure portal-wide settings
        </p>
      </div>

      <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-fs-warm-gray">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-fs-warm-white">
          <Construction className="h-8 w-8 text-fs-copper" />
        </div>
        <h2 className="font-display text-lg font-bold text-fs-espresso">
          Coming Soon
        </h2>
        <p className="mt-1 text-sm text-fs-copper">
          Portal settings and configuration options will be available here.
        </p>
      </div>
    </div>
  );
}
