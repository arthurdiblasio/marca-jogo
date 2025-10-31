/*
  Warnings:

  - You are about to drop the column `url` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "url",
ADD COLUMN     "instagram" TEXT;
