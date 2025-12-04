-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "gameModalityId" TEXT;

-- AlterTable
ALTER TABLE "public"."GameOffer" ADD COLUMN     "modalityId" TEXT;

-- CreateTable
CREATE TABLE "public"."GameModality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "players" INTEGER NOT NULL,
    "onField" INTEGER NOT NULL,
    "hasGoalkeeper" BOOLEAN NOT NULL DEFAULT true,
    "sportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameModality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."GameModality" ADD CONSTRAINT "GameModality_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameOffer" ADD CONSTRAINT "GameOffer_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "public"."GameModality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_gameModalityId_fkey" FOREIGN KEY ("gameModalityId") REFERENCES "public"."GameModality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
