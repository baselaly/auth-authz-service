/*
  Warnings:

  - You are about to drop the column `expiry` on the `blocked_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blocked_tokens" DROP COLUMN "expiry";
