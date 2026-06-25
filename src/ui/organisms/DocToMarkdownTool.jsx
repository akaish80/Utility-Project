import { useState } from "react";
import {
  sanitizeText,
  buildMarkdown,
} from "../../utils/buildMarkdown";
import { downloadFile } from "../../utils/downloadFile";
import ToolShell from "../atoms/ToolShell";

import "./DocToMarkdownTool.scss";

export default function DocToMarkdownTool() {
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

    if (selected.type !== "application/pdf" && selected.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
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

      const isPdf = file.type === "application/pdf";
      const converterModule = isPdf
        ? await import("../../utils/convertPdf")
        : await import("../../utils/convertDocx");

      const rawText = isPdf
        ? await converterModule.convertPdf(file)
        : await converterModule.convertDocx(file);

      setMarkdown(
        buildMarkdown(
          file.name,
          sanitizeText(rawText),
          isPdf ? "pdf" : "docx"
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

  const handleDownload = async () => {
    if (!file || !markdown) return;

    try {
      await downloadFile(`${file.name.replace(/\.[^.]+$/, "")}.md`, markdown);
    } catch (err) {
      console.error(err);
      setError("Could not export the Markdown file.");
    }
  };

  return (
    <ToolShell
      title="PDF / Word to Markdown"
      subtitle="Convert PDF and DOCX files into Markdown for Copilot or AI context."
    >
      <div className="doc-markdown-controls">
        <label htmlFor="doc-input" className="doc-markdown-upload">
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
          {loading ? "Converting..." : "Convert to Markdown"}
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
              {copied ? "Copied!" : "Copy Markdown"}
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
    </ToolShell>
  );
}