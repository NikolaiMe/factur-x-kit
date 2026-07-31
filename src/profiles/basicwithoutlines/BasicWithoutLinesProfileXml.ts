import { z } from 'zod';

import { ZBasicDocumentLevelNoteTypeXml } from '../../types/ram/NoteType/BasicDocumentLevelNoteType';
import {
    ZReferencedDocumentTypeXml_docId_issueDate,
    ZReferencedDocumentTypeXml_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZSpecifiedTaxRegistrationsForSellerTypeXml } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter';
import { ZSpecifiedTaxRegistrationsTypeXml } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter';
import { ZBasicDocumentLevelTradeAllowanceChargeTypeXml } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType';
import { ZBasicPaymentMeansTypeXml } from '../../types/ram/TradeSettlementPaymentMeansType/BasicTradeSettlementPaymentMeansType';
import { ZBasicDocumentLevelTradeTaxTypeXml } from '../../types/ram/TradeTaxType/BasicDocumentLevelTradeTaxType';
import { ZAmountTypeXml } from '../../types/udt/AmountTypeConverter';
import { ZAmountTypeWithRequiredCurrencyXml } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter';
import { ZDateTimeTypeXml } from '../../types/udt/DateTimeTypeConverter';
import { ZIdTypeXml } from '../../types/udt/IdTypeConverter';
import { ZIdTypeWithOptionalSchemeXml } from '../../types/udt/IdTypeWithOptionalSchemeConverter';
import { ZIdTypeWithRequiredSchemeXml } from '../../types/udt/IdTypeWithRequiredlSchemeConverter';
import { ZTextTypeXml } from '../../types/udt/TextTypeConverter';

export const ZTradePartyTypeXml = z.object({
    'ram:ID': ZTextTypeXml.optional(), // in seller this could be an array
    'ram:GlobalID': ZIdTypeWithRequiredSchemeXml.optional(), // in seller this could be an array
    'ram:Name': ZTextTypeXml, // may be optional on some specific trade parties
    'ram:SpecifiedLegalOrganization': z
        .object({
            'ram:ID': ZIdTypeWithOptionalSchemeXml.optional()
            // seller has additional Trading Business Name here
        })
        .optional(),
    'ram:PostalTradeAddress': z.object({
        'ram:PostcodeCode': ZTextTypeXml.optional(),
        'ram:LineOne': ZTextTypeXml.optional(),
        'ram:LineTwo': ZTextTypeXml.optional(),
        'ram:LineThree': ZTextTypeXml.optional(),
        'ram:CityName': ZTextTypeXml.optional(),
        'ram:CountryID': ZTextTypeXml,
        'ram:CountrySubDivisionName': ZTextTypeXml.optional()
    }),
    'ram:URIUniversalCommunication': z
        .object({
            'ram:URIID': ZIdTypeWithRequiredSchemeXml
        })
        .optional(),
    'ram:SpecifiedTaxRegistration': ZSpecifiedTaxRegistrationsTypeXml.optional()
});

