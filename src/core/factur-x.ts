import objectPath from 'object-path';
import { PDFDocument } from 'pdf-lib';

import { FacturXProfile } from '../facturxRegistry';
import { XsdValidationResult, validateFacturXXsd } from '../helper/xsdValidator';
import { XsltValidationResult, validateFacturXXslt } from '../helper/xsltValidator';
import { FacturXKitPDFTemplate, HeaderImageType, SupportedLocales } from '../pdfTemplates/types';
import { BasicProfile, isBasicProfile } from '../profiles/basic/BasicProfile';
import { BasicProfileConverter } from '../profiles/basic/BasicProfileConverter';
import {
    BasicWithoutLinesProfile,
    BasicWithoutLinesProfileConverter,
    isBasicWithoutLinesProfile
} from '../profiles/basicwithoutlines/index';
import { ComfortProfile, isComfortProfile } from '../profiles/comfort/ComfortProfile';
import { ComfortProfileConverter } from '../profiles/comfort/ComfortProfileConverter';
import { validationResult } from '../profiles/convert';
import { ExtendedProfile, ExtendedProfileConverter, isExtendedProfile } from '../profiles/extended';
import { MinimumProfile, MinimumProfileConverter, isMinimumProfile } from '../profiles/minimum/index';
import FacturXPdf from './pdf';
import { buildXML, parseXML } from './xml';

export type availableProfiles =
    MinimumProfile | BasicWithoutLinesProfile | BasicProfile | ComfortProfile | ExtendedProfile;
export type availableConverters =
    | MinimumProfileConverter
    | BasicWithoutLinesProfileConverter
    | BasicProfileConverter
    | ComfortProfileConverter
    | ExtendedProfileConverter;

/**
 * Accepted input formats for schema validation (PDF or XML data)
 */
export type ValidatableInput = string | Buffer | Uint8Array | ArrayBuffer;

/**
 * Configuration options for Factur-X schema validation
 */
export interface ValidationOptions {
    /** Whether to validate against the official XSD schema (default: true) */
    checkXsd?: boolean;
    /** Whether to validate against the official Schematron / XSLT business rules (default: true) */
    checkSchematron?: boolean;
}

export type IssueSeverity = 'fatal' | 'error' | 'warning' | 'info';
export type IssueType = 'xsd' | 'schematron' | 'general';

/**
 * Normalized validation issue representing either an XSD error, a Schematron rule violation, or a general error
 */
export interface FacturXValidationIssue {
    type: IssueType;
    severity: IssueSeverity;
    message: string;
    /** Schematron rule ID, e.g. 'BR-CO-04' (only present for Schematron issues) */
    code?: string;
    /** Target XPath location (Schematron) or element name (XSD) */
    location?: string;
    /** Line number in the XML document (only present for XSD errors) */
    line?: number;
    /** Schematron assertion test expression */
    test?: string;
    /** Unprocessed raw error output */
    raw?: string;
}

/**
 * Aggregated result of the Factur-X validation process
 */
export interface FacturXValidationReport {
    /** True if the document contains neither 'fatal' nor 'error' severity issues */
    isValid: boolean;
    /** The detected Factur-X profile */
    profile: FacturXProfile;
    /** List of all normalized issues (errors, warnings, reports) */
    issues: FacturXValidationIssue[];
    /** Detailed XSD validation result for deep inspection */
    xsdResult?: XsdValidationResult;
    /** Detailed Schematron/XSLT validation result for deep inspection */
    xsltResult?: XsltValidationResult;
}

export class FacturX {
    private profile: availableProfiles;
    private converter: availableConverters;

    // private _data: MinimumProfileConverter | BasicProfileConverter

    private _fromPDF: string | Uint8Array | ArrayBuffer | undefined;
    private _fromXML: string | Buffer | undefined;
    private _pdf: FacturXPdf | undefined;

    constructor(profile: availableProfiles, converter: availableConverters) {
        this.profile = profile;
        this.converter = converter;
    }

    get pdf() {
        return this._pdf;
    }

    /**
     * Validates the generated Factur-X XML of this instance against official XSD schemas and Schematron rules.
     *
     * @param options - Options to toggle XSD and Schematron checks
     * @returns A structured validation report
     */
    public async validateSchema(options?: ValidationOptions): Promise<FacturXValidationReport> {
        const xml = await this.getXML();
        return FacturX.validateXMLString(xml, options);
    }

