import fs from 'node:fs/promises';
import path from 'node:path';

import { validatePdfWithMustang, validateXmlWithMustang } from './mustangValidator';

describe('Mustang Validator Integration Tests', () => {
    const testDataDir = path.join(__dirname, 'testData');

    describe('XML Validierung', () => {
        it('sollte "factur-x.xml" als VALIDE erkennen', async () => {
            const xmlPath = path.join(testDataDir, 'factur-x.xml');
            const xmlContent = await fs.readFile(xmlPath, 'utf-8');

            const result = await validateXmlWithMustang(xmlContent);

            expect(result.isValid).toBe(true);
        });

        it('sollte "falseXML.xml" als UNGÜLTIG erkennen', async () => {
            const xmlPath = path.join(testDataDir, 'falseXML.xml');
            const xmlContent = await fs.readFile(xmlPath, 'utf-8');

            const result = await validateXmlWithMustang(xmlContent);

            expect(result.isValid).toBe(false);
        });
    });

    describe('PDF Validierung', () => {
        it('sollte "PDF_DESIGN_DE.pdf" als VALIDE erkennen', async () => {
            const pdfPath = path.join(testDataDir, 'PDF_DESIGN_DE.pdf');

            const result = await validatePdfWithMustang(pdfPath);

            expect(result.isValid).toBe(true);
        });

        it('sollte "fehlerhafte_rechnung.pdf" als UNGÜLTIG erkennen', async () => {
            const pdfPath = path.join(testDataDir, 'fehlerhafte_rechnung.pdf');

            const result = await validatePdfWithMustang(pdfPath);

            expect(result.isValid).toBe(false);
        });

        it('sollte "non_compliant_pdf.pdf" als UNGÜLTIG erkennen', async () => {
            const pdfPath = path.join(testDataDir, 'non_compliant_pdf.pdf');

            const result = await validatePdfWithMustang(pdfPath);

            expect(result.isValid).toBe(false);
        });
    });
});
