import { readFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";

function norm(t:string) { return t.replace(/\s+/g," "); }

const texts = new Map<string,string>();
// Load all cached texts
for (const [f,label] of [["spd.txt","SPD"],["gruene.txt","GRÜNE"],["linke-berlin.txt","LINKE"],["cdu.txt","CDU"],["afd.txt","AFD"]] as const) {
  const p = `.factcheck-cache/${f}`;
  try {
    if (!require("fs").existsSync(p)) continue;
    const buf = readFileSync(p);
    if (buf.subarray(0,5).toString("latin1").startsWith("%PDF")) {
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      const {text} = await extractText(pdf, {mergePages:true});
      texts.set(label, norm(text));
    } else {
      texts.set(label, norm(buf.toString("utf8")));
    }
  } catch {}
}

interface Gap { thesisId:string; label:string; kws:{kw:string;stance:number}[] }
const GAPS: Record<string, Gap[]> = {
  SPD: [
    { thesisId:"ausbau-videoueberwachung", label:"", kws:[
      {kw:"Videoüberwachung",stance:0},{kw:"Kameras",stance:0} ]},
    { thesisId:"begrenzung-polizeilicher-befugnisse", label:"", kws:[
      {kw:"Befugnisse einschränken",stance:1},{kw:"polizeiliche Befugnisse",stance:0} ]},
    { thesisId:"personalabbau-in-der-verwaltung", label:"", kws:[
      {kw:"Personalabbau",stance:-1},{kw:"schlanker Staat",stance:1},{kw:"Stellenabbau",stance:-1}]},
    { thesisId:"staerkere-besteurung-hoher-einkommen", label:"", kws:[
      {kw:"Reiche besteuern",stance:1},{kw:"höhere Einkommen besteuern",stance:1},
      {kw:"Vermögenssteuer",stance:1},{kw:"besteuern",stance:0}]},
    { thesisId:"mehr-kompetenzen-fuer-die-bezirke", label:"", kws:[
      {kw:"Bezirke",stance:0},{kw:"Bezirksamt",stance:0}]},
    { thesisId:"mehr-reinigungspersonal", label:"", kws:[
      {kw:"Reinigung",stance:0},{kw:"Sauberkeit",stance:0}]},
    { thesisId:"rund-um-die-uhr-digitale-buergerservices", label:"", kws:[
      {kw:"digital",stance:1},{kw:"Online",stance:0}]},
    { thesisId:"tariftreue-bei-oeffentlichen-auftraegen", label:"", kws:[
      {kw:"Tariftreue",stance:1},{kw:"Tarifbindung",stance:1}]},
    { thesisId:"prioritaet-fuer-radverkehr", label:"", kws:[
      {kw:"Radverkehr",stance:1},{kw:"Radwege",stance:1}]},
    { thesisId:"sozialticket-und-oepnv-ausbau", label:"", kws:[
      {kw:"Deutschlandticket",stance:1},{kw:"ÖPNV",stance:1}]},
    { thesisId:"besserer-personalschluessel-in-kitas", label:"", kws:[
      {kw:"Kitas",stance:0},{kw:"Personalschlüssel",stance:1}]},
    { thesisId:"beschleunigte-schulsanierung", label:"", kws:[
      {kw:"Schulbauoffensive",stance:1},{kw:"Sanierung Schulen",stance:1}]},
    { thesisId:"heizkostenfonds-fuer-niedrige-einkommen", label:"", kws:[
      {kw:"Heizkosten",stance:0},{kw:"Energiekosten",stance:0}]},
    { thesisId:"mehr-reinigungspersonal", label:"", kws:[
      {kw:"Sauberkeit",stance:0},{kw:"Reinigung",stance:0}]},
    { thesisId:"netto-null-bei-neuversiegelung", label:"", kws:[
      {kw:"Versiegelung",stance:0}]},
    { thesisId:"rund-um-die-uhr-digitale-buergerservices", label:"", kws:[
      {kw:"Digitalisierung",stance:1},{kw:"digital",stance:0}]},
  ],
  CDU: [],
  GRÜNE: [],
  LINKE: [],
  AFD: [],
};

for (const [pid, gaps] of Object.entries(GAPS)) {
  const doc = texts.get(pid.toUpperCase()) ?? texts.get(pid);
  if (!doc) { console.log(`${pid}: no text`); continue; }
  console.log(`\n=== ${pid} ===`);
  for (const g of gaps) {
    let found = false;
    for (const {kw, stance} of g.kws) {
      const idx = doc.toLowerCase().indexOf(kw.toLowerCase());
      if (idx >= 0) {
        const s = Math.max(0, idx - 60);
        const e = Math.min(doc.length, idx + 180);
        console.log(`[${g.label || g.thesisId}] kw="${kw}" stance=${stance}`);
        console.log(`  …${doc.slice(s,e)}…`);
        found = true;
        break;
      }
    }
    if (!found) console.log(`[${g.label || g.thesisId}] –`);
  }
}
