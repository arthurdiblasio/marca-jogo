"use client";

import React from "react";
import { X, Calendar, Clock, MapPin, User } from "lucide-react";
import Image from "next/image";
import { IGameOfferEnriched } from "./IGameOfferEnriched";

interface GameOfferDetailsModalProps {
  offer: IGameOfferEnriched | null;
  open: boolean;
  onClose: () => void;
}

export function GameOfferDetailsModal({ offer, open, onClose }: GameOfferDetailsModalProps) {
  if (!open || !offer) return null;

  const dateObj = new Date(offer.gameDate);

  const formattedDate = dateObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background escuro */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          {offer.teamLogo ? (
            <Image
              src={offer.teamLogo}
              alt={offer.teamName}
              width={56}
              height={56}
              className="rounded-full"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-300 rounded-full" />
          )}

          <div>
            <h2 className="text-xl font-semibold">{offer.teamName}</h2>
            <p className="text-sm text-gray-500">
              {offer.sportName} • {offer.modalityName}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="mt-5 space-y-4 text-gray-800">

          <div className="flex items-center">
            <Calendar className="text-blue-600 mr-2" size={18} />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center">
            <Clock className="text-blue-600 mr-2" size={18} />
            <span>{formattedTime}</span>
          </div>

          {offer.fieldInfo && (
            <div className="flex items-center">
              <MapPin className="text-blue-600 mr-2" size={18} />
              <span>{offer.fieldInfo?.address || offer.fieldAddress}</span>
            </div>
          )}

          <div className="flex items-center">
            <User className="text-blue-600 mr-2" size={18} />
            <span>
              {offer.gender === "MALE"
                ? "Masculino"
                : offer.gender === "FEMALE"
                  ? "Feminino"
                  : "Misto"}
            </span>
          </div>

          {offer.categoryName && (
            <p className="text-sm bg-gray-100 px-2 py-1 rounded inline-block">
              Categoria: {offer.categoryName}
            </p>
          )}

          {offer.fieldInfo?.observations && (
            <p className="text-sm text-gray-600 mt-3">
              <strong>Observações: </strong>
              {offer.fieldInfo.observations}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
