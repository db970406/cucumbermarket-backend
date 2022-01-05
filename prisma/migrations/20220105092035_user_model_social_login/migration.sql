-- AlterTable
ALTER TABLE "User" ADD COLUMN     "socialLogin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
