import { assertUnlocked, handle, ownerClaims, readBody, saveClaims } from "@/app/api/_shared";
import { asMaster, withProfile, withoutProfile } from "@/lib/profiles/owner";
import { claimProfile } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertUnlocked();

    const { id } = await params;
    const body = (await readBody(request)) as { pin?: unknown };
    const result = await claimProfile(id, body.pin);
    const claims = await ownerClaims();

    await saveClaims(
      result.outcome === "master" ? asMaster(claims) : withProfile(claims, id),
    );

    return result;
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertUnlocked();

    const { id } = await params;
    const claims = await ownerClaims();

    await saveClaims(withoutProfile(claims, id));

    return { released: id };
  });
}
