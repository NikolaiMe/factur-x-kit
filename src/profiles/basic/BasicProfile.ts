import { z } from 'zod';

import { ZCodeType } from '../../types/CodeTypeConverter';
import { PROFILES } from '../../types/ProfileTypes';
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes';
import { ZBasicTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/BasicTradeLineItem';
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType';
import {
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter';
import { ZSpecifiedVatRegistrationsType } from '../../types/ram/SpecifiedVatRegistrationsTypeConverter';
import { ZBasicDocumentLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType';
import { ZBasicPaymentMeansType } from '../../types/ram/TradeSettlementPaymentMeansType/BasicTradeSettlementPaymentMeansType';
import { ZBasicDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/BasicDocumentLevelTradeTaxType';
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
import { validationResult } from '../convert';

export const ZBasicProfileStructure = z.object({
    businessProcessType: ZIdType.optional(),
    profile: z.literal(PROFILES.BASIC),
    document: z.object({
        id: ZIdType,
        type: ZCodeType(DOCUMENT_TYPE_CODES),
        dateOfIssue: ZDateTimeType,
        currency: ZCodeType(CURRENCY_CODES),
        notes: ZBasicDocumentLevelNoteType.array().optional()
    }),
    seller: ZTradePartyType.extend({
        id: ZIdType.array().optional(),
        globalId: ZIdTypeWithRequiredScheme(ISO6523_CODES).array().optional(),
        specifiedLegalOrganization: z
            .object({
                id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional(),
                tradingBusinessName: ZTextType.optional()
            })
            .optional(),
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType.optional()
    }),
    buyer: ZTradePartyType.extend({
        reference: ZTextType.optional()
    }),
    sellerTaxRepresentative: ZTradePartyType.omit({
        id: true,
        globalId: true,
        specifiedLegalOrganization: true,
        universalCommunicationAddressURI: true
    })
        .extend({
            taxIdentification: ZSpecifiedVatRegistrationsType
        })
        .optional(),
    invoiceLines: ZBasicTradeLineItem.array(),
    referencedDocuments: z
        .object({
            orderReference: ZReferencedDocumentType_documentId.optional(),
            contractReference: ZReferencedDocumentType_documentId.optional(),
            advanceShippingNotice: ZReferencedDocumentType_documentId.optional(),
            referencedInvoice: ZReferencedDocumentType_docId_issueDate.array().optional()
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
        paymentMeans: ZBasicPaymentMeansType.array().optional(),
        paymentTerms: z
            .object({
                description: ZTextType.optional(),
                dueDate: ZDateTimeType.optional(),
                directDebitMandateID: ZIdType.optional()
            })
            .optional(),
        specifiedTradeAccountingAccount: ZIdType.optional()
    }),
    totals: z.object({
        sumWithoutAllowancesAndCharges: ZAmountType,
        documentLevelAllowancesAndCharges: ZBasicDocumentLevelTradeAllowanceChargeType.optional(),
        allowanceTotalAmount: ZAmountType.optional(),
        chargeTotalAmount: ZAmountType.optional(),
        netTotal: ZAmountType,
        taxBreakdown: ZBasicDocumentLevelTradeTaxType.array(),
        taxTotal: ZAmountTypeWithRequiredCurrency.array().max(2).optional(),
        taxCurrency: ZCodeType(CURRENCY_CODES).optional(),
        grossTotal: ZAmountType,
        prepaidAmount: ZAmountType.optional(),
        openAmount: ZAmountType
    })
});

export type BasicProfile = z.infer<typeof ZBasicProfileStructure>;

export function isBasicProfile(data: unknown): data is BasicProfile {
    return ZBasicProfileStructure.safeParse(data).success;
}

export const ZBasicProfile = [
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
    ...BR_Z
].reduce<z.ZodType<BasicProfile>>((schema, rule) => schema.refine(rule.rule, rule.error), ZBasicProfileStructure);

export function isValidBasicProfile(data: unknown): validationResult {
    const result = ZBasicProfile.safeParse(data);
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
