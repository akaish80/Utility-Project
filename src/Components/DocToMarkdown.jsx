import { useState } from "react";
import { GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { convertPdf } from "../utils/convertPdf";
import { convertDocx } from "../utils/convertDocx";
import {
  sanitizeText,
  buildMarkdown,
} from "../utils/buildMarkdown";
import { downloadFile } from "../utils/downloadFile";

import "./DocToMarkdown.css";

GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const CONVERTERS = {
  "application/pdf": {
    type: "pdf",
    convert: convertPdf,
  },
  [DOCX_TYPE]: {
    type: "docx",
    convert: convertDocx,
  },
};

export default function DocToMarkdown() {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = ({ target }) => {
    const selected = target.files?.[0];

    setError("");
    setMarkdown("");
    setCopied(false);

    if (!selected) {
      setFile(null);
      return;
    }

    if (!CONVERTERS[selected.type]) {
      setFile(null);
      setError("Please upload a PDF or DOCX file.");
      return;
    }

    setFile(selected);
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const converter = CONVERTERS[file.type];

      const rawText = await converter.convert(file);

      setMarkdown(
        buildMarkdown(
          file.name,
          sanitizeText(rawText),
          converter.type
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        "Could not convert this file. If it is scanned, run OCR first."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!markdown) return;

    await navigator.clipboard.writeText(markdown);

    setCopied(true);

    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    if (!file || !markdown) return;

    downloadFile(
      `${file.name.replace(/\.[^.]+$/, "")}.md`,
      markdown
    );
  };

  return (
    <section className="doc-markdown-card">
      <h2>PDF / Word to Markdown</h2>

      <p className="doc-markdown-subtitle">
        Convert PDF and DOCX files into Markdown for
        Copilot or AI context.
      </p>

      <div className="doc-markdown-controls">
        <label
          htmlFor="doc-input"
          className="doc-markdown-upload"
        >
          Choose File
        </label>

        <input
          id="doc-input"
          type="file"
          accept="application/pdf,.docx"
          onChange={handleFileChange}
        />

        <span className="doc-markdown-file">
          {file?.name ?? "No file selected"}
        </span>

        <button
          onClick={handleConvert}
          disabled={!file || loading}
        >
          {loading
            ? "Converting..."
            : "Convert to Markdown"}
        </button>
      </div>

      {error && (
        <p className="doc-markdown-error">
          {error}
        </p>
      )}

      {markdown && (
        <div className="doc-markdown-output-wrap">
          <div className="doc-markdown-actions">
            <button onClick={handleCopy}>
              {copied
                ? "Copied!"
                : "Copy Markdown"}
            </button>

            <button onClick={handleDownload}>
              Download .md
            </button>
          </div>

          <textarea
            readOnly
            value={markdown}
            className="doc-markdown-output"
            aria-label="Markdown output"
          />
        </div>
      )}
    </section>
  );
}