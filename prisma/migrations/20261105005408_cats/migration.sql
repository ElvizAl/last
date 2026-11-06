-- Reconstructed from the live database; see prisma/RECOVERY.md.
-- The foreign key is added after init creates users.
-- CreateEnum
CREATE TYPE "catGender" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "VaccineStatus" AS ENUM ('TIDAK_VAKSIN', 'VAKSIN');

-- CreateTable
CREATE TABLE "Cat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "catGender" NOT NULL DEFAULT 'LAKI_LAKI',
    "birthDate" TIMESTAMP(3),
    "breed" TEXT,
    "vaccineStatus" "VaccineStatus" NOT NULL DEFAULT 'VAKSIN',
    "healthHistory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Cat_pkey" PRIMARY KEY ("id")
);
