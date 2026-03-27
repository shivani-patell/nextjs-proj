import { NextResponse } from "next/server";

/**
 * Receives anonymous survey submissions. Payload is logged in Vercel Function logs
 * (Dashboard → project → Logs). Replace with email/DB/webhook when ready.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const entries: Record<string, string> = {};
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          entries[key] = value;
        } else {
          entries[key] = `[file: ${value.name}, ${value.size} bytes]`;
        }
      });
      console.log("[survey-submit]", JSON.stringify(entries));
    } else {
      const body = await request.json();
      console.log("[survey-submit]", JSON.stringify(body));
    }

    return NextResponse.json({ ok: true, message: "Received" });
  } catch (e) {
    console.error("[survey-submit]", e);
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
}
