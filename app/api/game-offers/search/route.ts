import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

/**
 * TURNOS definidos em horas (inteiros)
 * morning: 06:00 - 11:59 (6–12)
 * afternoon: 11:00 - 18:59 (11–19)
 * night: 17:00 - 23:59 (17–24)
 */
const TURNO = {
  morning: { start: 6, end: 12 },
  afternoon: { start: 11, end: 19 },
  night: { start: 17, end: 24 },
};

// Parse "HH:mm" → {h, m}
function parseTimeToHM(time: string) {
  const [hStr, mStr] = time.split(":");
  return { h: Number(hStr ?? 0), m: Number(mStr ?? 0) };
}

// Extração rápido de hora/minuto do Date
function gameDateToHM(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return { h: d.getHours(), m: d.getMinutes() };
}

// Validação de sobreposição de turno
function overlapsTurn(
  startH: number,
  startM: number,
  durationMin: number,
  turnoStartH: number,
  turnoEndH: number
) {
  const startMinutes = startH * 60 + startM;
  const endMinutes = startMinutes + durationMin;

  const turnoStart = turnoStartH * 60;
  const turnoEnd = turnoEndH * 60; // exclusivo

  // overlap se houver interseção entre [start, end] e [turnoStart, turnoEnd]
  return endMinutes > turnoStart && startMinutes < turnoEnd;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // -----------------------------
    // FILTROS BÁSICOS
    // -----------------------------
    const sportId = searchParams.get("sportId") ?? undefined;
    const gender = searchParams.get("gender") ?? undefined;
    const modalityId = searchParams.get("modalityId") ?? undefined;

    // Se faltar qualquer um → erro
    if (!sportId || !modalityId || !gender) {
      return NextResponse.json(
        {
          error: "Esporte, modalidade e gênero são obrigatórios.",
          missing: {
            sportId: !sportId,
            modalityId: !modalityId,
            gender: !gender,
          },
        },
        { status: 400 }
      );
    }

    const categoryId = searchParams.get("categoryId") ?? undefined;

    // -----------------------------
    // FILTROS DE DATA/TEMPO
    // -----------------------------
    const date = searchParams.get("date") ?? undefined; // yyyy-mm-dd
    const weekday = searchParams.get("weekday") ?? undefined; // 0 = domingo
    const dayOfMonth = searchParams.get("dayOfMonth") ?? undefined; // 1–31
    const time = searchParams.get("time") ?? undefined; // HH:mm
    const turno = (searchParams.get("turno") ?? undefined) as
      | "morning"
      | "afternoon"
      | "night"
      | undefined;

    // -----------------------------
    // PAGINAÇÃO CONTROLADA PELO FRONT
    // -----------------------------
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(
      100,
      Math.max(5, Number(searchParams.get("pageSize") ?? "20"))
    );

    // -----------------------------
    // LIMITADOR DE SCAN NO BD
    // -----------------------------
    const lookaheadDays = Math.min(
      180,
      Math.max(7, Number(searchParams.get("lookaheadDays") ?? "90"))
    );

    // -----------------------------
    // WHERE para Prisma (eficiente)
    // -----------------------------
    const where: any = { status: "OPEN" };

    if (sportId) where.sportId = sportId;
    if (categoryId) where.categoryId = categoryId;
    if (modalityId) where.modalityId = modalityId;
    if (gender) where.gender = gender;

    // Filtro por data exata
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59.999`);
      where.gameDate = { gte: start, lte: end };
    } else {
      // Se houver filtros de tempo, limitamos a um range de datas
      const needsTimeLimit = Boolean(time || turno || weekday || dayOfMonth);
      if (needsTimeLimit) {
        const now = new Date();
        const endWindow = new Date(now.getTime() + lookaheadDays * 86400000);
        where.gameDate = { gte: now, lte: endWindow };
      }
    }

    // -----------------------------
    // BUSCA PRIMÁRIA NO BANCO (limitada)
    // -----------------------------
    const maxFetch = 2000; // Limite de proteção
    const offers = await prisma.gameOffer.findMany({
      where,
      include: {
        team: true,
        modality: true,
        sport: true,
        category: true,
      },
      orderBy: { gameDate: "asc" },
      take: maxFetch,
    });

    // =====================================================
    // FILTROS EM JS — Prisma não consegue filtrá-los direto
    // =====================================================
    let filtered = offers;

    // Horário exato
    if (time) {
      const { h: qh, m: qm } = parseTimeToHM(time);
      filtered = filtered.filter((o) => {
        const { h, m } = gameDateToHM(o.gameDate);
        return h === qh && m === qm;
      });
    }

    // Dia da semana (0 = domingo)
    if (weekday) {
      const wk = Number(weekday);
      filtered = filtered.filter((o) => new Date(o.gameDate).getDay() === wk);
    }

    // Dia do mês (1–31)
    if (dayOfMonth) {
      const dm = Number(dayOfMonth);
      filtered = filtered.filter((o) => new Date(o.gameDate).getDate() === dm);
    }

    // Turno (considerando duração da partida)
    if (turno) {
      const { start, end } = TURNO[turno];
      filtered = filtered.filter((o) => {
        const { h, m } = gameDateToHM(o.gameDate);
        const duration = typeof o.durationMin === "number" ? o.durationMin : 90;
        return overlapsTurn(h, m, duration, start, end);
      });
    }

    // =====================================================
    // PAGINAÇÃO (pós-filtros)
    // =====================================================
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const startIndex = (page - 1) * pageSize;
    const paged = filtered.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      data: paged,
      pagination: {
        total,
        page,
        pageSize,
        countOnPage: paged.length,
        totalPages,
      },
      meta: {
        appliedLookaheadDays:
          !date && (time || turno || weekday || dayOfMonth)
            ? lookaheadDays
            : null,
        fetchedFromDb: offers.length,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar jogos" },
      { status: 500 }
    );
  }
}
