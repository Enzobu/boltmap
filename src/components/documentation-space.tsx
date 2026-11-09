"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FileText, Image as ImageIcon, Plus, Search, Trash2, X, Pencil, Upload } from "lucide-react";

type DocumentFile = { id: string; name: string; mimeType: string; size: number; position: number };
type ProjectDocument = {
  id: string; code: string; title: string; notes: string | null;
  projectId: string; createdAt: string; updatedAt: string; files: DocumentFile[];
};

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Action impossible.");
  return data;
}

export function DocumentationSpace({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProjectDocument | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setQuery("");
    setSelected(null);
    setCreating(false);
    void requestJson<{ documents: ProjectDocument[] }>(
      `/api/projects/${projectId}/documents`, { signal: controller.signal },
    ).then((data) => {
      if (!controller.signal.aborted) setDocuments(data.documents);
    }).catch((caught) => {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Chargement impossible.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [projectId]);

  function saveDocument(document: ProjectDocument) {
    setDocuments((current) => {
      const exists = current.some((item) => item.id === document.id);
      return exists ? current.map((item) => item.id === document.id ? document : item) : [document, ...current];
    });
    setSelected(document);
    setCreating(false);
  }

  const matches = documents.filter((document) => {
    const needle = query.trim().toLocaleLowerCase();
    return !needle || document.code.toLocaleLowerCase().includes(needle) ||
      document.title.toLocaleLowerCase().includes(needle) ||
      (document.notes ?? "").toLocaleLowerCase().includes(needle);
  });

  return (
    <div className="documentation-space">
      <div className="documentation-space__toolbar">
        <label className="search-field documentation-space__search">
          <Search size={16} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un code, un titre ou une note…"
            aria-label="Rechercher dans la documentation" />
        </label>
        <button type="button" className="button button--primary" onClick={() => setCreating(true)}>
          <Plus size={16} /> Nouveau document
        </button>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {loading ? (
        <div className="table-skeleton">Chargement de la documentation…</div>
      ) : documents.length === 0 ? (
        <div className="empty-state empty-state--compact">
          <FileText size={27} />
          <h2>Pas encore de documentation.</h2>
          <p>Enregistre un schéma, des photos ou un PDF. Note ensuite son code de trois lettres sur ta boîte.</p>
          <button type="button" className="button button--primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Créer le premier document
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-search">Aucun document pour « {query} ».</div>
      ) : (
        <div className="documentation-space__grid">
          {matches.map((document) => (
            <button key={document.id} type="button" className="documentation-card"
              onClick={() => setSelected(document)}>
              <span className="documentation-card__code">{document.code}</span>
              <span className="documentation-card__main">
                <strong>{document.title}</strong>
                <small>{document.files.length} fichier{document.files.length !== 1 ? "s" : ""}</small>
              </span>
              {document.files.length > 0 && document.files[0].mimeType.startsWith("image/") ? (
                <img src={`/api/document-files/${document.files[0].id}`} alt="" className="documentation-card__thumbnail" />
              ) : <FileText size={18} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}

      {creating || selected ? (
        <DocumentDialog
          key={selected?.id ?? "new"}
          projectId={projectId}
          document={selected}
          onClose={() => { setSelected(null); setCreating(false); }}
          onSave={saveDocument}
          onDelete={(id) => {
            setDocuments((current) => current.filter((document) => document.id !== id));
            setSelected(null);
          }}
        />
      ) : null}
    </div>
  );
}

function DocumentDialog({
  projectId, document, onClose, onSave, onDelete,
}: {
  projectId: string;
  document: ProjectDocument | null;
  onClose: () => void;
  onSave: (document: ProjectDocument) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(document?.title ?? "");
  const [notes, setNotes] = useState(document?.notes ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [editing, setEditing] = useState(!document);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removeFileId, setRemoveFileId] = useState<string | null>(null);
  const [zoomId, setZoomId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const url = document ? `/api/documents/${document.id}` : `/api/projects/${projectId}/documents`;
      const { document: saved } = await requestJson<{ document: ProjectDocument }>(url, {
        method: document ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, notes }),
      });
      if (files.length > 0) {
        const payload = new FormData();
        files.forEach((file) => payload.append("files", file));
        const uploaded = await requestJson<{ files: DocumentFile[] }>(`/api/documents/${saved.id}/files`, {
          method: "POST", body: payload,
        });
        saved.files = uploaded.files;
      }
      onSave(saved);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Enregistrement impossible.");
    } finally {
      setPending(false);
    }
  }

  async function deleteDocument() {
    if (!document) return;
    setPending(true);
    setError("");
    try {
      await requestJson(`/api/documents/${document.id}`, { method: "DELETE" });
      onDelete(document.id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Suppression impossible.");
      setPending(false);
    }
  }

  async function deleteFile() {
    if (!document || !removeFileId) return;
    setPending(true);
    setError("");
    try {
      await requestJson(`/api/document-files/${removeFileId}`, { method: "DELETE" });
      onSave({ ...document, files: document.files.filter((file) => file.id !== removeFileId) });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Suppression impossible.");
    } finally {
      setPending(false);
      setRemoveFileId(null);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={pending ? undefined : onClose}>
      <section className="modal documentation-dialog" role="dialog" aria-modal="true"
        aria-labelledby="document-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2 id="document-dialog-title">{document ? `Document · ${document.code}` : "Nouveau document"}</h2>
          <button type="button" className="icon-button" aria-label="Fermer" disabled={pending} onClick={onClose}>
            <X size={17} />
          </button>
        </div>
        <div className="modal__body documentation-dialog__body">
          {document ? <div className="documentation-dialog__code">
            <span>Code à écrire sur la boîte</span><strong>{document.code}</strong>
          </div> : null}
          {editing ? (
            <form className="form-stack" onSubmit={(event) => void submit(event)}>
              <label className="field">
                <span>Titre</span>
                <input autoFocus required maxLength={180} value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Position des soupapes de la culasse" />
              </label>
              <label className="field">
                <span>Notes</span>
                <textarea rows={4} maxLength={4000} value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Soupapes numérotées de 1 à 16, côté distribution…" />
              </label>
              <label className="field">
                <span>Fichiers (PDF, JPEG, PNG, WebP · 15 Mo/fichier · 10 maximum)</span>
                <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" multiple
                  onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
              </label>
              {error ? <p className="form-error" role="alert">{error}</p> : null}
              <div className="modal__actions">
                <button type="button" className="button button--quiet" onClick={document ? () => setEditing(false) : onClose}>Annuler</button>
                <button type="submit" className="button button--primary" disabled={pending || !title.trim() ||
                  files.length + (document?.files.length ?? 0) > 10}>
                  {pending ? "Enregistrement…" : document ? "Enregistrer" : "Créer le document"}
                </button>
              </div>
            </form>
          ) : document ? (
            <>
              <h3 className="documentation-dialog__title">{document.title}</h3>
              {document.notes ? <p className="documentation-dialog__notes">{document.notes}</p> : null}
              <div className="documentation-dialog__files">
                <strong>Fichiers · {document.files.length}</strong>
                {document.files.map((file) => (
                  <div className="documentation-dialog__file" key={file.id}>
                    {file.mimeType.startsWith("image/") ? (
                      <button type="button" className="documentation-dialog__preview"
                        data-zoomed={zoomId === file.id || undefined}
                        aria-label={zoomId === file.id ? "Réduire l'image" : "Agrandir l'image"}
                        onClick={() => setZoomId((current) => current === file.id ? null : file.id)}>
                        <img src={`/api/document-files/${file.id}`} alt={file.name} />
                      </button>
                    ) : (
                      <a href={`/api/document-files/${file.id}`} target="_blank" rel="noreferrer"
                        className="documentation-dialog__pdf"><FileText size={18} /> Ouvrir le PDF</a>
                    )}
                    <span className="documentation-dialog__filename">{file.name}</span>
                    <button type="button" className="icon-button" title="Supprimer ce fichier"
                      aria-label={`Supprimer ${file.name}`} onClick={() => setRemoveFileId(file.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {document.files.length === 0 ? <p className="muted">Aucun fichier joint.</p> : null}
              </div>
              {confirmDelete ? (
                <div className="documentation-dialog__confirm">
                  <p>Supprimer définitivement le document {document.code} et tous ses fichiers ?</p>
                  <button type="button" className="button button--quiet" onClick={() => setConfirmDelete(false)}>Annuler</button>
                  <button type="button" className="button button--danger" disabled={pending} onClick={() => void deleteDocument()}>
                    Confirmer la suppression
                  </button>
                </div>
              ) : null}
              {removeFileId ? (
                <div className="documentation-dialog__confirm">
                  <p>Supprimer définitivement ce fichier ?</p>
                  <button type="button" className="button button--quiet" onClick={() => setRemoveFileId(null)}>Annuler</button>
                  <button type="button" className="button button--danger" disabled={pending} onClick={() => void deleteFile()}>Supprimer le fichier</button>
                </div>
              ) : null}
              {error ? <p className="form-error" role="alert">{error}</p> : null}
              <div className="modal__actions documentation-dialog__actions">
                <button type="button" className="button button--danger" onClick={() => setConfirmDelete(true)}>
                  <Trash2 size={15} /> Supprimer
                </button>
                <button type="button" className="button button--primary" onClick={() => setEditing(true)}>
                  <Pencil size={15} /> Modifier / ajouter des fichiers
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
