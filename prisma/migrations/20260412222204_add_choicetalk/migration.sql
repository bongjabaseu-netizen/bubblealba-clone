-- CreateTable
CREATE TABLE "ChoiceTalkRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "roomCount" INTEGER NOT NULL DEFAULT 0,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "jobId" TEXT,
    "ownerId" TEXT NOT NULL,
    "lastMessageAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChoiceTalkRoom_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ChoiceTalkRoom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChoiceTalkMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChoiceTalkMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChoiceTalkRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChoiceTalkMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ChoiceTalkRoom_slug_key" ON "ChoiceTalkRoom"("slug");

-- CreateIndex
CREATE INDEX "ChoiceTalkRoom_ownerId_idx" ON "ChoiceTalkRoom"("ownerId");

-- CreateIndex
CREATE INDEX "ChoiceTalkRoom_lastMessageAt_idx" ON "ChoiceTalkRoom"("lastMessageAt");

-- CreateIndex
CREATE INDEX "ChoiceTalkMessage_roomId_createdAt_idx" ON "ChoiceTalkMessage"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "ChoiceTalkMessage_authorId_idx" ON "ChoiceTalkMessage"("authorId");
