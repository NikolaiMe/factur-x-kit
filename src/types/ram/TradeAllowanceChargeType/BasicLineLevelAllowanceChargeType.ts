import { z } from 'zod'

import { ZCodeType } from '../../CodeTypeConverter'
import { ALLOWANCE_REASONS_CODES, CHARGE_REASONS_CODES } from '../../codes'
import { ZAmountType, ZAmountTypeXml } from '../../udt/AmountTypeConverter'
import { ZIndicatorTypeXml } from '../../udt/IndicatorTypeConverter'
import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter'

const ZTradeAllowanceChargeBasisType = z.object({
    actualAmount: ZAmountType,
    reasonCode: z.union([z.nativeEnum(CHARGE_REASONS_CODES), z.nativeEnum(ALLOWANCE_REASONS_CODES)]).optional(),
    reason: ZTextType.optional()
})

const ZTradeAllowanceType = ZTradeAllowanceChargeBasisType.extend({
    reasonCode: ZCodeType(ALLOWANCE_REASONS_CODES).optional()
})

const ZTradeChargeType = ZTradeAllowanceChargeBasisType.extend({
    reasonCode: ZCodeType(CHARGE_REASONS_CODES).optional()
})

export const ZBasicLineLevelTradeAllowanceChargeType = z.object({
    allowances: ZTradeAllowanceType.array().optional(),
    charges: ZTradeChargeType.array().optional()
})

export type BasicLineLevelTradeAllowanceChargeType = z.infer<typeof ZBasicLineLevelTradeAllowanceChargeType>

const ZTradeAllowanceChargeBasisTypeXml = z.object({
    'ram:ChargeIndicator': ZIndicatorTypeXml,
    'ram:ActualAmount': ZAmountTypeXml,
    'ram:ReasonCode': ZTextTypeXml.optional(),
    'ram:Reason': ZTextTypeXml.optional()
})

export const ZBasicLineLevelTradeAllowanceChargeTypeXml = z.union([
    ZTradeAllowanceChargeBasisTypeXml,
    ZTradeAllowanceChargeBasisTypeXml.array()
])

export type BasicLineLevelTradeAllowanceChargeTypeXml = z.infer<typeof ZBasicLineLevelTradeAllowanceChargeTypeXml>
