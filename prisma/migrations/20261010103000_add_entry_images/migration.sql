CREATE TABLE `EntryImage` (
  `id` VARCHAR(191) NOT NULL,
  `entryId` VARCHAR(191) NOT NULL,
  `storageKey` VARCHAR(255) NOT NULL,
  `mimeType` VARCHAR(64) NOT NULL,
  `size` INTEGER NOT NULL,
  `position` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `EntryImage_storageKey_key`(`storageKey`),
  INDEX `EntryImage_entryId_position_idx`(`entryId`, `position`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `EntryImage`
  ADD CONSTRAINT `EntryImage_entryId_fkey`
  FOREIGN KEY (`entryId`) REFERENCES `Entry`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
