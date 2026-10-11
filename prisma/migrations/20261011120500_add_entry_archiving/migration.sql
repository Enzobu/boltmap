ALTER TABLE `Entry`
  ADD COLUMN `archivedAt` DATETIME(3) NULL;

CREATE INDEX `Entry_projectId_archivedAt_idx`
  ON `Entry`(`projectId`, `archivedAt`);
