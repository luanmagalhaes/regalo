import { assertMember, handle, ownerClaims } from "@/app/api/_shared";
import { ServiceError, resetPin } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await assertMember();

    const claims = await ownerClaims();

    if (!claims.master) {
      throw new ServiceError("só quem tem a senha mestre pode limpar o PIN de alguém", 403);
    }

    const { id } = await params;

    return resetPin(id);
  });
}
