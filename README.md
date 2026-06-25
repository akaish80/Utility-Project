# Image & PDF Utilities

A React + Vite web app with multiple client-side document tools in one place.

## Features

1. Image Compressor
2. PDF Splitter (split one PDF into one-file-per-page)
3. PDF Merger (merge multiple PDFs into one)
4. PDF/Word to Markdown converter (Copilot-friendly output)

## Tech Stack

- React 19
- Vite 8
- Bootstrap + React Bootstrap
- pdf-lib (PDF split/merge)
- pdfjs-dist (PDF text extraction)
- mammoth (DOCX to Markdown)
- image-conversion (image compression)
- file-saver (download generated files)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview built app
- `npm run lint` - Run ESLint

## PDF/Word to Markdown Output Format

The converter generates structured Markdown designed for AI context ingestion.

Example structure:

```md
# Converted Document

## Metadata
- source_file: sample.pdf
- source_type: pdf
- converted_at_utc: 2026-06-11T10:00:00.000Z
- target_use: copilot_context

## Content
### Page 1
...
```

## Notes and Limitations

- DOCX is supported; legacy `.doc` is not supported.
- Scanned/image-only PDFs may return little or no text without OCR.
- PDF processing is done in-browser, so very large files can increase memory usage.

## Project Structure

```text
src/
	Components/
		Compressor.jsx
		DocToMarkdown.jsx
		PngToPdf.jsx
	pdfextracter/
		index.jsx
		PdfMerger.jsx
	ui/
		atoms/
			ToolShell.jsx
		organisms/
			ToolTabsWorkspace.jsx
	App.jsx
```

## UI Structure

- `ui/atoms` contains the shared shell used by every tool card.
- `ui/organisms` contains the main tab workspace.
- Each tool keeps its own file-processing logic and tool-specific controls.
