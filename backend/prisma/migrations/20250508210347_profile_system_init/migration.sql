/*
  Warnings:

  - The primary key for the `CandidateProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `CandidateProfile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CandidateProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CandidateProfile` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `CandidateProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_candidateProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TechStack" DROP CONSTRAINT "TechStack_candidateProfileId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_candidateProfileId_fkey";

-- AlterTable
ALTER TABLE "CandidateProfile" DROP CONSTRAINT "CandidateProfile_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("profileId");

-- AlterTable
ALTER TABLE "TechStack" ADD COLUMN     "companyProfileId" TEXT,
ALTER COLUMN "candidateProfileId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "profileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "services" TEXT[],
    "teamSize" INTEGER NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("profileId")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isOneTime" BOOLEAN NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotPersona" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "style" TEXT,
    "language" TEXT,
    "introPrompt" TEXT,

    CONSTRAINT "BotPersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatLog" (
    "id" TEXT NOT NULL,
    "botPersonaId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "BotPersona_profileId_key" ON "BotPersona"("profileId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechStack" ADD CONSTRAINT "TechStack_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechStack" ADD CONSTRAINT "TechStack_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotPersona" ADD CONSTRAINT "BotPersona_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_botPersonaId_fkey" FOREIGN KEY ("botPersonaId") REFERENCES "BotPersona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
