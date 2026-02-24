import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeObject, validateExternalUrl } from "@/lib/security/sanitize";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5000";
const VALID_TYPES = new Set(["traffic", "behavior", "risk"]);
const MAX_BODY_SIZE = 50_000;
const AI_FETCH_TIMEOUT_MS = 10_000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

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
        { error: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
      return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
    }

    const body = sanitizeObject(rawBody as Record<string, unknown>);
    const { type, data } = body as { type?: string; data?: unknown };

    if (!type || !VALID_TYPES.has(type)) {
      return NextResponse.json(
        { error: "Invalid analysis type. Must be: traffic, behavior, or risk" },
        { status: 400 }
      );
    }

    if (data === undefined || data === null) {
      return NextResponse.json({ error: "Missing 'data' field" }, { status: 400 });
    }

    const urlValidation = validateExternalUrl(AI_SERVICE_URL);
    if (AI_SERVICE_URL !== "http://localhost:5000" && !urlValidation.valid) {
      console.error(`[SECURITY] Blocked SSRF attempt to: ${AI_SERVICE_URL} - ${urlValidation.reason}`);
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 }
      );
    }

    const endpoints: Record<string, string> = {
      traffic: "/api/analyze/traffic",
      behavior: "/api/analyze/behavior",
      risk: "/api/analyze/risk",
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(`${AI_SERVICE_URL}${endpoints[type]}`, {
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
        throw new Error(`AI service responded with ${response.status}`);
      }

      const result = await response.json();
      const sanitizedResult = sanitizeObject(result);
      return NextResponse.json(sanitizedResult);
    } catch (fetchError) {
      clearTimeout(timeout);
      const isAbort = fetchError instanceof DOMException && fetchError.name === "AbortError";

      if (isAbort) {
        console.warn("[SECURITY] AI service request timed out");
      }

      return NextResponse.json(
        {
          error: "AI service unavailable",
          fallback: true,
          message: "Running in offline mode - AI analysis uses local heuristics",
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "AI service unavailable",
        fallback: true,
        message: "Running in offline mode - AI analysis uses local heuristics",
      },
      { status: 200 }
    );
  }
}
