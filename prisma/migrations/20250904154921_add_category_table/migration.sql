-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_sportId_name_key" ON "public"."Category"("sportId", "name");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
