import { Schema } from 'node-schematron';
import fs from 'node:fs/promises';
import path from 'node:path';
import objectPath from 'object-path';
import { validateXML } from 'xmllint-wasm';

import { parseXML } from '../../src/core/xml';
import { FacturX } from '../../src/index';
import { ComfortProfileXml, isComfortProfileXml } from '../../src/profiles/comfort/ComfortProfileXml';
import { removeUndefinedKeys } from '../testhelpers';
import './codeDb/xPathDocumentFunction';
import { testComfortProfile } from './comfort_test_objects';

let xmlObject: ComfortProfileXml;
let instance: FacturX;

beforeAll(async () => {
    instance = await FacturX.fromObject(testComfortProfile);
    const xml = await instance.getXML();
    const obj = parseXML(xml);

    if (!isComfortProfileXml(obj)) throw new Error('Conversion to XML Obj failed');

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
                ).toBe('SO-98765');
            });
            test('BT-XX-XX - ContractReferencedDocument', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:ContractReferencedDocument.ram:IssuerAssignedID.#text'
                    )
                ).toBe('CON-54321');
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
                    expect(paymentMeans.length).toBe(4);
                    expect(paymentMeans[0]['ram:TypeCode']['#text']).toBe('59');
                    expect(paymentMeans[0]['ram:PayerPartyDebtorFinancialAccount']['ram:IBANID']['#text']).toBe(
                        'DE89370400440532013000'
                    );
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
                    ).toBe('DDI-001');
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

    describe('BG-25 INVOICE LINE', () => {
        test('First line item details', () => {
            const lineItem = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:IncludedSupplyChainTradeLineItem.0'
            );
            expect(lineItem['ram:AssociatedDocumentLineDocument']['ram:LineID']['#text']).toBe('LINE-001');
            expect(lineItem['ram:SpecifiedTradeProduct']['ram:Name']['#text']).toBe('Premium Schrauben 1kg');
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
            expect(lineItem['ram:SpecifiedLineTradeDelivery']['ram:BilledQuantity']['#text']).toBe('2.00');
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
            expect(monetarySummation['ram:DuePayableAmount']['#text']).toBe('144.60');
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
        ).toBe('urn:cen.eu:en16931:2017');
    });

    describe('Line Item Extensions', () => {
        test('Product Details', () => {
            const firstLineItem = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:IncludedSupplyChainTradeLineItem.0'
            );
            expect(firstLineItem['ram:SpecifiedTradeProduct']['ram:SellerAssignedID']['#text']).toBe('COMP-XYZ-123');
            expect(firstLineItem['ram:SpecifiedTradeProduct']['ram:Description']['#text']).toBe(
                'Präzisionsgefertigte Komponente aus Edelstahl V4A.'
            );
            expect(
                firstLineItem['ram:SpecifiedTradeProduct']['ram:ApplicableProductCharacteristic'][0]['ram:Description'][
                    '#text'
                ]
            ).toBe('Material');
            expect(
                firstLineItem['ram:SpecifiedTradeProduct']['ram:ApplicableProductCharacteristic'][0]['ram:Value'][
                    '#text'
                ]
            ).toBe('Edelstahl 1.4404');
            expect(
                firstLineItem['ram:SpecifiedTradeProduct']['ram:DesignatedProductClassification']['ram:ClassCode'][
                    '#text'
                ]
            ).toBe('27111708');
            expect(
                firstLineItem['ram:SpecifiedTradeProduct']['ram:DesignatedProductClassification']['ram:ClassCode'][
                    '@listID'
                ]
            ).toBe('TST');
            expect(
                firstLineItem['ram:SpecifiedTradeProduct']['ram:DesignatedProductClassification']['ram:ClassCode'][
                    '@listVersionID'
                ]
            ).toBe('v23.0501');
            expect(firstLineItem['ram:SpecifiedTradeProduct']['ram:OriginTradeCountry']['ram:ID']['#text']).toBe('DE');
        });
    });

    describe('Trade Agreement Extensions', () => {
        describe('Seller Extensions', () => {
            test('Seller Trade Contact', () => {
                const tradeContact = objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:DefinedTradeContact'
                );
                expect(tradeContact['ram:PersonName']['#text']).toBe('Hans Müller');
                expect(tradeContact['ram:TelephoneUniversalCommunication']['ram:CompleteNumber']['#text']).toBe(
                    '+49 111222333'
                );
                expect(tradeContact['ram:EmailURIUniversalCommunication']['ram:URIID']['#text']).toBe('hans@firma.de');
            });
        });

        describe('Buyer Extensions', () => {
            test('Buyer Trading Business Name', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:SpecifiedLegalOrganization.ram:TradingBusinessName.#text'
                    )
                ).toBe('Erika GmbH');
            });
        });

        describe('Referenced Documents', () => {
            test('Additional Supporting Documents', () => {
                const supportingDoc0 = objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:AdditionalReferencedDocument.0'
                );
                expect(supportingDoc0['ram:IssuerAssignedID']['#text']).toBe('1234');
                expect(supportingDoc0['ram:Name']['#text']).toBe('Rapport');
                expect(supportingDoc0['ram:URIID']['#text']).toBe('https://example.com/rapport.pdf');
                expect(supportingDoc0['ram:TypeCode']['#text']).toBe('916');
                expect(supportingDoc0['ram:AttachmentBinaryObject']['@mimeCode']).toBe('application/pdf');
                expect(supportingDoc0['ram:AttachmentBinaryObject']['@filename']).toBe('rapport.pdf');

                const supportingDoc1 = objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:AdditionalReferencedDocument.1'
                );
                expect(supportingDoc1['ram:IssuerAssignedID']['#text']).toBe('LOT-001');
                expect(supportingDoc1['ram:TypeCode']['#text']).toBe('50');

                const supportingDoc2 = objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:AdditionalReferencedDocument.2'
                );
                expect(supportingDoc2['ram:IssuerAssignedID']['#text']).toBe('LOT-002');
                expect(supportingDoc2['ram:TypeCode']['#text']).toBe('50');

                const supportingDoc3 = objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:AdditionalReferencedDocument.3'
                );
                expect(supportingDoc3['ram:IssuerAssignedID']['#text']).toBe('ITEM-001');
                expect(supportingDoc3['ram:TypeCode']['#text']).toBe('130');

                const supportingDoc4 = objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:AdditionalReferencedDocument.4'
                );
                expect(supportingDoc4['ram:IssuerAssignedID']['#text']).toBe('ITEM-002');
                expect(supportingDoc4['ram:TypeCode']['#text']).toBe('130');
            });

            test('Project Reference', () => {
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SpecifiedProcuringProject.ram:ID.#text'
                    )
                ).toBe('PRJ-001');
                expect(
                    objectPath.get(
                        xmlObject,
                        'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SpecifiedProcuringProject.ram:Name.#text'
                    )
                ).toBe('Procuring Project XY');
            });
        });
    });

    describe('Payment Extensions', () => {
        test('Financial Card Details', () => {
            const paymentMeans = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementPaymentMeans.2'
            );
            expect(paymentMeans['ram:TypeCode']['#text']).toBe('54'); // Credit Card
            expect(paymentMeans['ram:Information']['#text']).toBe('Credit Card Payment');
            expect(paymentMeans['ram:ApplicableTradeSettlementFinancialCard']['ram:ID']['#text']).toBe('****1111');
        });

        test('BIC Details', () => {
            const paymentMeans = objectPath.get(
                xmlObject,
                'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementPaymentMeans.3'
            );
            expect(paymentMeans['ram:TypeCode']['#text']).toBe('59'); // Credit Card
            expect(paymentMeans['ram:PayeePartyCreditorFinancialAccount']['ram:IBANID']['#text']).toBe(
                'DE89370400440532013000'
            );
            expect(paymentMeans['ram:PayeePartyCreditorFinancialAccount']['ram:AccountName']['#text']).toBe(
                'Max Mustermann'
            );
            expect(paymentMeans['ram:PayeeSpecifiedCreditorFinancialInstitution']['ram:BICID']['#text']).toBe(
                'DEUTDEDBFRA'
            );
        });
    });

    describe('Settlement Extensions', () => {
        test('Tax Point Date', () => {
            expect(
                objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:ApplicableTradeTax.ram:TaxPointDate.udt:DateString.#text'
                )
            ).toBe('20240115');
        });

        test('Rounding Amount', () => {
            expect(
                objectPath.get(
                    xmlObject,
                    'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:RoundingAmount.#text'
                )
            ).toBe('0.01');
        });
    });
});

