import { XMLParser } from 'fast-xml-parser';
import SaxonJS from 'saxon-js';

import { FacturXProfile, getFacturXAssets } from '../facturxRegistry';

export interface SchematronIssue {
    flag: string;
    id?: string;
    location?: string;
    test?: string;
    message: string;
}

export interface XsltValidationResult {
    isValid: boolean;
    profile: FacturXProfile;
    errors: SchematronIssue[];
    warnings: SchematronIssue[];
    reports: SchematronIssue[];
    svrlRawOutput?: string;
}

function parseSvrlReport(svrlXml: string): {
    errors: SchematronIssue[];
    warnings: SchematronIssue[];
    reports: SchematronIssue[];
} {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
        trimValues: true
    });

    const parsed = parser.parse(svrlXml);
    const schematronOutput = parsed['svrl:schematron-output'] || parsed['schematron-output'] || {};

    const errors: SchematronIssue[] = [];
    const warnings: SchematronIssue[] = [];
    const reports: SchematronIssue[] = [];

    const normalizeArray = (item: any): any[] => {
        if (!item) return [];
        return Array.isArray(item) ? item : [item];
    };

    // 1. Failed Asserts
    const failedAsserts = normalizeArray(schematronOutput['svrl:failed-assert'] || schematronOutput['failed-assert']);
    for (const assert of failedAsserts) {
        const flag = (assert['@_flag'] || 'fatal').toLowerCase();
        const textNode = assert['svrl:text'] || assert['text'] || '';
        const message = typeof textNode === 'object' ? textNode['#text'] || JSON.stringify(textNode) : String(textNode);

        const issue: SchematronIssue = {
            flag,
            id: assert['@_id'],
            location: assert['@_location'],
            test: assert['@_test'],
            message: message.trim()
        };

        if (flag === 'warning') {
            warnings.push(issue);
        } else {
            errors.push(issue);
        }
    }

    // 2. Successful Reports
    const successfulReports = normalizeArray(
        schematronOutput['svrl:successful-report'] || schematronOutput['successful-report']
    );
    for (const report of successfulReports) {
        const flag = (report['@_flag'] || 'info').toLowerCase();
        const textNode = report['svrl:text'] || report['text'] || '';
        const message = typeof textNode === 'object' ? textNode['#text'] || JSON.stringify(textNode) : String(textNode);

        const issue: SchematronIssue = {
            flag,
            id: report['@_id'],
            location: report['@_location'],
            test: report['@_test'],
            message: message.trim()
        };

        if (flag === 'warning') {
            warnings.push(issue);
        } else if (flag === 'fatal' || flag === 'error') {
            errors.push(issue);
        } else {
            reports.push(issue);
        }
    }

    return { errors, warnings, reports };
}

/**
 * Validates a Factur-X XML string using Saxon-JS against the precompiled SEF Schematron rules
 * including the code list database (codedb.xml).
 */
export async function validateFacturXXslt(xmlContent: string, profile: FacturXProfile): Promise<XsltValidationResult> {
    const assets = getFacturXAssets(profile);

    try {
        // 1. Codelisten-Dokument parsen
        const codeDbDoc = await SaxonJS.getResource({
            text: assets.codeDb.contents,
            type: 'xml'
        });

        const fileName = assets.codeDb.fileName;

        // 2. Saxon-JS Transformation mit robuster DocumentPool-Abdeckung
        const transformResult = await SaxonJS.transform(
            {
                stylesheetInternal: assets.sef,
                sourceText: xmlContent,
                destination: 'serialized',
                baseOutputURI: fileName,
                documentPool: {
                    [fileName]: codeDbDoc,
                    [`./${fileName}`]: codeDbDoc,
                    [`file:///${fileName}`]: codeDbDoc
                }
            },
            'async'
        );

        const svrlOutput: string = transformResult.principalResult;
        const { errors, warnings, reports } = parseSvrlReport(svrlOutput);

        return {
            isValid: errors.length === 0,
            profile,
            errors,
            warnings,
            reports,
            svrlRawOutput: svrlOutput
        };
    } catch (error: any) {
        return {
            isValid: false,
            profile,
            errors: [
                {
                    flag: 'fatal',
                    message: `Unerwarteter Fehler bei der Schematron/XSLT-Validierung: ${error.message}`
                }
            ],
            warnings: [],
            reports: []
        };
    }
}
