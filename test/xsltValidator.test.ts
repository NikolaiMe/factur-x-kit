import * as fs from 'fs';
import * as path from 'path';

import { validateFacturXXslt } from '../src/helper/xsltValidator';

describe('Factur-X XSLT/Schematron Validator - MINIMUM Profile', () => {
    let validMinimumXml: string;
    let invalidMinimumXml: string;

    beforeAll(() => {
        // Pfade zu den Testdaten in ./utils/testData auflösen
        const validPath = path.resolve(__dirname, './utils/testData/valid_minimum.xml');
        const invalidPath = path.resolve(__dirname, './utils/testData/invalid_xslt_minimum.xml');

        validMinimumXml = fs.readFileSync(validPath, 'utf-8');
        invalidMinimumXml = fs.readFileSync(invalidPath, 'utf-8');
    });

    test('should validate valid_minimum.xml successfully with no Schematron errors', async () => {
        const result = await validateFacturXXslt(validMinimumXml, 'MINIMUM');

        // Die Schematron-Validierung muss erfolgreich sein
        expect(result.isValid).toBe(true);

        // Es dürfen keine fatal/error Schematron-Fehler vorliegen
        expect(result.errors).toEqual([]);

        // Das geprüfte Profil muss übereinstimmen
        expect(result.profile).toBe('MINIMUM');

        // Optional: Prüfen, ob der rohe SVRL-Output generiert wurde
        expect(result.svrlRawOutput).toBeDefined();
        expect(typeof result.svrlRawOutput).toBe('string');
    });

    test('should reject invalid_xsd_minimum.xml and return structured Schematron issues', async () => {
        const result = await validateFacturXXslt(invalidMinimumXml, 'MINIMUM');

        // Die Validierung muss fehlschlagen
        expect(result.isValid).toBe(false);

        // Es müssen Schematron-Fehler gefunden worden sein
        expect(result.errors.length).toBe(1);

        // Struktur des ersten Fehlers verifizieren
        const firstError = result.errors[0];
        expect(firstError.message).toBeDefined();
        expect(firstError.message).toContain('[BR-CO-09]');
        expect(typeof firstError.message).toBe('string');
        expect(firstError.message.length).toBeGreaterThan(0);
        expect(firstError.flag).toBeDefined(); // z. B. 'fatal' oder 'error'

        // Das geprüfte Profil muss übereinstimmen
        expect(result.profile).toBe('MINIMUM');
    });
});
