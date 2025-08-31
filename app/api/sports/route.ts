// app/api/sports/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sports = await prisma.sport.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ sports }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar os esportes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
