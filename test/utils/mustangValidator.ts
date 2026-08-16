import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export interface MustangValidationResult {
    isValid: boolean;
    output: string;
}

// path to mustang needs to be set via .env -- Download Mustang CLI from https://github.com/ZUGFeRD/mustangproject/releases
const DEFAULT_JAR_PATH = path.join(
    process.env.MUSTANG_JAR_PATH || 'C:/Program Files/Mustang/',
    'Mustang-CLI-2.25.0.jar'
);

/**
 * Interner Aufruf des Mustang CLI Befehls
 */
async function runMustangCLI(sourcePath: string, jarPath: string): Promise<MustangValidationResult> {
    const command = `java -jar "${jarPath}" --action validate --source "${sourcePath}"`;

    try {
        const { stdout } = await execAsync(command);
        const isValid = stdout.includes('<summary status="valid"/>') || stdout.includes('status="valid"');

        return { isValid, output: stdout };
    } catch (error: any) {
        // Falls Mustang Fehler im Dokument findet, beendet es sich oft mit Exit-Code != 0
        const stdout = error.stdout || '';
        return {
            isValid: false,
            output: stdout || error.message || String(error)
        };
    }
}

/**
 * Validiert einen XML-String mit dem Mustang Validator
 */
export async function validateXmlWithMustang(
    xmlString: string,
    jarPath: string = DEFAULT_JAR_PATH
): Promise<MustangValidationResult> {
    const tempFilePath = path.join(__dirname, `temp_test_${Date.now()}.xml`);

    try {
        await fs.writeFile(tempFilePath, xmlString, 'utf-8');
        return await runMustangCLI(tempFilePath, jarPath);
    } finally {
        try {
            await fs.unlink(tempFilePath);
        } catch {
            // Ignorieren, falls Temp-Datei bereits gelöscht
        }
    }
}

/**
 * Validiert eine bestehende PDF-Datei (Factur-X / ZUGFeRD) mit dem Mustang Validator
 */
export async function validatePdfWithMustang(
    pdfFilePath: string,
    jarPath: string = DEFAULT_JAR_PATH
): Promise<MustangValidationResult> {
    // Prüfen, ob die PDF-Datei existiert
    try {
        await fs.access(pdfFilePath);
    } catch {
        return {
            isValid: false,
            output: `PDF-Datei wurde unter dem Pfad nicht gefunden: ${pdfFilePath}`
        };
    }

    return await runMustangCLI(pdfFilePath, jarPath);
}
