import { NextRequest, NextResponse } from "next/server";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    let endpoint = "";
    switch (type) {
      case "traffic":
        endpoint = "/api/analyze/traffic";
        break;
      case "behavior":
        endpoint = "/api/analyze/behavior";
        break;
      case "risk":
        endpoint = "/api/analyze/risk";
        break;
      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
    }

    const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`AI service responded with ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
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
