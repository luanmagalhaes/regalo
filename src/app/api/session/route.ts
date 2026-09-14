import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  cookieMaxAge,
  cookieName,
  fingerprint,
  isUnlocked,
  matches,
  passphrase,
  readBody,
} from "@/app/api/_shared";

export async function GET() {
  return NextResponse.json({ required: passphrase() !== null, unlocked: await isUnlocked() });
}

export async function POST(request: Request) {
  const secret = passphrase();

  if (!secret) {
    return NextResponse.json({ required: false, unlocked: true });
  }

  const body = (await readBody(request).catch(() => ({}))) as { passphrase?: unknown };
  const given = typeof body.passphrase === "string" ? body.passphrase.trim() : "";

  if (given.length === 0) {
    return NextResponse.json({ error: "escreva a senha da turma" }, { status: 422 });
  }

  if (!matches(fingerprint(given), fingerprint(secret))) {
    return NextResponse.json({ error: "essa senha não é a da turma" }, { status: 401 });
  }

  const store = await cookies();

  store.set({
    name: cookieName,
    value: fingerprint(secret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAge,
  });

  return NextResponse.json({ required: true, unlocked: true });
}

export async function DELETE() {
  const store = await cookies();

  store.delete(cookieName);

  return NextResponse.json({ required: passphrase() !== null, unlocked: false });
}
