// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email"; // Vamos criar esta função

const prisma = new PrismaClient();

const validatePassword = (password: string) => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("ter no mínimo 8 caracteres;");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("uma letra maiúscula;");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("uma letra minúscula;");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("um número;");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("um caractere especial;");
  }
  if (errors.length) errors[0] = `A senha deve ${errors[0]}`;

  return errors;
};

export async function POST(request: Request) {
  try {
    const { name, email, password, confirmPassword, phone } =
      await request.json();

    // 1. Validação inicial e de senha
    if (!name || !email || !password || !confirmPassword || !phone) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "As senhas não coincidem." },
        { status: 400 }
      );
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length) {
      return NextResponse.json(
        { error: passwordErrors.join(" ") },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está em uso." },
        { status: 409 }
      );
    }

    // 2. Criptografar a senha e gerar código de verificação
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();
    const codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // Expira em 30 minutos

    // 3. Salvar o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        isEmailVerified: false,
        verificationCode,
        codeExpiresAt,
      },
    });

    // 4. Enviar e-mail de verificação (se o envio falhar, o usuário ainda é criado)
    await sendVerificationEmail(newUser.email, verificationCode);

    return NextResponse.json(
      {
        message:
          "Cadastro realizado! Verifique seu e-mail para ativar sua conta.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
