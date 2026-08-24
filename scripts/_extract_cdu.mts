import { readFileSync, writeFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";
const buf = readFileSync(".factcheck-cache/cdu.pdf");
const pdf = await getDocumentProxy(new Uint8Array(buf));
const { text } = await extractText(pdf, { mergePages: true });
writeFileSync(".factcheck-cache/cdu.txt", text.replace(/\s+/g, " "));
console.log("CDU text:", text.length, "chars");
// Check if it's actually the Berlin program
const berlin = text.toLowerCase().includes("berlin");
const abgeordnetenhaus = text.toLowerCase().includes("abgeordnetenhaus");
console.log("mentions Berlin:", berlin, "| Abgeordnetenhaus:", abgeordnetenhaus);
