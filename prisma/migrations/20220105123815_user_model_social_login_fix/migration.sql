-- AlterTable
ALTER TABLE "User" ALTER COLUMN "socialLogin" DROP DEFAULT,
ALTER COLUMN "socialLogin" SET DATA TYPE TEXT;
