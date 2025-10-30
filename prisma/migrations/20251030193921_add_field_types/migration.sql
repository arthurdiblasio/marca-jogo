-- CreateTable
CREATE TABLE "public"."FieldSurfaceTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FieldSurfaceTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldSurfaceTypes_name_key" ON "public"."FieldSurfaceTypes"("name");
