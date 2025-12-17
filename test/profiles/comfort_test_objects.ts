import { ComfortProfile } from '../../src/profiles/comfort';
import { PROFILES } from '../../src/types/ProfileTypes';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    ISO6523_CODES,
    MIME_CODES,
    PAYMENT_MEANS_CODES,
    REFERENCED_DOCUMENT_TYPE_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES,
    UNTDID_1153,
    UNTDID_7143
} from '../../src/types/codes';
import { ComfortTradeLineItem } from '../../src/types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem';
import { testBasicProfile } from './basic_test_objects';

const lineObject1: ComfortTradeLineItem = {
    generalLineData: {
        lineId: 'LINE-001',
        lineNote: {
            content: 'First item line note'
        }
    },
    productDescription: {
        globalId: {
            id: '12345678',
            scheme: ISO6523_CODES.GTIN_Global_Trade_Item_Number
        },
        sellerProductId: 'COMP-XYZ-123',
        name: 'Premium Schrauben 1kg',
        description: 'Präzisionsgefertigte Komponente aus Edelstahl V4A.',
        productCharacteristic: [
            { characteristic: 'Material', value: 'Edelstahl 1.4404' },
            { characteristic: 'Oberfläche', value: 'Gebürstet' }
        ],
        productClassification: [
            {
                productClass: {
                    code: '27111708',
                    codeScheme: UNTDID_7143.UNSPSC,
                    codeSchemeVersion: 'v23.0501'
                }
            }
        ],
        originTradeCountry: COUNTRY_ID_CODES.GERMANY
    },
    productPriceAgreement: {
        referencedOrder: {
            lineId: 'CUST-PO-12345-LN10'
        },
        productPricing: {
            basisPricePerItem: 20,
            priceBaseQuantity: {
                quantity: 1,
                unit: UNIT_CODES.KILOGRAM
            },
            priceAllowancesAndCharges: {
                allowances: [{ actualAmount: 1.0 }]
            }
        },
        productNetPricing: {
            netPricePerItem: 19.0,
            priceBaseQuantity: {
                quantity: 1,
                unit: UNIT_CODES.KILOGRAM
            }
        }
    },
    delivery: {
        itemQuantity: {
            quantity: 5,
            unit: UNIT_CODES.KILOGRAM
        }
    },
    settlement: {
        tax: {
            typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
            rateApplicablePercent: 19
        },
        lineLevelAllowancesAndCharges: {
            allowances: [
                {
                    actualAmount: 5.0,
                    reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                    reason: 'Volume discount'
                }
            ]
        },
        lineTotals: {
            netTotal: 90.0
        },
        additionalReferences: [
            {
                documentId: 'Lieferschein LS-9876',
                typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet,
                referenceTypeCode: UNTDID_1153.Bar_coded_label_serial_number
            }
        ],
        accountingInformation: {
            id: 'Projekt P-100-A'
        }
    }
};
export const lineObject2: ComfortTradeLineItem = {
    generalLineData: {
        lineId: 'LINE-002'
    },
    productDescription: {
        buyerProductId: 'MAINT-PLAN-BASIC',
        name: 'Organic Tea Leaves 500g'
    },
    productPriceAgreement: {
        productNetPricing: {
            netPricePerItem: 15.0
        }
    },
    delivery: {
        itemQuantity: {
            quantity: 2,
            unit: UNIT_CODES.KILOGRAM
        }
    },
    settlement: {
        tax: {
            typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
            rateApplicablePercent: 19
        },
        billingPeriod: {
            startDate: {
                year: 2024,
                month: 1,
                day: 1
            },
            endDate: {
                year: 2024,
                month: 1,
                day: 31
            }
        },
        lineLevelAllowancesAndCharges: {
            charges: [
                {
                    actualAmount: 15.0,
                    reasonCode: CHARGE_REASONS_CODES.Mutually_defined,
                    reason: 'Express-Zuschlag'
                }
            ]
        },
        lineTotals: {
            netTotal: 45.0
        },
        additionalReferences: [
            {
                documentId: 'Vertrag V-2024-001',
                typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet
            }
        ]
    }
};

export const testComfortProfile: ComfortProfile = {
    ...testBasicProfile,

    profile: PROFILES.COMFORT,
    seller: {
        ...testBasicProfile.seller,
        otherLegalInformation: 'Verkauf',
        tradeContact: [
            {
                personName: 'Hans Müller',
                telephoneNumber: '+49 111222333',
                email: 'hans@firma.de'
            }
        ]
    },
    buyer: {
        ...testBasicProfile.buyer,
        tradeContact: [
            {
                departmentName: 'Einkauf',
                telephoneNumber: '+49 444555666',
                email: 'erika@firma.de'
            }
        ],
        specifiedLegalOrganization: {
            ...testBasicProfile.buyer.specifiedLegalOrganization,
            tradingBusinessName: 'Erika GmbH'
        }
    },
    referencedDocuments: {
        ...testBasicProfile.referencedDocuments,
        orderReference: {
            documentId: 'SO-98765'
        },
        contractReference: {
            documentId: 'CON-54321'
        },
        additionalReferences: {
            invoiceSupportingDocuments: [
                {
                    documentId: '1234',
                    name: 'Rapport',
                    uriid: 'https://example.com/rapport.pdf',
                    attachmentBinaryObject: {
                        mimeCode: MIME_CODES.PDF,
                        fileName: 'rapport.pdf'
                    }
                }
            ],
            tenderOrLotReferenceDetails: [
                {
                    documentId: 'LOT-001'
                },
                {
                    documentId: 'LOT-002'
                }
            ],
            invoiceItemDetails: [
                {
                    documentId: 'ITEM-001',
                    referenceTypeCode: UNTDID_1153.Dangerous_Goods_information
                },
                {
                    documentId: 'ITEM-002',
                    referenceTypeCode: UNTDID_1153.Outerpackaging_unit_identification
                }
            ]
        },
        projectReference: {
            id: 'PRJ-001',
            name: 'Procuring Project XY'
        }
    },
    delivery: {
        ...testBasicProfile.delivery,
        billingPeriod: {
            startDate: {
                year: 2024,
                month: 1,
                day: 1
            },
            endDate: {
                year: 2024,
                month: 1,
                day: 31
            }
        }
    },
    paymentInformation: {
        ...testBasicProfile.paymentInformation,
        paymentMeans: [
            ...testBasicProfile.paymentInformation.paymentMeans!,
            {
                description: 'Credit Card Payment',
                paymentType: PAYMENT_MEANS_CODES.Credit_card,
                financialCard: {
                    finalDigitsOfCard: '****1111',
                    cardholderName: 'Max Mustermann'
                }
            },
            {
                description: 'Bank Transfer with BIC',
                paymentType: PAYMENT_MEANS_CODES.SEPA_direct_debit,
                payeeBankAccount: {
                    iban: 'DE89370400440532013000',
                    bic: 'DEUTDEDBFRA',
                    accountName: 'Max Mustermann'
                }
            }
        ],
        paymentTerms: {
            description: 'Payment due in 30 days',
            dueDate: {
                year: 2024,
                month: 2,
                day: 1
            },
            directDebitMandateID: 'DDI-001'
        }
    },
    totals: {
        ...testBasicProfile.totals,
        roundingAmount: 0.01,
        taxBreakdown: [
            {
                ...testBasicProfile.totals.taxBreakdown![0],
                taxPointDate: {
                    year: 2024,
                    month: 1,
                    day: 15
                }
            }
        ],
        openAmount: 144.6
    },
    invoiceLines: [lineObject1, lineObject2]
};
