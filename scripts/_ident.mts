import { readFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";
for (const f of ["2a9e6b256ce38946", "cd3299dca8e6b07b", "26601d867b2e97e2"]) {
  const buf = readFileSync(`.factcheck-cache/${f}`);
  if (buf.subarray(0,5).toString("latin1").startsWith("%PDF")) {
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    console.log(f, "= PDF:", JSON.stringify(text.replace(/\s+/g," ").slice(0,140)));
  } else {
    const t = buf.toString("utf8").replace(/<[^>]+>/g," ").replace(/\s+/g," ");
    console.log(f, "= HTML:", JSON.stringify(t.slice(0,200)));
  }
}
