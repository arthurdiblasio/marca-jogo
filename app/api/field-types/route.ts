import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const fieldSurfaceTypes = await prisma.fieldSurfaceTypes.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ fieldSurfaceTypes }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar as categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
