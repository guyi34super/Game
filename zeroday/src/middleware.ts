import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/game"];
const AUTH_ROUTES = ["/auth/signin"];
const API_RATE_WINDOW = 60_000;
const API_RATE_MAX = 100;
const AUTH_RATE_WINDOW = 300_000;
const AUTH_RATE_MAX = 30;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(ip: string, bucket: string): string {
  return `${bucket}:${ip}`;
}

function checkLimit(key: string, windowMs: number, max: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count++;
  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

function periodicCleanup() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

let cleanupCounter = 0;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Request-Id", crypto.randomUUID());
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  cleanupCounter++;
  if (cleanupCounter % 100 === 0) {
    periodicCleanup();
  }

  if (pathname.startsWith("/api/")) {
    const isAuthEndpoint = pathname.startsWith("/api/auth");
    const bucket = isAuthEndpoint ? "auth" : "api";
    const windowMs = isAuthEndpoint ? AUTH_RATE_WINDOW : API_RATE_WINDOW;
    const max = isAuthEndpoint ? AUTH_RATE_MAX : API_RATE_MAX;

    const limit = checkLimit(getRateLimitKey(ip, bucket), windowMs, max);

    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
      const response = NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(retryAfter));
      response.headers.set("X-RateLimit-Limit", String(max));
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(limit.resetAt / 1000)));
      return addSecurityHeaders(response);
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost !== host) {
            return addSecurityHeaders(
              NextResponse.json({ error: "Cross-origin request blocked" }, { status: 403 })
            );
          }
        } catch {
          return addSecurityHeaders(
            NextResponse.json({ error: "Invalid origin header" }, { status: 400 })
          );
        }
      }
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(max));
    response.headers.set("X-RateLimit-Remaining", String(limit.remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(limit.resetAt / 1000)));
    return addSecurityHeaders(response);
  }

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected || isAuthRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? "zeroday-dev-secret-change-in-production",
    });

    if (isProtected && !token) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signinUrl);
    }

    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
