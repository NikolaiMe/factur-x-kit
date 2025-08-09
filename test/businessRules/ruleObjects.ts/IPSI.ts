import { ComfortProfile } from '../../../src/profiles/comfort';
import { PROFILES } from '../../../src/types/ProfileTypes';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES,
    PAYMENT_MEANS_CODES,
    REFERENCED_DOCUMENT_TYPE_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES,
    UNTDID_1153,
    UNTDID_7143
} from '../../../src/types/codes';

export const IPSIInvoice: ComfortProfile = {
    profile: PROFILES.COMFORT,
    document: {
        id: 'INV-2023-00789',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2023, month: 10, day: 1 },
        notes: [
            {
                content: 'Thank you for your business! Please find the details of your order below.',
                subject: 'ACY' as SUBJECT_CODES
            },
            { content: 'Kind regards,\nYour Apex Solutions Team' },
            {
                content:
                    'Standard delivery is within 3-5 business days after payment confirmation. For any inquiries, please do not hesitate to contact us.',
                subject: 'DEL' as SUBJECT_CODES
            }
        ],
        currency: 'EUR' as CURRENCY_CODES
    },
    seller: {
        name: 'Apex Solutions Ltd.',
        specifiedLegalOrganization: {
            id: { id: 'CRN 9876543' },
            tradingBusinessName: 'Apex Industrial Supplies'
        },
        postalAddress: {
            postcode: 'EC1A 1BB',
            addressLineOne: '123 Business Road',
            city: 'London',
            country: 'GB' as COUNTRY_ID_CODES,
            countrySubDivision: 'ENG'
        },
        taxIdentification: { vatId: 'GB987654321' },
        otherLegalInformation:
            'Managing Director: Eleanor Vance\nRegistered Office: London\nRegistered in England and Wales',
        tradeContact: [
            {
                personName: 'David Miller',
                telephoneNumber: '+44 20 7946 0123',
                email: 'sales@apexsolutions.co.uk'
            }
        ]
    },
    sellerTaxRepresentative: {
        name: 'Tax Representative',
        postalAddress: {
            postcode: '10176',
            addressLineOne: 'Geschäftsweg 123',
            city: 'Berlin',
            country: 'DE' as COUNTRY_ID_CODES,
            countrySubDivision: 'Berlin'
        },
        taxIdentification: { vatId: 'DE987654321' }
    },
    buyer: {
        id: 'CUST-00456',
        name: 'Innovatech Corp.',
        postalAddress: {
            postcode: '10001',
            addressLineOne: '456 Innovation Drive',
            addressLineTwo: 'Suite 500',
            city: 'New York',
            country: 'US' as COUNTRY_ID_CODES,
            countrySubDivision: 'NY'
        },
        universalCommunicationAddressURI: { id: 'accounts.payable@innovatech.com', scheme: '0088' as EAS_SCHEME_CODES },
        taxIdentification: { vatId: 'US-TAXID-7890123' },
        tradeContact: [
            {
                personName: 'Sarah Chen',
                telephoneNumber: '+1 212 555 0199',
                email: 'schen@innovatech.com'
            }
        ]
    },
    referencedDocuments: {
        orderReference: { documentId: 'PO-2023-10-005' },
        contractReference: { documentId: 'CTR-SERV-001B' },
        advanceShippingNotice: { documentId: 'ASN-778899' },
        referencedInvoice: [
            {
                documentId: 'PREV-INV-00700',
                issueDate: { year: 2023, month: 9, day: 1 }
            }
        ]
    },
    delivery: {
        deliveryDate: { year: 2023, month: 10, day: 5 },
        billingPeriod: {
            startDate: { year: 2024, month: 1, day: 1 },
            endDate: { year: 2024, month: 1, day: 31 }
        }
    },
    paymentInformation: {
        paymentMeans: [
            {
                description: 'International Commerce Bank',
                paymentType: '58' as PAYMENT_MEANS_CODES,
                payeeBankAccount: {
                    iban: 'GB29NWBK60161331926819',
                    bic: 'NWBKGB2L',
                    accountName: 'Apex Solutions Ltd.'
                }
            }
        ],

        paymentTerms: {
            description: 'Payment due within 30 days from date of invoice.',
            dueDate: { year: 2024, month: 2, day: 1 }
        }
    },
    totals: {
        sumWithoutAllowancesAndCharges: 166,
        documentLevelAllowancesAndCharges: {
            allowances: [
                {
                    actualAmount: 14,
                    reasonCode: '95' as ALLOWANCE_REASONS_CODES, // Discount
                    reason: 'Loyalty Program Discount',
                    categoryTradeTax: {
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        categoryCode: TAX_CATEGORY_CODES.IPSI,
                        rateApplicablePercent: 19
                    }
                },
                {
                    actualAmount: 1,
                    reasonCode: ALLOWANCE_REASONS_CODES.Discount, // Freight charges
                    reason: 'Allowance',
                    categoryTradeTax: {
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        categoryCode: TAX_CATEGORY_CODES.IPSI,
                        rateApplicablePercent: 0
                    }
                }
            ],
            charges: [
                {
                    actualAmount: 0.5,
                    reasonCode: 'FC' as CHARGE_REASONS_CODES, // Freight charges
                    reason: 'Standard Shipping Fee',
                    categoryTradeTax: {
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        categoryCode: TAX_CATEGORY_CODES.IPSI,
                        rateApplicablePercent: 19
                    }
                }
            ]
        },
        allowanceTotalAmount: 15,
        chargeTotalAmount: 0.5,
        netTotal: 151.5,
        taxBreakdown: [
            {
                calculatedAmount: 23.09,
                typeCode: 'VAT' as TAX_TYPE_CODE,
                basisAmount: 121.5,
                categoryCode: TAX_CATEGORY_CODES.IPSI,
                rateApplicablePercent: 19,
                taxPointDate: { year: 2024, month: 1, day: 15 }
            },
            {
                calculatedAmount: 0,
                typeCode: 'VAT' as TAX_TYPE_CODE,
                basisAmount: 30,
                categoryCode: TAX_CATEGORY_CODES.IPSI,
                rateApplicablePercent: 0,
                taxPointDate: { year: 2024, month: 1, day: 15 }
            }
        ],
        taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
        grossTotal: 174.59,
        prepaidAmount: 10,
        openAmount: 164.6,
        roundingAmount: 0.01
    },
    invoiceLines: [
        {
            generalLineData: {
                lineId: '1',
                lineNote: {
                    content:
                        'This item is shipped in bulk. A specialized carrier will deliver this separately from other items. Estimated delivery: 3-5 business days.'
                }
            },
            productDescription: {
                globalId: { id: 'GTIN01234567890123', scheme: '0160' as ISO6523_CODES },
                sellerProductId: 'APX-COMP-001A',
                buyerProductId: 'TECH-REQ-789B',
                name: 'Industrial Grade Fasteners',
                description: 'Precision-engineered stainless steel (Grade 316) fasteners.',
                productCharacteristic: [
                    { characteristic: 'Material', value: 'Stainless Steel 316' },
                    { characteristic: 'Finish', value: 'Polished' }
                ],
                productClassification: [
                    {
                        productClass: {
                            code: '27111708',
                            codeScheme: 'TST' as UNTDID_7143,
                            codeSchemeVersion: 'v23.0501'
                        }
                    },
                    {
                        productClass: {
                            code: 'C456',
                            codeScheme: 'SSO' as UNTDID_7143
                        }
                    },
                    {
                        productClass: {
                            code: '9',
                            codeScheme: 'TSO' as UNTDID_7143
                        }
                    }
                ],
                originTradeCountry: 'GB' as COUNTRY_ID_CODES
            },
            productPriceAgreement: {
                referencedOrder: { lineId: 'CUST-PO-12345-LN10' },
                productPricing: {
                    basisPricePerItem: 20,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES },
                    priceAllowancesAndCharges: { allowances: [{ actualAmount: 1 }] }
                },
                productNetPricing: {
                    netPricePerItem: 19,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES }
                }
            },
            delivery: { itemQuantity: { quantity: 5, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                    rateApplicablePercent: 19
                },
                lineLevelAllowancesAndCharges: {
                    allowances: [
                        {
                            actualAmount: 6,
                            reasonCode: '95' as ALLOWANCE_REASONS_CODES,
                            reason: 'Volume Discount Applied'
                        }
                    ],
                    charges: [
                        {
                            actualAmount: 1,
                            reasonCode: 'ZZZ' as CHARGE_REASONS_CODES,
                            reason: 'Special Handling Fee'
                        }
                    ]
                },
                billingPeriod: {
                    startDate: { year: 2024, month: 1, day: 1 },
                    endDate: { year: 2024, month: 1, day: 31 }
                },
                lineTotals: { netTotal: 90 },
                additionalReferences: [
                    {
                        documentId: 'DS-SPEC-003',
                        typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet,
                        referenceTypeCode: 'DQ' as UNTDID_1153
                    }
                ],
                accountingInformation: { id: 'Cost Center Alpha-100' }
            }
        },
        {
            generalLineData: { lineId: '2' },
            productDescription: {
                name: 'Premium Filter Cartridges'
            },
            productPriceAgreement: {
                productNetPricing: {
                    netPricePerItem: 15
                }
            },
            delivery: { itemQuantity: { quantity: 2, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                    rateApplicablePercent: 19
                },
                lineLevelAllowancesAndCharges: {
                    charges: [
                        {
                            actualAmount: 15,
                            reasonCode: 'ZZZ' as CHARGE_REASONS_CODES,
                            reason: 'Expedited Processing Fee'
                        }
                    ]
                },
                lineTotals: { netTotal: 45 }
            }
        },
        {
            generalLineData: { lineId: '3' },
            productDescription: {
                name: 'Tax Free Service'
            },
            productPriceAgreement: {
                productNetPricing: {
                    netPricePerItem: 15.5
                }
            },
            delivery: { itemQuantity: { quantity: 2, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                    rateApplicablePercent: 0
                },
                lineTotals: { netTotal: 31 }
            }
        }
    ]
};

