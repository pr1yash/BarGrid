/*
  Warnings:

  - You are about to drop the column `teamMemberId` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_teamMemberId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "teamMemberId";

-- CreateTable
CREATE TABLE "_ShiftAssignments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ShiftAssignments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ShiftAssignments_B_index" ON "_ShiftAssignments"("B");

-- AddForeignKey
ALTER TABLE "_ShiftAssignments" ADD CONSTRAINT "_ShiftAssignments_A_fkey" FOREIGN KEY ("A") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftAssignments" ADD CONSTRAINT "_ShiftAssignments_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
