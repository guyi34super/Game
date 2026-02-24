import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeObject, validateExternalUrl, isPrivateAddress } from "@/lib/security/sanitize";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

const VALID_TYPES = new Set(["traffic", "behavior", "risk"]);
const MAX_BODY_SIZE = 50_000;
const AI_FETCH_TIMEOUT_MS = 10_000;
const ALLOWED_AI_ENDPOINTS: Record<string, string> = {
  traffic: "/api/analyze/traffic",
  behavior: "/api/analyze/behavior",
  risk: "/api/analyze/risk",
};

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first && (/^[\d.]+$/.test(first) || /^[a-fA-F0-9:]+$/.test(first))) {
      return first;
    }
  }
  return req.headers.get("x-real-ip") || "unknown";
}

function validateAiServiceUrl(): { valid: boolean; url: string; reason?: string } {
  const raw = process.env.AI_SERVICE_URL;
  if (!raw) {
    return { valid: false, url: "", reason: "AI_SERVICE_URL not configured" };
  }

  try {
    const parsed = new URL(raw);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, url: raw, reason: "Invalid protocol" };
    }

    if (isPrivateAddress(parsed.hostname) && process.env.NODE_ENV === "production") {
      return { valid: false, url: raw, reason: "Private address blocked in production" };
    }

    const validation = validateExternalUrl(raw);
    if (!validation.valid) {
      return { valid: false, url: raw, reason: validation.reason };
    }

    return { valid: true, url: raw };
  } catch {
    return { valid: false, url: raw ?? "", reason: "Malformed URL" };
  }
}

const FALLBACK_RESPONSE = {
  error: "AI service unavailable",
  fallback: true,
  message: "Running in offline mode - AI analysis uses local heuristics",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const ip = getClientIp(req);
    const rateResult = checkRateLimit(`analyze:${ip}`, RATE_LIMITS.api);
    if (!rateResult.allowed) {
      const retryAfter = Math.ceil(rateResult.retryAfterMs / 1000);
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    const contentLength = req.headers.get("content-length");
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (isNaN(size) || size > MAX_BODY_SIZE) {
        return NextResponse.json({ error: "Request too large" }, { status: 413 });
      }
    }

    let rawText: string;
    try {
      rawText = await req.text();
    } catch {
      return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
    }

    if (rawText.length > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    let rawBody: unknown;
    try {
      rawBody = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const body = sanitizeObject(rawBody as Record<string, unknown>);
    const { type, data } = body as { type?: string; data?: unknown };

    if (!type || typeof type !== "string" || !VALID_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
    }

    if (data === undefined || data === null) {
      return NextResponse.json({ error: "Missing data field" }, { status: 400 });
    }

    const serviceUrl = validateAiServiceUrl();
    if (!serviceUrl.valid) {
      return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
    }

    const endpoint = ALLOWED_AI_ENDPOINTS[type];
    if (!endpoint) {
      return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(`${serviceUrl.url}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Service": "zeroday-game",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
      }

      const result = await response.json();
      const sanitizedResult = sanitizeObject(result);
      return NextResponse.json(sanitizedResult);
    } catch {
      clearTimeout(timeout);
      return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
    }
  } catch {
    return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
  }
}
