import { validateXML } from 'xmllint-wasm';

import { FacturXProfile, getFacturXAssets } from '../facturxRegistry';

/**
 * A single, structured XSD validation error
 */
export interface XsdValidationError {
    /** The formatted error message */
    message: string;
    /** The line number in the XML, if determinable */
    line?: number;
    /** The affected XML element, if determinable */
    element?: string;
    /** The unchanged original output from libxml2 */
    raw: string;
}

/**
 * The overall result of the XSD validation
 */
export interface XsdValidationResult {
    /** True if the XML is 100% compliant with the XSD schema of the profile */
    isValid: boolean;
    /** The validated Factur-X profile */
    profile: FacturXProfile;
    /** List of all validation errors (empty on success) */
    errors: XsdValidationError[];
    /** The raw text output from xmllint */
    rawOutput?: string;
}

/**
 * Helper function to parse the raw libxml2 error messages
 * Format typically: "e-invoice.xml:21: element Name: Schemas validity error : Element 'Name': [facet ...] ..."
 */
function parseLibxmlError(rawError: string): XsdValidationError {
    const error: XsdValidationError = {
        message: rawError.trim(),
        raw: rawError
    };

    // Regex to extract line number and element name
    const match = rawError.match(/:(\d+):\s*(?:element\s+([^:]+):)?\s*(?:Schemas validity error\s*:\s*)?(.*)$/i);

    if (match) {
        const [, lineNumber, elementName, cleanMessage] = match;
        if (lineNumber) {
            error.line = parseInt(lineNumber, 10);
        }
        if (elementName) {
            error.element = elementName.trim();
        }
        if (cleanMessage) {
            error.message = cleanMessage.trim();
        }
    }

    return error;
}

/**
 * Validates an XML string against the XSD schema of a Factur-X profile.
 *
 * @param xmlContent The complete Factur-X XML string
 * @param profile The profile to be validated (MINIMUM, BASICWL, BASIC, EN16931, EXTENDED)
 * @returns A structured validation result
 */
export async function validateFacturXXsd(xmlContent: string, profile: FacturXProfile): Promise<XsdValidationResult> {
    const assets = getFacturXAssets(profile);

    try {
        const result = await validateXML({
            xml: [
                {
                    fileName: 'factur-x.xml',
                    contents: xmlContent
                }
            ],
            schema: [assets.mainXsd],
            preload: assets.preload
        });

        const parsedErrors: XsdValidationError[] = (result.errors || []).map((err: any) => {
            const rawMsg = typeof err === 'string' ? err : err.rawMessage || err.rawOutput || JSON.stringify(err);
            return parseLibxmlError(rawMsg);
        });

        return {
            isValid: result.valid,
            profile,
            errors: parsedErrors,
            rawOutput: result.rawOutput
        };
    } catch (error: any) {
        // Unexpected parsing/WASM error
        return {
            isValid: false,
            profile,
            errors: [
                {
                    message: `Unexpected error during XSD validation: ${error.message}`,
                    raw: error.stack || error.message
                }
            ]
        };
    }
}
