import { PDFDocument } from "pdf-lib";

async function renderImageToPngBytes(file) {
  const imageUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    image.src = imageUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas rendering is not available.");
    }

    context.drawImage(image, 0, 0);

    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not render image."));
          return;
        }

        resolve(blob);
      }, "image/png");
    });

    return await pngBlob.arrayBuffer();
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function convertImageToPdf(file) {
  const imageBytes = await renderImageToPngBytes(file);

  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(imageBytes);

  const { width, height } = pngImage.scale(1);
  const page = pdfDoc.addPage([width, height]);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width,
    height,
  });

  return pdfDoc.save();
}

export { convertImageToPdf as convertPngToPdf };