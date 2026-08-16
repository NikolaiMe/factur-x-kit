import fs from 'node:fs/promises';
import path from 'node:path';
import { validateXML } from 'xmllint-wasm';

import { FacturX } from '../src';
import { TotalsCalculatorInputType } from '../src/adapter/totalsCalculator/easyInputType';
import { totalsCalculator } from '../src/adapter/totalsCalculator/totalsCalculator';
import { validateFacturXXsd } from '../src/helper/xsdValidator';
import { validateFacturXXslt } from '../src/helper/xsltValidator';
import { TAX_CATEGORY_CODES, UNIT_CODES } from '../src/types/codes';
import { designTestObject_preCalc } from './design_test_object_preCalc';
// Wir importieren direkt die Funktion, die eine Zahl zurückgibt

import './profiles/codeDb/xPathDocumentFunction';
import { validatePdfWithMustang, validateXmlWithMustang } from './utils/mustangValidator';

describe('calculate totals', () => {
    test.todo('Make proper unit tests for totalsCalculator functions');
    test('System Test: calculate totals for comfort profile with every Tax but "Not subject to VAT Tax" ', async () => {
        const invoiceData = totalsCalculator(designTestObject_preCalc);
        const instance = await FacturX.fromObject(invoiceData);
        const checkProfile = instance.validate();
        expect(checkProfile.valid).toBeTruthy();
    });

    test('System Test: calculate totals for comfort profile with "Not subject to VAT" Tax', async () => {
        const data: TotalsCalculatorInputType = {
            ...designTestObject_preCalc,
            seller: { ...designTestObject_preCalc.seller, taxIdentification: undefined },
            buyer: { ...designTestObject_preCalc.buyer, taxIdentification: undefined },
            invoiceLines: [
                {
                    generalLineData: { lineId: '3' },
                    productDescription: {
                        name: 'Item StandardRate'
                    },
                    productPriceAgreement: {
                        productPricing: {
                            basisPricePerItem: 15
                        }
                    },
                    delivery: { itemQuantity: { quantity: 2, unit: 'KGM' as UNIT_CODES } },
                    settlement: {
                        tax: {
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT
                        }
                    }
                }
            ],
            totals: { ...designTestObject_preCalc.totals, documentLevelAllowancesAndCharges: undefined }
        };
        const invoiceData = totalsCalculator(data);
        const instance = await FacturX.fromObject(invoiceData);

        const checkProfile = instance.validate();
        expect(checkProfile.valid).toBeTruthy();
    });

    describe('Build and check XML', () => {
        test('Check XML against XSD Schemes', async () => {
            const invoiceData = totalsCalculator(designTestObject_preCalc);
            const instance = await FacturX.fromObject(invoiceData);

            const convertedXML = await instance.getXML();
            if (!convertedXML) {
                throw new Error('XSD Check could not be performed as XML conversion failed');
            }

            if (!convertedXML) {
                throw new Error('XSD Check could not be performed as XML conversion failed');
            }

            const result = await validateFacturXXsd(convertedXML, 'EN16931');

            if (!result.isValid) console.log(result.errors);
            expect(result.isValid).toBe(true);
        }, 30000);

        test('Check XML against XSLT', async () => {
            const invoiceData = totalsCalculator(designTestObject_preCalc);
            const instance = await FacturX.fromObject(invoiceData);

            const convertedXML = await instance.getXML();
            const result = await validateFacturXXslt(convertedXML, 'EN16931');

            if (!result.isValid) {
                console.log(result.errors);
                console.log(result.warnings);
            }
            expect(result.isValid).toBe(true);
        }, 30000);
    });

    test('Build and validate PDF', async () => {
        const invoiceData = totalsCalculator(designTestObject_preCalc);
        const instance = await FacturX.fromObject(invoiceData);

        const pdfBytes = await instance.getPDF();
        expect(pdfBytes).toBeDefined();
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'CalculatorTests.pdf'), pdfBytes);
        const result = await validatePdfWithMustang(path.join(__dirname, 'pdfs', 'createdPDFs', 'CalculatorTests.pdf'));
        expect(result.isValid).toBe(true);
    }, 30000);
});
