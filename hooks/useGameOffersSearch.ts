"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { IGameOffer } from "@/types/IGameOffer";
import { Pagination } from "@/types/pagination";
import { GameOfferFilters } from "@/types/GameOfferFilters";

export function useGameOffersSearch(defaultPageSize = 20) {
  // Resultado da API
  const [offers, setOffers] = useState<IGameOffer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  // FILTROS INDIVIDUAIS (para facilitar uso no front)
  const [sportId, setSportId] = useState("");
  const [modalityId, setModalityId] = useState("");
  const [gender, setGender] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [weekday, setWeekday] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [turno, setTurno] = useState<GameOfferFilters["turno"] | undefined>(
    undefined
  );

  // Paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Monta objeto final de filtros
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filters: GameOfferFilters = {
    sportId,
    modalityId,
    gender,
    categoryId,
    weekday,
    dayOfMonth,
    date,
    time,
    turno,
    page,
    pageSize,
  };

  // -------------------------------
  // Debounce para otimizar requisições
  // -------------------------------
  const debouncedFetch = useMemo(
    () =>
      debounce(async (f: GameOfferFilters) => {
        await fetchGames(f);
      }, 350),
    []
  );

  // -------------------------------
  // Função da API
  // -------------------------------
  const fetchGames = useCallback(async (params: GameOfferFilters) => {
    // Regras: filtros obrigatórios
    if (!params.sportId || !params.modalityId || !params.gender) {
      setOffers([]);
      setPagination(null);
      return;
    }

    setLoading(true);

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    try {
      const res = await fetch(`/api/game-offers/search?${query.toString()}`);
      const data = await res.json();

      setOffers(data.data ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error("Erro ao buscar jogos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Observa mudanças nos filtros
  useEffect(() => {
    debouncedFetch(filters);
  }, [filters, debouncedFetch]);

  return {
    // Dados
    offers,
    loading,
    pagination,

    // Filtros
    sportId,
    modalityId,
    gender,
    categoryId,
    weekday,
    dayOfMonth,
    date,
    time,
    turno,

    // Setters
    setSportId,
    setModalityId,
    setGender,
    setCategoryId,
    setWeekday,
    setDayOfMonth,
    setDate,
    setTime,
    setTurno,

    // Paginação
    setPage,
    setPageSize,
  };
}
