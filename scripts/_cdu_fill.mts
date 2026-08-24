import { readFileSync } from "node:fs";
const doc = readFileSync(".factcheck-cache/cdu.txt", "utf8").replace(/\s+/g, " ");

// Alle CDU-Lücken mit deutschen Suchbegriffen
const searches: Array<{id:string; label:string; kws:string[]}> = [
  { id:"abschaffung-modernisierungsumlage", label:"Modernisierungsumlage", kws:["Modernisierungsumlage","Umlage Modernisierung"] },
  { id:"ausbau-der-integrationsangebote", label:"Integrationsangebote", kws:["Integration","Integrationskurs","Sprachkurs","Ankommen"] },
  { id:"ausbau-queerer-gesundheitsversorgung", label:"Queere Gesundheit", kws:["queer","trans","LGBT","Regenbogen"] },
  { id:"ausbau-videoueberwachung-oeffentlicher-raeume", label:"Videoüberwachung ausbauen", kws:["Videoüberwachung","Kameras öffentlich","Überwachung öffentlicher","videokonzept","Video-Überwachung"] },
  { id:"begrenzung-polizeilicher-befugnisse", label:"Befugnisse begrenzen", kws:["Befugnisse einschränken","Befugnisse reduzieren","weniger Befugnisse","polizeiliche Befugnisse zurückfahren"] },
  { id:"beschleunigte-schulsanierung", label:"Schulsanierung beschleunigen", kws:["Schulsanierung","Sanierung Schulen","Schulen sanieren","Schulgebäude sanieren"] },
  { id:"besserer-personalschluessel-in-kitas", label:"Kita Personalschlüssel", kws:["Kitas","Kita-Personal","Personalschlüssel","Fachkräfte Kitas","Erzieher"] },
  { id:"dezentrale-unterkuenfte-statt-notunterkuenfte", label:"Dezentrale Unterkünfte", kws:["Notunterkünfte","dezentrale Unterbringung","Geflüchtete wohnen","Unterkünfte Asyl"] },
  { id:"digitalisierung-der-bauaemter", label:"Bauämter digitalisieren", kws:["Bauamt","Baugenehmigung digital","Genehmigungsverfahren digital","Baurecht digital"] },
  { id:"einschraenkung-moeblierter-wohnraum", label:"Möblierten Wohnraum einschränken", kws:["möbliert","Möblierte Vermietung","befristete Vermietung"] },
  { id:"erleichterte-abschiebungen", label:"Abschiebungen erleichtern", kws:["Abschiebung","Ausreisepflicht","Rückführung","Ausländerbehörde"] },
  { id:"gemeinschaftsschule-fuer-alle", label:"Gemeinschaftsschule", kws:["Gemeinschaftsschule","Schulstruktur","Schulform","Schulreform"] },
  { id:"grundsteuer-c-baureife-grundstuecke", label:"Grundsteuer C", kws:["Grundsteuer C","Grundsteuer C einführen","baureife Grundstücke"] },
  { id:"haushaltsnotlage-investitionen-ueber-neue-kredite", label:"Investitionen Kredite", kws:["Sondervermögen","Investitionen Kredite","Investitionshaushalt","Investitionsfonds"] },
  { id:"heizkostenfonds-fuer-niedrige-einkommen", label:"Heizkosten entlasten", kws:["Heizkosten","Energiekosten","Heizkostenzuschuss","Wärmekosten"] },
  { id:"hitzeschutz-fuer-obdachlose", label:"Hitzeschutz Obdachlose", kws:["obdachlos","Hitzeschutz","Wohnungslose","Hilfe obdachlos"] },
  { id:"klimaneutralitaet-bis-2045", label:"Klimaneutralität 2045", kws:["klimaneutral","Klimaneutralität 2045","Klimaziel","Klimaschutzgesetz"] },
  { id:"mehr-kompetenzen-fuer-die-bezirke", label:"Bezirke stärken", kws:["Bezirke stärken","Bezirksamt","Dezentralisierung","Bezirk mehr Kompetenz"] },
  { id:"mehr-reinigungspersonal-oeffentliche-raeume", label:"Reinigung öffentliche Räume", kws:["Reinigung","Stadtreinigung","Sauberkeit","Müll","BSR"] },
  { id:"mehr-reinigungspersonal-oeffentliche-raeume2", label:"Reinigung2", kws:["Reinigung","Straßenreinigung","sauber","Müll"] },
  { id:"netto-null-bei-neuversiegelung", label:"Netto-Null Versiegelung", kws:["Versiegelung","Netto-Null","Bodenversiegelung"] },
  { id:"personalabbau-in-der-verwaltung", label:"Personalabbau Verwaltung", kws:["Personalabbau","schlanker Staat","Stellen abbauen","Verwaltung verschlanken"] },
  { id:"prioritaet-fuer-radverkehr", label:"Radverkehr priorisieren", kws:["Radverkehr","Radwege","Radfahrinfrastruktur","Fahrrad"] },
  { id:"rund-um-die-uhr-digitale-buergerservices", label:"Digitale Bürgerservices", kws:["digital","Online-Dienste","Behörden online","Digitalisierung Verwaltung","Serviceportal","Online-Termine"] },
  { id:"schutz-und-foerderung-der-clubkultur", label:"Clubkultur", kws:["Clubkultur","Clubs","Nachtleben","Spielstättenförderung","Nachtökonomie"] },
  { id:"sozialticket-und-oepnv-ausbau", label:"ÖPNV/Sozialticket", kws:["ÖPNV","Deutschlandticket","Sozialticket","Nahverkehr","Bus und Bahn"] },
  { id:"sozialwohnungsquote-im-baulandmodell", label:"Sozialwohnungsquote Baulandmodell", kws:["Baulandmodell","Sozialwohnungsquote","kooperatives Baulandmodell"] },
  { id:"staerkere-besteurung-hoher-einkommen", label:"Besteuerung Reiche", kws:["Reiche besteuern","Vermögenssteuer","höher besteuern","Steuererhöhung Besserverdiener"] },
  { id:"stopp-der-a100-verlaengerung", label:"A100 stoppen", kws:["A100 stoppen","A100 Verlängerung","A100 weiterbauen","17. Bauabschnitt A100"] },
  { id:"tariftreue-bei-oeffentlichen-auftraegen", label:"Tariftreue Aufträge", kws:["Tariftreue","Tarifbindung","öffentliche Aufträge Vergabe","Vergabemindestlohn"] },
  { id:"tempo30-auf-hauptverkehrsstrassen", label:"Tempo 30 Hauptstraßen", kws:["Tempo 30","Hauptverkehrsstraßen Tempo","Geschwindigkeit Hauptverkehrsstraßen","tempo hauptverkehrsstraßen"] },
  { id:"vorrang-einheimische-bei-gefoerdertem-wohnraum", label:"Vorrang Einheimische Wohnraum", kws:["Einheimische bevorzugt","Vorrang Einheimische","Punktesystem Wohnraum","Wohnraumpriorisierung Einheimische"] },
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
  if (!found) console.log(`\n[${s.label}] – keine Passage`);
}
