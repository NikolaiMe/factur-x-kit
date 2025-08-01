import objectPath from 'object-path'
import { PDFDocument } from 'pdf-lib'

import { ImageDimensions } from '../pdfTemplates/invoiceBlocks/headerImage'
import { SupportedLocales, ZugferdKitPDFTemplate } from '../pdfTemplates/types'
import { BasicProfile, isBasicProfile } from '../profiles/basic/BasicProfile'
import { BasicProfileConverter } from '../profiles/basic/BasicProfileConverter'
import {
    BasicWithoutLinesProfile,
    BasicWithoutLinesProfileConverter,
    isBasicWithoutLinesProfile
} from '../profiles/basicwithoutlines/index'
import { ComfortProfile, isComfortProfile } from '../profiles/comfort/ComfortProfile'
import { ComfortProfileConverter } from '../profiles/comfort/ComfortProfileConverter'
import { validationResult } from '../profiles/convert'
import { MinimumProfile, MinimumProfileConverter, isMinimumProfile } from '../profiles/minimum/index'
import FacturXPdf from './pdf'
import { buildXML, parseXML } from './xml'

export type availableProfiles = MinimumProfile | BasicWithoutLinesProfile | BasicProfile | ComfortProfile
export type availableConverters =
    | MinimumProfileConverter
    | BasicWithoutLinesProfileConverter
    | BasicProfileConverter
    | ComfortProfileConverter

export class FacturX {
    private profile: availableProfiles
    private converter: availableConverters
    // private _data: MinimumProfileConverter | BasicProfileConverter

    private _fromPDF: string | Uint8Array | ArrayBuffer | undefined
    private _fromXML: string | Buffer | undefined
    private _pdf: FacturXPdf | undefined

    constructor(profile: availableProfiles, converter: availableConverters) {
        this.profile = profile
        this.converter = converter
    }

    get pdf() {
        return this._pdf
    }

    public validate(): validationResult {
        return this.converter.validateProfile(this.profile)
    }

    /**
     * Returns the current Factur-X data
     *
     * @returns An object with the current Factur-X data
     */
    public async getObject(): Promise<availableProfiles> {
        // TODO: should we deep-clone this here to prevent editing?
        return this.profile
        // return this._data.invoice
    }

    /**
     * Returns a PDF with Embedded Factur-X XML
     *
     * @param pdfBytes - The PDF the Factur-X XML should be embedded into
     * @returns The given PDF with embedded Factur-X XML
     */

    public async getPDF(options?: {
        keepInitialPdf?: boolean
        existingNonConformantPdf?: string | Uint8Array | ArrayBuffer | null
        pdfLibDocument?: PDFDocument | null
        pdfTemplate?: ZugferdKitPDFTemplate
        locale?: SupportedLocales
        headerImage?: {
            path: string
            dimensions: ImageDimensions
        }
    }): Promise<Uint8Array> {
        if (options?.existingNonConformantPdf) {
            this._pdf = await FacturXPdf.createFromNonCompliantPDF(options?.existingNonConformantPdf)
        } else if (options?.pdfLibDocument) {
            this._pdf = await FacturXPdf.createFromPDFDocument(options?.pdfLibDocument)
        } else if (options?.keepInitialPdf && !this._pdf) {
            throw new Error('You can only use keepInitialPdf if you created the FacturX Object via FacturX.fromPdf')
        } else {
            this._pdf = await FacturXPdf.create()
            await this._pdf.createPDFContent(this.profile, options?.pdfTemplate, options?.locale, options?.headerImage)
        }
        return this._pdf.createFacturXPDF(await this.getXML(), this.profile)
    }

    /**
     * Returns a Factur-X XML with the current data
     *
     * @returns The data of this Factur-X instace as XML
     */
    public async getXML(): Promise<string> {
        const xml = this.converter.obj2xml(this.profile)
        return buildXML(xml)
    }

    public static async fromObject(data: object): Promise<FacturX> {
        if (isComfortProfile(data)) {
            return new FacturX(data, new ComfortProfileConverter())
        }
        if (isBasicProfile(data)) {
            return new FacturX(data, new BasicProfileConverter())
        }
        if (isBasicWithoutLinesProfile(data)) {
            return new FacturX(data, new BasicWithoutLinesProfileConverter())
        }
        if (isMinimumProfile(data)) {
            return new FacturX(data, new MinimumProfileConverter())
        }

        throw new Error('Unknown or Not Implemented Profile given')
    }

    public static async fromPDF(bytes: string | Uint8Array | ArrayBuffer): Promise<FacturX> {
        const pdf = await FacturXPdf.createFromFacturXPDF(bytes)
        const xml = pdf.extractEmbeddedXML()

        if (!xml) throw new Error('No Embedded Factur-X XML found in PDF')

        const instance = await this.fromXML(Buffer.from(xml))
        instance._fromPDF = bytes
        instance._pdf = pdf

        return instance
    }

    public static async fromXML(xml: string | Buffer): Promise<FacturX> {
        const obj = parseXML(xml)

        let instance: FacturX | undefined

        const profileId = objectPath.get(
            obj,
            'rsm:CrossIndustryInvoice.rsm:ExchangedDocumentContext.ram:GuidelineSpecifiedDocumentContextParameter.ram:ID.#text'
        )

        switch (profileId) {
            case 'urn:factur-x.eu:1p0:minimum': {
                const converter = new MinimumProfileConverter()
                const data = converter.xml2obj(obj)
                instance = new FacturX(data, converter)
                instance._fromXML = xml
                break
            }
            case 'urn:factur-x.eu:1p0:basicwl': {
                const converter = new BasicWithoutLinesProfileConverter()
                const data = converter.xml2obj(obj)
                instance = new FacturX(data, converter)
                instance._fromXML = xml
                break
            }
            // instance = new FacturX(obj, 'BASIC_XML')
            // instance._fromXML = xml
            // break
            case 'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic': {
                const converter = new BasicProfileConverter()
                const data = converter.xml2obj(obj)
                instance = new FacturX(data, converter)
                instance._fromXML = xml
                break
            }
            case 'urn:cen.eu:en16931:2017': {
                const converter = new ComfortProfileConverter()
                const data = converter.xml2obj(obj)
                instance = new FacturX(data, converter)
                instance._fromXML = xml
                break
            }
            case 'urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:extended':
            case 'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0':
                throw new Error(`Profile not yet implemented: ${profileId}`)
            default:
                throw new Error(`Unknown Profile: ${profileId}`)
        }

        instance._fromXML = xml

        return instance
    }
}
