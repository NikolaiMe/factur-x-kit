import { z } from 'zod'

import { ZSpecifiedTaxRegistrationsType } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter.js'
import { ZNoteType } from '../../types/ram/index.js'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter.js'
import { ZIdType } from '../../types/udt/IdTypeConverter'
import { ZIdTypeWithScheme } from '../../types/udt/IdTypeWithSchemeConverter'
import { ZTextType } from '../../types/udt/TextTypeConverter.js'

const ZTradePartyType = z.object({
    id: ZIdType.array().optional(),
    globalId: ZIdType.array().optional(),
    name: ZTextType.optional(), // may be required on some specific trade parties
    specifiedLegalOrganization: ZIdTypeWithScheme.optional(), // TODO: ZIdTypeWithScheme extended by trading business name?
    postalAddress: z.object({
        address: ZTextType.optional().array().length(3),
        postcode: ZTextType.optional(),
        city: ZTextType.optional(),
        country: ZTextType,
        countrySubDivision: ZTextType.optional()
    }),
    // TODO: is URIUniversalCommunication an "email"?
    taxIdentification: ZSpecifiedTaxRegistrationsType
})

export const ZBasicWithoutLinesProfile = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal('urn:factur-x.eu:1p0:basicwl')
    }),
    notes: ZNoteType.array().optional(),
    document: z.object({
        id: ZIdType,
        type: ZTextType, // TODO: specific DocumentTypeType
        currency: ZTextType, // TODO: specific CurrencyType
        dateOfIssue: ZDateTimeType
    }),
    seller: ZTradePartyType.extend({
        name: ZTextType
    }),
    buyer: ZTradePartyType.extend({
        name: ZTextType
    })
    // TODO...
})

export type BasicWithoutLinesProfile = z.infer<typeof ZBasicWithoutLinesProfile>

export function isBasicWithoutLinesProfile(data: unknown): data is BasicWithoutLinesProfile {
    return ZBasicWithoutLinesProfile.safeParse(data).success
}
