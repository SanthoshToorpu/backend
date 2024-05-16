/*
  Warnings:

  - Added the required column `petId` to the `Fine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fine" ADD COLUMN     "petId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "fineAmount" DOUBLE PRECISION,
ADD COLUMN     "isPaid" BOOLEAN;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
