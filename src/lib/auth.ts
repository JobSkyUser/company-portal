import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: Role;
      department: string | null;
    };
  }

  interface User {
    role: Role;
    department: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.department = user.department;
      }
      return session;
    },
    async signIn({ user, profile }) {
      const email =
        user.email ||
        (profile as Record<string, string> | undefined)?.email ||
        (profile as Record<string, string> | undefined)?.preferred_username ||
        "";
      if (!email.endsWith("@fieldstonehomes.com")) {
        return false;
      }
      return true;
    },
  },
  session: {
    strategy: "database",
  },
});
