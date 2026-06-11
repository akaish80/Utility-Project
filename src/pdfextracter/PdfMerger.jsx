import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function PdfMerger() {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    const hasInvalidFile = files.some((file) => file.type !== "application/pdf");
    if (hasInvalidFile) {
      alert("Please upload only valid PDF files.");
      return;
    }

    try {
      setLoading(true);

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageIndices = pdfDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);

        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "merged.pdf");
      alert("PDF files merged successfully!");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging the PDF files.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>PDF Merger</h2>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
      {loading && <p>Processing PDFs, please wait...</p>}
    </div>
  );
}