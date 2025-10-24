import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = await params;

    if (!teamId) {
      return NextResponse.json(
        { error: "ID do time não fornecido." },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Time não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar o time:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao buscar o time." },
      { status: 500 }
    );
  }
}
