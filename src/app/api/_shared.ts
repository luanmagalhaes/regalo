import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ServiceError } from "@/lib/profiles/service";

export const cookieName = "regalo_key";
export const cookieMaxAge = 60 * 60 * 24 * 180;

export function passphrase(): string | null {
  const value = process.env.REGALO_PASSPHRASE;

  return value && value.length > 0 ? value : null;
}

export function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function matches(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isUnlocked(): Promise<boolean> {
  const secret = passphrase();

  if (!secret) {
    return true;
  }

  const store = await cookies();
  const token = store.get(cookieName)?.value;

  return Boolean(token && matches(token, fingerprint(secret)));
}

export async function assertUnlocked() {
  if (!(await isUnlocked())) {
    throw new ServiceError("entre com a senha da turma", 401);
  }
}

export async function handle<T>(action: () => Promise<T>) {
  try {
    return NextResponse.json(await action());
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("erro nao tratado na rota", error);

    return NextResponse.json({ error: "algo deu errado, tente de novo" }, { status: 500 });
  }
}

export async function readBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ServiceError("não entendi o que veio no pedido", 400);
  }
}
