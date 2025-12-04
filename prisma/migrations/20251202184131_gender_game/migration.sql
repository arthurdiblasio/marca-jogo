/*
  Warnings:

  - Added the required column `gender` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."GameGender" AS ENUM ('MALE', 'FEMALE', 'MIXED');

-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "gender" "public"."GameGender" NOT NULL;

-- AlterTable
ALTER TABLE "public"."GameOffer" ADD COLUMN     "gender" "public"."GameGender" NOT NULL DEFAULT 'MALE';
