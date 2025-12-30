-- AlterTable
ALTER TABLE `user` ADD COLUMN `passwordChangedAt` DATETIME(3) NULL,
    ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);
