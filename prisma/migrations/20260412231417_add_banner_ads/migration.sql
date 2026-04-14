-- CreateTable
CREATE TABLE "BannerAd" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "text" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BannerAd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BannerAd_type_isActive_order_idx" ON "BannerAd"("type", "isActive", "order");

-- CreateIndex
CREATE INDEX "BannerAd_userId_idx" ON "BannerAd"("userId");
