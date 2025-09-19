import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    const body = await request.json();

    const {
      name,
      sportId,
      abbreviation,
      logo,
      foundedAt,
      history,
      hasField,
      fieldName,
      fieldAddress,
      latitude,
      longitude,
      categoryId,
    } = body;

    // Verifique se o ID do time é válido
    if (!teamId) {
      return NextResponse.json(
        { error: "ID do time não fornecido." },
        { status: 400 }
      );
    }

    // Verifique se o time existe
    const existingTeam = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: "Time não encontrado." },
        { status: 404 }
      );
    }

    // Atualize o registro do time no banco de dados
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        name,
        sportId,
        abbreviation,
        logo,
        foundedAt,
        history,
        hasField,
        fieldName,
        fieldAddress,
        latitude,
        longitude,
        categoryId,
      },
    });

    return NextResponse.json(
      { message: "Time atualizado com sucesso!", team: updatedTeam },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar o time:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao atualizar o time." },
      { status: 500 }
    );
  }
}
