import { assertMember, handle, ownerClaims, readBody } from "@/app/api/_shared";
import { ServiceError } from "@/lib/profiles/service";
import { serverClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Incoming {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
}

export async function POST(request: Request) {
  return handle(async () => {
    await assertMember();

    const body = (await readBody(request)) as Incoming;
    const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
    const p256dh = typeof body.keys?.p256dh === "string" ? body.keys.p256dh : "";
    const auth = typeof body.keys?.auth === "string" ? body.keys.auth : "";

    if (!endpoint || !p256dh || !auth) {
      throw new ServiceError("essa inscrição de aviso veio incompleta", 422);
    }

    const claims = await ownerClaims();
    const { error } = await serverClient()
      .from("push_subscriptions")
      .upsert(
        { endpoint, p256dh, auth, profile_id: claims.ids[0] ?? null },
        { onConflict: "endpoint" },
      );

    if (error) {
      console.error("falha ao guardar inscricao de push", error);

      throw new ServiceError("não consegui guardar o aviso agora", 503);
    }

    return { subscribed: true };
  });
}
