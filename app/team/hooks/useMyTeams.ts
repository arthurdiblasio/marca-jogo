// src/hooks/useMyTeams.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import type { TeamListItem } from "@/types/team";

export function useMyTeams() {
  const [teams, setTeams] = useState<TeamListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState<string>("");
  const [sportId, setSportId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [debouncedQ, setDebouncedQ] = useState<string>(q);

  // debounce para a pesquisa
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(handle);
  }, [q]);

  useEffect(() => {
    let cancelled = false;

    async function fetchTeams() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (sportId) params.set("sportId", sportId);
        if (categoryId) params.set("categoryId", categoryId);
        if (debouncedQ && debouncedQ.trim() !== "")
          params.set("q", debouncedQ.trim());

        const url = `/api/team/list${
          params.toString() ? "?" + params.toString() : ""
        }`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Erro ao buscar times");
        }

        if (!cancelled) setTeams(data as TeamListItem[]);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err?.message || "Erro desconhecido");
          setTeams([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTeams();

    return () => {
      cancelled = true;
    };
  }, [sportId, categoryId, debouncedQ]);

  // Derivar esportes e categorias disponíveis a partir dos times retornados
  const availableSports = useMemo(() => {
    const map = new Map<string, string>();
    teams.forEach((t) => {
      if (t.sport) map.set(t.sport.id, t.sport.name);
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [teams]);

  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    teams.forEach((t) => {
      if (t.category) map.set(t.category.id, t.category.name);
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [teams]);

  return {
    teams,
    loading,
    error,
    q,
    setQ,
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    debouncedQ,
    availableSports,
    availableCategories,
  } as const;
}
