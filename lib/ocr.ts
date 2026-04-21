export async function extractTextFromImage(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("kor+eng");
  try {
    const {
      data: { text }
    } = await worker.recognize(file);
    return text;
  } finally {
    await worker.terminate();
  }
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/");
}
