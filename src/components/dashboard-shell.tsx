"use client";

import {
  Bolt,
  Check,
  ChevronRight,
  Clipboard,
  FolderPlus,
  Images,
  Camera,
  LogOut,
  Menu,
  MoreHorizontal,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { filterEntries } from "@/lib/entries";

type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: { entries: number };
};

type Entry = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  notes: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  images: Array<{ id: string; position: number }>;
};

type EntryFormPayload = {
  name: string;
  quantity: number;
  notes: string;
  images: File[];
  deletedImageIds: string[];
};

type ModalState =
  | { type: "new-project" }
  | { type: "rename-project"; project: Project }
  | { type: "delete-project"; project: Project }
  | { type: "new-entry" }
  | { type: "edit-entry"; entry: Entry }
  | { type: "gallery-entry"; entry: Entry }
  | { type: "delete-entry"; entry: Entry }
  | null;

async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init);
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Une erreur est survenue.");
  }

  return data;
}

async function uploadEntryImages(
  entryId: string,
  images: readonly File[],
): Promise<Array<{ id: string; position: number }>> {
  if (images.length === 0) {
    return [];
  }

  const formData = new FormData();
  images.forEach((image) => formData.append("images", image));

  const data = await requestJson<{
    images: Array<{ id: string; position: number }>;
  }>(`/api/entries/${entryId}/images`, {
    method: "POST",
    body: formData,
  });

  return data.images;
}

