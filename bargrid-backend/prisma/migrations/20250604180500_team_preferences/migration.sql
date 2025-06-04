-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "mustHaveDays" TEXT[],
ADD COLUMN     "numberOfDays" INTEGER,
ADD COLUMN     "shiftPreference" TEXT NOT NULL DEFAULT 'Mix';
