import { z } from 'zod';

import { ZCodeType } from '../../types/CodeTypeConverter';
import { PROFILES } from '../../types/ProfileTypes';
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes';
import { ZReferencedDocumentType_documentId } from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter';
import { ZAmountType } from '../../types/udt/AmountTypeConverter';
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter';
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter';
import { ZIdType } from '../../types/udt/IdTypeConverter';
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter';
import { ZTextType } from '../../types/udt/TextTypeConverter';
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

export const ZMinimumProfileStructure = z.object({
    businessProcessType: ZIdType.optional(),
    profile: z.literal(PROFILES.MINIMUM).describe('BT-24'),
    document: z.object({
        id: ZIdType,
        type: ZCodeType(DOCUMENT_TYPE_CODES),
        currency: ZCodeType(CURRENCY_CODES),
        dateOfIssue: ZDateTimeType
    }),
    seller: z.object({
        name: ZTextType,
        specifiedLegalOrganization: z.object({ id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional() }).optional(),
        postalAddress: z.object({
            country: ZTextType
        }),
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType
    }),
    buyer: z.object({
        reference: ZTextType.optional(), // Explanation @https://www.e-rechnung-bund.de/faq/leitweg-id/
        name: ZTextType,
        specifiedLegalOrganization: z.object({ id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional() }).optional()
    }),
    referencedDocuments: z
        .object({
            orderReference: ZReferencedDocumentType_documentId.optional()
        })
        .optional(),
    totals: z.object({
        netTotal: ZAmountType,
        taxTotal: ZAmountTypeWithRequiredCurrency.array().max(1).optional(),
        grossTotal: ZAmountType,
        openAmount: ZAmountType
    })
});

export type MinimumProfile = z.infer<typeof ZMinimumProfileStructure>;

export const ZMinimumProfile = [
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
].reduce<z.ZodType<MinimumProfile>>((schema, rule) => schema.refine(rule.rule, rule.error), ZMinimumProfileStructure);

export function isMinimumProfile(data: unknown): data is MinimumProfile {
    return ZMinimumProfileStructure.safeParse(data).success;
}

export function isValidMinimumProfile(data: unknown): validationResult {
    const result = ZMinimumProfile.safeParse(data);
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
