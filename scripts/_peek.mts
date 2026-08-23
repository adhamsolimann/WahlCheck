import { readFileSync, writeFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";
const pdf = await getDocumentProxy(new Uint8Array(readFileSync(".factcheck-cache/gruene")));
const { text } = await extractText(pdf, { mergePages: true });
writeFileSync(".factcheck-cache/gruene.txt", text);
console.log("chars:", text.length);
for (const kw of ["Klimaneutralität","Grundsteuer","Baulandmodell","Vermögen","Spielstätten","Videoüberwachung","Polizei","Tempo 30","Mietendeckel"]) {
  console.log(kw + ":", (text.match(new RegExp(kw, "gi")) ?? []).length + "x");
}
