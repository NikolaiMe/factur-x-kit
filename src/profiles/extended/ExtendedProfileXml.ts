import { z } from 'zod';

import { ZComfortTradeContactTypeXml } from '../../types/ram/DefinedTradeContact/ComfortTradeContactType';
import { ZComfortTradeLineItemXml } from '../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem';
import { ZBasicDocumentLevelNoteTypeXml } from '../../types/ram/NoteType/BasicDocumentLevelNoteType';
import { ZAdditionalReferencedDocumentTypeXml_comfort } from '../../types/ram/ReferencedDocumentType/AdditionalReferencedDocumentConverter/ComfortAdditonalReferencedDocumentTypes';
import {
    ZReferencedDocumentTypeXml_docId_issueDate,
    ZReferencedDocumentTypeXml_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZSpecifiedTaxRegistrationsForSellerTypeXml } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter';
import { ZSpecifiedTaxRegistrationsTypeXml } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter';
import { ZBasicDocumentLevelTradeAllowanceChargeTypeXml } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType';
import { ZComfortPaymentMeansTypeXml } from '../../types/ram/TradeSettlementPaymentMeansType/ComfortTradeSettlementPaymentMeansType';
import { ZComfortDocumentLevelTradeTaxTypeXml } from '../../types/ram/TradeTaxType/ComfortDocumentLevelTradeTaxType';
import { ZAmountTypeXml } from '../../types/udt/AmountTypeConverter';
import { ZAmountTypeWithRequiredCurrencyXml } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter';
import { ZDateTimeTypeXml } from '../../types/udt/DateTimeTypeConverter';
import { ZIdTypeXml } from '../../types/udt/IdTypeConverter';
import { ZIdTypeWithOptionalSchemeXml } from '../../types/udt/IdTypeWithOptionalSchemeConverter';
import { ZIdTypeWithRequiredSchemeXml } from '../../types/udt/IdTypeWithRequiredlSchemeConverter';
import { ZTextTypeXml } from '../../types/udt/TextTypeConverter';
import { ZTradePartyTypeXml } from '../basicwithoutlines/BasicWithoutLinesProfileXml';

export const ZExtendedProfileXml = z.object({
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
                    '#text': z.literal('urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:extended')
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
            'ram:IncludedSupplyChainTradeLineItem': z.union([
                ZComfortTradeLineItemXml,
                ZComfortTradeLineItemXml.array()
            ]),
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
                    'ram:SpecifiedTaxRegistration': ZSpecifiedTaxRegistrationsForSellerTypeXml.optional(),
                    'ram:Description': ZTextTypeXml.optional(),
                    'ram:DefinedTradeContact': z
                        .union([ZComfortTradeContactTypeXml, ZComfortTradeContactTypeXml.array()])
                        .optional()
                }),
                'ram:BuyerTradeParty': ZTradePartyTypeXml.extend({
                    'ram:SpecifiedLegalOrganization': z
                        .object({
                            'ram:ID': ZIdTypeWithOptionalSchemeXml.optional(),
                            'ram:TradingBusinessName': ZTextTypeXml.optional()
                        })
                        .optional(),
                    'ram:DefinedTradeContact': z
                        .union([ZComfortTradeContactTypeXml, ZComfortTradeContactTypeXml.array()])
                        .optional()
                }),
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
                'ram:SellerOrderReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional(),
                'ram:BuyerOrderReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional(),
                'ram:ContractReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional(),
                'ram:AdditionalReferencedDocument': ZAdditionalReferencedDocumentTypeXml_comfort.optional(),
                'ram:SpecifiedProcuringProject': z
                    .object({
                        'ram:ID': ZIdTypeXml,
                        'ram:Name': ZTextTypeXml
                    })
                    .optional()
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
                'ram:DespatchAdviceReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional(),
                'ram:ReceivingAdviceReferencedDocument': ZReferencedDocumentTypeXml_documentId.optional()
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
                    .union([ZComfortPaymentMeansTypeXml, ZComfortPaymentMeansTypeXml.array()])
                    .optional(),
                'ram:ApplicableTradeTax': z.union([
                    ZComfortDocumentLevelTradeTaxTypeXml,
                    ZComfortDocumentLevelTradeTaxTypeXml.array()
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
                    'ram:RoundingAmount': ZAmountTypeXml.optional(),
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

export type ExtendedProfileXml = z.infer<typeof ZExtendedProfileXml>;

export function isExtendedProfileXml(data: unknown): data is ExtendedProfileXml {
    const result = ZExtendedProfileXml.safeParse(data);

    if (!result.success) {
        console.dir(data, { depth: null });
        console.dir(result.error.issues, { depth: null });
    }
    return result.success;
}
