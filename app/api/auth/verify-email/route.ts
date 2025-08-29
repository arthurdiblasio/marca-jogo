// app/api/auth/verify-email/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "E-mail e código de verificação são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Encontre o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "E-mail não encontrado." },
        { status: 404 }
      );
    }

    // 2. Verifique se o código já expirou
    if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Código de verificação expirado. Por favor, solicite um novo.",
        },
        { status: 400 }
      );
    }

    // 3. Verifique se o código está correto e se o e-mail não foi verificado ainda
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Código de verificação inválido." },
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Este e-mail já foi verificado." },
        { status: 400 }
      );
    }

    // 4. Se tudo estiver correto, ative a conta do usuário
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        codeExpiresAt: null,
      },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
      },
    });

    return NextResponse.json(
      { message: "E-mail verificado com sucesso!", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na verificação do e-mail:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
