import { getDocument } from "pdfjs-dist";

export async function convertPdf(file) {
    const pdf = await getDocument({
        data: await file.arrayBuffer(),
    }).promise;

    const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, index) => {
            const page = await pdf.getPage(index + 1);
            const content = await page.getTextContent();

            const text = content.items
                .map(({ str = "" }) => str)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            return `### Page ${index + 1}

${text || "(No text found on this page)"}`;
        }),
    );

    return pages.join("\n\n");
}
