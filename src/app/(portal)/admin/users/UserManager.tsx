"use client";

import { useState } from "react";
import { Shield, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface PortalUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  createdAt: string | Date;
}

const ROLE_ICONS: Record<string, typeof User> = {
  EMPLOYEE: User,
  MANAGER: Shield,
  ADMIN: ShieldCheck,
};

export default function UserManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: PortalUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [saving, setSaving] = useState<string | null>(null);
  const router = useRouter();

  async function updateRole(userId: string, role: string) {
    setSaving(userId);
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
      router.refresh();
    }
    setSaving(null);
  }

  async function updateDepartment(userId: string, department: string) {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department: department || null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white px-5 py-3 text-xs font-semibold text-fs-copper shadow-sm ring-1 ring-fs-warm-gray">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Joined</div>
        </div>
      </div>

      {users.map((user) => {
        const Icon = ROLE_ICONS[user.role] || User;
        const isCurrentUser = user.id === currentUserId;

        return (
          <div
            key={user.id}
            className="rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-fs-warm-gray"
          >
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-fs-warm-white text-fs-copper">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-fs-espresso">
                      {user.name || "—"}
                      {isCurrentUser && (
                        <span className="ml-1.5 text-xs text-fs-copper">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-fs-copper">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-3">
                <input
                  defaultValue={user.department || ""}
                  onBlur={(e) => updateDepartment(user.id, e.target.value)}
                  placeholder="Set department..."
                  className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-fs-espresso placeholder:text-fs-copper-light/50 hover:border-fs-warm-gray focus:border-fs-copper focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  disabled={isCurrentUser || saving === user.id}
                  className="w-full rounded-lg border border-fs-warm-gray bg-fs-warm-white px-3 py-1.5 text-sm text-fs-espresso focus:border-fs-copper focus:outline-none disabled:opacity-50"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="col-span-2 text-xs text-fs-copper">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}

      {users.length === 0 && (
        <p className="py-8 text-center text-sm text-fs-copper">
          No users have signed in yet.
        </p>
      )}

      <div className="rounded-xl bg-fs-warm-white p-4 text-xs text-fs-copper">
        <p>
          <strong>Note:</strong> Users appear here after their first sign-in via
          Microsoft SSO. You cannot add users manually — they must authenticate
          with their @fieldstonehomes.com account first, then you can assign
          their role.
        </p>
      </div>
    </div>
  );
}
