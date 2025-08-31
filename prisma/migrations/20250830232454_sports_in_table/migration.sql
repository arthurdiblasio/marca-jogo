/*
  Warnings:

  - You are about to drop the column `sport` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId,name,sportId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sportId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Team_ownerId_name_sport_key";

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "sport",
ADD COLUMN     "sportId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Sport";

-- CreateTable
CREATE TABLE "public"."Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "public"."Sport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_ownerId_name_sportId_key" ON "public"."Team"("ownerId", "name", "sportId");

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
