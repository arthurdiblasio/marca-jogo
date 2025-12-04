/*
  Warnings:

  - You are about to drop the column `gameModalityId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_gameModalityId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" DROP COLUMN "gameModalityId",
DROP COLUMN "updatedAt",
ADD COLUMN     "modalityId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "public"."GameModality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
