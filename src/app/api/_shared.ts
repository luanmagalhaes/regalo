import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ServiceError } from "@/lib/profiles/service";
import {
  ownerCookieMaxAge,
  ownerCookieName,
  ownsProfile,
  packClaims,
  readClaims,
  type OwnerClaims,
} from "@/lib/profiles/owner";

export async function isMember(): Promise<boolean> {
  const claims = await ownerClaims();

  return claims.master || claims.ids.length > 0;
}

export async function assertMember() {
  if (!(await isMember())) {
    throw new ServiceError("entre no seu espaço primeiro", 401);
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

export async function ownerClaims(): Promise<OwnerClaims> {
  const store = await cookies();

  return readClaims(store.get(ownerCookieName)?.value);
}

export async function saveClaims(claims: OwnerClaims) {
  const store = await cookies();

  store.set({
    name: ownerCookieName,
    value: packClaims(claims),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ownerCookieMaxAge,
  });
}

export async function assertOwner(profileId: string) {
  const claims = await ownerClaims();

  if (!ownsProfile(claims, profileId)) {
    throw new ServiceError("esse espaço é de outra pessoa; entre com o PIN dela para editar", 403);
  }
}
