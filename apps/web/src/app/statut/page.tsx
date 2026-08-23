export const metadata = { title: "Redaktionsstatut – WahlCheck Berlin" };

export default function StatutPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <h1 className="text-3xl font-bold">Redaktionsstatut</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Die Spielregeln dieses Projekts — verbindlich für alle Beteiligten.
        Verstöße werden im öffentlichen Änderungslog dokumentiert.
      </p>

      <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <li>
          <strong>Überparteilichkeit.</strong> Wir empfehlen keine Partei. Alle
          zugelassenen Parteien werden nach denselben Regeln dargestellt;
          Funktionsumfang und Sichtbarkeit hängen nicht von Größe oder Couleur
          einer Partei ab.
        </li>
        <li>
          <strong>Quellenpflicht.</strong> Jede Parteiposition trägt ein Zitat
          aus dem offiziellen Programm oder eine klar gekennzeichnete
          Sekundärquelle. Ohne Beleg: „keine Angabe“ — niemals eine Vermutung.
        </li>
        <li>
          <strong>Transparente Thesenauswahl.</strong> Auswahlkriterien
          (Wählersalienz vor Differenzierung) sind öffentlich dokumentiert; die
          Differenzierung jedes Thesen-Sets wird maschinell geprüft und
          berichtet.
        </li>
        <li>
          <strong>Unabhängige Finanzierung.</strong> Wir nehmen keine Gelder von
          Parteien oder parteinahen Organisationen an. Schalten wir keine
          politische Werbung (TTPW-VO). Finanzierungsquellen veröffentlichen wir
          jährlich in einem Transparenzbericht.
        </li>
        <li>
          <strong>Datenminimierung als Haltung.</strong> Antwortdaten verlassen
          das Gerät der Nutzerinnen und Nutzer nicht. Wir verkaufen keine Daten,
          betreiben kein Targeting und bauen es auch nicht ein.
        </li>
        <li>
          <strong>Offenheit.</strong> Code unter AGPL-3.0, Inhalte unter CC BY-SA
          4.0. Methodik, Formeln und Content-Pipeline sind öffentlich einsehbar.
        </li>
        <li>
          <strong>Korrekturen.</strong> Berechtigte Korrekturmeldungen werden
          zeitnah bearbeitet; die Korrektur selbst bleibt mit Datum im
          Änderungslog sichtbar.
        </li>
      </ol>
    </main>
  );
}
