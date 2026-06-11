import mammoth from "mammoth";

export async function convertDocx(file) {
  const { value } = await mammoth.convertToMarkdown({
    arrayBuffer: await file.arrayBuffer(),
  });

  return value;
}