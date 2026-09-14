import { assertUnlocked, handle, readBody } from "@/app/api/_shared";
import { deleteItem, updateItem } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertUnlocked();

    const { id } = await params;

    return { item: await updateItem(id, await readBody(request)) };
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertUnlocked();

    const { id } = await params;

    return deleteItem(id);
  });
}
