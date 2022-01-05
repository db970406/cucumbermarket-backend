/*
  Warnings:

  - A unique constraint covering the columns `[file]` on the table `ItemPhoto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file` to the `ItemPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemPhoto" ADD COLUMN     "file" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ItemPhoto_file_key" ON "ItemPhoto"("file");
