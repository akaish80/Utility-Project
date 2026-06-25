function toBlob(content, mimeType) {
  if (content instanceof Blob) {
    return content;
  }

  return new Blob([content], { type: mimeType });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.click();

  URL.revokeObjectURL(url);
}

async function writeBlobToFolder(directoryHandle, filename, blob) {
  const fileHandle = await directoryHandle.getFileHandle(filename, {
    create: true,
  });
  const writable = await fileHandle.createWritable();

  await writable.write(blob);
  await writable.close();
}

async function pickDirectory(folderPickerOptions = {}) {
  try {
    const directoryHandle = await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "downloads",
      ...folderPickerOptions,
    });

    return { cancelled: false, directoryHandle };
  } catch (error) {
    if (error?.name === "AbortError") {
      return { cancelled: true };
    }

    throw error;
  }
}

export async function saveFile(
  filename,
  content,
  {
    mimeType = "application/octet-stream",
    useFolderPicker = true,
    folderPickerOptions = {},
  } = {}
) {
  const blob = toBlob(content, mimeType);
  const canPickFolder =
    useFolderPicker && typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";

  if (canPickFolder) {
    const selection = await pickDirectory(folderPickerOptions);

    if (selection.cancelled) {
      return { method: "cancelled", filename };
    }

    await writeBlobToFolder(selection.directoryHandle, filename, blob);
    return { method: "folder", filename };
  }

  triggerDownload(blob, filename);
  return { method: "download", filename };
}

export async function saveFiles(
  files,
  {
    useFolderPicker = true,
    folderPickerOptions = {},
  } = {}
) {
  const normalizedFiles = files.map((file) => ({
    filename: file.filename,
    blob: toBlob(file.content, file.mimeType ?? "application/octet-stream"),
  }));

  const canPickFolder =
    useFolderPicker && typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";

  if (canPickFolder) {
    const selection = await pickDirectory(folderPickerOptions);

    if (selection.cancelled) {
      return { method: "cancelled", count: normalizedFiles.length };
    }

    for (const file of normalizedFiles) {
      await writeBlobToFolder(selection.directoryHandle, file.filename, file.blob);
    }

    return { method: "folder", count: normalizedFiles.length };
  }

  normalizedFiles.forEach((file) => {
    triggerDownload(file.blob, file.filename);
  });

  return { method: "download", count: normalizedFiles.length };
}