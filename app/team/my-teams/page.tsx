// src/app/team/my-teams/page.tsx
"use client";

import React from "react";
import { TeamCard } from "../components/TeamCard";
import { TeamFilters } from "../components/TeamFilters";
import { useMyTeams } from "../hooks/useMyTeams";
import { PageTitle } from "@/components/PageTitle";

export default function MyTeamsPage() {
  const {
    teams,
    loading,
    error,
    q,
    setQ,
    sportId,
    setSportId,
    categoryId,
    setCategoryId,
    availableSports,
    availableCategories,
  } = useMyTeams();

  const handleManage = (id: string) => {
    // navegação limpa — você pode trocar por router.push
    window.location.href = `/team/edit/${id}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mb-12 justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-8xl m-2">

        <PageTitle>Meus Times</PageTitle>

        <TeamFilters
          q={q}
          setQ={setQ}
          sportId={sportId}
          setSportId={setSportId}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          availableSports={availableSports}
          availableCategories={availableCategories}
        />

        <main className="mt-4">
          {loading && <p className="text-center text-gray-500">Carregando...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && teams.length === 0 && !q && (
            <div className="text-center py-12">
              <p className="text-gray-600">Você ainda não tem nenhum time.</p>
              <a href="/team/create" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                Criar Time
              </a>
            </div>
          )}

          {!loading && teams.length === 0 && q && (
            <div className="text-center py-3">
              <p className="text-gray-600">Nenhum time encontrado pelo nome "{q}"</p>
            </div>
          )}

          <div className="mt-2 space-y-3">
            {teams.map((t) => (
              <TeamCard key={t.id} team={t} onManage={handleManage} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