describe('Build and check XML', () => {
    test('Build XML succeeds', async () => {
        const convertedXML = await instance.getXML();
        expect(convertedXML).toBeDefined();
    });

    test('Check XML against XSD Schemes', async () => {
        const convertedXML = await instance.getXML();
        if (!convertedXML) {
            throw new Error('XSD Check could not be performed as XML conversion failed');
        }

        const xsd = await fs.readFile(
            path.join(__dirname, 'xsdSchemes', 'COMFORT', 'FACTUR-X_1.07.4_EN16931.xsd'),
            'utf-8'
        );

        const xsdImports = [
            'FACTUR-X_EN16931_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
            'FACTUR-X_EN16931_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
            'FACTUR-X_EN16931_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd'
        ];

        const preload: { fileName: string; contents: string }[] = [];

        for (const fileName of xsdImports) {
            const contents = await fs.readFile(path.join(__dirname, 'xsdSchemes', 'COMFORT', fileName), 'utf-8');
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

    test('Builds Valid XML According to SCHEMATRON Schema', async () => {
        const convertedXML = await instance.getXML();

        const schematron = (
            await fs.readFile(path.join(__dirname, 'schematronSchemes', 'FACTUR-X_1.07.4_EN16931.sch'), 'utf-8')
        ).toString();

        const schema = Schema.fromString(schematron);

        const result = schema.validateString(convertedXML);

        if (result.length > 0) console.log(result.map(res => res.message?.trim()));

        expect(result.length).toBe(0);
    });
});

test('Build PDF', async () => {
    const pdfBytes = await instance.getPDF();
    expect(pdfBytes).toBeDefined();
    await fs.writeFile(path.join(__dirname, 'pdf', 'createdPDFs', 'FacturX_Comfort_Test.pdf'), pdfBytes);
});

test('Roundtrip Check', async () => {
    const convertedXML = await instance.getXML();
    const facturx = await FacturX.fromXML(convertedXML);
    const roundtripObject = facturx.object;
    const cleanRoundtripObject = removeUndefinedKeys(roundtripObject);
    expect(cleanRoundtripObject).toEqual(testComfortProfile);
});
