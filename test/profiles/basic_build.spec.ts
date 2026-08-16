import fs from 'node:fs/promises';
import path from 'node:path';
import objectPath from 'object-path';

import { parseXML } from '../../src/core/xml';
import { validateFacturXXsd } from '../../src/helper/xsdValidator';
import { validateFacturXXslt } from '../../src/helper/xsltValidator';
import { FacturX } from '../../src/index';
import { BasicProfileXml, isBasicProfileXml } from '../../src/profiles/basic';
import { removeUndefinedKeys } from '../testhelpers';
import { validatePdfWithMustang } from '../utils/mustangValidator';
import { testBasicProfile } from './basic_test_objects';
import './codeDb/xPathDocumentFunction';

let xmlObject: BasicProfileXml;
let instance: FacturX;

beforeAll(async () => {
    instance = await FacturX.fromObject(testBasicProfile);
    const xml = await instance.getXML();
    const obj = parseXML(xml);

    if (!isBasicProfileXml(obj)) throw new Error('Conversion to XML Obj failed');

    xmlObject = obj;
});

describe('Re-Check lower profiles', () => {
    describe('7.2.2 - ExchangedDocument - Page 44/85.', () => {
        test('BT-1 - Invoice number', () => {
            expect(objectPath.get(xmlObject, 'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:ID.#text')).toBe(
                'DOC-12345'
            );
        });

        test('BT-3 - Type Code', () => {
            expect(objectPath.get(xmlObject, 'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:TypeCode.#text')).toBe(
                '380'
            );
        });
        test('BT-2 - Invoice issue date', () => {
            expect(
                objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:IssueDateTime.udt:DateTimeString.#text'
                )
            ).toBe('20231001');
            expect(
                objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:IssueDateTime.udt:DateTimeString.@format'
                )
            ).toBe('102');
        });
        test('BT-X - Notes', () => {
            const notesArray = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:IncludedNote'
            );
            expect(Array.isArray(notesArray)).toBeTruthy();
            expect(notesArray.length).toBe(2);
            expect(notesArray[0]['ram:Content']['#text']).toBe('Note 1');
            expect(notesArray[0]['ram:SubjectCode']['#text']).toBe('ABS');
            expect(notesArray[1]['ram:Content']['#text']).toBe('Note 2');
            expect(notesArray[1]['ram:SubjectCode']['#text']).toBe('AEA');
        });
    });

    describe('7.3.3 - SupplyChainTradeTransaction - Page 44/85 ff.', () => {
        describe('7.3.3.1 - ApplicableHeaderTradeAgreement', () => {
            test('BT-10-00 - Buyer reference', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerReference.#text'
                    )
                ).toBe('Buyer Reference');
            });
            describe('BG-4 - SELLER', () => {
                test('BT-27 - Seller name', () => {
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:Name.#text'
                        )
                    ).toBe('Seller Company');
                });
                test('BT-30-00 - Seller legal registration', () => {
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.#text'
                        )
                    ).toBe('LEGAL-1');
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.@schemeID'
                        )
                    ).toBe('0060');
                });
                describe('BG-5 - SELLER POSTAL ADDRESS', () => {
                    test('BT-40 - Seller country code', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:CountryID.#text'
                            )
                        ).toBe('DE');
                    });
                    test('BT-X - Seller postcode', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:PostcodeCode.#text'
                            )
                        ).toBe('12345');
                    });
                    test('BT-X - Seller address line one', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:LineOne.#text'
                            )
                        ).toBe('123 Seller St');
                    });
                    test('BT-X - Seller address line two', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:LineTwo.#text'
                            )
                        ).toBe('Suite 100');
                    });
                    test('BT-X - Seller address line three', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:LineThree.#text'
                            )
                        ).toBe('Building A');
                    });
                    test('BT-X - Seller city', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:CityName.#text'
                            )
                        ).toBe('Seller City');
                    });
                    test('BT-X - Seller country subdivision', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:CountrySubDivisionName.#text'
                            )
                        ).toBe('Seller State');
                    });
                });
                test('BT-31-00 - Seller VAT identifier', () => {
                    const sellerTaxArray = objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedTaxRegistration'
                    );
                    expect(Array.isArray(sellerTaxArray)).toBeFalsy();
                    expect(sellerTaxArray['ram:ID']?.['#text']).toBe('DE123456789');
                    expect(sellerTaxArray['ram:ID']?.['@schemeID']).toBe('VA');
                });
            });
            describe('BG-5 - BUYER', () => {
                test('BT-44 - Buyer name', () => {
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:Name.#text'
                        )
                    ).toBe('Buyer Company');
                });
                test('BT-47-00 - Buyer legal registration', () => {
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.#text'
                        )
                    ).toBe('LEGAL-BUYER-1');
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:SpecifiedLegalOrganization.ram:ID.@schemeID'
                        )
                    ).toBe('0060');
                });
                describe('BG-X - BUYER POSTAL ADDRESS', () => {
                    test('BT-X - Buyer country code', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:CountryID.#text'
                            )
                        ).toBe('DE');
                    });
                    test('BT-X - Buyer postcode', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:PostcodeCode.#text'
                            )
                        ).toBe('67890');
                    });
                    test('BT-X - Buyer address line one', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:LineOne.#text'
                            )
                        ).toBe('456 Buyer St');
                    });
                    test('BT-X - Buyer address line two', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:LineTwo.#text'
                            )
                        ).toBe('Suite 200');
                    });
                    test('BT-X - Buyer address line three', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:LineThree.#text'
                            )
                        ).toBe('Building B');
                    });
                    test('BT-X - Buyer city', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:CityName.#text'
                            )
                        ).toBe('Buyer City');
                    });
                    test('BT-X - Buyer country subdivision', () => {
                        expect(
                            objectPath.get(
                                xmlObject,
                                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:PostalTradeAddress.ram:CountrySubDivisionName.#text'
                            )
                        ).toBe('Buyer State');
                    });
                });
            });
            test('BT-13-00 - BuyerOrderReferencedDocument', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerOrderReferencedDocument.ram:IssuerAssignedID.#text'
                    )
                ).toBe('ORDER-12345');
            });
            test('BT-XX-XX - ContractReferencedDocument', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:ContractReferencedDocument.ram:IssuerAssignedID.#text'
                    )
                ).toBe('CONTRACT-12345');
            });
        });
        describe('BG-13-00 ApplicableHeaderTradeDelivery', () => {
            test('BT-X - Delivery recipient id', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:ID.#text'
                    )
                ).toBe('RECIPIENT-1');
            });
            test('BT-X - Delivery recipient global id', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:GlobalID.#text'
                    )
                ).toBe('GLOBAL-RECIPIENT-1');
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:GlobalID.@schemeID'
                    )
                ).toBe('0204');
            });
            test('BT-X - Delivery recipient name', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:Name.#text'
                    )
                ).toBe('Recipient Company');
            });
            test('BT-X - Delivery recipient postal address postcode', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:PostcodeCode.#text'
                    )
                ).toBe('98765');
            });
            test('BT-X - Delivery recipient postal address line one', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:LineOne.#text'
                    )
                ).toBe('123 Recipient St');
            });
            test('BT-X - Delivery recipient postal address line two', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:LineTwo.#text'
                    )
                ).toBe('Suite 400');
            });
            test('BT-X - Delivery recipient postal address line three', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:LineThree.#text'
                    )
                ).toBe('Building D');
            });
            test('BT-X - Delivery recipient postal address city', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:CityName.#text'
                    )
                ).toBe('Recipient City');
            });
            test('BT-X - Delivery recipient postal address country', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:CountryID.#text'
                    )
                ).toBe('GB');
            });
            test('BT-X - Delivery recipient postal address country subdivision', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ShipToTradeParty.ram:PostalTradeAddress.ram:CountrySubDivisionName.#text'
                    )
                ).toBe('Recipient State');
            });
            test('BT-X - Delivery date', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:ActualDeliverySupplyChainEvent.ram:OccurrenceDateTime.udt:DateTimeString.#text'
                    )
                ).toBe('20231005');
            });
            test('BT-X - Advance shipping notice', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeDelivery.ram:DespatchAdviceReferencedDocument.ram:IssuerAssignedID.#text'
                    )
                ).toBe('ASN-12345');
            });
        });

        describe('BG-19 ApplicableHeaderTradeSettlement', () => {
            describe('Payment Information', () => {
                test('BT-X Creditor Reference', () => {
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:CreditorReferenceID.#text'
                        )
                    ).toBe('CREDITOR-12345');
                });

                test('Payment Means', () => {
                    const paymentMeans = objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementPaymentMeans'
                    );
                    expect(Array.isArray(paymentMeans)).toBeTruthy();
                    expect(paymentMeans.length).toBe(2);
                    expect(paymentMeans[0]['ram:TypeCode']['#text']).toBe('58');
                    expect(paymentMeans[0]['ram:PayeePartyCreditorFinancialAccount']['ram:IBANID']['#text']).toBe(
                        'DE89370400440532013001'
                    );
                });

                test('Payment Terms', () => {
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradePaymentTerms.ram:Description.#text'
                        )
                    ).toBe('Payment due in 30 days');
                    expect(
                        objectPath.get(
                            xmlObject,
                            'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradePaymentTerms.ram:DirectDebitMandateID.#text'
                        )
                    ).toBe('DDM-12345');
                });
            });

            describe('Seller Additional Information', () => {
                test('Seller IDs', () => {
                    const sellerIds = objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:ID'
                    );
                    expect(Array.isArray(sellerIds)).toBeTruthy();
                    expect(sellerIds.length).toBe(2);
                    expect(sellerIds[0]['#text']).toBe('SELLER-1');
                    expect(sellerIds[1]['#text']).toBe('SELLER-2');
                });

                test('Seller Global IDs', () => {
                    const globalIds = objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:GlobalID'
                    );
                    expect(Array.isArray(globalIds)).toBeTruthy();
                    expect(globalIds.length).toBe(2);
                    expect(globalIds[0]['#text']).toBe('GLOBAL-1');
                    expect(globalIds[0]['@schemeID']).toBe('0204');
                    expect(globalIds[1]['#text']).toBe('GLOBAL-2');
                    expect(globalIds[1]['@schemeID']).toBe('0131');
                });
            });
        });
    });
});

