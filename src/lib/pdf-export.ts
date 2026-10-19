import { jsPDF } from "jspdf";

export type PdfEntry = {
  code: string;
  name: string;
  quantity: number;
  notes: string | null;
};

export function downloadEntriesPdf(
  projectName: string,
  view: "active" | "archived",
  search: string,
  entries: readonly PdfEntry[],
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const left = 15;
  const right = 15;
  const usableWidth = pageWidth - left - right;
  const columns = [29, 63, 17, usableWidth - 109];
  const labels = ["Code", "Pièce / emplacement", "Qté", "Notes"];
  const padding = 2.7;
  let y = 0;

  function heading() {
    doc.setFillColor(217, 103, 43);
    doc.rect(left, 15, 2, 10, "F");
    doc.setTextColor(32, 36, 31);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("boltmap", left + 5, 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(125, 130, 122);
    doc.text("INVENTAIRE", pageWidth - right, 22, { align: "right" });

    doc.setTextColor(153, 96, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("RAPPORT DE PROJET", left, 35);

    doc.setTextColor(32, 36, 31);
    doc.setFontSize(17);
    const titleLines = doc.splitTextToSize(projectName, usableWidth);
    doc.text(titleLines, left, 44);

    const subtitleY = 44 + (titleLines.length - 1) * 7 + 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 110, 100);
    const subtitle = `${view === "active" ? "Entrées actives" : "Archives"} · ${entries.length} entrée(s)${search ? ` · Recherche : ${search}` : ""}`;
    const subtitleLines = doc.splitTextToSize(subtitle, usableWidth);
    doc.text(subtitleLines, left, subtitleY);
    doc.setFontSize(8);
    doc.text(`Édité le ${new Date().toLocaleDateString("fr-FR")}`, left, subtitleY + subtitleLines.length * 5 + 2);
    y = subtitleY + subtitleLines.length * 5 + 10;
  }

  function tableHead() {
    doc.setFillColor(240, 241, 237);
    doc.rect(left, y, usableWidth, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(60, 65, 57);
    let x = left;
    labels.forEach((label, index) => {
      doc.text(label, x + padding, y + 6.2);
      x += columns[index];
    });
    y += 10;
  }

  function nextPage() {
    doc.addPage();
    y = 19;
    tableHead();
  }

  heading();
  tableHead();

  entries.forEach((entry, index) => {
    const cells = [entry.code, entry.name, String(entry.quantity), entry.notes || "—"];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = cells.map((value, i) => doc.splitTextToSize(value, columns[i] - 2 * padding) as string[]);
    const lineHeight = 4.4;
    const height = Math.max(9, Math.max(...lines.map((cell) => cell.length)) * lineHeight + 5.5);

    if (y + height > pageHeight - 20) nextPage();
    if (index % 2 === 1) {
      doc.setFillColor(251, 251, 248);
      doc.rect(left, y, usableWidth, height, "F");
    }
    doc.setDrawColor(230, 233, 227);
    doc.line(left, y + height, left + usableWidth, y + height);

    let x = left;
    lines.forEach((cellLines, i) => {
      doc.setTextColor(32, 36, 31);
      doc.setFont("helvetica", i === 0 ? "bold" : "normal");
      doc.text(cellLines, x + padding, y + 5.6);
      x += columns[i];
    });
    y += height;
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(225, 228, 221);
    doc.line(left, pageHeight - 14, pageWidth - right, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(139, 143, 139);
    doc.text("boltmap · Inventaire du projet", left, pageHeight - 9);
    doc.text(`${page} / ${pages}`, pageWidth - right, pageHeight - 9, { align: "right" });
  }

  const filename = projectName.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 70) || "projet";
  doc.save(`boltmap-${filename}-${view === "active" ? "entrees" : "archives"}.pdf`);
}
