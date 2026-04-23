import type { Role } from "@prisma/client";
import { hasMinRole } from "@/lib/roles";

interface RoleGateProps {
  userRole: Role;
  minRole: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGate({
  userRole,
  minRole,
  children,
  fallback,
}: RoleGateProps) {
  if (!hasMinRole(userRole, minRole)) {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children}</>;
}
