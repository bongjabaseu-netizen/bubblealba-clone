-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "wage" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "views" INTEGER NOT NULL DEFAULT 0,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("authorId", "category", "city", "company", "createdAt", "description", "id", "images", "isPromoted", "region", "status", "tags", "title", "updatedAt", "views", "wage") SELECT "authorId", "category", "city", "company", "createdAt", "description", "id", "images", "isPromoted", "region", "status", "tags", "title", "updatedAt", "views", "wage" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE INDEX "Job_authorId_idx" ON "Job"("authorId");
CREATE INDEX "Job_region_city_idx" ON "Job"("region", "city");
CREATE INDEX "Job_category_idx" ON "Job"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
