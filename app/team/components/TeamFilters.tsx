// src/components/team/TeamFilters.tsx
"use client";

import React from "react";

export function TeamFilters(props: {
  q: string;
  setQ: (v: string) => void;
  sportId: string | null;
  setSportId: (v: string | null) => void;
  categoryId: string | null;
  setCategoryId: (v: string | null) => void;
  availableSports: { id: string; name: string }[];
  availableCategories: { id: string; name: string }[];
}) {
  const { q, setQ, sportId, setSportId, categoryId, setCategoryId, availableSports, availableCategories } = props;

  return (
    <div className="space-y-3">
      <div className="px-2">
        <label className="sr-only">Buscar</label>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome do time"
            className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-200 bg-white text-sm"
          />
        </div>
      </div>

      <div className="px-2 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSportId(null)}
          className={`px-3 py-1 text-sm rounded-full ${!sportId ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Todos
        </button>
        {availableSports.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSportId(s.id)}
            className={`px-3 py-1 text-sm rounded-full ${sportId === s.id ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="px-2 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setCategoryId(null)}
          className={`px-3 py-1 text-sm rounded-full ${!categoryId ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Todas
        </button>
        {availableCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryId(c.id)}
            className={`px-3 py-1 text-sm rounded-full ${categoryId === c.id ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
