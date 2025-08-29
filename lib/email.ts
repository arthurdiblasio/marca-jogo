// lib/email.ts

import nodemailer from "nodemailer";

// O transportador do Nodemailer. Use suas credenciais do .env
const transporter = nodemailer.createTransport({
  service: "gmail", // ou 'smtp' com host e porta específicos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verifique seu e-mail para o Marca Jogo",
    html: `
      <h1>Bem-vindo ao Marca Jogo!</h1>
      <p>Seu código de verificação é:</p>
      <h2 style="background: #f4f4f4; padding: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">${code}</h2>
      <p>Este código expira em 30 minutos.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de verificação enviado para: ${toEmail}`);
  } catch (error) {
    console.error("Erro ao enviar e-mail de verificação:", error);
    throw new Error("Falha ao enviar e-mail de verificação.");
  }
};
