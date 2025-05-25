/*
  Warnings:

  - The primary key for the `CandidateProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `botPersonaId` on the `ChatLog` table. All the data in the column will be lost.
  - The primary key for the `CompanyProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `candidateProfileId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `TokenAccessLog` table. All the data in the column will be lost.
  - You are about to drop the `BotPersona` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `CandidateProfile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `agentId` to the `ChatLog` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `CompanyProfile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `profileId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `years` on the `WorkExperience` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AgentStyle" AS ENUM ('formal', 'casual', 'concise', 'enthusiastic');

-- CreateEnum
CREATE TYPE "AgentTone" AS ENUM ('neutral', 'friendly', 'professional', 'humorous');

-- CreateEnum
CREATE TYPE "AnswerLength" AS ENUM ('short', 'medium', 'long');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('one_time', 'time_limited');

-- DropForeignKey
ALTER TABLE "BotPersona" DROP CONSTRAINT "BotPersona_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ChatLog" DROP CONSTRAINT "ChatLog_botPersonaId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_candidateProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TechStack" DROP CONSTRAINT "TechStack_candidateProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TechStack" DROP CONSTRAINT "TechStack_companyProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_profileId_fkey";

-- DropForeignKey
ALTER TABLE "TokenAccessLog" DROP CONSTRAINT "TokenAccessLog_profileId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_candidateProfileId_fkey";

-- AlterTable
ALTER TABLE "CandidateProfile" DROP CONSTRAINT "CandidateProfile_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChatLog" DROP COLUMN "botPersonaId",
ADD COLUMN     "agentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "candidateProfileId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "profileId",
ADD COLUMN     "candidateProfileId" TEXT,
ADD COLUMN     "companyProfileId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "TokenType" NOT NULL;

-- AlterTable
ALTER TABLE "TokenAccessLog" DROP COLUMN "profileId",
ADD COLUMN     "candidateProfileId" TEXT,
ADD COLUMN     "companyProfileId" TEXT;

-- AlterTable
ALTER TABLE "WorkExperience" DROP COLUMN "years",
ADD COLUMN     "years" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BotPersona";

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT,
    "companyProfileId" TEXT,
    "language" TEXT,
    "style" "AgentStyle",
    "tone" "AgentTone",
    "answerLength" "AnswerLength",
    "introPrompt" TEXT,
    "disclaimerText" TEXT,
    "customInstructions" TEXT,
    "name" TEXT,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgentDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AgentDocuments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_candidateProfileId_key" ON "Agent"("candidateProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_companyProfileId_key" ON "Agent"("companyProfileId");

-- CreateIndex
CREATE INDEX "_AgentDocuments_B_index" ON "_AgentDocuments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechStack" ADD CONSTRAINT "TechStack_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechStack" ADD CONSTRAINT "TechStack_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenAccessLog" ADD CONSTRAINT "TokenAccessLog_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenAccessLog" ADD CONSTRAINT "TokenAccessLog_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentDocuments" ADD CONSTRAINT "_AgentDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentDocuments" ADD CONSTRAINT "_AgentDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