describe('Profile specific tests', () => {
    test('BT-24 - Specification identifier', () => {
        expect(
            objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:ExchangedDocumentContext.ram:GuidelineSpecifiedDocumentContextParameter.ram:ID.#text'
            )
        ).toBe('urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic');
    });

    describe('BG-25 INVOICE LINE', () => {
        test('First line item details', () => {
            const lineItem = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:IncludedSupplyChainTradeLineItem.0'
            );
            expect(lineItem['ram:AssociatedDocumentLineDocument']['ram:LineID']['#text']).toBe('LINE-001');
            expect(lineItem['ram:SpecifiedTradeProduct']['ram:Name']['#text']).toBe('Premium Coffee Beans 1kg');
            expect(lineItem['ram:SpecifiedTradeProduct']['ram:GlobalID']['#text']).toBe('12345678');
            expect(lineItem['ram:SpecifiedTradeProduct']['ram:GlobalID']['@schemeID']).toBe('0160');
            expect(
                lineItem['ram:SpecifiedLineTradeAgreement']['ram:GrossPriceProductTradePrice']['ram:ChargeAmount'][
                    '#text'
                ]
            ).toBe('20.0000');
            expect(
                lineItem['ram:SpecifiedLineTradeAgreement']['ram:NetPriceProductTradePrice']['ram:ChargeAmount'][
                    '#text'
                ]
            ).toBe('19.0000');
            expect(lineItem['ram:SpecifiedLineTradeDelivery']['ram:BilledQuantity']['#text']).toBe('5.00');
            expect(lineItem['ram:SpecifiedLineTradeDelivery']['ram:BilledQuantity']['@unitCode']).toBe('KGM');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:ApplicableTradeTax']['ram:TypeCode']['#text']
            ).toBe('VAT');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:ApplicableTradeTax']['ram:CategoryCode']['#text']
            ).toBe('S');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:ApplicableTradeTax']['ram:RateApplicablePercent'][
                    '#text'
                ]
            ).toBe('19.0000');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:SpecifiedTradeSettlementLineMonetarySummation'][
                    'ram:LineTotalAmount'
                ]['#text']
            ).toBe('90.00');
        });

        test('Second line item details', () => {
            const lineItem = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:IncludedSupplyChainTradeLineItem.1'
            );
            expect(lineItem['ram:AssociatedDocumentLineDocument']['ram:LineID']['#text']).toBe('LINE-002');
            expect(lineItem['ram:SpecifiedTradeProduct']['ram:Name']['#text']).toBe('Organic Tea Leaves 500g');
            expect(
                lineItem['ram:SpecifiedLineTradeAgreement']['ram:NetPriceProductTradePrice']['ram:ChargeAmount'][
                    '#text'
                ]
            ).toBe('15.0000');
            expect(lineItem['ram:SpecifiedLineTradeDelivery']['ram:BilledQuantity']['#text']).toBe('3.00');
            expect(lineItem['ram:SpecifiedLineTradeDelivery']['ram:BilledQuantity']['@unitCode']).toBe('KGM');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:ApplicableTradeTax']['ram:TypeCode']['#text']
            ).toBe('VAT');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:ApplicableTradeTax']['ram:CategoryCode']['#text']
            ).toBe('S');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:ApplicableTradeTax']['ram:RateApplicablePercent'][
                    '#text'
                ]
            ).toBe('19.0000');
            expect(
                lineItem['ram:SpecifiedLineTradeSettlement']['ram:SpecifiedTradeSettlementLineMonetarySummation'][
                    'ram:LineTotalAmount'
                ]['#text']
            ).toBe('45.00');
        });
    });

    describe('Document Totals', () => {
        test('BG-22 Document level totals', () => {
            const monetarySummation = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation'
            );
            expect(monetarySummation['ram:LineTotalAmount']['#text']).toBe('135.00');
            expect(monetarySummation['ram:AllowanceTotalAmount']['#text']).toBe('13.50');
            expect(monetarySummation['ram:TaxBasisTotalAmount']['#text']).toBe('121.50');
            expect(monetarySummation['ram:TaxTotalAmount']['#text']).toBe('23.09');
            expect(monetarySummation['ram:GrandTotalAmount']['#text']).toBe('144.59');
            expect(monetarySummation['ram:DuePayableAmount']['#text']).toBe('144.59');
        });
    });
});

