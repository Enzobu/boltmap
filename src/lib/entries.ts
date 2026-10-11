export type SearchableEntry = {
  code: string;
  name: string;
};

export function filterEntries<T extends SearchableEntry>(
  entries: readonly T[],
  query: string,
): T[] {
  const normalized = query.trim().toLocaleLowerCase();

  if (!normalized) {
    return [...entries];
  }

  return entries.filter((entry) => {
    return (
      entry.code.includes(normalized) ||
      entry.name.toLocaleLowerCase().includes(normalized)
    );
  });
}

export type ArchivableEntry = {
  archivedAt: string | null;
};

export function filterEntriesByArchiveState<T extends ArchivableEntry>(
  entries: readonly T[],
  archived: boolean,
): T[] {
  return entries.filter((entry) =>
    archived ? entry.archivedAt !== null : entry.archivedAt === null,
  );
}
