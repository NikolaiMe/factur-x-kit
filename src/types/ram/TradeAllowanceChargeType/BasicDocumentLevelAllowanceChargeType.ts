import { z } from 'zod';

import { ZCodeType } from '../../CodeTypeConverter';
import { ALLOWANCE_REASONS_CODES, CHARGE_REASONS_CODES, TAX_CATEGORY_CODES, TAX_TYPE_CODE } from '../../codes';
import { ZAmountType, ZAmountTypeXml } from '../../udt/AmountTypeConverter';
import { ZIndicatorTypeXml } from '../../udt/IndicatorTypeConverter';
import { ZPercentType, ZPercentTypeXml } from '../../udt/PercentTypeConverter';
import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter';

export const ZTradeAllowanceChargeBasisType = z.object({
    calculationPercent: ZPercentType.optional(),
    basisAmount: ZAmountType.optional(),
    actualAmount: ZAmountType,
    reasonCode: z.union([z.enum(CHARGE_REASONS_CODES), z.enum(ALLOWANCE_REASONS_CODES)]).optional(),
    reason: ZTextType.optional(),
    categoryTradeTax: z.object({
        typeCode: ZCodeType(TAX_TYPE_CODE),
        categoryCode: ZCodeType(TAX_CATEGORY_CODES),
        rateApplicablePercent: ZPercentType.optional()
    })
});

export type TradeAllowanceChargeBasisType = z.infer<typeof ZTradeAllowanceChargeBasisType>;

const ZTradeAllowanceType = ZTradeAllowanceChargeBasisType.extend({
    reasonCode: ZCodeType(ALLOWANCE_REASONS_CODES).optional()
});

const ZTradeChargeType = ZTradeAllowanceChargeBasisType.extend({
    reasonCode: ZCodeType(CHARGE_REASONS_CODES).optional()
});

export type TradeAllowanceType = z.infer<typeof ZTradeAllowanceType>;
export type TradeChargeType = z.infer<typeof ZTradeChargeType>;

export const ZBasicDocumentLevelTradeAllowanceChargeType = z.object({
    allowances: ZTradeAllowanceType.array().optional(),
    charges: ZTradeChargeType.array().optional()
});

export type BasicDocumentLevelTradeAllowanceChargeType = z.infer<typeof ZBasicDocumentLevelTradeAllowanceChargeType>;

export const ZTradeAllowanceChargeBasisTypeXml = z.object({
    'ram:ChargeIndicator': ZIndicatorTypeXml,
    'ram:CalculationPercent': ZPercentTypeXml.optional(),
    'ram:BasisAmount': ZAmountTypeXml.optional(),
    'ram:ActualAmount': ZAmountTypeXml,
    'ram:ReasonCode': ZTextTypeXml.optional(),
    'ram:Reason': ZTextTypeXml.optional(),
    'ram:CategoryTradeTax': z.object({
        'ram:TypeCode': ZTextTypeXml,
        'ram:CategoryCode': ZTextTypeXml,
        'ram:RateApplicablePercent': ZPercentTypeXml.optional()
    })
});

export const ZBasicDocumentLevelTradeAllowanceChargeTypeXml = z.union([
    ZTradeAllowanceChargeBasisTypeXml,
    ZTradeAllowanceChargeBasisTypeXml.array()
]);

export type BasicDocumentLevelTradeAllowanceChargeTypeXml = z.infer<
    typeof ZBasicDocumentLevelTradeAllowanceChargeTypeXml
>;
