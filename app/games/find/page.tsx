"use client";

import { PageTitle } from "@/components/PageTitle";
import { PaginationComponent } from "@/components/common/Pagination";
import { FindGameFilters } from "@/components/game/FindGameFilters";
import { GameOfferList } from "@/components/game/GameOfferList";

import { useGameOffersSearch } from "@/hooks/useGameOffersSearch";

export default function FindGamesPage() {
  const {
    offers,
    loading,
    sportId,
    modalityId,
    gender,
    categoryId,
    weekday,
    dayOfMonth,
    date,
    time,
    turno,
    setSportId,
    setModalityId,
    setGender,
    setCategoryId,
    setWeekday,
    setDayOfMonth,
    setDate,
    setTime,
    setTurno,
    pagination,
    setPage,
  } = useGameOffersSearch();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* Header fixo para mobile */}
      <div className="sticky top-0 z-20 bg-white pb-3 pt-2 border-b md:border-none">
        <PageTitle>Encontrar Jogo</PageTitle>
      </div>

      {/* FILTROS */}
      <FindGameFilters
        sportId={sportId}
        modalityId={modalityId}
        gender={gender}
        categoryId={categoryId}
        weekday={weekday}
        dayOfMonth={dayOfMonth}
        date={date}
        time={time}
        turno={turno}
        onSportChange={setSportId}
        onModalityChange={setModalityId}
        onGenderChange={setGender}
        onCategoryChange={setCategoryId}
        onWeekdayChange={setWeekday}
        onDayOfMonthChange={setDayOfMonth}
        onDateChange={setDate}
        onTimeChange={setTime}
        onTurnoChange={setTurno}
      />

      {/* LISTA DE OFERTAS */}
      <GameOfferList offers={offers} loading={loading} />

      {/* PAGINAÇÃO */}
      <PaginationComponent pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
