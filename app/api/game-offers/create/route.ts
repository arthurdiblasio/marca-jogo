import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import type { NextRequest } from "next/server";

/**
 * POST /api/game-offers/create
 *
 * Body (JSON):
 * {
 *   "teamId": string,
 *   "modalityId": string,        // opcionalmente informado — será validado
 *   "categoryId": string|null,   // opcional, default para team.categoryId
 *   "gameDate": string,          // ISO 8601 datetime
 *   "durationMin": number,       // opcional, default from Sport.durationMin
 *   "fee": number,               // opcional
 *   "fieldInfo": {               // opcional - se team hasField = true, default from team; se team doesn't have field, required
 *     address?: string,
 *     latitude?: number,
 *     longitude?: number,
 *     images?: string[],
 *     observations?: string
 *   }
 * }
 *
 * Response:
 * 201 { id: string, status: "OPEN" }
 * 4xx/5xx errors with message
 */

// Helper to extract user id from request. Tries next-auth then fallback to header x-user-id.
async function getUserIdFromRequest(req: Request): Promise<string | null> {
  try {
    // Try to use next-auth if configured
    // If you have an auth helper, import it (e.g. "@/lib/auth") and pass to getServerSession.
    // We do a dynamic import to avoid hard dependency if you don't have it set up.
    // NOTE: adjust if your project uses a different name for authOptions.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { getServerSession } = await import("next-auth/next");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { authOptions } = await import("@/lib/auth").catch(() => ({}));
    if (typeof getServerSession === "function" && authOptions) {
      // @ts-ignore
      const session = await getServerSession(authOptions);
      const userId =
        (session as any)?.user?.id ?? (session as any)?.user?.sub ?? null;
      if (userId) return String(userId);
    }
  } catch (err) {
    // ignore — fallback below
  }

  // Fallback: custom header (useful for local dev / tests)
  try {
    // @ts-ignore
    const headers = (global as any).requestHeadersForCreateGame ?? null;
  } catch {
    // ignore
  }

  // If running in Next route we can read req.headers
  try {
    const maybe = (req as any).headers?.get
      ? (req as any).headers.get("x-user-id")
      : undefined;
    if (maybe) return maybe;
  } catch {
    // ignore
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const {
      teamId,
      modalityId,
      categoryId,
      gameDate: rawGameDate,
      durationMin: payloadDurationMin,
      fee,
      includesRef,
      refereeType,
      fieldInfo: payloadFieldInfo,
    } = body as {
      teamId?: string;
      modalityId?: string;
      categoryId?: string | null;
      gameDate?: string;
      durationMin?: number;
      fee?: number;
      fieldInfo?: any;
      includesRef: boolean;
      refereeType: "SOLO" | "TRIO";
    };

    // validações básicas
    if (!teamId)
      return NextResponse.json(
        { error: "teamId é obrigatório" },
        { status: 400 }
      );
    if (!rawGameDate)
      return NextResponse.json(
        { error: "gameDate é obrigatório" },
        { status: 400 }
      );

    const gameDate = new Date(rawGameDate);
    if (Number.isNaN(gameDate.getTime())) {
      return NextResponse.json({ error: "gameDate inválido" }, { status: 400 });
    }

    // autenticação / usuário atual
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // --- buscar o time e validar propriedade ---
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        sportId: true,
        categoryId: true,
        gender: true,
        hasField: true,
        fieldInfo: true,
      },
    });

    if (!team)
      return NextResponse.json(
        { error: "Time não encontrado" },
        { status: 404 }
      );

    // Validar que o usuário é o dono do time (ajuste se quiser permitir managers)
    if (String(team.ownerId) !== String(userId)) {
      return NextResponse.json(
        { error: "Você não tem permissão para criar jogo para esse time" },
        { status: 403 }
      );
    }

    // --- definir sportId e gender a partir do time (imutáveis) ---
    const sportId = team.sportId;
    const gender = team.gender; // assume banco já tem MALE/FEMALE/MIXED

    // se o payload enviou sportId/gender/modality diferente do time, validamos ou rejeitamos
    // (a regra definida: o esporte e gênero vieram do time; modalidade o usuário escolhe)
    if (categoryId && categoryId !== team.categoryId) {
      // OK - usuário permite override de category
    }

    // modalityId must be provided (or the payload included it). We'll validate existence below.
    if (!modalityId) {
      return NextResponse.json(
        { error: "modalityId é obrigatório" },
        { status: 400 }
      );
    }

    // --- buscar Sport para duration default ---
    const sport = await prisma.sport.findUnique({
      where: { id: sportId },
      select: { id: true, durationMin: true },
    });

    if (!sport) {
      return NextResponse.json(
        { error: "Sport associado ao time não encontrado" },
        { status: 400 }
      );
    }

    const durationMin =
      typeof payloadDurationMin === "number" && payloadDurationMin > 0
        ? payloadDurationMin
        : sport.durationMin ?? 90;

    // --- verificar modality pertence ao mesmo sport ---
    const modality = await prisma.gameModality.findUnique({
      where: { id: modalityId },
      select: { id: true, sportId: true, name: true },
    });
    if (!modality) {
      return NextResponse.json(
        { error: "Modalidade inexistente" },
        { status: 400 }
      );
    }
    if (modality.sportId !== sportId) {
      return NextResponse.json(
        { error: "Modalidade não pertence ao esporte do time" },
        { status: 400 }
      );
    }

    // --- fieldInfo logic ---
    let fieldInfoToSave: any = null;
    if (team.hasField) {
      // pega do team, mas permite override parcial via payloadFieldInfo
      fieldInfoToSave = team.fieldInfo ?? {};
      if (payloadFieldInfo && typeof payloadFieldInfo === "object") {
        // merge with payload (payload overrides)
        fieldInfoToSave = { ...fieldInfoToSave, ...payloadFieldInfo };
      }
    } else {
      // time não tem campo — precisa fornecer fieldInfo no payload
      if (
        !payloadFieldInfo ||
        typeof payloadFieldInfo !== "object" ||
        !payloadFieldInfo.address
      ) {
        return NextResponse.json(
          {
            error: "Time não tem campo. Informe fieldInfo.address no payload.",
          },
          { status: 400 }
        );
      }
      fieldInfoToSave = payloadFieldInfo;
    }

    // ensure images is array if provided
    if (fieldInfoToSave?.images && !Array.isArray(fieldInfoToSave.images)) {
      // try to coerce or error
      if (typeof fieldInfoToSave.images === "string") {
        fieldInfoToSave.images = [fieldInfoToSave.images];
      } else {
        return NextResponse.json(
          { error: "fieldInfo.images deve ser um array de URLs" },
          { status: 400 }
        );
      }
    }

    // --- categoria final (default do time, override permitido) ---

    // --- checagem de conflito de horários (mesmo time) ---
    // Consideramos conflito se existir uma oferta (não cancelada) do mesmo time
    // que tenha interseção de intervalo com o novo jogo.
    // existente: [existingStart, existingEnd)
    // novo: [gameDate, gameDate + durationMin)
    // Vamos usar SQL via prisma.$queryRawUnsafe para verificar existência.

    // calcular novo intervalo em ISO
    const newStartISO = gameDate.toISOString();
    // Postgres interval expression will use (interval 'x minutes')
    // We'll build a SQL that checks overlaps using: NOT (existing_end <= new_start OR existing_start >= new_end)
    const conflictSql = `
      SELECT COUNT(*)::int as cnt
      FROM "GameOffer" g
      WHERE g."teamId" = $1
        AND g."status" != 'CANCELED'
        AND (
          -- existing start:
          g."gameDate" < (TIMESTAMP $2 + ($3 * interval '1 minute'))
          AND
          (g."gameDate" + (COALESCE(g."durationMin", $3) * interval '1 minute')) > TIMESTAMP $2
        )
    `;

    const conflictResult = await prisma.$queryRawUnsafe(
      conflictSql,
      teamId,
      newStartISO,
      durationMin
    );
    // conflictResult is array of rows; first row has cnt
    const conflictsCount = Number((conflictResult?.[0] as any)?.cnt ?? 0);
    if (conflictsCount > 0) {
      return NextResponse.json(
        {
          error:
            "Conflito de horário: já existe um jogo desse time no período informado",
        },
        { status: 409 }
      );
    }

    // --- finalmente, criar o GameOffer ---
    const created = await prisma.gameOffer.create({
      data: {
        teamId: team.id,
        sportId,
        modalityId,
        gender,
        categoryId: categoryId ?? team.categoryId ?? null,
        gameDate,
        durationMin,
        fee: fee ?? 0,
        fieldAddress: fieldInfoToSave.address ?? null,
        latitude: fieldInfoToSave.latitude ?? null,
        longitude: fieldInfoToSave.longitude ?? null,
        includesRef,
        refereeType,
        status: "OPEN",
      },
    });

    return NextResponse.json(
      { id: created.id, status: created.status },
      { status: 201 }
    );
  } catch (err) {
    console.error("ERROR /api/game-offers/create", err);
    return NextResponse.json(
      { error: "Erro ao criar oferta de jogo" },
      { status: 500 }
    );
  }
}
