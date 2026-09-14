import { assertUnlocked, handle, ownerClaims, readBody, saveClaims } from "@/app/api/_shared";
import { withProfile } from "@/lib/profiles/owner";
import { createProfile, listProfiles } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await assertUnlocked();

    const claims = await ownerClaims();

    return { profiles: await listProfiles(), owned: claims.ids, master: claims.master };
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    await assertUnlocked();

    const profile = await createProfile(await readBody(request));
    const claims = await ownerClaims();

    await saveClaims(withProfile(claims, profile.id));

    return { profile };
  });
}
