import { assertUnlocked, handle, readBody } from "@/app/api/_shared";
import { createProfile, listProfiles } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await assertUnlocked();

    return { profiles: await listProfiles() };
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    await assertUnlocked();

    return { profile: await createProfile(await readBody(request)) };
  });
}
