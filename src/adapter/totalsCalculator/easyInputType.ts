// Original: ZComfortLineTradeAgreementType

import { z } from 'zod';

import { ZComfortProfileStructure } from '../../profiles/comfort';
import { ZCodeType } from '../../types/CodeTypeConverter';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    CURRENCY_CODES,
    TAX_CATEGORY_CODES,
    TIME_REFERENCE_CODES
} from '../../types/codes';
import { ZComfortTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem';
import { ZBasicPriceProductTradePriceType } from '../../types/ram/IncludedSupplyChainTradeLineItem/SpecifiedLineTradeAgreement/GrossPriceProductTradePrice/BasicGrossPriceProductTradePriceType';
import { ZComfortLineTradeSettlementType } from '../../types/ram/IncludedSupplyChainTradeLineItem/SpecifiedLineTradeSettlement/ComfortLineTradeSettlementType';
import { ZReferencedDocumentType_lineId } from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes';
import { ZTradeAllowanceChargeBasisType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType';
import { ZAmountType } from '../../types/udt/AmountTypeConverter';
import { ZDateType } from '../../types/udt/DateTypeConverter';

export const ZComfortLineTradeAgreementType_modified = z.object({
    referencedOrder: ZReferencedDocumentType_lineId.optional().describe('BT-132-00'),
    productPricing: ZBasicPriceProductTradePriceType.describe('BT-148-00')
});

export const zTaxTypesWithoutRate = z.union([
    z.literal(TAX_CATEGORY_CODES.ZERO_RATED_GOODS),
    z.literal(TAX_CATEGORY_CODES.EXEMPT_FROM_TAX),
    z.literal(TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE),
    z.literal(TAX_CATEGORY_CODES.INTRA_COMMUNITY_SUPPLY_VAT_EXEMPT), // Verwende den richtigen Wert aus der Basis-Enum
    z.literal(TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED),
    z.literal(TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT)
]);

export type TaxTypeWithoutTaxRate = z.infer<typeof zTaxTypesWithoutRate>;

export const zTaxTypesWithRate = z.union([
    z.literal(TAX_CATEGORY_CODES.STANDARD_RATE),
    z.literal(TAX_CATEGORY_CODES.IPSI),
    z.literal(TAX_CATEGORY_CODES.IGIC)
]);

export type TaxTypeWithTaxRate = z.infer<typeof zTaxTypesWithRate>;

export const zExemptionReason = z.object({
    reason: z.string(),
    categoryCode: zTaxTypesWithoutRate
});

const ZTaxWithRate = z.object({
    categoryCode: zTaxTypesWithRate,
    rateApplicablePercent: z.number().describe('BT-152')
});

const ZTaxWithoutRate = z.object({
    categoryCode: zTaxTypesWithoutRate
});

export const zTaxDueDate = z.union([
    ZTaxWithRate.extend({ dueDateTimeCode: ZCodeType(TIME_REFERENCE_CODES) }),
    ZTaxWithRate.extend({ taxPointDate: ZDateType })
]);

export const ZTax_modified = z.union([ZTaxWithRate, ZTaxWithoutRate]);

export const ZComfortLineTradeSettlementType_modified = ZComfortLineTradeSettlementType.omit({
    lineTotals: true,
    tax: true
}).extend({
    tax: ZTax_modified
});

export const zSimpleTradeLineItem = ZComfortTradeLineItem.extend({
    productPriceAgreement: ZComfortLineTradeAgreementType_modified,
    settlement: ZComfortLineTradeSettlementType_modified
});

const ZTradeAllowanceChargeBasisType_modified = ZTradeAllowanceChargeBasisType.extend({
    categoryTradeTax: ZTax_modified
});

export const ZTradeAllowanceType_modified = ZTradeAllowanceChargeBasisType_modified.extend({
    reasonCode: ZCodeType(ALLOWANCE_REASONS_CODES).optional()
});

export const ZTradeChargeType_modified = ZTradeAllowanceChargeBasisType_modified.extend({
    reasonCode: ZCodeType(CHARGE_REASONS_CODES).optional()
});

export const ZBasicDocumentLevelTradeAllowanceChargeType_modified = z.object({
    allowances: ZTradeAllowanceType_modified.array().optional(),
    charges: ZTradeChargeType_modified.array().optional()
});

export const ZOptionalForeignTaxCurrencyType = z.object({
    taxCurrency: ZCodeType(CURRENCY_CODES),
    exchangeRate: z.number()
});

export const ZComfortTotals_modiified = z.object({
    documentLevelAllowancesAndCharges: ZBasicDocumentLevelTradeAllowanceChargeType_modified.optional(),
    optionalTaxCurrency: ZOptionalForeignTaxCurrencyType.optional(),
    taxExemptionReason: zExemptionReason.array().optional(),
    optionalTaxDueDates: zTaxDueDate.array().optional(),
    roundingAmount: ZAmountType.optional(),
    prepaidAmount: ZAmountType.optional()
});

export const zTotalsCalculatorInputType = ZComfortProfileStructure.omit({
    profile: true
}).extend({
    invoiceLines: zSimpleTradeLineItem.array(),
    totals: ZComfortTotals_modiified.optional()
});

export type TotalsCalculatorInputType = z.infer<typeof zTotalsCalculatorInputType>;