    /**
     * Validates the internal TypeScript data of this instance.
     *
     * @returns A validation result for the current profile structure
     */
    public checkObject(): validationResult {
        return this.converter.validateProfile(this.profile);
    }

    /**
     * @deprecated Use `checkObject()` to validate TypeScript data structures, or `validateSchema()` for official XSD/Schematron schema validation.
     */
    public validate(): validationResult {
        return this.checkObject();
    }

    /**
     * Returns the current Factur-X data
     *
     * @returns An object with the current Factur-X data
     */
    get object() {
        return this.profile;
    }

    /**
     * Allows you to edit the Factur-X data
     *
     * @param data - The invoice data
     */
    set object(data: availableProfiles) {
        if (isExtendedProfile(data)) {
            console.warn('ExtendedProfile is not yet implemented, using ComfortProfileConverter as fallback');
            this.profile = data;
            this.converter = new ExtendedProfileConverter();
            return;
        }
        if (isComfortProfile(data)) {
            this.profile = data;
            this.converter = new ComfortProfileConverter();
            return;
        }
        if (isBasicProfile(data)) {
            this.profile = data;
            this.converter = new BasicProfileConverter();
            return;
        }
        if (isBasicWithoutLinesProfile(data)) {
            this.profile = data;
            this.converter = new BasicWithoutLinesProfileConverter();
            return;
        }
        if (isMinimumProfile(data)) {
            this.profile = data;
            this.converter = new MinimumProfileConverter();
            return;
        }
        throw new Error('Unknown or Not Implemented Profile given');
    }

    /**
     * Returns a PDF with Embedded Factur-X XML
     *
     * @param pdfBytes - The PDF the Factur-X XML should be embedded into
     * @returns The given PDF with embedded Factur-X XML
     */

    public async getPDF(options?: {
        keepInitialPdf?: boolean;
        existingNonConformantPdf?: string | Uint8Array | ArrayBuffer | null;
        pdfLibDocument?: PDFDocument | null;
        pdfTemplate?: FacturXKitPDFTemplate;
        locale?: SupportedLocales;
        headerImage?: HeaderImageType;
    }): Promise<Uint8Array> {
        if (options?.existingNonConformantPdf) {
            this._pdf = await FacturXPdf.createFromNonCompliantPDF(options?.existingNonConformantPdf);
        } else if (options?.pdfLibDocument) {
            this._pdf = await FacturXPdf.createFromPDFDocument(options?.pdfLibDocument);
        } else if (options?.keepInitialPdf && !this._pdf) {
            throw new Error('You can only use keepInitialPdf if you created the FacturX Object via FacturX.fromPdf');
        } else {
            this._pdf = await FacturXPdf.create();
            await this._pdf.createPDFContent(this.profile, options?.pdfTemplate, options?.locale, options?.headerImage);
        }
        return this._pdf.createFacturXPDF(await this.getXML(), this.profile);
    }

    /**
     * Returns a Factur-X XML with the current data
     *
     * @returns The data of this Factur-X instace as XML
     */
    public async getXML(): Promise<string> {
        const xml = this.converter.obj2xml(this.profile);
        return buildXML(xml);
    }

    public static async fromObject(data: object): Promise<FacturX> {
        if (isExtendedProfile(data)) {
            console.warn('ExtendedProfile is not yet implemented, using ComfortProfileConverter as fallback');
            return new FacturX(data, new ExtendedProfileConverter());
        }
        if (isComfortProfile(data)) {
            return new FacturX(data, new ComfortProfileConverter());
        }
        if (isBasicProfile(data)) {
            return new FacturX(data, new BasicProfileConverter());
        }
        if (isBasicWithoutLinesProfile(data)) {
            return new FacturX(data, new BasicWithoutLinesProfileConverter());
        }
        if (isMinimumProfile(data)) {
            return new FacturX(data, new MinimumProfileConverter());
        }

        throw new Error('Unknown or Not Implemented Profile given');
    }

    public static async fromPDF(bytes: string | Uint8Array | ArrayBuffer): Promise<FacturX> {
        const pdf = await FacturXPdf.createFromFacturXPDF(bytes);
        const xml = pdf.extractEmbeddedXML();

        if (!xml) throw new Error('No Embedded Factur-X XML found in PDF');

        const instance = await this.fromXML(xml);
        instance._fromPDF = bytes;
        instance._pdf = pdf;

        return instance;
    }

