import webpush from "web-push";
import { countdownLabel, daysUntilBirthday, nearWindow } from "@/lib/birthday";
import { serverClient } from "@/lib/supabase/server";

export const contact = "mailto:regalo@bibuaidi.app";

interface SubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface BirthdayRow {
  id: string;
  name: string;
  emoji: string;
  birthday: string | null;
}

export function pushReady(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configure() {
  webpush.setVapidDetails(
    contact,
    process.env.VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
  );
}

export interface NoticeResult {
  checked: number;
  soon: string[];
  sent: number;
  dropped: number;
  skipped: string[];
}

export async function sendBirthdayNotices(now = new Date()): Promise<NoticeResult> {
  if (!pushReady()) {
    return { checked: 0, soon: [], sent: 0, dropped: 0, skipped: ["sem chaves VAPID"] };
  }

  configure();

  const db = serverClient();
  const [people, subscriptions, notices] = await Promise.all([
    db.from("profiles").select("id, name, emoji, birthday"),
    db.from("push_subscriptions").select("id, endpoint, p256dh, auth"),
    db.from("birthday_notices").select("target_id, year"),
  ]);

  if (people.error || subscriptions.error || notices.error) {
    throw new Error("não consegui ler os dados para avisar a turma");
  }

  const year = now.getFullYear();
  const already = new Set(
    (notices.data as { target_id: string; year: number }[]).map(
      (row) => `${row.target_id}:${row.year}`,
    ),
  );

  const soon = (people.data as BirthdayRow[]).filter((person) => {
    const distance = daysUntilBirthday(person.birthday, now);

    return distance !== null && distance <= nearWindow;
  });

  const fresh = soon.filter((person) => !already.has(`${person.id}:${year}`));
  const rows = subscriptions.data as SubscriptionRow[];

  let sent = 0;
  let dropped = 0;

  for (const person of fresh) {
    const distance = daysUntilBirthday(person.birthday, now) ?? 0;
    const payload = JSON.stringify({
      title: distance === 0 ? `Hoje é aniversário de ${person.name}! 🎂` : "Regalo 🎁",
      body:
        distance === 0
          ? `Corre ver a lista de ${person.name} antes de sair comprando.`
          : `${countdownLabel(distance)} para o aniversário de ${person.name} ${person.emoji}. Dá uma espiada na lista.`,
      tag: `regalo-${person.id}-${year}`,
    });

    for (const row of rows) {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          payload,
        );
        sent += 1;
      } catch (cause) {
        const status = (cause as { statusCode?: number }).statusCode;

        if (status === 404 || status === 410) {
          await db.from("push_subscriptions").delete().eq("id", row.id);
          dropped += 1;
        } else {
          console.error("falha ao enviar push", status, cause);
        }
      }
    }

    await db.from("birthday_notices").upsert({ target_id: person.id, year });
  }

  return {
    checked: (people.data as BirthdayRow[]).length,
    soon: soon.map((person) => person.name),
    sent,
    dropped,
    skipped: soon.filter((person) => already.has(`${person.id}:${year}`)).map((p) => p.name),
  };
}
