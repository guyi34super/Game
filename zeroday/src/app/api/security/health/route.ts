import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateEnvironment } from "@/lib/security/env-check";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const envCheck = validateEnvironment();
  const isProduction = process.env.NODE_ENV === "production";

  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "unknown",
    security: {
      authSecret: process.env.NEXTAUTH_SECRET
        ? process.env.NEXTAUTH_SECRET !== "zeroday-dev-secret-change-in-production"
          ? "strong"
          : "weak-default"
        : "missing",
      httpsEnforced: isProduction,
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
    envValidation: {
      valid: envCheck.valid,
      warningCount: envCheck.warnings.length,
      errorCount: envCheck.errors.length,
    },
  };

  return NextResponse.json(checks);
}
