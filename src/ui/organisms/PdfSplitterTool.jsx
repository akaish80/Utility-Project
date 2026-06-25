import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import { saveFiles } from "../../utils/exportFile";
import ToolShell from "../atoms/ToolShell";
import "./PdfSplitterTool.scss";

export default function PdfSplitterTool() {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      setLoading(true);

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      const exports = [];

      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        exports.push({
          filename: `page-${i + 1}.pdf`,
          content: new Blob([pdfBytes], { type: "application/pdf" }),
        });
      }

      const result = await saveFiles(exports);

      if (result.method === "cancelled") {
        return;
      }

      alert(`PDF split into ${totalPages} files successfully!`);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("An error occurred while splitting the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="PDF Splitter"
      subtitle="Upload one PDF and export a separate file for each page."
    >
      <div className="pdf-splitter-controls">
        <label htmlFor="pdf-splitter-input" className="pdf-splitter-upload">
          Choose PDF
        </label>

        <input
          id="pdf-splitter-input"
          className="pdf-splitter-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        {loading && <p className="pdf-splitter-status">Processing PDF, please wait...</p>}
      </div>
    </ToolShell>
  );
}