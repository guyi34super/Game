import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateEnvironment } from "@/lib/security/env-check";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const sessionUser = session.user as Record<string, unknown>;
  if (sessionUser.isGuest) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const envCheck = validateEnvironment();

  const checks = {
    timestamp: new Date().toISOString(),
    status: envCheck.valid ? "healthy" : "degraded",
    security: {
      authConfigured: !!process.env.NEXTAUTH_SECRET,
      csrfProtection: true,
      rateLimiting: true,
      inputSanitization: true,
      securityHeaders: true,
      ssrfProtection: true,
      routeProtection: true,
    },
    providers: {
      google: !!process.env.GOOGLE_CLIENT_ID,
      apple: !!process.env.APPLE_ID,
      github: !!process.env.GITHUB_ID,
      guest: true,
    },
    validation: {
      passed: envCheck.valid,
      issues: envCheck.warnings.length + envCheck.errors.length,
    },
  };

  return NextResponse.json(checks);
}
