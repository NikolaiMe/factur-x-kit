import { z } from 'zod';

import { ZCodeType } from '../../types/CodeTypeConverter';
import { PROFILES } from '../../types/ProfileTypes';
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES
} from '../../types/codes';
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType';
import {
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter';
import { ZSpecifiedTaxRegistrationsType } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter';
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
import { ZTokenType } from '../../types/xs/TokenConverter';
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

export const ZTradePartyType = z.object({
    id: ZIdType.optional(), // in seller this could be an array
    globalId: ZIdTypeWithRequiredScheme(ISO6523_CODES).optional(), // in seller this could be an array
    name: ZTextType, // may be optional on some specific trade parties
    specifiedLegalOrganization: z.object({ id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional() }).optional(),
    postalAddress: z.object({
        postcode: ZTokenType.optional(),
        addressLineOne: ZTextType.optional(),
        addressLineTwo: ZTextType.optional(),
        addressLineThree: ZTextType.optional(),
        city: ZTextType.optional(),
        country: ZCodeType(COUNTRY_ID_CODES),
        countrySubDivision: ZTextType.optional()
    }),
    universalCommunicationAddressURI: ZIdTypeWithRequiredScheme(EAS_SCHEME_CODES).optional(),
    taxIdentification: ZSpecifiedTaxRegistrationsType.optional()
});

export const ZBasicWithoutLinesProfileStructure = z.object({
    businessProcessType: ZIdType.optional(),
    profile: z.literal(PROFILES.BASIC_WITHOUT_LINES).describe('BT-23'),
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
            taxIdentification: ZSpecifiedVatRegistrationsType.describe('BT-63-00')
        })
        .optional(),
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

export type BasicWithoutLinesProfile = z.infer<typeof ZBasicWithoutLinesProfileStructure>;

export const ZBasicWithoutLinesProfile = [
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
].reduce<z.ZodType<BasicWithoutLinesProfile>>(
    (schema, rule) => schema.refine(rule.rule, rule.error),
    ZBasicWithoutLinesProfileStructure
);

export function isBasicWithoutLinesProfile(data: unknown): data is BasicWithoutLinesProfile {
    return ZBasicWithoutLinesProfileStructure.safeParse(data).success;
}

export function isValidBasicWithoutLinesProfile(data: unknown): validationResult {
    const result = ZBasicWithoutLinesProfile.safeParse(data);
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
