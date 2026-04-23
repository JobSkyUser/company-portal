import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  EMPLOYEE: 0,
  MANAGER: 1,
  ADMIN: 2,
};

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    EMPLOYEE: "Employee",
    MANAGER: "Manager",
    ADMIN: "Admin",
  };
  return labels[role];
}

export const ALL_ROLES: Role[] = ["EMPLOYEE", "MANAGER", "ADMIN"];
