-- CreateIndex
CREATE INDEX "GameOffer_gameDate_idx" ON "public"."GameOffer"("gameDate");

-- CreateIndex
CREATE INDEX "GameOffer_sportId_idx" ON "public"."GameOffer"("sportId");

-- CreateIndex
CREATE INDEX "GameOffer_modalityId_idx" ON "public"."GameOffer"("modalityId");

-- CreateIndex
CREATE INDEX "GameOffer_gender_idx" ON "public"."GameOffer"("gender");

-- CreateIndex
CREATE INDEX "GameOffer_categoryId_idx" ON "public"."GameOffer"("categoryId");

-- CreateIndex
CREATE INDEX "GameOffer_status_idx" ON "public"."GameOffer"("status");

-- CreateIndex
CREATE INDEX "GameOffer_sportId_modalityId_gender_idx" ON "public"."GameOffer"("sportId", "modalityId", "gender");

-- CreateIndex
CREATE INDEX "GameOffer_sportId_modalityId_gender_gameDate_idx" ON "public"."GameOffer"("sportId", "modalityId", "gender", "gameDate");