export function DashboardShell({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [notice, setNotice] = useState<Entry | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;

  const visibleEntries = useMemo(
    () => filterEntries(entries, query),
    [entries, query],
  );

  async function loadProjects() {
    setError("");

    try {
      const data = await requestJson<{ projects: Project[] }>("/api/projects");
      setProjects(data.projects);
      setActiveProjectId((current) => {
        if (current && data.projects.some((project) => project.id === current)) {
          return current;
        }
        return data.projects[0]?.id ?? "";
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chargement impossible.");
    } finally {
      setLoadingProjects(false);
    }
  }

  async function loadEntries(projectId: string) {
    if (!projectId) {
      setEntries([]);
      return;
    }

    setLoadingEntries(true);
    setError("");

    try {
      const data = await requestJson<{ entries: Entry[] }>(
        `/api/projects/${projectId}/entries`,
      );
      setEntries(data.entries);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chargement impossible.");
    } finally {
      setLoadingEntries(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    setQuery("");
    setNotice(null);
    void loadEntries(activeProjectId);
  }, [activeProjectId]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
  }

  function updateProjectCount(delta: number) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              _count: {
                entries: Math.max(0, project._count.entries + delta),
              },
            }
          : project,
      ),
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" data-open={sidebarOpen || undefined}>
        <div className="sidebar__top">
          <button
            className="brand brand--button"
            type="button"
            onClick={() => setSidebarOpen(false)}
          >
            <Bolt size={18} strokeWidth={2.2} aria-hidden="true" />
            boltmap
          </button>
          <button
            className="icon-button sidebar__close"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__heading">
            <span>Projets</span>
            <button
              className="icon-button"
              type="button"
              onClick={() => setModal({ type: "new-project" })}
              aria-label="Nouveau projet"
              title="Nouveau projet"
            >
              <Plus size={16} />
            </button>
          </div>

          <nav className="project-list" aria-label="Projets">
            {loadingProjects ? (
              <span className="sidebar__muted">Chargement…</span>
            ) : projects.length === 0 ? (
              <button
                className="empty-project"
                type="button"
                onClick={() => setModal({ type: "new-project" })}
              >
                <FolderPlus size={17} />
                Créer ton premier projet
              </button>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="project-item"
                  data-active={project.id === activeProjectId || undefined}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="project-item__name">{project.name}</span>
                  <span className="project-item__count">
                    {project._count.entries}
                  </span>
                </button>
              ))
            )}
          </nav>
        </div>

        <div className="sidebar__footer">
          <ThemeSwitch />
          <div className="account-row">
            <span title={userEmail}>{userEmail}</span>
            <button
              className="icon-button"
              type="button"
              onClick={logout}
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="workspace">
        <header className="workspace__header">
          <button
            className="icon-button mobile-menu"
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={19} />
          </button>

          <div className="workspace__title">
            <span className="eyebrow">Projet</span>
            <h1>{activeProject?.name ?? "Boltmap"}</h1>
          </div>

          {activeProject ? (
            <div className="header-actions">
              <button
                className="button button--quiet hide-mobile"
                type="button"
                onClick={() =>
                  setModal({ type: "rename-project", project: activeProject })
                }
              >
                <Pencil size={15} />
                Renommer
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={() =>
                  setModal({ type: "delete-project", project: activeProject })
                }
                aria-label="Supprimer le projet"
                title="Supprimer le projet"
              >
                <Trash2 size={16} />
              </button>
              <button
                className="button button--primary"
                type="button"
                onClick={() => setModal({ type: "new-entry" })}
              >
                <Plus size={16} />
                <span className="hide-mobile">Ajouter</span>
              </button>
            </div>
          ) : null}
        </header>

        <section className="workspace__content">
          {error ? (
            <div className="alert alert--error">
              {error}
              <button type="button" onClick={() => setError("")}>
                <X size={15} />
              </button>
            </div>
          ) : null}

          {notice ? (
            <div className="code-notice">
              <div>
                <span className="code-notice__label">Code généré</span>
                <strong>{notice.code}</strong>
                <span className="code-notice__name">{notice.name}</span>
              </div>
              <button
                className="button button--quiet"
                type="button"
                onClick={() => void copyCode(notice.code)}
              >
                <Clipboard size={15} />
                Copier
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={() => setNotice(null)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          ) : null}

          {!activeProject ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <FolderPlus size={23} />
              </div>
              <h2>Crée un projet pour commencer.</h2>
              <p>
                Par exemple « Remplacement moteur Focus ». Chaque projet garde ses
                propres codes et sa propre visserie.
              </p>
              <button
                className="button button--primary"
                type="button"
                onClick={() => setModal({ type: "new-project" })}
              >
                <Plus size={16} />
                Nouveau projet
              </button>
            </div>
          ) : (
            <>
              <div className="toolbar">
                <label className="search-field">
                  <Search size={17} aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un code ou une pièce…"
                    aria-label="Rechercher un code ou une pièce"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Effacer la recherche"
                    >
                      <X size={15} />
                    </button>
                  ) : null}
                </label>
                <span className="result-count">
                  {visibleEntries.length}{" "}
                  {visibleEntries.length > 1 ? "entrées" : "entrée"}
                </span>
              </div>

              {loadingEntries ? (
                <div className="table-skeleton">Chargement des entrées…</div>
              ) : entries.length === 0 ? (
                <div className="empty-state empty-state--compact">
                  <div className="empty-state__icon">
                    <PackagePlus size={23} />
                  </div>
                  <h2>Aucune boîte enregistrée.</h2>
                  <p>Démonte, range, ajoute l’entrée, puis note le code sur la boîte.</p>
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => setModal({ type: "new-entry" })}
                  >
                    <Plus size={16} />
                    Ajouter la première
                  </button>
                </div>
              ) : visibleEntries.length === 0 ? (
                <div className="empty-search">
                  Aucun résultat pour « {query} ».
                </div>
              ) : (
                <div className="entries">
                  <div className="entries__head">
                    <span>Code</span>
                    <span>Pièce / emplacement</span>
                    <span>Qté</span>
                    <span>Notes</span>
                    <span aria-hidden="true" />
                  </div>

                  {visibleEntries.map((entry) => (
                    <article className="entry-row" key={entry.id}>
                      <button
                        className="code-chip"
                        type="button"
                        onClick={() => void copyCode(entry.code)}
                        title="Copier le code"
                      >
                        {entry.code}
                      </button>
                      <div className="entry-row__name">{entry.name}</div>
                      <div className="entry-row__quantity">×{entry.quantity}</div>
                      <div className="entry-row__notes">
                        {entry.notes || <span className="muted">—</span>}
                      </div>
                      <div className="entry-row__actions">
                        {entry.images.length > 0 ? (
                          <button
                            className="image-count-button"
                            type="button"
                            onClick={() => setModal({ type: "gallery-entry", entry })}
                            aria-label={`Voir ${entry.images.length} photo(s) de ${entry.name}`}
                            title="Voir les photos"
                          >
                            <Images size={15} />
                            {entry.images.length}
                          </button>
                        ) : null}
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() => setModal({ type: "edit-entry", entry })}
                          aria-label={`Modifier ${entry.name}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() => setModal({ type: "delete-entry", entry })}
                          aria-label={`Supprimer ${entry.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {modal?.type === "new-project" ? (
        <ProjectModal
          title="Nouveau projet"
          submitLabel="Créer le projet"
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            const data = await requestJson<{ project: Project }>("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
            setProjects((current) => [data.project, ...current]);
            setActiveProjectId(data.project.id);
            setModal(null);
          }}
        />
      ) : null}

      {modal?.type === "rename-project" ? (
        <ProjectModal
          title="Renommer le projet"
          submitLabel="Enregistrer"
          initialName={modal.project.name}
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            const data = await requestJson<{ project: Project }>(
              `/api/projects/${modal.project.id}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
              },
            );
            setProjects((current) =>
              current.map((project) =>
                project.id === data.project.id ? data.project : project,
              ),
            );
            setModal(null);
          }}
        />
      ) : null}

      {modal?.type === "delete-project" ? (
        <ConfirmModal
          title="Supprimer ce projet ?"
          body={`« ${modal.project.name} » et toutes ses entrées seront supprimés définitivement.`}
          confirmLabel="Supprimer le projet"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            await requestJson(`/api/projects/${modal.project.id}`, {
              method: "DELETE",
            });
            const remaining = projects.filter(
              (project) => project.id !== modal.project.id,
            );
            setProjects(remaining);
            setActiveProjectId(remaining[0]?.id ?? "");
            setModal(null);
          }}
        />
      ) : null}

      {modal?.type === "new-entry" && activeProject ? (
        <EntryModal
          title="Ajouter une entrée"
          submitLabel="Générer le code"
          onClose={() => setModal(null)}
          onSubmit={async (payload) => {
            const { images, deletedImageIds: _deletedImageIds, ...entryPayload } = payload;
            const data = await requestJson<{ entry: Entry }>(
              `/api/projects/${activeProject.id}/entries`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entryPayload),
              },
            );

            try {
              const uploadedImages = await uploadEntryImages(data.entry.id, images);
              const entry = { ...data.entry, images: uploadedImages };
              setEntries((current) => [entry, ...current]);
              updateProjectCount(1);
              setNotice(entry);
              setModal(null);
            } catch (caught) {
              await requestJson(`/api/entries/${data.entry.id}`, {
                method: "DELETE",
              }).catch(() => undefined);
              throw caught;
            }
          }}
        />
      ) : null}

      {modal?.type === "edit-entry" ? (
        <EntryModal
          title={`Modifier ${modal.entry.code}`}
          submitLabel="Enregistrer"
          entry={modal.entry}
          onClose={() => setModal(null)}
          onSubmit={async (payload) => {
            const { images, deletedImageIds, ...entryPayload } = payload;
            const data = await requestJson<{ entry: Entry }>(
              `/api/entries/${modal.entry.id}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entryPayload),
              },
            );

            await Promise.all(
              deletedImageIds.map((imageId) =>
                requestJson(`/api/images/${imageId}`, { method: "DELETE" }),
              ),
            );

            const uploadedImages = await uploadEntryImages(modal.entry.id, images);
            const deletedIds = new Set(deletedImageIds);
            const retainedImages = data.entry.images.filter(
              (image) => !deletedIds.has(image.id),
            );
            const entry = {
              ...data.entry,
              images: uploadedImages.length > 0 ? uploadedImages : retainedImages,
            };

            setEntries((current) =>
              current.map((currentEntry) =>
                currentEntry.id === entry.id ? entry : currentEntry,
              ),
            );
            setModal(null);
          }}
        />
      ) : null}

      {modal?.type === "gallery-entry" ? (
        <GalleryModal entry={modal.entry} onClose={() => setModal(null)} />
      ) : null}

      {modal?.type === "delete-entry" ? (
        <ConfirmModal
          title={`Supprimer ${modal.entry.code} ?`}
          body={`L’entrée « ${modal.entry.name} » sera supprimée. Le code pourra être réattribué plus tard.`}
          confirmLabel="Supprimer l’entrée"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            await requestJson(`/api/entries/${modal.entry.id}`, {
              method: "DELETE",
            });
            setEntries((current) =>
              current.filter((entry) => entry.id !== modal.entry.id),
            );
            updateProjectCount(-1);
            setModal(null);
          }}
        />
      ) : null}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ProjectModal({
  title,
  submitLabel,
  initialName = "",
  onSubmit,
  onClose,
}: {
  title: string;
  submitLabel: string;
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      await onSubmit(String(formData.get("name") ?? ""));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Action impossible.");
      setPending(false);
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="modal__body form-stack" onSubmit={submit}>
        <label className="field">
          <span>Nom du projet</span>
          <input
            name="name"
            required
            maxLength={120}
            autoFocus
            defaultValue={initialName}
            placeholder="Remplacement moteur Focus"
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="modal__actions">
          <button className="button button--quiet" type="button" onClick={onClose}>
            Annuler
          </button>
          <button className="button button--primary" disabled={pending}>
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EntryModal({
  title,
  submitLabel,
  entry,
  onSubmit,
  onClose,
}: {
  title: string;
  submitLabel: string;
  entry?: Entry;
  onSubmit: (payload: EntryFormPayload) => Promise<void>;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const selectedPreviews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedPreviews]);

  const existingImages =
    entry?.images.filter((image) => !deletedImageIds.includes(image.id)) ?? [];
  const imageCount = existingImages.length + selectedFiles.length;

  function addImages(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (incoming.length === 0) {
      return;
    }

    const remaining = 10 - imageCount;

    if (remaining <= 0 || incoming.length > remaining) {
      setError("Maximum 10 images par entrée.");
      return;
    }

    setError("");
    setSelectedFiles((current) => [...current, ...incoming]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      await onSubmit({
        name: String(formData.get("name") ?? ""),
        quantity: Number(formData.get("quantity") ?? 1),
        notes: String(formData.get("notes") ?? ""),
        images: selectedFiles,
        deletedImageIds,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Action impossible.");
      setPending(false);
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="modal__body form-stack" onSubmit={submit}>
        <label className="field">
          <span>Pièce / emplacement</span>
          <input
            name="name"
            required
            maxLength={180}
            autoFocus
            defaultValue={entry?.name ?? ""}
            placeholder="Cache sous berceau"
          />
        </label>

        <label className="field field--small">
          <span>Quantité</span>
          <input
            name="quantity"
            type="number"
            min={1}
            max={9999}
            required
            defaultValue={entry?.quantity ?? 1}
          />
        </label>

        <label className="field">
          <span>Notes <em>optionnel</em></span>
          <textarea
            name="notes"
            rows={3}
            maxLength={4000}
            defaultValue={entry?.notes ?? ""}
            placeholder="Vis longue côté passager, 2 clips…"
          />
        </label>

        <div className="photo-field">
          <div className="photo-field__heading">
            <span>Photos <em>optionnel</em></span>
            <span>{imageCount}/10</span>
          </div>

          <input
            ref={galleryInputRef}
            className="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={addImages}
          />
          <input
            ref={cameraInputRef}
            className="file-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={addImages}
          />

          <div className="photo-actions">
            <button
              className="button button--quiet"
              type="button"
              disabled={imageCount >= 10}
              onClick={() => galleryInputRef.current?.click()}
            >
              <Images size={15} />
              Ajouter
            </button>
            <button
              className="button button--quiet"
              type="button"
              disabled={imageCount >= 10}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={15} />
              Prendre une photo
            </button>
          </div>

          {imageCount > 0 ? (
            <div className="photo-previews">
              {existingImages.map((image) => (
                <div className="photo-preview" key={image.id}>
                  <img src={`/api/images/${image.id}`} alt="" />
                  <button
                    type="button"
                    onClick={() =>
                      setDeletedImageIds((current) => [...current, image.id])
                    }
                    aria-label="Supprimer cette photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {selectedPreviews.map((preview) => (
                <div className="photo-preview" key={preview.url}>
                  <img src={preview.url} alt="" />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles((current) =>
                        current.filter((file) => file !== preview.file),
                      )
                    }
                    aria-label="Retirer cette photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="photo-field__hint">
              Jusqu’à 10 JPEG, PNG ou WebP · 10 Mo max par image.
            </p>
          )}
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="modal__actions">
          <button className="button button--quiet" type="button" onClick={onClose}>
            Annuler
          </button>
          <button className="button button--primary" disabled={pending}>
            {submitLabel}
            <ChevronRight size={15} />
          </button>
        </div>
      </form>
    </Modal>
  );
}

function GalleryModal({
  entry,
  onClose,
}: {
  entry: Entry;
  onClose: () => void;
}) {
  return (
    <Modal title={`Photos · ${entry.code}`} onClose={onClose}>
      <div className="modal__body">
        <div className="gallery-grid">
          {entry.images.map((image, index) => (
            <a
              key={image.id}
              href={`/api/images/${image.id}`}
              target="_blank"
              rel="noreferrer"
              className="gallery-image"
              aria-label={`Ouvrir la photo ${index + 1}`}
            >
              <img src={`/api/images/${image.id}`} alt="" />
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ConfirmModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Modal title={title} onClose={onClose}>
      <div className="modal__body">
        <p className="modal__copy">{body}</p>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="modal__actions">
          <button className="button button--quiet" type="button" onClick={onClose}>
            Annuler
          </button>
          <button
            className="button button--danger"
            type="button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              setError("");
              try {
                await onConfirm();
              } catch (caught) {
                setError(
                  caught instanceof Error ? caught.message : "Action impossible.",
                );
                setPending(false);
              }
            }}
          >
            <Trash2 size={15} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