export const ZBasicWithoutLinesProfileXml = z.object({
    '?xml': z.object({
        '@version': z.literal('1.0'),
        '@encoding': z.literal('UTF-8')
    }),
    'rsm:CrossIndustryInvoice': z.object({
        'rsm:ExchangedDocumentContext': z.object({
            'ram:BusinessProcessSpecifiedDocumentContextParameter': z
                .object({
                    'ram:ID': ZIdTypeXml
                })
                .optional(),
            'ram:GuidelineSpecifiedDocumentContextParameter': z.object({
                'ram:ID': z.object({
                    '#text': z.literal('urn:factur-x.eu:1p0:basicwl')
                })
            })
        }),
        'rsm:ExchangedDocument': z.object({
            'ram:ID': ZIdTypeXml,
            'ram:TypeCode': ZTextTypeXml,
            'ram:IssueDateTime': ZDateTimeTypeXml,
            'ram:IncludedNote': z
                .union([ZBasicDocumentLevelNoteTypeXml, ZBasicDocumentLevelNoteTypeXml.array()])
                .optional()
        }),
        'rsm:SupplyChainTradeTransaction': z.object({
            'ram:ApplicableHeaderTradeAgreement': z.object({
                'ram:BuyerReference': ZTextTypeXml.optional(),
                'ram:SellerTradeParty': ZTradePartyTypeXml.extend({
                    'ram:ID': z.union([ZTextTypeXml, ZTextTypeXml.array()]).optional(), // in seller this could be an array
                    'ram:GlobalID': z
                        .union([ZIdTypeWithRequiredSchemeXml, ZIdTypeWithRequiredSchemeXml.array()])
                        .optional(),
                    'ram:SpecifiedLegalOrganization': z
                        .object({
                            'ram:ID': ZIdTypeWithOptionalSchemeXml.optional(),
                            'ram:TradingBusinessName': ZTextTypeXml.optional()
                        })
                        .optional(),
                    'ram:SpecifiedTaxRegistration': ZSpecifiedTaxRegistrationsForSellerTypeXml.optional()
                }),
                'ram:BuyerTradeParty': ZTradePartyTypeXml,
                'ram:SellerTaxRepresentativeTradeParty': ZTradePartyTypeXml.omit({
                    'ram:ID': true,
                    'ram:GlobalID': true,
                    'ram:SpecifiedLegalOrganization': true,
                    'ram:URIUniversalCommunication': true
                })
                    .extend({
                        'ram:SpecifiedTaxRegistration': ZSpecifiedTaxRegistrationsTypeXml
                    })
                    .optional(),
                'ram:BuyerOrderReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional(),
                'ram:ContractReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional()
            }),
            'ram:ApplicableHeaderTradeDelivery': z.object({
                'ram:ShipToTradeParty': ZTradePartyTypeXml.omit({
                    'ram:SpecifiedLegalOrganization': true,
                    'ram:URIUniversalCommunication': true,
                    'ram:SpecifiedTaxRegistration': true
                })
                    .extend({
                        'ram:Name': ZTextTypeXml.optional()
                    })
                    .optional(),
                'ram:ActualDeliverySupplyChainEvent': z
                    .object({
                        'ram:OccurrenceDateTime': ZDateTimeTypeXml
                    })
                    .optional(),
                'ram:DespatchAdviceReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional()
            }),
            'ram:ApplicableHeaderTradeSettlement': z.object({
                'ram:CreditorReferenceID': ZIdTypeXml.optional(),
                'ram:PaymentReference': ZTextTypeXml.optional(),
                'ram:TaxCurrencyCode': ZTextTypeXml.optional(),
                'ram:InvoiceCurrencyCode': ZTextTypeXml,
                'ram:PayeeTradeParty': ZTradePartyTypeXml.pick({
                    'ram:ID': true,
                    'ram:GlobalID': true,
                    'ram:Name': true,
                    'ram:SpecifiedLegalOrganization': true
                }).optional(),
                'ram:SpecifiedTradeSettlementPaymentMeans': z
                    .union([ZBasicPaymentMeansTypeXml, ZBasicPaymentMeansTypeXml.array()])
                    .optional(),
                'ram:ApplicableTradeTax': z.union([
                    ZBasicDocumentLevelTradeTaxTypeXml,
                    ZBasicDocumentLevelTradeTaxTypeXml.array()
                ]),
                'ram:BillingSpecifiedPeriod': z
                    .object({
                        'ram:StartDateTime': ZDateTimeTypeXml.optional(),
                        'ram:EndDateTime': ZDateTimeTypeXml.optional()
                    })
                    .optional(),
                'ram:SpecifiedTradeAllowanceCharge': ZBasicDocumentLevelTradeAllowanceChargeTypeXml.optional(),
                'ram:SpecifiedTradePaymentTerms': z
                    .object({
                        'ram:Description': ZTextTypeXml.optional(),
                        'ram:DueDateDateTime': ZDateTimeTypeXml.optional(),
                        'ram:DirectDebitMandateID': ZIdTypeXml.optional()
                    })
                    .optional(),
                'ram:SpecifiedTradeSettlementHeaderMonetarySummation': z.object({
                    'ram:LineTotalAmount': ZAmountTypeXml,
                    'ram:ChargeTotalAmount': ZAmountTypeXml.optional(),
                    'ram:AllowanceTotalAmount': ZAmountTypeXml.optional(),
                    'ram:TaxBasisTotalAmount': ZAmountTypeXml,
                    'ram:TaxTotalAmount': z
                        .union([ZAmountTypeWithRequiredCurrencyXml, ZAmountTypeWithRequiredCurrencyXml.array().max(2)])
                        .optional(),
                    'ram:GrandTotalAmount': ZAmountTypeXml,
                    'ram:TotalPrepaidAmount': ZAmountTypeXml.optional(),
                    'ram:DuePayableAmount': ZAmountTypeXml
                }),
                'ram:InvoiceReferencedDocument': z
                    .union([
                        ZReferencedDocumentTypeXml_docId_issueDate,
                        ZReferencedDocumentTypeXml_docId_issueDate.array()
                    ])
                    .optional(),
                'ram:ReceivableSpecifiedTradeAccountingAccount': z
                    .object({
                        'ram:ID': ZIdTypeXml
                    })
                    .optional()
            })
        }),
        '@xmlns:rsm': z.literal('urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100'),
        '@xmlns:qdt': z.literal('urn:un:unece:uncefact:data:standard:QualifiedDataType:100'),
        '@xmlns:ram': z.literal('urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100'),
        '@xmlns:xs': z.literal('http://www.w3.org/2001/XMLSchema'),
        '@xmlns:udt': z.literal('urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100')
    })
});

export type BasicWithoutLinesProfileXml = z.infer<typeof ZBasicWithoutLinesProfileXml>;

export function isBasicWithoutLinesProfileXml(data: unknown): data is BasicWithoutLinesProfileXml {
    const result = ZBasicWithoutLinesProfileXml.safeParse(data);

    if (!result.success) {
        console.dir(data, { depth: null });
        console.dir(result.error.issues, { depth: null });
    }
    return result.success;
}
