import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function PdfSplitter() {
  const [loading, setLoading] = useState(false);

  // Handle file upload and splitting
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      setLoading(true);

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      // Loop through each page and create a new PDF
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `page-${i + 1}.pdf`);
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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>PDF Splitter</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>Processing PDF, please wait...</p>}
    </div>
  );
}
