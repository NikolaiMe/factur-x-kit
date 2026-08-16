import fs from 'node:fs/promises';
import path from 'node:path';
import { validateXML } from 'xmllint-wasm';

import { FacturX } from '../src';
import { TotalsCalculatorInputType } from '../src/adapter/totalsCalculator/easyInputType';
import { totalsCalculator } from '../src/adapter/totalsCalculator/totalsCalculator';
import { TAX_CATEGORY_CODES, UNIT_CODES } from '../src/types/codes';
import { designTestObject_preCalc } from './design_test_object_preCalc';
// Wir importieren direkt die Funktion, die eine Zahl zurückgibt

import './profiles/codeDb/xPathDocumentFunction';
import { validateXmlWithMustang } from './utils/mustangValidator';

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

            const xsd = await fs.readFile(
                path.join(__dirname, 'profiles', 'xsdSchemes', 'COMFORT', 'FACTUR-X_1.07.4_EN16931.xsd'),
                'utf-8'
            );

            const xsdImports = [
                'FACTUR-X_EN16931_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                'FACTUR-X_EN16931_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                'FACTUR-X_EN16931_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd'
            ];

            const preload: { fileName: string; contents: string }[] = [];

            for (const fileName of xsdImports) {
                const contents = await fs.readFile(
                    path.join(__dirname, 'profiles', 'xsdSchemes', 'COMFORT', fileName),
                    'utf-8'
                );
                preload.push({
                    fileName,
                    contents
                });
            }
            const result = await validateXML({
                xml: [
                    {
                        fileName: 'e-invoice.xml',
                        contents: convertedXML
                    }
                ],
                schema: [xsd],
                preload
            });

            if (!result.valid) console.log(result.errors);
            expect(result.valid).toBe(true);
        });
    });

    describe('Factur-X Validierung mit Mustang', () => {
        it('sollte valides Factur-X XML erzeugen und mit Mustang bestehen', async () => {
            // Generiere hier dein XML-String aus deiner Bibliotheks-Logik
            const invoiceData = totalsCalculator(designTestObject_preCalc);
            const instance = await FacturX.fromObject(invoiceData);

            const convertedXML = await instance.getXML();
            console.log('Converted XML:\n', convertedXML);
            const result = await validateXmlWithMustang(convertedXML);

            if (!result.isValid) {
                console.error('Mustang Validierungsbericht:\n', result.output);
            }

            // Assertion for Jest
            expect(result.isValid).toBe(true);
        });
    });
});
