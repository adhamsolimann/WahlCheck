import { readFileSync, writeFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";
const files: [string, string][] = [
  [".factcheck-cache/afd-berlin.pdf", ".factcheck-cache/afd.txt"],
];
for (const [pdfPath, txtPath] of files) {
  const buf = readFileSync(pdfPath);
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: true });
  writeFileSync(txtPath, text.replace(/\s+/g, " "));
  console.log(txtPath, "→", text.length, "chars");
}
