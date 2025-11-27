// src/components/team/TeamCard.tsx
"use client";

import React from "react";
import type { TeamListItem } from "@/types/team";

export function TeamCard({
  team,
  onManage,
}: {
  team: TeamListItem;
  onManage?: (id: string) => void;
}) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-3 flex items-center gap-3">
      <div className="flex-shrink-0">
        {team.logo ? (
          <img
            src={team.logo}
            alt={team.name}
            className="h-14 w-14 rounded-md object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
            ⚽
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{team.name}</h3>
          <button
            type="button"
            onClick={() => onManage && onManage(team.id)}
            className="text-xs text-blue-600 hover:underline"
            aria-label={`Gerenciar ${team.name}`}
          >
            Gerenciar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {team.sport?.name || "-"} {team.category ? `· ${team.category.name}` : ""}
        </p>
      </div>
    </div>
  );
}
