// src/compare.ts
import * as fs from 'fs';
import * as path from 'path';

import * as enums from '../src/types/codes';

// --- Konfiguration ---
// Eine "Registry", um über einen String-Namen auf das Enum-Objekt zugreifen zu können.
// Wenn du ein neues Enum in enums.ts hinzufügst, trage es hier ein.
const AVAILABLE_ENUMS: Record<string, object> = {
    COUNTRY_ID_CODES: enums.COUNTRY_ID_CODES,
    CURRENCY_CODES: enums.CURRENCY_CODES,
    UNIT_CODES: enums.UNIT_CODES,
    SUBJECT_CODES: enums.SUBJECT_CODES,
    ISO6523_CODES: enums.ISO6523_CODES,
    EAS_SCHEME_CODES: enums.EAS_SCHEME_CODES,
    TAX_CODES: enums.TAX_CODES,
    TAX_TYPE_CODE: enums.TAX_TYPE_CODE,
    TAX_CATEGORY_CODES: enums.TAX_CATEGORY_CODES,
    ALLOWANCE_REASONS_CODES: enums.ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES: enums.CHARGE_REASONS_CODES,
    DOCUMENT_TYPE_CODES: enums.DOCUMENT_TYPE_CODES,
    PAYMENT_MEANS_CODES: enums.PAYMENT_MEANS_CODES,
    TIME_REFERENCE_CODES: enums.TIME_REFERENCE_CODES,
    EXEMPTION_REASON_CODES: enums.EXEMPTION_REASON_CODES,
    UNTDID_7143: enums.UNTDID_7143,
    MIME_CODES: enums.MIME_CODES,
    UNTDID_1153: enums.UNTDID_1153,
    REFERENCED_DOCUMENT_TYPE_CODES: enums.REFERENCED_DOCUMENT_TYPE_CODES
};

// --- Hilfsfunktionen ---

/**
 * Liest den Input interaktiv aus dem Terminal.
 * Die Eingabe wird beendet, wenn der Benutzer Enter in einer leeren Zeile drückt.
 * @returns Ein Promise, das mit dem kompletten Input-String aufgelöst wird.
 */
function readInputInteractively(): Promise<string> {
    // Diese Funktion wird jetzt so umgeschrieben, dass sie sich nicht mehr
    // auf das unzuverlässige 'end'-Event verlässt.
    return new Promise(resolve => {
        let inputData = '';
        console.log('📋 Bitte füge jetzt deine Liste mit Codes ein (jeder Code in einer neuen Zeile).');
        console.log('➡️  Beende die Eingabe, indem du in einer leeren Zeile ENTER drückst.');

        // Wir definieren den Listener als separate Funktion, damit wir ihn später wieder entfernen können.
        const dataListener = (chunk: Buffer) => {
            const text = chunk.toString();

            // Prüft auf die Abbruchbedingung (nur Enter gedrückt)
            if (text.trim() === '') {
                // ANSTATT auf 'end' zu warten, lösen wir die Promise HIER DIREKT auf.
                // Das ist der entscheidende Fix.
                process.stdin.removeListener('data', dataListener); // Listener entfernen (gute Praxis)
                process.stdin.pause(); // Stream anhalten, damit das Programm beendet werden kann
                resolve(inputData); // Promise mit den gesammelten Daten auflösen
            } else {
                inputData += text; // Daten sammeln
            }
        };

        process.stdin.resume(); // Stellt sicher, dass der Stream lesebereit ist
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', dataListener);
    });
}

/**
 * Die Hauptfunktion des Skripts
 */
async function main() {
    // 1. Argumente auslesen: Enum-Name und optionaler Dateipfad
    const targetEnumName = process.argv[2];
    const filePath = process.argv[3];

    // Prüfen, ob ein gültiger Enum-Name angegeben wurde
    if (!targetEnumName || !AVAILABLE_ENUMS[targetEnumName]) {
        console.error('❌ Fehler: Bitte gib einen gültigen Enum-Namen an.');
        console.error('Verfügbare Enums:', Object.keys(AVAILABLE_ENUMS).join(', '));
        console.error('\nVerwendung:');
        console.error('  1. Mit Datei: tsx src/compare.ts <EnumName> <Dateipfad>');
        console.error('  2. Interaktiv: tsx src/compare.ts <EnumName>');
        process.exit(1);
    }

    const targetEnum = AVAILABLE_ENUMS[targetEnumName];
    console.log(`🔎 Vergleiche mit Enum: ${targetEnumName}`);

    let inputString: string;

    // 2. Input-Methode bestimmen: Datei oder Interaktiv
    if (filePath) {
        try {
            const fullPath = path.resolve(filePath);
            console.log(`📄 Lese Codes aus Datei: ${fullPath}`);
            inputString = fs.readFileSync(fullPath, 'utf8');
        } catch (error) {
            console.error(`❌ Fehler: Datei konnte nicht gelesen werden: ${filePath}`);
            console.error((error as Error).message);
            process.exit(1);
        }
    } else {
        inputString = await readInputInteractively();
    }

    // 3. Daten für den Vergleich vorbereiten
    const enumValues = new Set(Object.values(targetEnum));
    const inputCodes = new Set(
        inputString
            .split(/\r?\n/)
            .map(code => code.trim())
            .filter(code => code.length > 0)
    );

    // 4. Vergleich durchführen
    const codesInListButNotInEnum = [...inputCodes].filter(code => !enumValues.has(code));
    const codesInEnumButNotInList = [...enumValues].filter(code => !inputCodes.has(code as string));

    // 5. Ergebnisse ausgeben
    console.log('\n\n--- ERGEBNISSE ---');
    console.log(`Gefundene Codes in deiner Liste: ${inputCodes.size}`);
    console.log(`Einträge im Enum '${targetEnumName}': ${enumValues.size}`);

    console.log(`\n[+] ${codesInListButNotInEnum.length} Codes, die in deiner LISTE, aber NICHT im Enum sind:`);
    if (codesInListButNotInEnum.length > 0) {
        console.log(codesInListButNotInEnum.join('\n'));
    } else {
        console.log('Alle Codes aus der Liste sind im Enum enthalten. ✅');
    }

    console.log(`\n[-] ${codesInEnumButNotInList.length} Codes, die im ENUM, aber NICHT in deiner Liste sind:`);
    if (codesInEnumButNotInList.length > 0) {
        console.log(codesInEnumButNotInList.join('\n'));
    } else {
        console.log('Alle Codes aus dem Enum sind in der Liste enthalten. ✅');
    }

    console.log('\n--- FERTIG ---');
}

// Skript starten
main();
