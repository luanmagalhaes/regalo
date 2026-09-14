import { assertOwner, assertUnlocked, handle, readBody } from "@/app/api/_shared";
import { deleteProfile, updateProfile } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertUnlocked();

    const { id } = await params;

    await assertOwner(id);

    return { profile: await updateProfile(id, await readBody(request)) };
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertUnlocked();

    const { id } = await params;

    await assertOwner(id);

    return deleteProfile(id);
  });
}
