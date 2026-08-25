import { readFileSync, writeFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";
const pdf = await getDocumentProxy(new Uint8Array(readFileSync(".factcheck-cache/afd-berlin.pdf")));
const { text } = await extractText(pdf, { mergePages: true });
writeFileSync("/tmp/afd_unpdf.txt", text);
console.log("chars:", text.length);
