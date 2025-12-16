"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "@/types/pagination";

interface PaginationProps {
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({ pagination, onPageChange }: PaginationProps) {
  if (!pagination) return null;

  const { page, totalPages } = pagination;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="w-full py-4 flex justify-center items-center space-x-4">

      {/* BOTÃO ANTERIOR */}
      <button
        disabled={prevDisabled}
        onClick={() => onPageChange(page - 1)}
        className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition ${prevDisabled
          ? "opacity-40 cursor-not-allowed"
          : "bg-white hover:bg-gray-100 border-gray-300"
          }`}
      >
        <ChevronLeft size={18} className="mr-1" />
        Anterior
      </button>

      {/* PÁGINA ATUAL */}
      <span className="text-sm font-semibold text-gray-700">
        Página {page} de {totalPages}
      </span>

      {/* BOTÃO PRÓXIMA */}
      <button
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition ${nextDisabled
          ? "opacity-40 cursor-not-allowed"
          : "bg-white hover:bg-gray-100 border-gray-300"
          }`}
      >
        Próxima
        <ChevronRight size={18} className="ml-1" />
      </button>
    </div>
  );
}