export const IPSINoTaxInvoice: ComfortProfile = {
    profile: PROFILES.COMFORT,
    document: {
        id: 'INV-2023-00789',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2023, month: 10, day: 1 },
        notes: [
            {
                content: 'Thank you for your business! Please find the details of your order below.',
                subject: 'ACY' as SUBJECT_CODES
            },
            { content: 'Kind regards,\nYour Apex Solutions Team' },
            {
                content:
                    'Standard delivery is within 3-5 business days after payment confirmation. For any inquiries, please do not hesitate to contact us.',
                subject: 'DEL' as SUBJECT_CODES
            }
        ],
        currency: 'EUR' as CURRENCY_CODES
    },
    seller: {
        name: 'Apex Solutions Ltd.',
        specifiedLegalOrganization: {
            id: { id: 'CRN 9876543' },
            tradingBusinessName: 'Apex Industrial Supplies'
        },
        postalAddress: {
            postcode: 'EC1A 1BB',
            addressLineOne: '123 Business Road',
            city: 'London',
            country: 'GB' as COUNTRY_ID_CODES,
            countrySubDivision: 'ENG'
        },
        taxIdentification: { vatId: 'GB987654321' },
        otherLegalInformation:
            'Managing Director: Eleanor Vance\nRegistered Office: London\nRegistered in England and Wales',
        tradeContact: [
            {
                personName: 'David Miller',
                telephoneNumber: '+44 20 7946 0123',
                email: 'sales@apexsolutions.co.uk'
            }
        ]
    },
    buyer: {
        id: 'CUST-00456',
        name: 'Innovatech Corp.',
        postalAddress: {
            postcode: '10001',
            addressLineOne: '456 Innovation Drive',
            addressLineTwo: 'Suite 500',
            city: 'New York',
            country: 'US' as COUNTRY_ID_CODES,
            countrySubDivision: 'NY'
        },
        universalCommunicationAddressURI: { id: 'accounts.payable@innovatech.com', scheme: '0088' as EAS_SCHEME_CODES },
        taxIdentification: { vatId: 'US-TAXID-7890123' },
        tradeContact: [
            {
                personName: 'Sarah Chen',
                telephoneNumber: '+1 212 555 0199',
                email: 'schen@innovatech.com'
            }
        ]
    },
    referencedDocuments: {
        orderReference: { documentId: 'PO-2023-10-005' },
        contractReference: { documentId: 'CTR-SERV-001B' },
        advanceShippingNotice: { documentId: 'ASN-778899' },
        referencedInvoice: [
            {
                documentId: 'PREV-INV-00700',
                issueDate: { year: 2023, month: 9, day: 1 }
            }
        ]
    },
    delivery: {
        deliveryDate: { year: 2023, month: 10, day: 5 },
        billingPeriod: {
            startDate: { year: 2024, month: 1, day: 1 },
            endDate: { year: 2024, month: 1, day: 31 }
        }
    },
    paymentInformation: {
        paymentMeans: [
            {
                description: 'International Commerce Bank',
                paymentType: '58' as PAYMENT_MEANS_CODES,
                payeeBankAccount: {
                    iban: 'GB29NWBK60161331926819',
                    bic: 'NWBKGB2L',
                    accountName: 'Apex Solutions Ltd.'
                }
            }
        ],

        paymentTerms: {
            description: 'Payment due within 30 days from date of invoice.',
            dueDate: { year: 2024, month: 2, day: 1 }
        }
    },
    totals: {
        sumWithoutAllowancesAndCharges: 135,
        documentLevelAllowancesAndCharges: {
            allowances: [
                {
                    actualAmount: 15,
                    reasonCode: '95' as ALLOWANCE_REASONS_CODES, // Discount
                    reason: 'Loyalty Program Discount',
                    categoryTradeTax: {
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        categoryCode: TAX_CATEGORY_CODES.IPSI,
                        rateApplicablePercent: 0
                    }
                }
            ],
            charges: [
                {
                    actualAmount: 0.5,
                    reasonCode: 'FC' as CHARGE_REASONS_CODES, // Freight charges
                    reason: 'Standard Shipping Fee',
                    categoryTradeTax: {
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        categoryCode: TAX_CATEGORY_CODES.IPSI,
                        rateApplicablePercent: 0
                    }
                }
            ]
        },
        allowanceTotalAmount: 15,
        chargeTotalAmount: 0.5,
        netTotal: 120.5,
        taxBreakdown: [
            {
                calculatedAmount: 0,
                typeCode: 'VAT' as TAX_TYPE_CODE,
                basisAmount: 120.5,
                categoryCode: TAX_CATEGORY_CODES.IPSI,
                rateApplicablePercent: 0,
                taxPointDate: { year: 2024, month: 1, day: 15 }
            }
        ],
        taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
        grossTotal: 120.5,
        prepaidAmount: 0,
        openAmount: 120.5,
        roundingAmount: 0
    },
    invoiceLines: [
        {
            generalLineData: {
                lineId: '1'
            },
            productDescription: {
                globalId: { id: 'GTIN01234567890123', scheme: '0160' as ISO6523_CODES },
                sellerProductId: 'APX-COMP-001A',
                buyerProductId: 'TECH-REQ-789B',
                name: 'Industrial Grade Fasteners',
                description: 'Precision-engineered stainless steel (Grade 316) fasteners.',
                originTradeCountry: 'GB' as COUNTRY_ID_CODES
            },
            productPriceAgreement: {
                referencedOrder: { lineId: 'CUST-PO-12345-LN10' },
                productPricing: {
                    basisPricePerItem: 20,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES },
                    priceAllowancesAndCharges: { allowances: [{ actualAmount: 1 }] }
                },
                productNetPricing: {
                    netPricePerItem: 19,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES }
                }
            },
            delivery: { itemQuantity: { quantity: 5, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                    rateApplicablePercent: 0
                },
                lineLevelAllowancesAndCharges: {
                    allowances: [
                        {
                            actualAmount: 6,
                            reasonCode: '95' as ALLOWANCE_REASONS_CODES,
                            reason: 'Volume Discount Applied'
                        }
                    ],
                    charges: [
                        {
                            actualAmount: 1,
                            reasonCode: 'ZZZ' as CHARGE_REASONS_CODES,
                            reason: 'Special Handling Fee'
                        }
                    ]
                },
                billingPeriod: {
                    startDate: { year: 2024, month: 1, day: 1 },
                    endDate: { year: 2024, month: 1, day: 31 }
                },
                lineTotals: { netTotal: 90 },
                additionalReferences: [
                    {
                        documentId: 'DS-SPEC-003',
                        typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet,
                        referenceTypeCode: 'DQ' as UNTDID_1153
                    }
                ],
                accountingInformation: { id: 'Cost Center Alpha-100' }
            }
        },
        {
            generalLineData: { lineId: '2' },
            productDescription: {
                name: 'Premium Filter Cartridges'
            },
            productPriceAgreement: {
                productNetPricing: {
                    netPricePerItem: 15
                }
            },
            delivery: { itemQuantity: { quantity: 2, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                    rateApplicablePercent: 0
                },
                lineLevelAllowancesAndCharges: {
                    charges: [
                        {
                            actualAmount: 15,
                            reasonCode: 'ZZZ' as CHARGE_REASONS_CODES,
                            reason: 'Expedited Processing Fee'
                        }
                    ]
                },
                lineTotals: { netTotal: 45 }
            }
        }
    ]
};
