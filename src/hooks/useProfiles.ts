"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "@/lib/api";
import type { Profile } from "@/types/profile";

const pollMs = 20_000;

export type Gate = "checking" | "locked" | "open";

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [gate, setGate] = useState<Gate>("checking");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { profiles: fresh } = await api.profiles();

      setProfiles(fresh);
      setGate("open");
      setError(null);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setGate("locked");
        setError(null);
      } else {
        setError(cause instanceof Error ? cause.message : "não consegui carregar a lista");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, pollMs);

    document.addEventListener("visibilitychange", tick);
    window.addEventListener("online", tick);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("online", tick);
    };
  }, [refresh]);

  const replaceProfile = useCallback((profile: Profile) => {
    setProfiles((current) =>
      current.map((entry) => (entry.id === profile.id ? { ...profile, items: profile.items } : entry)),
    );
  }, []);

  const dropProfile = useCallback((id: string) => {
    setProfiles((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const addProfile = useCallback((profile: Profile) => {
    setProfiles((current) => [...current, profile]);
  }, []);

  return {
    profiles,
    gate,
    setGate,
    error,
    setError,
    loading,
    refresh,
    addProfile,
    replaceProfile,
    dropProfile,
  };
}
