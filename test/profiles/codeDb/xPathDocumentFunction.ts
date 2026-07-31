// In 'profiles/codeDb/xPathDocumentFunction.ts'
import { DOMParser } from '@xmldom/xmldom';
import type { Document } from '@xmldom/xmldom';
import { registerCustomXPathFunction } from 'fontoxpath';
import { readFileSync } from 'fs';
import path from 'path';

// Der Cache ist der Schlüssel! Er speichert die bereits geparsten XML-Dokumente.
const cache = new Map<string, Document[]>();

registerCustomXPathFunction(
    { namespaceURI: 'http://www.w3.org/2005/xpath-functions', localName: 'document' },
    ['xs:string'],
    'node()*',
    (dynamicContext, filePath: string) => {
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);

        // 1. Prüfen, ob das Dokument bereits im Cache ist
        if (cache.has(absolutePath)) {
            // console.log(`[Cache HIT] for: ${filePath}`);
            return cache.get(absolutePath) as Document[];
        }

        try {
            // console.log(`[Cache MISS] Reading file: ${filePath}`);

            // 2. Wenn nicht im Cache: Synchron lesen (passiert nur einmal pro Datei)
            const xmlString = readFileSync(absolutePath, 'utf-8');
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, 'text/xml');

            // WICHTIG: Wir speichern das Ergebnis als Array im Cache, genau wie es zurückgegeben wird
            const result = [doc];
            cache.set(absolutePath, result);

            // 3. Ergebnis zurückgeben
            return result;
        } catch (error) {
            console.error(`[Schematron] Failed to load or parse document: ${absolutePath}`, error);
            // Bei einem Fehler auch ein leeres Array im Cache speichern, um wiederholte Leseversuche zu vermeiden
            const errorResult: Document[] = [];
            cache.set(absolutePath, errorResult);
            return errorResult;
        }
    }
);
