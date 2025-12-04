import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

// TURNOS
const TURNO = {
  morning: { start: "06:00", end: "12:00" },
  afternoon: { start: "11:00", end: "19:00" },
  night: { start: "17:00", end: "23:59" },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const sportId = searchParams.get("sportId") ?? undefined;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const modalityId = searchParams.get("modalityId") ?? undefined;
    const gender = searchParams.get("gender") ?? undefined;
    const date = searchParams.get("date") ?? undefined;
    const weekday = searchParams.get("weekday") ?? undefined;
    const dayOfMonth = searchParams.get("dayOfMonth") ?? undefined;
    const time = searchParams.get("time") ?? undefined;
    const turno = searchParams.get("turno") as
      | "morning"
      | "afternoon"
      | "night"
      | undefined;

    // Construção dinâmica do filtro
    const where: any = {
      status: "OPEN",
    };

    if (sportId) where.sportId = sportId;
    if (categoryId) where.categoryId = categoryId;
    if (modalityId) where.modalityId = modalityId;
    if (gender) where.gender = gender;

    // Filtro por data exata (yyyy-mm-dd)
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);
      where.gameDate = { gte: start, lte: end };
    }

    // Filtro por dia do mês
    if (dayOfMonth && !date) {
      where.AND = [
        ...(where.AND ?? []),
        {
          AND: [
            { gameDate: { gte: new Date() } },
            {
              // filtra jogos futuros com mesmo dia
              gameDate: {
                equals: undefined, // filtramos depois via JavaScript
              },
            },
          ],
        },
      ];
    }

    // Filtro por horário exato
    if (time) {
      where.AND = [
        ...(where.AND ?? []),
        {
          OR: [
            {
              gameDate: {
                gte: new Date(`1970-01-01T${time}:00`),
                lte: new Date(`1970-01-01T${time}:00`),
              },
            },
          ],
        },
      ];
    }

    // Filtro por turno
    if (turno) {
      const selected = TURNO[turno];

      where.AND = [
        ...(where.AND ?? []),
        {
          OR: [
            {
              AND: [
                {
                  gameDate: {
                    gte: new Date(`1970-01-01T${selected.start}:00`),
                  },
                },
                {
                  gameDate: {
                    lte: new Date(`1970-01-01T${selected.end}:00`),
                  },
                },
              ],
            },
          ],
        },
      ];
    }

    // Faz a consulta
    const offers = await prisma.gameOffer.findMany({
      where,
      include: {
        team: true,
        modality: true,
        sport: true,
        category: true,
      },
      orderBy: { gameDate: "asc" },
    });

    // FILTRO POR DIA DO MÊS (feito após consulta)
    let filtered = offers;

    if (dayOfMonth && !date) {
      filtered = offers.filter((o) => {
        const d = new Date(o.gameDate).getDate();
        return d === Number(dayOfMonth);
      });
    }

    return NextResponse.json(filtered);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar jogos" },
      { status: 500 }
    );
  }
}
