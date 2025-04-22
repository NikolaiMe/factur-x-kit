import { z } from 'zod'

import { ZCodeType } from '../../types/CodeTypeConverter'
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes'
import { ZReferencedDocumentType_documentId } from '../../types/ram/ReferencedDocumentConverter'
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter'
import { ZAmountType } from '../../types/udt/AmountTypeConverter'
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter'
import { ZIdType } from '../../types/udt/IdTypeConverter'
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter'
import { ZTextType } from '../../types/udt/TextTypeConverter'

export const ZMinimumProfile = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal('urn:factur-x.eu:1p0:minimum')
    }),
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
        taxTotal: ZAmountTypeWithRequiredCurrency,
        grossTotal: ZAmountType,
        dueTotal: ZAmountType
    })
})

export type MinimumProfile = z.infer<typeof ZMinimumProfile>

export function isMinimumProfile(data: unknown): data is MinimumProfile {
    return ZMinimumProfile.safeParse(data).success
}
