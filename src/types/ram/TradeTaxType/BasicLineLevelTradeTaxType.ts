import { z } from 'zod'

import { ZCodeType } from '../../CodeTypeConverter'
import { TAX_CATEGORY_CODES, TAX_TYPE_CODE } from '../../codes'
import { ZPercentType, ZPercentTypeXml } from '../../udt/PercentTypeConverter'
import { ZTextTypeXml } from '../../udt/TextTypeConverter'

export const ZBasicLineLevelTradeTaxType = z.object({
    typeCode: ZCodeType(TAX_TYPE_CODE).describe('BT-151-0'),
    categoryCode: ZCodeType(TAX_CATEGORY_CODES).describe('BT-151'),
    rateApplicablePercent: ZPercentType.optional().describe('BT-152')
})

export type BasicLineLevelTradeTaxType = z.infer<typeof ZBasicLineLevelTradeTaxType>

export const ZBasicLineLevelTradeTaxTypeXml = z.object({
    'ram:TypeCode': ZTextTypeXml,
    'ram:CategoryCode': ZTextTypeXml,
    'ram:RateApplicablePercent': ZPercentTypeXml.optional()
})

export type BasicLineLevelTradeTaxTypeXml = z.infer<typeof ZBasicLineLevelTradeTaxTypeXml>
