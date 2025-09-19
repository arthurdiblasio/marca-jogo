// app/api/team/create/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth"; // Para obter a sessão do servidor
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Importe suas opções de autenticação

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Você precisa estar logado para criar um time." },
        { status: 401 }
      );
    }
    const {
      name,
      abbreviation,
      logo,
      sportId,
      foundedAt,
      latitude,
      longitude,
      history,
      hasField,
      fieldName,
      categoryId,
      fieldAddress,
    } = await request.json();

    const loggedInUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!loggedInUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    // 1. Validação dos dados
    if (!name || !sportId) {
      return NextResponse.json(
        { error: "Nome e esporte são obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Verifique se o usuário já tem um time com o mesmo nome e esporte
    const existingTeam = await prisma.team.findUnique({
      where: {
        ownerId_name_sportId: {
          ownerId: loggedInUser.id,
          name,
          sportId,
        },
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "Você já tem um time com este nome para o mesmo esporte." },
        { status: 409 }
      );
    }

    // 3. Crie o novo time no banco de dados
    const newTeam = await prisma.team.create({
      data: {
        name,
        abbreviation,
        logo,
        sportId,
        latitude,
        longitude,
        categoryId,
        ownerId: loggedInUser.id,
        foundedAt,
        history,
        hasField,
        fieldName,
        fieldAddress,
      },
    });

    return NextResponse.json(
      { message: "Time criado com sucesso!", team: newTeam },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro na criação do time:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
