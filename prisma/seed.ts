// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sports = ["Futebol", "Vôlei", "FIFA", "Basquete"];
const categoriesSoccer = [
  "Sub-10",
  "Sub-12",
  "Sub-15",
  "Sub-17",
  "Sub-20",
  "Mesclado (Jovem e Veterano)",
  "Veterano",
  "Jovem",
];

const fieldSurfaceTypes = [
  "Grama Natural",
  "Grama Sintética",
  "Terra",
  "Cimento",
  "Taco de Madeira",
  "Areia",
];

async function main() {
  console.log("Iniciando o processo de seed...");

  for (const surfaceTypeName of fieldSurfaceTypes) {
    await prisma.fieldSurfaceTypes.upsert({
      where: { name: surfaceTypeName },
      update: {},
      create: { name: surfaceTypeName },
    });
    console.log(
      `Tipo de Superfície de Campo "${surfaceTypeName}" inserido ou atualizado.`
    );
  }

  for (const sportName of sports) {
    await prisma.sport.upsert({
      where: { name: sportName },
      update: {},
      create: { name: sportName },
    });
    console.log(`Esporte "${sportName}" inserido ou atualizado.`);
  }

  const sportRecords = await prisma.sport.findMany();
  const sportSoccer = sportRecords.find((s) => s.name === "Futebol");
  const sportVolleyball = sportRecords.find((s) => s.name === "Vôlei");
  const sportFIFA = sportRecords.find((s) => s.name === "FIFA");
  const sportBasketball = sportRecords.find((s) => s.name === "Basquete");

  if (sportSoccer) {
    for (const category of categoriesSoccer) {
      await prisma.category.upsert({
        where: { sportId_name: { sportId: sportSoccer?.id, name: category } },
        update: {},
        create: {
          name: category,
          sportId: sportSoccer?.id,
        },
      });
      console.log(
        `Categoria "${category}" para o esporte "${sportSoccer.name}" inserida/atualizada.`
      );
    }
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
