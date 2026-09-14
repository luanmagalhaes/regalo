import { handle } from "@/app/api/_shared";
import { listRoster } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => ({ roster: await listRoster() }));
}
