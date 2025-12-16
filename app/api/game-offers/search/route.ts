import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

const TURNOS = {
  morning: { start: "06:00", end: "12:00" },
  afternoon: { start: "11:00", end: "19:00" },
  night: { start: "17:00", end: "23:59" },
} as const;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // -----------------------------
    // 📌 Filtros obrigatórios
    // -----------------------------
    const sportId = searchParams.get("sportId");
    const modalityId = searchParams.get("modalityId");
    const gender = searchParams.get("gender");

    if (!sportId || !modalityId || !gender) {
      return NextResponse.json(
        { error: "sportId, modalityId e gender são obrigatórios." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 📌 Filtros opcionais
    // -----------------------------
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const date = searchParams.get("date") ?? undefined;
    const weekday = searchParams.get("weekday") ?? undefined;
    const dayOfMonth = searchParams.get("dayOfMonth") ?? undefined;
    const time = searchParams.get("time") ?? undefined;
    const turno = searchParams.get("turno") as
      | "morning"
      | "afternoon"
      | "night"
      | undefined;

    // Paginação
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(
      100,
      Math.max(5, Number(searchParams.get("pageSize") ?? "20"))
    );
    const offset = (page - 1) * pageSize;

    // -----------------------------
    // 📌 WHERE dinâmico
    // -----------------------------
    const conditions: string[] = [];
    const params: any[] = [];

    // filtros obrigatórios
    params.push(sportId);
    conditions.push(`go."sportId" = $${params.length}`);

    params.push(modalityId);
    conditions.push(`go."modalityId" = $${params.length}`);

    params.push(gender);
    conditions.push(`go."gender" = $${params.length}`);

    // status OPEN
    conditions.push(`go."status" = 'OPEN'`);

    // categoria
    if (categoryId) {
      params.push(categoryId);
      conditions.push(`go."categoryId" = $${params.length}`);
    }

    // data exata
    if (date) {
      params.push(`${date}T00:00:00`);
      params.push(`${date}T23:59:59`);
      conditions.push(
        `go."gameDate" BETWEEN $${params.length - 1} AND $${params.length}`
      );
    } else {
      conditions.push(`go."gameDate" >= NOW()`);
    }

    // dia da semana (0–6)
    if (weekday) {
      params.push(Number(weekday));
      conditions.push(`EXTRACT(DOW FROM go."gameDate") = $${params.length}`);
    }

    // dia do mês
    if (dayOfMonth && !date) {
      params.push(Number(dayOfMonth));
      conditions.push(`EXTRACT(DAY FROM go."gameDate") = $${params.length}`);
    }

    // horário exato
    if (time) {
      params.push(time + ":00");
      conditions.push(
        `TO_CHAR(go."gameDate", 'HH24:MI:SS') = $${params.length}`
      );
    }

    // turno
    if (turno) {
      const t = TURNOS[turno];
      params.push(t.start + ":00", t.end + ":00");

      conditions.push(`
        (
          TO_CHAR(go."gameDate", 'HH24:MI:SS') >= $${params.length - 1}
          AND
          TO_CHAR(go."gameDate", 'HH24:MI:SS') <= $${params.length}
        )
      `);
    }

    const whereSQL = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // -----------------------------
    // 📌 SELECT ENRIQUECIDO
    // -----------------------------
    const sql = `
      SELECT
        go.*,

        -- Dados do time
        t.name AS "teamName",
        t.logo AS "teamLogo",

        -- Esporte, modalidade, categoria
        s.name AS "sportName",
        gm.name AS "modalityName",
        c.name AS "categoryName",

        -- Endereço do campo (campo JSON)
        go."fieldInfo"->>'address' AS "fieldAddress",

        -- Taxa do jogo
        go.fee AS "fee"

      FROM "GameOffer" go
      JOIN "Team" t ON t.id = go."teamId"
      JOIN "Sport" s ON s.id = go."sportId"
      JOIN "GameModality" gm ON gm.id = go."modalityId"
      LEFT JOIN "Category" c ON c.id = go."categoryId"
      ${whereSQL}
      ORDER BY go."gameDate" ASC
      LIMIT ${pageSize}
      OFFSET ${offset};
    `;

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM "GameOffer" go
      ${whereSQL};
    `;

    const [offers, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(sql, ...params),
      prisma.$queryRawUnsafe(countSql, ...params),
    ]);

    const total = countResult[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data: offers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        countOnPage: offers.length,
      },
    });
  } catch (error) {
    console.error("API FIND GAMES ERROR:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar jogos" },
      { status: 500 }
    );
  }
}
