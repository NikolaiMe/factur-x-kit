import * as fs from 'fs';
import * as path from 'path';

import { validateFacturXXsd } from '../src/helper/xsdValidator';

describe('Factur-X XSD Validator - MINIMUM Profile', () => {
    let validMinimumXml: string;
    let invalidMinimumXml: string;

    beforeAll(() => {
        // Pfade zu den Testdaten in ./utils/testData auflösen
        const validPath = path.resolve(__dirname, './utils/testData/valid_minimum.xml');
        const invalidPath = path.resolve(__dirname, './utils/testData/invalid_xsd_minimum.xml');

        validMinimumXml = fs.readFileSync(validPath, 'utf-8');
        invalidMinimumXml = fs.readFileSync(invalidPath, 'utf-8');
    });

    test('should validate valid_minimum.xml successfully with no errors', async () => {
        const result = await validateFacturXXsd(validMinimumXml, 'MINIMUM');

        // Das XML muss gültig sein
        expect(result.isValid).toBe(true);

        // Es dürfen keine Fehler vorliegen (toEqual([]) gibt im Fehlerfall die genauen Fehlermeldungen aus)
        expect(result.errors).toEqual([]);

        // Das geprüfte Profil muss übereinstimmen
        expect(result.profile).toBe('MINIMUM');
    });

    test('should reject invalid_minimum.xml and return structured errors', async () => {
        const result = await validateFacturXXsd(invalidMinimumXml, 'MINIMUM');

        // Das XML muss ungültig sein
        expect(result.isValid).toBe(false);

        // Es müssen Fehler gefunden worden sein
        expect(result.errors.length).toBe(1);

        // Prüfen, ob die Fehler sauber strukturiert sind
        const firstError = result.errors[0];
        expect(firstError.message).toBeDefined();
        expect(typeof firstError.message).toBe('string');
        expect(firstError.message.length).toBeGreaterThan(0);

        // Das geprüfte Profil muss übereinstimmen
        expect(result.profile).toBe('MINIMUM');
    });
});
