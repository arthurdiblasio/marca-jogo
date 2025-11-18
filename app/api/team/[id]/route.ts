import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do time não fornecido." },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: {
        id,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: teamId } = await params;
    const body = await request.json();

    const {
      name,
      sportId,
      abbreviation,
      logo,
      foundedAt,
      history,
      hasField,
      fieldInfo,
      latitude,
      teamImages,
      instagram,
      longitude,
      categoryId,
    } = body;

    console.log("teamImagesHook =>>", teamImages);
    console.log("fieldInfo =>>", fieldInfo);

    if (!teamId) {
      return NextResponse.json(
        { error: "ID do time não fornecido." },
        { status: 400 }
      );
    }

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
        instagram,
        hasField,
        fieldInfo,
        latitude,
        longitude,
        categoryId,
        photos: teamImages,
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
