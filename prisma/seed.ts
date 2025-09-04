// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sports = ["Futebol", "Vôlei", "FIFA", "Basquete"];

async function main() {
  console.log("Iniciando o processo de seed...");

  for (const sportName of sports) {
    await prisma.sport.upsert({
      where: { name: sportName },
      update: {},
      create: { name: sportName },
    });
    console.log(`Esporte "${sportName}" inserido ou atualizado.`);
  }

  console.log("Processo de seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
