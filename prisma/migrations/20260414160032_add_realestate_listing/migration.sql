-- CreateTable
CREATE TABLE "RealEstateListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "priceType" TEXT NOT NULL DEFAULT '월세',
    "deposit" TEXT,
    "area" TEXT,
    "rooms" TEXT,
    "floor" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "category" TEXT NOT NULL DEFAULT 'ONEROOM',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "authorId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RealEstateListing_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RealEstateListing_region_city_idx" ON "RealEstateListing"("region", "city");

-- CreateIndex
CREATE INDEX "RealEstateListing_category_idx" ON "RealEstateListing"("category");

-- CreateIndex
CREATE INDEX "RealEstateListing_status_idx" ON "RealEstateListing"("status");

-- CreateIndex
CREATE INDEX "RealEstateListing_authorId_idx" ON "RealEstateListing"("authorId");
