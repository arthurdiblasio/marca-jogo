import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sports = [
  { name: "Futebol", durationMin: 90 },
  { name: "Fut7 ou Fut6", durationMin: 90 },
  { name: "Vôlei", durationMin: 90 },
  { name: "FIFA", durationMin: 90 },
  { name: "Basquete", durationMin: 90 },
];
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

  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: {
        name: sport.name,
        durationMin: sport.durationMin,
      },
    });
    console.log(`Esporte "${sport.name}" inserido ou atualizado.`);
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

  if (sportSoccer) {
    await prisma.gameModality.createMany({
      data: [
        {
          name: "Futebol Campo",
          description: "10 jogadores na linha + goleiro. Campo grande.",
          players: 11,
          onField: 10,
          hasGoalkeeper: true,
          sportId: sportSoccer?.id,
        },
        {
          name: "Fut 7",
          description: "6 jogadores na linha + goleiro. Campo society.",
          players: 7,
          onField: 6,
          hasGoalkeeper: true,
          sportId: sportSoccer?.id,
        },
        {
          name: "Futebol 6",
          description:
            "5 jogadores na linha + goleiro. Campo society reduzido.",
          players: 6,
          onField: 5,
          hasGoalkeeper: true,
          sportId: sportSoccer?.id,
        },
        {
          name: "Futsal",
          description: "4 na linha + goleiro. Quadra oficial.",
          players: 5,
          onField: 4,
          hasGoalkeeper: true,
          sportId: sportSoccer?.id,
        },
      ],
    });
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
