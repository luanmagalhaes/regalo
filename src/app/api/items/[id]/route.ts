import { assertOwner, assertMember, handle, readBody } from "@/app/api/_shared";
import { deleteItem, profileIdForItem, updateItem } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertMember();

    const { id } = await params;

    await assertOwner(await profileIdForItem(id));

    return { item: await updateItem(id, await readBody(request)) };
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertMember();

    const { id } = await params;

    await assertOwner(await profileIdForItem(id));

    return deleteItem(id);
  });
}
