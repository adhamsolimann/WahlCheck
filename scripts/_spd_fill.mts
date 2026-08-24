import { readFileSync } from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";

const buf = readFileSync(".factcheck-cache/d9f00abb5c1e9145");
const pdf = await getDocumentProxy(new Uint8Array(buf));
const { text } = await extractText(pdf, { mergePages: true });
const doc = text.replace(/\s+/g, " ");

// Alle 22 fehlenden Thesen mit deutschen Suchbegriffen
const searches: Array<{id:string; label:string; kws:string[]}> = [
  { id:"abschaffung-der-grundsteuer", label:"Grundsteuer abschaffen", kws:["Grundsteuer abschaffen","Grundsteuer senken","Grundsteuer reformieren"] },
  { id:"abschaffung-modernisierungsumlage", label:"Modernisierungsumlage abschaffen", kws:["Modernisierungsumlage"] },
  { id:"ausbau-der-integrationsangebote", label:"Integration ausbauen", kws:["Integration","Integrationskurse","Sprachkurs","Ankommen in Deutschland"] },
  { id:"ausbau-videoueberwachung-oeffentlicher-raeume", label:"Videoüberwachung ausbauen", kws:["Videoüberwachung","Kameras öffentlich","Überwachungskameras","videokonzept"] },
  { id:"begrenzung-polizeilicher-befugnisse", label:"Befugnisse begrenzen", kws:["Befugnisse einschränken","Polizeiaufgaben","polizeiliche Maßnahmen","Innenpolitik"] },
  { id:"besserer-personalschluessel-in-kitas", label:"Kita Personalschlüssel", kws:["Kitas","Personalschlüssel","Kita-Personal","Kita-Qualität","Fachkräfte Kitas","Kita-Bedarf"] },
  { id:"dezentrale-unterkuenfte-statt-notunterkuenfte", label:"Dezentrale Unterkünfte Geflüchtete", kws:["Notunterkünfte","dezentrale Unterbringung","Geflüchtete wohnen","Unterkünfte Geflüchtete"] },
  { id:"foerderung-von-wohneigentum", label:"Wohneigentum fördern", kws:["Wohneigentum","Mietkauf","Eigentum fördern","eigenheim"] },
  { id:"heizkostenfonds-fuer-niedrige-einkommen", label:"Heizkosten entlasten", kws:["Heizkosten","Energiekosten entlasten","Heizkostenzuschuss","Wärmekosten"] },
  { id:"hitzeschutz-fuer-obdachlose", label:"Hitzeschutz Obdachlose", kws:["obdachlos","Hitzeschutz","Wohnungslose","Hilfe im Sommer"] },
  { id:"mehr-kompetenzen-fuer-die-bezirke", label:"Bezirke stärken", kws:["Bezirke stärken","Bezirksamt","Dezentralisierung","bezirkliche Kompetenz"] },
  { id:"mehr-polizeipersonal", label:"Mehr Polizisten einstellen", kws:["Polizistinnen und Polizisten einstellen","Personal aufstocken","mehr Personal Polizei","Polizei verstärken","Einstellungsoffensive Polizei","Sicherheits- und Ordnungsamt","Ordnungsamt personal"] },
  { id:"mehr-reinigungspersonal-oeffentliche-raeume", label:"Reinigung öffentliche Räume", kws:["Reinigung","Straßenreinigung","sauber","Müll","Abfall","Putzkolonne","Stadtreinigung"] },
  { id:"personalabbau-in-der-verwaltung", label:"Verwaltung personal abbauen", kws:["Personalabbau Verwaltung","schlanker Staat","Stellen abbauen","Verwaltung verschlanken"] },
  { id:"prioritaet-fuer-radverkehr", label:"Radverkehr priorisieren", kws:["Radverkehr","Radwege","Radfahrinfrastruktur","Fahrrad"] },
  { id:"privatisierungsverbot-in-der-verfassung", label:"Privatisierungsverbot Verfassung", kws:["Privatisierungsverbot","Privatisierung verhindern","landeseigene Wohnungen verkaufen"] },
  { id:"randbebauung-tempelhofer-feld", label:"Tempelhofer Feld Randbebauung", kws:["Tempelhofer Feld","THF Bebauung","Randbebauung"] },
  { id:"rund-um-die-uhr-digitale-buergerservices", label:"Digitale Bürgerservices rund um die Uhr", kws:["digital","Online-Dienste","Behördengänge online","Digitalisierung Verwaltung","E-Government","Serviceportal"] },
  { id:"staerkere-besteurung-hoher-einkommen", label:"Reiche besteuern", kws:["besteuern Reiche","Vermögenssteuer","höher besteuern","Steuererhöhung Besserverdiener","Grunderwerbsteuer","Immobilien besteuern"] },
  { id:"tariftreue-bei-oeffentlichen-auftraegen", label:"Tariftreue öffentliche Aufträge", kws:["Tariftreue","Tarifbindung","öffentliche Aufträge","Mindestlohn Aufträge","Vergabe Tariflohn"] },
  { id:"vergesellschaftung-grosser-wohnungskonzerne", label:"Vergesellschaftung Konzerne", kws:["Vergesellschaftung","enteignen","Volksentscheid Deutsche Wohnen","Enteignung Wohnungsunternehmen"] },
  { id:"vorrang-einheimische-bei-gefoerdertem-wohnraum", label:"Vorrang Einheimische Wohnraum", kws:["Einheimische bevorzugt","Vorrang Einheimische","Punktesystem Wohnraum","Wohnraumpriorisierung"] },
];

for (const s of searches) {
  let found = false;
  for (const kw of s.kws) {
    const idx = doc.toLowerCase().indexOf(kw.toLowerCase());
    if (idx >= 0) {
      const st = Math.max(0, idx - 70);
      const en = Math.min(doc.length, idx + 220);
      console.log(`\n[${s.label}] kw="${kw}"`);
      console.log(`  …${doc.slice(st, en)}…`);
      found = true;
      break;
    }
  }
  if (!found) console.log(`\n[${s.label}] – keine Passage gefunden`);
}
