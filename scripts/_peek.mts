import { readFileSync, writeFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";
const pdf = await getDocumentProxy(new Uint8Array(readFileSync(".factcheck-cache/891e8597ca52030b")));
const { text } = await extractText(pdf, { mergePages: true });
writeFileSync(".factcheck-cache/linke-berlin.txt", text);
console.log("chars:", text.length);
console.log("ANFANG:", JSON.stringify(text.slice(0, 300)));
for (const kw of ["Mietendeckel","Vergesellschaftung","Modernisierungsumlage","Heizkostenfonds","100 Tage","Berlin"]) {
  const n = (text.match(new RegExp(kw, "gi")) ?? []).length;
  console.log(kw + ": " + n + "x");
}
