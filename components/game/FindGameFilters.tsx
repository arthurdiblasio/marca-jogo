"use client";

import React from "react";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormInput } from "@/components/forms/FormInput";
import { GameOfferFilters } from "@/types/GameOfferFilters";

// Chips estilizados para mobile
interface ChipButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function ChipButton({ active, label, onClick }: ChipButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}

interface Option {
  id: string;
  name: string;
}

interface FindGameFiltersProps {
  // Valores
  sportId: string;
  modalityId: string;
  gender: string;
  categoryId?: string;
  weekday?: string;
  dayOfMonth?: string;
  date?: string;
  time?: string;
  turno?: string;

  // Listas
  sports?: Option[];
  modalities?: Option[];
  categories?: Option[];

  // Setters individuais
  onSportChange: (v: string) => void;
  onModalityChange: (v: string) => void;
  onGenderChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onWeekdayChange: (v: string) => void;
  onDayOfMonthChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onTurnoChange: (v: GameOfferFilters["turno"]) => void;
}

export function FindGameFilters({
  // valores
  sportId,
  modalityId,
  gender,
  categoryId,
  weekday,
  dayOfMonth,
  date,
  time,
  turno,

  // listas
  sports = [],
  modalities = [],
  categories = [],

  // setters
  onSportChange,
  onModalityChange,
  onGenderChange,
  onCategoryChange,
  onWeekdayChange,
  onDayOfMonthChange,
  onDateChange,
  onTimeChange,
  onTurnoChange,
}: FindGameFiltersProps) {
  return (
    <div className="p-4 space-y-6 border-b bg-white">

      {/* ---- FILTROS PRINCIPAIS OBRIGATÓRIOS ---- */}
      <div className="space-y-4">
        <FormSelect
          id="sportId"
          label="Esporte"
          required
          value={sportId}
          options={sports}
          onChange={(e) => onSportChange(e.target.value)}
        />

        <FormSelect
          id="modalityId"
          label="Modalidade"
          required
          value={modalityId}
          options={modalities}
          onChange={(e) => onModalityChange(e.target.value)}
        />

        <FormSelect
          id="gender"
          label="Gênero"
          required
          value={gender}
          options={[
            { id: "MALE", name: "Masculino" },
            { id: "FEMALE", name: "Feminino" },
            { id: "MIXED", name: "Misto" },
          ]}
          onChange={(e) => onGenderChange(e.target.value)}
        />
      </div>

      {/* ---- CATEGORIA / DATA / HORÁRIO ---- */}
      <div className="space-y-4">
        <FormSelect
          id="categoryId"
          label="Categoria (opcional)"
          value={categoryId || ""}
          options={categories}
          onChange={(e) => onCategoryChange(e.target.value)}
        />

        <FormInput
          id="date"
          label="Data específica"
          type="date"
          value={date || ""}
          onChange={(e) => onDateChange(e.target.value)}
        />

        <FormInput
          id="time"
          label="Horário exato"
          type="time"
          value={time || ""}
          onChange={(e) => onTimeChange(e.target.value)}
        />

        <FormInput
          id="dayOfMonth"
          label="Dia do mês"
          type="number"
          value={dayOfMonth || ""}
          onChange={(e) => onDayOfMonthChange(e.target.value)}
        />
      </div>

      {/* ---- DIA DA SEMANA (CHIPS) ---- */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">Dia da semana</p>

        <div className="flex overflow-x-auto space-x-2 pb-2">
          {[
            { value: "0", label: "Dom" },
            { value: "1", label: "Seg" },
            { value: "2", label: "Ter" },
            { value: "3", label: "Qua" },
            { value: "4", label: "Qui" },
            { value: "5", label: "Sex" },
            { value: "6", label: "Sáb" },
          ].map((d) => (
            <ChipButton
              key={d.value}
              label={d.label}
              active={weekday === d.value}
              onClick={() =>
                onWeekdayChange(weekday === d.value ? "" : d.value)
              }
            />
          ))}
        </div>
      </div>

      {/* ---- TURNO (CHIPS) ---- */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">Turno</p>

        <div className="flex overflow-x-auto space-x-2 pb-2">
          {[
            { value: "morning", label: "Manhã" },
            { value: "afternoon", label: "Tarde" },
            { value: "night", label: "Noite" },
          ].map((t) => (
            <ChipButton
              key={t.value}
              label={t.label}
              active={turno === t.value}
              onClick={() => onTurnoChange(turno === t.value ? undefined : (t.value as GameOfferFilters["turno"]))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