    public static async fromXML(xml: string | Buffer): Promise<FacturX> {
        const obj = parseXML(xml);

        let instance: FacturX | undefined;

        const profileId = objectPath.get(
            obj,
            'rsm:CrossIndustryInvoice.rsm:ExchangedDocumentContext.ram:GuidelineSpecifiedDocumentContextParameter.ram:ID.#text'
        );

        switch (profileId) {
            case 'urn:factur-x.eu:1p0:minimum': {
                const converter = new MinimumProfileConverter();
                const data = converter.xml2obj(obj);
                instance = new FacturX(data, converter);
                instance._fromXML = xml;
                break;
            }
            case 'urn:factur-x.eu:1p0:basicwl': {
                const converter = new BasicWithoutLinesProfileConverter();
                const data = converter.xml2obj(obj);
                instance = new FacturX(data, converter);
                instance._fromXML = xml;
                break;
            }
            // instance = new FacturX(obj, 'BASIC_XML')
            // instance._fromXML = xml
            // break
            case 'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic': {
                const converter = new BasicProfileConverter();
                const data = converter.xml2obj(obj);
                instance = new FacturX(data, converter);
                instance._fromXML = xml;
                break;
            }
            case 'urn:cen.eu:en16931:2017': {
                const converter = new ComfortProfileConverter();
                const data = converter.xml2obj(obj);
                instance = new FacturX(data, converter);
                instance._fromXML = xml;
                break;
            }
            case 'urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:extended': {
                console.warn('ExtendedProfile is not yet implemented, using ComfortProfileConverter as fallback');
                const converter = new ExtendedProfileConverter();
                const data = converter.xml2obj(obj);
                instance = new FacturX(data, converter);
                instance._fromXML = xml;
                break;
            }
            case 'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0':
                throw new Error(`Profile not yet implemented: ${profileId}`);
            default:
                throw new Error(`Unknown Profile: ${profileId}`);
        }

        instance._fromXML = xml;

        return instance;
    }

    /**
     * Validates a plain TypeScript invoice object against basic profile requirements before instantiation.
     *
     * @param data - The invoice data object to check
     * @returns A validation result indicating whether required properties are present
     */
    public static checkObject(data: object): validationResult {
        if (isExtendedProfile(data)) return new ExtendedProfileConverter().validateProfile(data);
        if (isComfortProfile(data)) return new ComfortProfileConverter().validateProfile(data);
        if (isBasicProfile(data)) return new BasicProfileConverter().validateProfile(data);
        if (isBasicWithoutLinesProfile(data)) return new BasicWithoutLinesProfileConverter().validateProfile(data);
        if (isMinimumProfile(data)) return new MinimumProfileConverter().validateProfile(data);

        return {
            valid: false,
            errors: [{ message: 'Unknown or Not Implemented Profile given', path: [] }]
        };
    }

    /**
     * Validates a Factur-X XML string/buffer or a Factur-X PDF document against official XSD schemas and Schematron rules.
     *
     * @param input - XML string, XML buffer, or PDF bytes
     * @param options - Options to toggle XSD and Schematron checks
     * @returns A structured report containing all detected errors, warnings, and profile information
     */
    public static async validate(
        input: ValidatableInput,
        options: ValidationOptions = { checkXsd: true, checkSchematron: true }
    ): Promise<FacturXValidationReport> {
        let xmlString: string;

        try {
            if (this.isPdf(input)) {
                const pdf = await FacturXPdf.createFromFacturXPDF(input);
                const extractedXml = pdf.extractEmbeddedXML();
                if (!extractedXml) {
                    return {
                        isValid: false,
                        profile: 'MINIMUM',
                        issues: [
                            {
                                type: 'general',
                                severity: 'fatal',
                                message: 'No embedded Factur-X XML found in the provided PDF.'
                            }
                        ]
                    };
                }
                xmlString =
                    typeof extractedXml === 'string' ? extractedXml : Buffer.from(extractedXml).toString('utf-8');
            } else {
                xmlString = typeof input === 'string' ? input : Buffer.from(input as ArrayBuffer).toString('utf-8');
            }
        } catch (err: any) {
            return {
                isValid: false,
                profile: 'MINIMUM',
                issues: [
                    {
                        type: 'general',
                        severity: 'fatal',
                        message: `Failed to read input: ${err.message}`
                    }
                ]
            };
        }

        return this.validateXMLString(xmlString, options);
    }

