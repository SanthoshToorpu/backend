/*
  Warnings:

  - A unique constraint covering the columns `[petId]` on the table `PetTracker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PetTracker_petId_key" ON "PetTracker"("petId");
