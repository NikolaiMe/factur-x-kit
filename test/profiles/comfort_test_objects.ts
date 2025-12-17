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
                        fileName: 'rapport.pdf',
                        base64Data:
                            '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enJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGRmPSJodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvIj4KICAgPHBkZjpQcm9kdWNlcj5MaWJyZU9mZmljZSAyNS4yLjUuMiAoWDg2XzY0KSAvIExpYnJlT2ZmaWNlIENvbW11bml0eTwvcGRmOlByb2R1Y2VyPgogICA8cGRmOlBERlZlcnNpb24+MS43PC9wZGY6UERGVmVyc2lvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICA8eG1wOkNyZWF0b3JUb29sPldyaXRlcjwveG1wOkNyZWF0b3JUb29sPgogICA8eG1wOkNyZWF0ZURhdGU+MjAyNS0xMi0xN1QxOTo1MzozOCswMTowMDwveG1wOkNyZWF0ZURhdGU+CiAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDI1LTEyLTE3VDE5OjUzOjM4KzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyNS0xMi0xN1QxOTo1MzozOCswMTowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4KCmVuZHN0cmVhbQplbmRvYmoKCjUgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1N0YW5kYXJkCi9QIDQgMCBSCi9QZyAxIDAgUgovQSA8PC9PL0xheW91dC9QbGFjZW1lbnQvQmxvY2sKPj4KL0tbMCBdCj4+CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvRG9jdW1lbnQKL1AgMTUgMCBSCi9QZyAxIDAgUgovS1s1IDAgUiAgXQo+PgplbmRvYmoKCjE1IDAgb2JqCjw8L1R5cGUvU3RydWN0VHJlZVJvb3QKL1BhcmVudFRyZWUgMTYgMCBSCi9Sb2xlTWFwPDwvU3RhbmRhcmQvUAo+PgovS1s0IDAgUiAgXQo+PgplbmRvYmoKCjE2IDAgb2JqCjw8L051bXNbCjAgWyA1IDAgUiBdCl0+PgplbmRvYmoKCjYgMCBvYmoKPDwvVHlwZS9QYWdlcwovUmVzb3VyY2VzIDEzIDAgUgovS2lkc1sgMSAwIFIgXQovQ291bnQgMT4+CmVuZG9iagoKMTcgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDYgMCBSCi9QYWdlTW9kZS9Vc2VPdXRsaW5lcwovT3BlbkFjdGlvblsxIDAgUiAvWFlaIG51bGwgbnVsbCAwXQovU3RydWN0VHJlZVJvb3QgMTUgMCBSCi9MYW5nKGRlLURFKQovTWFya0luZm88PC9NYXJrZWQgdHJ1ZT4+Ci9NZXRhZGF0YSAxNCAwIFI+PgplbmRvYmoKCjE4IDAgb2JqCjw8L0NyZWF0b3I8RkVGRjAwNTcwMDcyMDA2OTAwNzQwMDY1MDA3Mj4vUHJvZHVjZXI8RkVGRjAwNEMwMDY5MDA2MjAwNzIwMDY1MDA0RjAwNjYwMDY2MDA2OTAwNjMwMDY1MDAyMDAwMzIwMDM1MDAyRTAwMzIwMDJFMDAzNTAwMkUwMDMyMDAyMDAwMjgwMDU4MDAzODAwMzYwMDVGMDAzNjAwMzQwMDI5MDAyMDAwMkYwMDIwMDA0QzAwNjkwMDYyMDA3MjAwNjUwMDRGMDA2NjAwNjYwMDY5MDA2MzAwNjUwMDIwMDA0MzAwNkYwMDZEMDA2RDAwNzUwMDZFMDA2OTAwNzQwMDc5Pi9DcmVhdGlvbkRhdGUoRDoyMDI1MTIxNzE5NTMzOCswMScwMCcpPj4KZW5kb2JqCgp4cmVmCjAgMTkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDA2OTU1IDAwMDAwIG4gCjAwMDAwMDAwMTkgMDAwMDAgbiAKMDAwMDAwMDI1NSAwMDAwMCBuIAowMDAwMDEyMjY3IDAwMDAwIG4gCjAwMDAwMTIxNTcgMDAwMDAgbiAKMDAwMDAxMjQ5MCAwMDAwMCBuIAowMDAwMDAwMjc1IDAwMDAwIG4gCjAwMDAwMDYxMDIgMDAwMDAgbiAKMDAwMDAwNjEyMyAwMDAwMCBuIAowMDAwMDA2MzE4IDAwMDAwIG4gCjAwMDAwMDY2NjIgMDAwMDAgbiAKMDAwMDAwNjg2NiAwMDAwMCBuIAowMDAwMDA2ODk5IDAwMDAwIG4gCjAwMDAwMDcxMDQgMDAwMDAgbiAKMDAwMDAxMjM0OSAwMDAwMCBuIAowMDAwMDEyNDQ4IDAwMDAwIG4gCjAwMDAwMTI1NjQgMDAwMDAgbiAKMDAwMDAxMjc0OCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgMTkvUm9vdCAxNyAwIFIKL0luZm8gMTggMCBSCi9JRCBbIDxGMzM2ODFFN0EyMEJGQUE1QkRDNDUwNDQwQ0ZDQzI5Qj4KPEYzMzY4MUU3QTIwQkZBQTVCREM0NTA0NDBDRkNDMjlCPiBdCi9Eb2NDaGVja3N1bSAvRDkwRDIxM0M0RUY2NERCNzNDRTZFQzQ3QzkwQzdCQTYKPj4Kc3RhcnR4cmVmCjEzMDczCiUlRU9GCg=='
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
