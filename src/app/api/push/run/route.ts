import { NextResponse } from "next/server";
import { sendBirthdayNotices } from "@/lib/push/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function allowed(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!allowed(request)) {
    return NextResponse.json({ error: "essa rotina não é sua para rodar" }, { status: 401 });
  }

  try {
    return NextResponse.json(await sendBirthdayNotices());
  } catch (cause) {
    console.error("falha na rotina de avisos", cause);

    return NextResponse.json({ error: "a rotina tropeçou" }, { status: 500 });
  }
}
