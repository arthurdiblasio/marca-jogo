"use client";

import { useEffect, useMemo, useState } from "react";
import { showToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { useImageUpload } from "@/hooks/useImageUpload";
import { UserTeam } from "@/types/team";
import { RefereeType } from "@/types/refereeType";

export function useCreateGameOffer() {
  const router = useRouter();

  // -----------------------------
  // State base
  // -----------------------------
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null);

  // -----------------------------
  // Dados do jogo
  // -----------------------------
  const [modalityId, setModalityId] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [gameDate, setGameDate] = useState("");
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [fee, setFee] = useState<number>(0);

  const [includesRef, setIncludesRef] = useState(true);
  const [refereeType, setRefereeType] = useState<RefereeType>("SOLO");

  // -----------------------------
  // Local do jogo
  // -----------------------------
  const fieldLocation = useGooglePlaces();
  const fieldImagesHook = useImageUpload(5);

  // -----------------------------
  // Busca os times do usuário
  // -----------------------------
  useEffect(() => {
    async function loadTeams() {
      try {
        const res = await fetch("/api/team/list");
        const data = await res.json();

        setTeams(data || []);
      } catch (err) {
        showToast("Erro ao buscar seus times", "error");
      } finally {
        setLoadingTeams(false);
      }
    }

    loadTeams();
  }, []);

  // -----------------------------
  // Esportes disponíveis a partir dos times
  // -----------------------------
  const availableSportIds = useMemo(() => {
    if (!teams || teams.length === 0 || teams.error) {
      return [];
    }
    return Array.from(
      new Map(
        teams.map((t) => [t.sport.id, { id: t.sport.id, name: t.sport.name }])
      ).values()
    );
  }, [teams]);

  // -----------------------------
  // Se só existe 1 esporte, já seleciona
  // -----------------------------
  useEffect(() => {
    console.log(availableSportIds);

    if (!loadingTeams && availableSportIds.length === 1) {
      setSelectedSportId(availableSportIds[0]);
    }
  }, [availableSportIds, loadingTeams]);

  // -----------------------------
  // Times filtrados por esporte
  // -----------------------------
  const teamsBySport = useMemo(() => {
    if (!selectedSportId) return [];
    return teams.filter((t) => t.sport.id === selectedSportId);
  }, [teams, selectedSportId]);

  useEffect(() => {
    if (!selectedSportId) return;

    if (teamsBySport.length === 1) {
      setSelectedTeam(teamsBySport[0]);
    } else {
      setSelectedTeam(null);
    }
  }, [selectedSportId, teamsBySport]);

  // -----------------------------
  // Quando seleciona o time
  // -----------------------------
  useEffect(() => {
    if (!selectedTeam) return;

    // Categoria vem do time (editável)
    setCategoryId(selectedTeam.category?.id ?? null);
    setCategoryName(selectedTeam.category?.name ?? null);
    setDurationMin(selectedTeam.sport.durationMin);

    // Campo próprio
    if (selectedTeam.hasField && selectedTeam.fieldInfo) {
      fieldLocation.setInitialLocation({
        address: selectedTeam.fieldInfo.address ?? "",
        latitude: selectedTeam.latitude ?? 0,
        longitude: selectedTeam.longitude ?? 0,
      });

      if (selectedTeam.fieldInfo.images?.length) {
        fieldImagesHook.setInitialUrls(selectedTeam.fieldInfo.images);
      }
    }
  }, [selectedTeam]);

  // -----------------------------
  // Submit
  // -----------------------------
  async function submit() {
    if (!selectedTeam) {
      showToast("Selecione um time", "error");
      return;
    }

    if (!modalityId) {
      showToast("Selecione a modalidade", "error");
      return;
    }

    if (!gameDate) {
      showToast("Informe a data e horário do jogo", "error");
      return;
    }

    // Upload imagens do campo
    const imageUrls =
      fieldImagesHook.files.length > 0
        ? await fieldImagesHook.uploadFiles()
        : [];

    if (fieldImagesHook.files.length > 0 && !imageUrls) {
      return;
    }

    const payload = {
      teamId: selectedTeam.id,
      modalityId,
      categoryId,
      gameDate,
      durationMin,
      fee,
      includesRef,
      refereeType,
      fieldInfo: {
        address: fieldLocation.address,
        latitude: fieldLocation.latitude,
        longitude: fieldLocation.longitude,
        images: imageUrls,
      },
    };

    try {
      const res = await fetch("/api/game-offers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Erro ao criar jogo", "error");
        return;
      }

      showToast("Jogo criado com sucesso!", "success");
      router.push("/games/find");
    } catch (err) {
      showToast("Erro ao criar jogo", "error");
    }
  }

  return {
    // dados carregados
    teams,
    loadingTeams,

    // seleção inicial
    availableSportIds,
    selectedSportId,
    setSelectedSportId,

    teamsBySport,
    selectedTeam,
    setSelectedTeam,

    // dados do jogo
    modalityId,
    setModalityId,
    categoryId,
    setCategoryId,
    categoryName,
    setCategoryName,
    gameDate,
    setGameDate,
    durationMin,
    setDurationMin,
    fee,
    setFee,

    includesRef,
    setIncludesRef,
    refereeType,
    setRefereeType,

    // local
    fieldLocation,
    fieldImagesHook,

    // ação
    submit,
  };
}
