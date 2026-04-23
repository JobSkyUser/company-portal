import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInButton from "./SignInButton";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-full items-center justify-center bg-fs-warm-white">
      <div className="w-full max-w-md space-y-8 px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-fs-espresso">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-fs-espresso">
            Fieldstone Portal
          </h1>
          <p className="mt-2 text-sm text-fs-copper">
            Internal tools and resources for Fieldstone Homes
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-fs-warm-gray">
          <SignInButton />
          <p className="mt-4 text-center text-xs text-fs-copper-light">
            Use your @fieldstonehomes.com account to continue
          </p>
        </div>

        <p className="text-center text-xs text-fs-copper-light/60">
          Fieldstone Homes &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
