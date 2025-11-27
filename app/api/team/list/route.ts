import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient, Prisma } from "@prisma/client";
import type { TeamListFilters, TeamListItem } from "@/types/team";

const prisma = new PrismaClient();

export async function GET(
  req: Request
): Promise<NextResponse<TeamListItem[] | { error: string }>> {
  try {
    // Validar sessão
    const session = await getServerSession();
    console.log("session", session);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId: string = session.user.id;

    // Filtros tipados
    const { searchParams } = new URL(req.url);

    const filters: TeamListFilters = {
      sportId: searchParams.get("sportId"),
      categoryId: searchParams.get("categoryId"),
      q: searchParams.get("q"),
    };

    // Construir where tipado
    const where: Prisma.TeamWhereInput = {
      ownerId: userId,
    };

    if (filters.sportId) {
      where.sportId = filters.sportId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.q && filters.q.trim() !== "") {
      where.name = {
        contains: filters.q,
        mode: "insensitive",
      };
    }

    // Buscar times
    const teams: TeamListItem[] = await prisma.team.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        abbreviation: true,
        logo: true,
        sport: {
          select: { id: true, name: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Erro ao listar times:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar times" },
      { status: 500 }
    );
  }
}
