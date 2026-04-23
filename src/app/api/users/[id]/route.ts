import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasMinRole } from "@/lib/roles";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: Context) {
  const session = await auth();
  if (!session?.user || !hasMinRole(session.user.role, "MANAGER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const allowedFields: Record<string, unknown> = {};
  if (body.role && ["EMPLOYEE", "MANAGER", "ADMIN"].includes(body.role)) {
    allowedFields.role = body.role;
  }
  if (body.department !== undefined) {
    allowedFields.department = body.department;
  }

  const user = await prisma.user.update({
    where: { id },
    data: allowedFields,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
    },
  });

  return NextResponse.json(user);
}
