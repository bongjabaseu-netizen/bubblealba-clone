-- CreateTable
CREATE TABLE "AdBid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "packageId" TEXT,
    "bidAmount" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "payMethod" TEXT NOT NULL DEFAULT 'POINT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdBid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AdBid_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AdBid_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AdPackage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AdBid_userId_idx" ON "AdBid"("userId");

-- CreateIndex
CREATE INDEX "AdBid_jobId_idx" ON "AdBid"("jobId");

-- CreateIndex
CREATE INDEX "AdBid_status_idx" ON "AdBid"("status");
