"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock } from "lucide-react";
import { IGameOfferEnriched } from "./IGameOfferEnriched";

interface GameOfferCardProps {
  offer: IGameOfferEnriched;
  onClick?: () => void; // opcional caso futuramente queira abrir detalhes
}

export function GameOfferCard({ offer, onClick }: GameOfferCardProps) {
  const {
    teamName,
    teamLogo,
    gameDate,
    sportName,
    modalityName,
    categoryName,
    fieldInfo,
    gender,
  } = offer;

  const dateObj = new Date(gameDate);

  const formattedDate = dateObj.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:shadow-md transition"
    >
      {/* --- Linha superior: Logo + nome do time --- */}
      <div className="flex items-center space-x-3">
        {teamName ? (
          <Image
            src={teamLogo || "/default-team-logo.png"}
            alt={teamName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
        )}

        <div>
          <p className="font-semibold text-gray-900">{teamName}</p>
          <p className="text-xs text-gray-500">
            {sportName} • {modalityName}
          </p>
        </div>
      </div>

      {/* --- Informações principais do jogo --- */}
      <div className="mt-4 space-y-2 text-sm">

        {/* Data */}
        <div className="flex items-center text-gray-700">
          <Calendar size={16} className="mr-2 text-blue-600" />
          {formattedDate}
        </div>

        {/* Horário */}
        <div className="flex items-center text-gray-700">
          <Clock size={16} className="mr-2 text-blue-600" />
          {formattedTime}
        </div>

        {/* Local */}
        {fieldInfo?.address && (
          <div className="flex items-center text-gray-700">
            <MapPin size={16} className="mr-2 text-blue-600" />
            {fieldInfo.address}
          </div>
        )}

        {/* Categoria + Gênero */}
        <div className="flex flex-wrap gap-2 mt-3">
          {categoryName && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {categoryName}
            </span>
          )}

          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {gender === "MALE" ? "Masculino" : gender === "FEMALE" ? "Feminino" : "Misto"}
          </span>
        </div>
      </div>
    </div>
  );
}
