"use client";

import Link from "next/link";
import {
  Map,
  BarChart3,
  FileText,
  Wrench,
  Globe,
  Calculator,
  Users,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  map: Map,
  chart: BarChart3,
  file: FileText,
  tool: Wrench,
  globe: Globe,
  calculator: Calculator,
  users: Users,
  briefcase: Briefcase,
};

interface AppTileProps {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  url: string;
  category: string;
  openIn: string;
}

export default function AppTile({
  id,
  name,
  description,
  icon,
  category,
  openIn,
}: AppTileProps) {
  const Icon = ICON_MAP[icon || "tool"] || Wrench;

  const href = openIn === "external" ? undefined : `/apps/${id}`;

  const content = (
    <div className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-fs-warm-gray transition-all hover:shadow-md hover:ring-fs-copper/30">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fs-warm-white text-fs-copper transition-colors group-hover:bg-fs-espresso group-hover:text-white">
          <Icon size={24} />
        </div>
        <span className="rounded-full bg-fs-warm-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fs-copper">
          {category}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold text-fs-espresso">
        {name}
      </h3>
      {description && (
        <p className="mt-1 line-clamp-2 text-sm text-fs-copper">
          {description}
        </p>
      )}
      <div className="mt-auto pt-4">
        <span className="inline-flex items-center text-xs font-semibold text-fs-copper group-hover:text-fs-espresso">
          Open app &rarr;
        </span>
      </div>
    </div>
  );

  if (openIn === "external") {
    return (
      <a href={`/apps/${id}`} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={`/apps/${id}`}>{content}</Link>;
}
