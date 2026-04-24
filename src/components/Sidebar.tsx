"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Settings,
  Users,
  AppWindow,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  role: string;
}

const employeeNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Links", href: "/links", icon: Link2 },
];

const managerNav = [
  { label: "Manage Apps", href: "/admin/apps", icon: AppWindow },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isManager = role === "MANAGER" || role === "ADMIN";

  return (
    <aside
      className={`flex flex-col border-r border-fs-warm-gray bg-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-fs-warm-gray px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fs-espresso">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
            <span className="font-display text-sm font-bold text-fs-espresso">
              Fieldstone Portal
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-fs-copper hover:bg-fs-warm-gray"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-fs-copper-light">
            Main
          </p>
        )}
        {employeeNav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-fs-espresso text-white"
                  : "text-fs-copper hover:bg-fs-warm-gray hover:text-fs-espresso"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!collapsed && item.label}
            </Link>
          );
        })}

        {isManager && (
          <>
            {!collapsed && (
              <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-fs-copper-light">
                Management
              </p>
            )}
            {collapsed && <div className="my-4 border-t border-fs-warm-gray" />}
            {managerNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-fs-espresso text-white"
                      : "text-fs-copper hover:bg-fs-warm-gray hover:text-fs-espresso"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
}
