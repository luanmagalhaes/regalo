import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ownerClaims } from "@/app/api/_shared";
import { ownerCookieName } from "@/lib/profiles/owner";

export const dynamic = "force-dynamic";

export async function GET() {
  const claims = await ownerClaims();

  return NextResponse.json({
    member: claims.master || claims.ids.length > 0,
    owned: claims.ids,
    master: claims.master,
  });
}

export async function DELETE() {
  const store = await cookies();

  store.delete(ownerCookieName);

  return NextResponse.json({ member: false, owned: [], master: false });
}
