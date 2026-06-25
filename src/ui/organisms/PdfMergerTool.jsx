import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

import { saveFile } from "../../utils/exportFile";
import ToolShell from "../atoms/ToolShell";
import "./PdfMergerTool.scss";

export default function PdfMergerTool() {
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const createFileEntry = (file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID?.() ?? Date.now()}`,
    file,
    name: file.name,
  });

  const createMergedPdf = async (orderedFiles) => {
    const mergedPdf = await PDFDocument.create();

    for (const { file } of orderedFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return mergedPdf.save();
  };

  const syncPreview = async (orderedFiles) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    if (orderedFiles.length === 0) {
      return;
    }

    const pdfBytes = await createMergedPdf(orderedFiles);
    const nextPreviewUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    setPreviewUrl(nextPreviewUrl);
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      event.target.value = "";
      return;
    }

    const hasInvalidFile = files.some((file) => file.type !== "application/pdf");
    if (hasInvalidFile) {
      alert("Please upload only valid PDF files.");
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);
      const selectedFiles = files.map(createFileEntry);

      setFiles(selectedFiles);

      await syncPreview(selectedFiles);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while preparing the PDF preview.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const moveFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= files.length || fromIndex === toIndex) {
      return;
    }

    const nextFiles = [...files];
    const [movedFile] = nextFiles.splice(fromIndex, 1);
    nextFiles.splice(toIndex, 0, movedFile);

    setFiles(nextFiles);
    void syncPreview(nextFiles);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) {
      return;
    }

    moveFile(draggedIndex, index);
    setDraggedIndex(null);
  };

  const handlePreview = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    try {
      setLoading(true);
      await syncPreview(files);
    } catch (error) {
      console.error("Error creating PDF preview:", error);
      alert("An error occurred while creating the PDF preview.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    try {
      setLoading(true);
      const pdfBytes = await createMergedPdf(files);
      const result = await saveFile("merged.pdf", new Blob([pdfBytes], { type: "application/pdf" }));

      if (result.method === "cancelled") {
        return;
      }

      alert(
        result.method === "folder"
          ? "PDF files merged successfully and saved to the selected folder!"
          : "PDF files merged successfully!"
      );
    } catch (error) {
      console.error("Error exporting PDFs:", error);

      alert("An error occurred while exporting the merged PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFiles([]);
    setPreviewUrl("");
    setDraggedIndex(null);
  };

  return (
    <ToolShell
      title="PDF Merger"
      subtitle="Upload files, reorder them, preview the merged PDF, and export the result."
      actions={
        <label htmlFor="pdf-merger-input" className="pdf-merger-upload">
          Choose PDFs
        </label>
      }
    >
      <input
        id="pdf-merger-input"
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />

      {loading && <p className="pdf-merger-status">Processing PDFs, please wait...</p>}

      {files.length > 0 && (
        <div className="pdf-merger-layout">
          <div className="pdf-merger-list-panel">
            <div className="pdf-merger-panel-header">
              <h3>Arrange order</h3>
              <button type="button" className="pdf-merger-secondary" onClick={handleReset}>
                Clear
              </button>
            </div>

            <ul className="pdf-merger-list">
              {files.map((entry, index) => (
                <li
                  key={entry.id}
                  className="pdf-merger-item"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <span className="pdf-merger-position">{index + 1}</span>
                  <span className="pdf-merger-name" title={entry.name}>
                    {entry.name}
                  </span>

                  <div className="pdf-merger-actions">
                    <button
                      type="button"
                      onClick={() => moveFile(index, index - 1)}
                      disabled={index === 0}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFile(index, index + 1)}
                      disabled={index === files.length - 1}
                    >
                      Down
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pdf-merger-controls">
              <button type="button" onClick={handlePreview} disabled={loading || files.length < 2}>
                {loading ? "Working..." : "Refresh Preview"}
              </button>
              <button type="button" onClick={handleExport} disabled={loading || files.length < 2}>
                Choose Folder & Export PDF
              </button>
            </div>

            <p className="pdf-merger-hint">
              Export opens a folder picker when supported, then drops <strong>merged.pdf</strong> into the chosen folder.
            </p>
          </div>

          <div className="pdf-merger-preview-panel">
            <div className="pdf-merger-panel-header">
              <h3>Preview</h3>
              <span>{files.length} file{files.length === 1 ? "" : "s"}</span>
            </div>

            {previewUrl ? (
              <iframe
                title="Merged PDF preview"
                src={previewUrl}
                className="pdf-merger-preview"
              />
            ) : (
              <div className="pdf-merger-empty">
                Click Refresh Preview to view the merged PDF here.
              </div>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}