describe('Build and check XML', () => {
    test('Build XML succeeds', async () => {
        const convertedXML = await instance.getXML();
        expect(convertedXML).toBeDefined();
        await fs.writeFile(path.join(__dirname, 'xml', 'createdXml', 'Basic_Test.xml'), convertedXML);
    });

    test('Check XML against XSD Schemes', async () => {
        const convertedXML = await instance.getXML();
        if (!convertedXML) {
            throw new Error('XSD Check could not be performed as XML conversion failed');
        }

        const result = await validateFacturXXsd(convertedXML, 'BASIC');

        if (!result.isValid) console.log(result.errors);
        expect(result.isValid).toBe(true);
    });

    test('Check XML against XSLT', async () => {
        const convertedXML = await instance.getXML();
        const result = await validateFacturXXslt(convertedXML, 'BASIC');

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
    await fs.writeFile(path.join(__dirname, 'pdf', 'createdPDFs', 'FacturX_BASIC_Test.pdf'), pdfBytes);
    const result = await validatePdfWithMustang(path.join(__dirname, 'pdf', 'createdPDFs', 'FacturX_BASIC_Test.pdf'));
    expect(result.isValid).toBe(true);
}, 30000);

test('Roundtrip Check', async () => {
    const convertedXML = await instance.getXML();
    const facturx = await FacturX.fromXML(convertedXML);
    const roundtripObject = facturx.object;
    const cleanRoundtripObject = removeUndefinedKeys(roundtripObject);
    expect(cleanRoundtripObject).toEqual(testBasicProfile);
});
