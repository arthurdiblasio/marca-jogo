"use client";

import React from "react";
import { IGameOffer } from "@/types/IGameOffer";
import { GameOfferCard } from "./GameOfferCard";

interface GameOfferListProps {
  offers: IGameOffer[];
  loading: boolean;
}

export function GameOfferList({ offers, loading }: GameOfferListProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        Nenhum jogo encontrado.
      </p>
    );
  }

  return (
    <div className="p-4">
      <div className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    ">
        {offers.map((offer) => (
          <GameOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );

}
