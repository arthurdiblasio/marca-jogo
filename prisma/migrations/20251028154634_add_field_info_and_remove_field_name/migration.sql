/*
  Warnings:

  - You are about to drop the column `fieldAddress` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `fieldName` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "fieldAddress",
DROP COLUMN "fieldName",
ADD COLUMN     "fieldInfo" JSONB;
