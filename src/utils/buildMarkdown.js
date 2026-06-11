export function sanitizeText(text) {
  return text
    .split("\u0000").join("")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildMarkdown(fileName, content, sourceType) {
  return `
# Converted Document

## Metadata

- source_file: ${fileName}
- source_type: ${sourceType}
- converted_at_utc: ${new Date().toISOString()}
- target_use: copilot_context

## Content

${content || "(No readable text extracted)"}
`.trim();
}
