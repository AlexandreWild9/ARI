/*
  Warnings:

  - You are about to drop the column `dt_fim` on the `Prescricao` table. All the data in the column will be lost.
  - Added the required column `horario_notificacao` to the `Prescricao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prescricao" DROP COLUMN "dt_fim",
ADD COLUMN     "horario_notificacao" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "frequencia" SET DATA TYPE TEXT;
