import fs from 'node:fs/promises';
import path from 'node:path';
import objectPath from 'object-path';

import { parseXML } from '../../src/core/xml';
import { validateFacturXXsd } from '../../src/helper/xsdValidator';
import { validateFacturXXslt } from '../../src/helper/xsltValidator';
import { FacturX } from '../../src/index';
import { MinimumProfile } from '../../src/profiles/minimum/MinimumProfile';
import { isMinimumProfileXml } from '../../src/profiles/minimum/MinimumProfileXml';
import { PROFILES } from '../../src/types/ProfileTypes';
import { COUNTRY_ID_CODES, CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../src/types/codes';
import { removeUndefinedKeys } from '../testhelpers';
import { validatePdfWithMustang } from '../utils/mustangValidator';
import './codeDb/xPathDocumentFunction';

const testObj: MinimumProfile = {
    businessProcessType: 'A1',
    profile: PROFILES.MINIMUM,

    document: {
        id: 'RE20248731',
        type: DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE,
        dateOfIssue: { year: 2024, month: 11, day: 20 },
        currency: CURRENCY_CODES.Euro
    },
    seller: {
        name: 'ZUGFeRD AG',
        specifiedLegalOrganization: {
            id: {
                id: 'ZUGFERDAG',
                scheme: ISO6523_CODES.Data_Universal_Numbering_System_DUNS_Number
            }
        },
        postalAddress: {
            country: COUNTRY_ID_CODES.GERMANY
        },
        taxIdentification: {
            vatId: 'DE124356789'
        }
    },
    buyer: {
        reference: '991-1234512345-06',
        name: 'FACTURX AG',
        specifiedLegalOrganization: {
            id: {
                id: 'FACTURXAG',
                scheme: ISO6523_CODES.Data_Universal_Numbering_System_DUNS_Number
            }
        }
    },
    referencedDocuments: {
        orderReference: { documentId: 'ORD123456' }
    },
    totals: {
        netTotal: 200,
        taxTotal: [{ amount: 38, currency: CURRENCY_CODES.Euro }],
        grossTotal: 238,
        openAmount: 238
    }
};

let instance: FacturX;
let xml: string;
let parsedXml: object;

beforeAll(async () => {
    instance = await FacturX.fromObject(testObj);
    xml = await instance.getXML();
    parsedXml = parseXML(xml);
});

describe('Create FacturX Instance from Object', () => {
    test('Builds XML with Correct Profile', () => {
        expect(isMinimumProfileXml(parsedXml)).toBe(true);
    });

    test('Builds XML with Provided Values', () => {
        function valueAtXpath(key: string) {
            return objectPath.get(parsedXml, `rsm:CrossIndustryInvoice.${key}`);
        }

        expect(
            valueAtXpath(
                'rsm:ExchangedDocumentContext.ram:BusinessProcessSpecifiedDocumentContextParameter.ram:ID.#text'
            )
        ).toBe('A1');

        expect(
            valueAtXpath('rsm:ExchangedDocumentContext.ram:GuidelineSpecifiedDocumentContextParameter.ram:ID.#text')
        ).toBe('urn:factur-x.eu:1p0:minimum');

        expect(valueAtXpath('rsm:ExchangedDocument.ram:ID.#text')).toBe('RE20248731');

        expect(valueAtXpath('rsm:ExchangedDocument.ram:TypeCode.#text')).toBe('380');

        expect(valueAtXpath('rsm:ExchangedDocument.ram:IssueDateTime.udt:DateTimeString.#text')).toBe('20241120');

        expect(valueAtXpath('rsm:ExchangedDocument.ram:IssueDateTime.udt:DateTimeString.@format')).toBe('102');

        expect(
            valueAtXpath('rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerReference.#text')
        ).toBe('991-1234512345-06');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:Name.#text'
            )
        ).toBe('ZUGFeRD AG');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.#text'
            )
        ).toBe('ZUGFERDAG');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.@schemeID'
            )
        ).toBe('0060');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:CountryID.#text'
            )
        ).toBe('DE');

        const sellerTaxArray = valueAtXpath(
            'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedTaxRegistration'
        );

        expect(Array.isArray(sellerTaxArray)).toBeFalsy();
        expect(sellerTaxArray['ram:ID']?.['#text']).toBe('DE124356789');
        expect(sellerTaxArray['ram:ID']?.['@schemeID']).toBe('VA');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:Name.#text'
            )
        ).toBe('FACTURX AG');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.#text'
            )
        ).toBe('FACTURXAG');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.@schemeID'
            )
        ).toBe('0060');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerOrderReferencedDocument.ram:IssuerAssignedID.#text'
            )
        ).toBe('ORD123456');

        expect(valueAtXpath('rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.#text')).toBe('');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:InvoiceCurrencyCode.#text'
            )
        ).toBe('EUR');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:TaxBasisTotalAmount.#text'
            )
        ).toBe('200.00');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:TaxTotalAmount.#text'
            )
        ).toBe('38.00');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:TaxTotalAmount.@currencyID'
            )
        ).toBe('EUR');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:GrandTotalAmount.#text'
            )
        ).toBe('238.00');

        expect(
            valueAtXpath(
                'rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:DuePayableAmount.#text'
            )
        ).toBe('238.00');
    });
});

describe('Build and check XML', () => {
    test('Build XML succeeds', async () => {
        const convertedXML = await instance.getXML();
        expect(convertedXML).toBeDefined();
        await fs.writeFile(path.join(__dirname, 'xml', 'createdXml', 'Minimum_Test.xml'), convertedXML);
    });

    test('Check XML against XSD Schemes', async () => {
        const convertedXML = await instance.getXML();
        if (!convertedXML) {
            throw new Error('XSD Check could not be performed as XML conversion failed');
        }

        const result = await validateFacturXXsd(convertedXML, 'MINIMUM');

        if (!result.isValid) console.log(result.errors);
        expect(result.isValid).toBe(true);
    });

    test('Check XML against XSLT', async () => {
        const convertedXML = await instance.getXML();
        const result = await validateFacturXXslt(convertedXML, 'MINIMUM');

        if (!result.isValid) {
            console.log(result.errors);
            console.log(result.warnings);
        }
        expect(result.isValid).toBe(true);
    });
});

test('Build and validate PDF', async () => {
    const pdfBytes = await instance.getPDF();
    expect(pdfBytes).toBeDefined();
    await fs.writeFile(path.join(__dirname, 'pdf', 'createdPDFs', 'FacturX_MINIMUM_Test.pdf'), pdfBytes);
    const result = await validatePdfWithMustang(path.join(__dirname, 'pdf', 'createdPDFs', 'FacturX_MINIMUM_Test.pdf'));
    expect(result.isValid).toBe(true);
}, 30000);

test('Roundtrip Check', async () => {
    const convertedXML = await instance.getXML();
    const facturx = await FacturX.fromXML(convertedXML);
    const roundtripObject = facturx.object;
    const cleanRoundtripObject = removeUndefinedKeys(roundtripObject);
    expect(cleanRoundtripObject).toEqual(testObj);
});
