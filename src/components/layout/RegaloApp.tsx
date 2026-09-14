"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WelcomeScreen } from "@/components/layout/WelcomeScreen";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { HomeScreen } from "@/components/home/HomeScreen";
import { NewProfileSheet } from "@/components/home/NewProfileSheet";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { countdownLabel, daysUntilBirthday, isNear } from "@/lib/birthday";
import { useProfiles } from "@/hooks/useProfiles";
import { api, type ProfilePatch } from "@/lib/api";
import {
  prefsSnapshot,
  rememberMe,
  rememberMuted,
  rememberNoticed,
  rememberProfileTourSeen,
  rememberTutorialSeen,
  serverPrefsSnapshot,
  subscribePrefs,
} from "@/lib/prefs";
import { applyMuted, sound, unlockSound } from "@/lib/sound";
import {
  askPushPermission,
  pushSnapshot,
  serverPushSnapshot,
  subscribePush,
} from "@/lib/push";
import type { ItemDraft, Profile, ProfileDraft } from "@/types/profile";

export function RegaloApp() {
  const {
    profiles,
    owned,
    master,
    gate,
    setGate,
    error,
    setError,
    loading,
    refresh,
    addProfile,
    replaceProfile,
    dropProfile,
  } = useProfiles();
  const prefs = useSyncExternalStore(subscribePrefs, prefsSnapshot, serverPrefsSnapshot);
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const push = useSyncExternalStore(subscribePush, pushSnapshot, serverPushSnapshot);
  const [splashDone, setSplashDone] = useState(false);
  const [askedHelp, setAskedHelp] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimProblem, setClaimProblem] = useState<string | null>(null);
  const noticedRef = useRef<string[]>([]);

  useEffect(() => {
    applyMuted(prefs.muted);
  }, [prefs.muted]);

  useEffect(() => {
    noticedRef.current = prefs.noticed;
  }, [prefs.noticed]);

  useEffect(() => {
    const prime = () => unlockSound();

    window.addEventListener("pointerdown", prime, { once: true });

    return () => window.removeEventListener("pointerdown", prime);
  }, []);

  useEffect(() => {
    if (pushSnapshot() !== "granted") {
      return;
    }

    const year = new Date().getFullYear();
    const fresh = profiles.filter(
      (profile) => isNear(profile.birthday) && !noticedRef.current.includes(`${profile.id}:${year}`),
    );

    if (fresh.length === 0) {
      return;
    }

    for (const profile of fresh) {
      try {
        const distance = daysUntilBirthday(profile.birthday);

        new Notification("Regalo", {
          body: `${profile.name} faz aniversário ${countdownLabel(distance).toLowerCase()}. Dá uma olhada na lista.`,
          icon: "/icon-192.png",
          tag: `regalo-${profile.id}-${year}`,
        });
      } catch {
        break;
      }
    }

    const tokens = [...noticedRef.current, ...fresh.map((profile) => `${profile.id}:${year}`)];

    noticedRef.current = tokens;
    rememberNoticed(tokens);
  }, [profiles]);

  const run = useCallback(
    async <T,>(action: () => Promise<T>, after?: (result: T) => void) => {
      setBusy(true);
      setError(null);

      try {
        const result = await action();

        after?.(result);
      } catch (cause) {
        sound.oops();
        setError(cause instanceof Error ? cause.message : "não consegui guardar isso");
        void refresh();
      } finally {
        setBusy(false);
      }
    },
    [refresh, setError],
  );

  const askPush = useCallback(() => {
    void askPushPermission().then((answer) => {
      if (answer === "granted") {
        sound.party();
      }
    });
  }, []);

  const splash = splashDone ? null : <SplashScreen onDone={() => setSplashDone(true)} />;
  const helpOpen = splashDone && (askedHelp || !prefs.tutorialSeen);
  const help = helpOpen ? (
    <HowItWorks
      onClose={() => {
        setAskedHelp(false);
        rememberTutorialSeen();
      }}
    />
  ) : null;

  if (gate === "locked") {
    return (
      <>
        {splash}
        <WelcomeScreen
          onIn={(profileId) => {
            rememberMe(profileId);
            setGate("checking");
            void refresh();
          }}
        />
      </>
    );
  }

  const open = profiles.find((profile) => profile.id === openId) ?? null;

  if (open) {
    const patch = (change: ProfilePatch) =>
      void run(
        () => api.updateProfile(open.id, change),
        ({ profile }) => replaceProfile(profile),
      );

    return (
      <>
        {splash}
        {help}
        <ProfileScreen
        profile={open}
        autoTour={!prefs.profileTourSeen}
        onTourDone={rememberProfileTourSeen}
        busy={busy}
        error={error}
        onBack={() => {
          sound.tap();
          setOpenId(null);
        }}
        canEdit={master || owned.includes(open.id)}
        master={master}
        claiming={claiming}
        claimProblem={claimProblem}
        onClaimPin={(pin) => {
          setClaiming(true);
          setClaimProblem(null);

          void api
            .claim(open.id, pin)
            .then((result) => {
              sound.party();

              if (result.outcome !== "master") {
                rememberMe(open.id);
              }

              return refresh();
            })
            .catch((cause: unknown) => {
              sound.oops();
              setClaimProblem(cause instanceof Error ? cause.message : "não consegui liberar");
            })
            .finally(() => setClaiming(false));
        }}
        onRelease={() => {
          void api
            .release(open.id)
            .then(() => {
              if (prefs.me === open.id) {
                rememberMe(null);
              }

              return refresh();
            })
            .catch(() => undefined);
        }}
        onPatch={patch}
        onDelete={() =>
          void run(
            () => api.deleteProfile(open.id),
            () => {
              if (prefs.me === open.id) {
                rememberMe(null);
              }

              dropProfile(open.id);
              setOpenId(null);
            },
          )
        }
        onCreateItem={(draft: ItemDraft) =>
          void run(
            () => api.createItem(open.id, draft),
            ({ item }) => replaceProfile({ ...open, items: [...open.items, item] }),
          )
        }
        onUpdateItem={(id, draft) =>
          void run(
            () => api.updateItem(id, draft),
            ({ item }) =>
              replaceProfile({
                ...open,
                items: open.items.map((entry) => (entry.id === id ? item : entry)),
              }),
          )
        }
        onDeleteItem={(id) =>
          void run(
            () => api.deleteItem(id),
            () =>
              replaceProfile({
                ...open,
                items: open.items.filter((entry) => entry.id !== id),
              }),
          )
        }
        />
      </>
    );
  }

  return (
    <>
      {splash}
      {help}
      <HomeScreen
        profiles={profiles}
        meId={prefs.me}
        loading={loading}
        error={error}
        muted={prefs.muted}
        canAskPush={push === "default"}
        onAskPush={askPush}
        onToggleSound={() => {
          applyMuted(!prefs.muted);
          rememberMuted(!prefs.muted);

          if (prefs.muted) {
            unlockSound();
            sound.pop();
          }
        }}
        onOpen={(profile: Profile) => setOpenId(profile.id)}
        onCreate={() => setCreating(true)}
        onHelp={() => setAskedHelp(true)}
      />

      {creating ? (
        <NewProfileSheet
          busy={busy}
          onCreate={(draft) =>
            void run(
              () => api.createProfile(draft),
              ({ profile }) => {
                addProfile(profile);
                setCreating(false);

                if (prefs.me === null) {
                  rememberMe(profile.id);
                }

                setOpenId(profile.id);
              },
            )
          }
          onClose={() => setCreating(false)}
        />
      ) : null}
    </>
  );
}
