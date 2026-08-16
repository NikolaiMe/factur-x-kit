/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

function generateDataUrlFromFile(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        const base64 = buffer.toString('base64');
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error(`Error generating data URL for ${filePath}:`, error);
        throw new Error(`Failed to generate data URL for asset: ${filePath}. Original error: ${error.message}`, {
            cause: error
        });
    }
}

module.exports = {
    process(src, filename) {
        const ext = path.extname(filename).toLowerCase();

        // 1. Für .icc und .ttf: Bestehende Data-URL Logik
        if (ext === '.icc' || ext === '.ttf') {
            const dataUrl = generateDataUrlFromFile(filename);
            return {
                code: `module.exports = ${JSON.stringify(dataUrl)};`
            };
        }

        // 2. Für .xsd, .xml, .json / .sef.json: Als reinen Text-String zurückgeben
        // 'src' enthält hier bereits den von Jest eingelesenen Dateiinhalt
        return {
            code: `module.exports = ${JSON.stringify(src)};`
        };
    }
};
