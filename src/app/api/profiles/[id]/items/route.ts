import { assertOwner, assertMember, handle, readBody } from "@/app/api/_shared";
import { createItem } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertMember();

    const { id } = await params;

    await assertOwner(id);

    return { item: await createItem(id, await readBody(request)) };
  });
}
