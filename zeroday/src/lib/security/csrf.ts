import { NextRequest } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function validateCsrf(request: NextRequest): { valid: boolean; reason?: string } {
  if (SAFE_METHODS.has(request.method)) {
    return { valid: true };
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (host && refererUrl.host !== host) {
          return { valid: false, reason: "Referer host mismatch" };
        }
      } catch {
        return { valid: false, reason: "Invalid referer" };
      }
    }
    return { valid: true };
  }

  try {
    const originUrl = new URL(origin);
    if (host && originUrl.host !== host) {
      return { valid: false, reason: "Origin host mismatch" };
    }
  } catch {
    return { valid: false, reason: "Invalid origin" };
  }

  return { valid: true };
}
