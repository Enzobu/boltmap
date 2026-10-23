-- Keep physical labels intact: if a code is already used in multiple projects,
-- this unique index fails rather than silently changing any stored code.
CREATE UNIQUE INDEX `Entry_code_key` ON `Entry`(`code`);

-- The global constraint supersedes the old per-project unique index.
DROP INDEX `Entry_projectId_code_key` ON `Entry`;
