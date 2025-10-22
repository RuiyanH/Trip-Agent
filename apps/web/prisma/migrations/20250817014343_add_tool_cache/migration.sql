-- CreateTable
CREATE TABLE "ToolCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "ttl" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolCache_key_key" ON "ToolCache"("key");

-- CreateIndex
CREATE INDEX "ToolCache_key_idx" ON "ToolCache"("key");
