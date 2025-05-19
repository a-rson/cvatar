/*
  Warnings:

  - Added the required column `name` to the `CandidateProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "name" TEXT NOT NULL;
