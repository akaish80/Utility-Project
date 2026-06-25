import { saveFile } from "./exportFile";

export function downloadFile(filename, content) {
  return saveFile(filename, content, {
    mimeType: "text/markdown;charset=utf-8",
  });
}