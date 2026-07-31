import { z } from 'zod';

import { ZCodeType } from '../../types/CodeTypeConverter';
import { PROFILES } from '../../types/ProfileTypes';
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes';
import { ZComfortTradeContactType } from '../../types/ram/DefinedTradeContact/ComfortTradeContactType';
import { ZComfortTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem';
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType';
import { ZAdditionalReferencedDocumentType_comfort } from '../../types/ram/ReferencedDocumentType/AdditionalReferencedDocumentConverter/ComfortAdditonalReferencedDocumentTypes';
import {
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter';
import { ZSpecifiedVatRegistrationsType } from '../../types/ram/SpecifiedVatRegistrationsTypeConverter';
import { ZBasicDocumentLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType';
import { ZComfortPaymentMeansType } from '../../types/ram/TradeSettlementPaymentMeansType/ComfortTradeSettlementPaymentMeansType';
import { ZComfortDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/ComfortDocumentLevelTradeTaxType';
import { ZAmountType } from '../../types/udt/AmountTypeConverter';
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter';
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter';
import { ZIdType } from '../../types/udt/IdTypeConverter';
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter';
import { ZIdTypeWithRequiredScheme } from '../../types/udt/IdTypeWithRequiredlSchemeConverter';
import { ZTextType } from '../../types/udt/TextTypeConverter';
import { ZTradePartyType } from '../basicwithoutlines/BasicWithoutLinesProfile';
import { BR } from '../businessRules/br';
import { BR_AE } from '../businessRules/br_ae';
import { BR_CO } from '../businessRules/br_co';
import { BR_E } from '../businessRules/br_e';
import { BR_G } from '../businessRules/br_g';
import { BR_IC } from '../businessRules/br_ic';
import { BR_IG } from '../businessRules/br_ig';
import { BR_IP } from '../businessRules/br_ip';
import { BR_O } from '../businessRules/br_o';
import { BR_OWN } from '../businessRules/br_own';
import { BR_S } from '../businessRules/br_s';
import { BR_Z } from '../businessRules/br_z';
import { CII_SR } from '../businessRules/cii_sr';
import { validationResult } from '../convert';

export const ZComfortTotalsType = z.object({
    sumWithoutAllowancesAndCharges: ZAmountType,
    documentLevelAllowancesAndCharges: ZBasicDocumentLevelTradeAllowanceChargeType.optional(),
    allowanceTotalAmount: ZAmountType.optional(),
    chargeTotalAmount: ZAmountType.optional(),
    netTotal: ZAmountType,
    taxBreakdown: ZComfortDocumentLevelTradeTaxType.array(),
    taxTotal: ZAmountTypeWithRequiredCurrency.array().max(2).optional(),
    taxCurrency: ZCodeType(CURRENCY_CODES).optional(),
    roundingAmount: ZAmountType.optional(),
    grossTotal: ZAmountType,
    prepaidAmount: ZAmountType.optional(),
    openAmount: ZAmountType
});

export const ZComfortProfileStructure = z.object({
    businessProcessType: ZIdType.optional().describe('BT-23'),
    profile: z.literal(PROFILES.COMFORT).describe('BT-24'),
    document: z.object({
        id: ZIdType.describe('BT-1'),
        type: ZCodeType(DOCUMENT_TYPE_CODES).describe('BT-3'),
        dateOfIssue: ZDateTimeType.describe('BT-2'),
        currency: ZCodeType(CURRENCY_CODES),
        notes: ZBasicDocumentLevelNoteType.array().optional().describe('BG-1')
    }),
    seller: ZTradePartyType.extend({
        id: ZIdType.array().optional().describe('BT-29'),
        globalId: ZIdTypeWithRequiredScheme(ISO6523_CODES).array().optional().describe('BT-29-0'),
        specifiedLegalOrganization: z
            .object({
                id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional().describe('BT-30'),
                tradingBusinessName: ZTextType.optional().describe('BT-28')
            })
            .optional()
            .describe('BT-30-00'),
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType.optional().describe('BT-31-00'),
        otherLegalInformation: ZTextType.optional().describe('BT-33'),
        tradeContact: ZComfortTradeContactType.array().max(1).optional().describe('BG-6')
    }).describe('BG-4'),
    buyer: ZTradePartyType.extend({
        specifiedLegalOrganization: z
            .object({
                id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional().describe('BT-47'),
                tradingBusinessName: ZTextType.optional().describe('BT-45')
            })
            .optional(),
        reference: ZTextType.optional().describe('BT-10'),
        tradeContact: ZComfortTradeContactType.array().max(1).optional().describe('BG-9')
    }).describe('BG-7'),
    sellerTaxRepresentative: ZTradePartyType.omit({
        id: true,
        globalId: true,
        specifiedLegalOrganization: true,
        universalCommunicationAddressURI: true
    })
        .extend({
            taxIdentification: ZSpecifiedVatRegistrationsType.describe('BT-63-00')
        })
        .optional()
        .describe('BG-11'),
    invoiceLines: ZComfortTradeLineItem.array(),
    referencedDocuments: z
        .object({
            orderReference: ZReferencedDocumentType_documentId.optional().describe('BT-13'),
            contractReference: ZReferencedDocumentType_documentId.optional().describe('BT-12'),
            advanceShippingNotice: ZReferencedDocumentType_documentId.optional(),
            referencedInvoice: ZReferencedDocumentType_docId_issueDate.array().optional(),
            orderConfirmationReference: ZReferencedDocumentType_documentId.optional().describe('BT-14'),
            projectReference: z
                .object({
                    id: ZIdType,
                    name: ZTextType
                })
                .optional(),
            receivingAdviceReference: ZReferencedDocumentType_documentId.optional(),
            additionalReferences: ZAdditionalReferencedDocumentType_comfort.optional()
        })
        .optional(),
    delivery: z
        .object({
            recipient: ZTradePartyType.omit({
                specifiedLegalOrganization: true,
                universalCommunicationAddressURI: true,
                taxIdentification: true
            })
                .extend({ name: ZTextType.optional() })
                .optional(),
            deliveryDate: ZDateTimeType.optional(),
            billingPeriod: z
                .object({
                    startDate: ZDateTimeType.optional(),
                    endDate: ZDateTimeType.optional()
                })
                .optional()
        })
        .optional(),
    paymentInformation: z.object({
        creditorReference: ZIdType.optional(),
        paymentReference: ZTextType.optional(),
        payee: ZTradePartyType.pick({
            id: true,
            globalId: true,
            name: true,
            specifiedLegalOrganization: true
        }).optional(),
        paymentMeans: ZComfortPaymentMeansType.array().optional(),
        paymentTerms: z
            .object({
                description: ZTextType.optional(),
                dueDate: ZDateTimeType.optional(),
                directDebitMandateID: ZIdType.optional()
            })
            .optional(),
        specifiedTradeAccountingAccount: ZIdType.optional()
    }),
    totals: ZComfortTotalsType
});

export type ComfortProfile = z.infer<typeof ZComfortProfileStructure>;

export const ZComfortProfile = [
    ...BR,
    ...BR_CO,
    ...BR_OWN,
    ...BR_AE,
    ...BR_E,
    ...BR_G,
    ...BR_IC,
    ...BR_IG,
    ...BR_IP,
    ...BR_O,
    ...BR_S,
    ...BR_Z,
    ...CII_SR
].reduce<z.ZodType<ComfortProfile>>((schema, rule) => schema.refine(rule.rule, rule.error), ZComfortProfileStructure);

export function isComfortProfile(data: unknown): data is ComfortProfile {
    const result = ZComfortProfileStructure.safeParse(data);
    return result.success;
}

export function isValidComfortProfile(data: unknown): validationResult {
    const result = ZComfortProfile.safeParse(data);
    if (!result.success) {
        return {
            valid: false,
            errors: result.error.issues.map(issue => ({
                message: issue.message,
                path: issue.path.filter(
                    (segment): segment is string | number => typeof segment === 'string' || typeof segment === 'number'
                )
            }))
        };
    }
    return { valid: result.success };
}
