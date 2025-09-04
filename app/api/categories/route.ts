import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sportId = searchParams.get("sportId");

  if (!sportId) {
    return NextResponse.json(
      { error: "ID do esporte ausente." },
      { status: 400 }
    );
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        sportId: sportId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar as categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
