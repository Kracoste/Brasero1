import { NextResponse } from "next/server";

import { supabaseAdminClient } from "@/lib/supabase/admin";

type VisitPayload = {
  visitorId?: string;
  page?: string;
  referrer?: string | null;
};

const sanitizeText = (value?: string | null) => {
  if (!value) return undefined;
  return value.slice(0, 512);
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as VisitPayload;
    const visitorId = sanitizeText(body.visitorId);
    const page = sanitizeText(body.page) ?? "/";
    const referrer = sanitizeText(body.referrer);

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId is required" }, { status: 400 });
    }

    const userAgent = sanitizeText(request.headers.get("user-agent"));
    const resolvedReferrer = referrer ?? sanitizeText(request.headers.get("referer"));

    const { error } = await supabaseAdminClient.from("visits").insert({
      visitor_id: visitorId,
      page,
      referrer: resolvedReferrer,
      user_agent: userAgent,
    });

    if (error) {
      console.error("Failed to record visit", error);
      return NextResponse.json(
        { error: "Failed to record visit", details: error.message ?? error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Visit tracking error", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error instanceof Error ? error.message : `${error}` },
      { status: 500 },
    );
  }
}