    /**
     * Performs XSD and Schematron/XSLT validation on a raw XML string.
     */
    private static async validateXMLString(
        xmlString: string,
        options: ValidationOptions = { checkXsd: true, checkSchematron: true }
    ): Promise<FacturXValidationReport> {
        const issues: FacturXValidationIssue[] = [];
        let profile: FacturXProfile;

        try {
            profile = this.detectProfileFromXML(xmlString);
        } catch (err: any) {
            return {
                isValid: false,
                profile: 'MINIMUM',
                issues: [
                    {
                        type: 'general',
                        severity: 'fatal',
                        message: `Profile detection failed: ${err.message}`
                    }
                ]
            };
        }

        let xsdResult: XsdValidationResult | undefined;
        let xsltResult: XsltValidationResult | undefined;

        // 1. Run XSD schema validation
        if (options.checkXsd !== false) {
            xsdResult = await validateFacturXXsd(xmlString, profile);
            for (const err of xsdResult.errors) {
                issues.push({
                    type: 'xsd',
                    severity: 'error',
                    message: err.message,
                    location: err.element,
                    line: err.line,
                    raw: err.raw
                });
            }
        }

        // 2. Run Schematron / XSLT business rule validation
        if (options.checkSchematron !== false) {
            xsltResult = await validateFacturXXslt(xmlString, profile);

            for (const err of xsltResult.errors) {
                issues.push({
                    type: 'schematron',
                    severity: err.flag === 'fatal' ? 'fatal' : 'error',
                    message: err.message,
                    code: err.id,
                    location: err.location,
                    test: err.test
                });
            }

            for (const warn of xsltResult.warnings) {
                issues.push({
                    type: 'schematron',
                    severity: 'warning',
                    message: warn.message,
                    code: warn.id,
                    location: warn.location,
                    test: warn.test
                });
            }

            for (const rep of xsltResult.reports) {
                issues.push({
                    type: 'schematron',
                    severity: 'info',
                    message: rep.message,
                    code: rep.id,
                    location: rep.location,
                    test: rep.test
                });
            }
        }

        const areToolsValid = (xsdResult ? xsdResult.isValid : true) && (xsltResult ? xsltResult.isValid : true);
        const hasBlockingIssues = issues.some(i => i.severity === 'error' || i.severity === 'fatal');
        const isValid = areToolsValid && !hasBlockingIssues;

        return {
            isValid,
            profile,
            issues,
            xsdResult,
            xsltResult
        };
    }

    /**
     * Checks if the input is a PDF by inspecting its magic bytes (%PDF-).
     */
    private static isPdf(input: ValidatableInput): boolean {
        if (typeof input === 'string') {
            return input.trimStart().startsWith('%PDF-');
        }

        const buf = Buffer.isBuffer(input) ? input : Buffer.from(input as ArrayBuffer);
        return (
            buf.length >= 4 &&
            buf[0] === 0x25 && // 0x25 is the Hex-Code for '%'
            buf[1] === 0x50 && // 0x50 is the Hex-Code for 'P'
            buf[2] === 0x44 && // 0x44 is the Hex-Code for 'D'
            buf[3] === 0x46 // 0x46 is the Hex-Code for 'F'
        );
    }

    /**
     * Extracts the guideline parameter URN from the XML and maps it to the internal FacturXProfile enum.
     */
    private static detectProfileFromXML(xmlString: string): FacturXProfile {
        const obj = parseXML(xmlString);
        const profileId = objectPath.get(
            obj,
            'rsm:CrossIndustryInvoice.rsm:ExchangedDocumentContext.ram:GuidelineSpecifiedDocumentContextParameter.ram:ID.#text'
        );

        switch (profileId) {
            case 'urn:factur-x.eu:1p0:minimum':
                return 'MINIMUM';
            case 'urn:factur-x.eu:1p0:basicwl':
                return 'BASICWL';
            case 'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic':
                return 'BASIC';
            case 'urn:cen.eu:en16931:2017':
                return 'EN16931';
            case 'urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:extended':
                return 'EXTENDED';
            default:
                throw new Error(`Unknown or unsupported Factur-X Profile URN: ${profileId}`);
        }
    }
}
