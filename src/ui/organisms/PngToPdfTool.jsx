import { useEffect, useState } from "react";

import { convertImageToPdf } from "../../utils/convertPng";
import { saveFile } from "../../utils/exportFile";
import ToolShell from "../atoms/ToolShell";

import "./PngToPdfTool.scss";

export default function PngToPdfTool() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfBytes, setPdfBytes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFileChange = ({ target }) => {
    const selected = target.files?.[0];

    setError("");

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }

    setPdfBytes(null);

    if (!selected) {
      setFile(null);
      return;
    }

    if (!selected.type.startsWith("image/")) {
      setFile(null);
      setError("Please upload an image file.");
      return;
    }

    setFile(selected);
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please choose an image file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }

      const nextBytes = await convertImageToPdf(file);
      setPdfBytes(nextBytes);
      const nextUrl = URL.createObjectURL(
        new Blob([nextBytes], { type: "application/pdf" })
      );

      setPdfUrl(nextUrl);
    } catch (err) {
      console.error(err);
      setError("Could not convert this image to PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    setFile(null);
    setPdfUrl("");
    setPdfBytes(null);
    setError("");
  };

  const handleExport = async () => {
    if (!file || !pdfBytes) {
      setError("Please convert an image first.");
      return;
    }

    try {
      setError("");

      const result = await saveFile(
        `${file.name.replace(/\.[^.]+$/, "")}.pdf`,
        new Blob([pdfBytes], { type: "application/pdf" })
      );

      if (result.method === "cancelled") {
        return;
      }

      if (result.method === "folder") {
        alert("PDF saved to the selected folder successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Could not export the PDF.");
    }
  };

  return (
    <ToolShell
      title="Image to PDF"
      subtitle="Convert any image into a downloadable PDF file."
    >
      <div className="png-pdf-controls">
        <label htmlFor="png-pdf-input" className="png-pdf-upload">
          Choose Image
        </label>

        <input
          id="png-pdf-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <span className="png-pdf-file">
          {file?.name ?? "No file selected"}
        </span>

        <button onClick={handleConvert} disabled={!file || loading}>
          {loading ? "Converting..." : "Convert to PDF"}
        </button>

        <button className="png-pdf-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {error && <p className="png-pdf-error">{error}</p>}

      {pdfUrl && (
        <div className="png-pdf-output-wrap">
          <button className="png-pdf-download" onClick={handleExport}>
            Choose Folder & Export PDF
          </button>
        </div>
      )}
    </ToolShell>
  );
}