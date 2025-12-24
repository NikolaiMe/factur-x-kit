import { z } from 'zod';

import { round } from '../../helper/calculation';
import { ComfortProfile } from '../../profiles/comfort';
import { PROFILES } from '../../types/ProfileTypes';
import { CURRENCY_CODES, EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES, TAX_TYPE_CODE } from '../../types/codes';
import { ComfortTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem';
import { ComfortLineTradeAgreementType } from '../../types/ram/IncludedSupplyChainTradeLineItem/SpecifiedLineTradeAgreement/ComfortLineTradeAgreementType';
import {
    BasicDocumentLevelTradeAllowanceChargeType,
    TradeAllowanceType,
    TradeChargeType
} from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType';
import { ComfortLineLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/ComfortLineLevelAllowanceChargeType';
import { BasicLineLevelTradeTaxType } from '../../types/ram/TradeTaxType/BasicLineLevelTradeTaxType';
import { ComfortDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/ComfortDocumentLevelTradeTaxType';
import { AmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter';
import {
    TotalsCalculatorInputType,
    ZBasicDocumentLevelTradeAllowanceChargeType_modified,
    ZComfortLineTradeAgreementType_modified,
    ZOptionalForeignTaxCurrencyType,
    ZTax_modified,
    zExemptionReason,
    zSimpleTradeLineItem,
    zTaxDueDate
} from './easyInputType';

export type SimpleTradeLineItem = z.infer<typeof zSimpleTradeLineItem>;
type SimpleLineTradeAgreementType = z.infer<typeof ZComfortLineTradeAgreementType_modified>;

function calculateLineTotals(
    netPricePerItem: number,
    quantity: number,
    priceBaseQuantity = 1,
    lineAllowancesAndCharges?: ComfortLineLevelTradeAllowanceChargeType
): number {
    const lineTotalWithoutAllowanceAndCharge = (netPricePerItem * quantity) / priceBaseQuantity;
    let totalAllowance = 0;
    let totalCharge = 0;
    if (lineAllowancesAndCharges?.allowances) {
        totalAllowance = lineAllowancesAndCharges.allowances.reduce(
            (sum, allowance) => sum + allowance.actualAmount,
            0
        );
    }
    if (lineAllowancesAndCharges?.charges) {
        totalCharge = lineAllowancesAndCharges.charges.reduce((sum, charge) => sum + charge.actualAmount, 0);
    }
    return round(lineTotalWithoutAllowanceAndCharge + totalCharge - totalAllowance, 2);
}

function createLComfortLineTradeAgreementFromSimpleInput(
    simpleLineTradeAgreement: SimpleLineTradeAgreementType
): ComfortLineTradeAgreementType {
    let netPricePerItem = simpleLineTradeAgreement.productPricing.basisPricePerItem;
    if (simpleLineTradeAgreement.productPricing.priceAllowancesAndCharges?.allowances) {
        netPricePerItem -= simpleLineTradeAgreement.productPricing.priceAllowancesAndCharges.allowances.reduce(
            (sum, allowance) => sum + allowance.actualAmount,
            0
        );
    }
    const productNetPricing = {
        netPricePerItem,
        priceBaseQuantity: simpleLineTradeAgreement.productPricing.priceBaseQuantity
    };
    return {
        ...simpleLineTradeAgreement,
        productNetPricing
    };
}

type TaxSimple = z.infer<typeof ZTax_modified>;

export function createComfortTaxTypeFromSimpleInput(taxInput: TaxSimple): BasicLineLevelTradeTaxType {
    let tax: BasicLineLevelTradeTaxType = { ...taxInput, typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT };
    if (
        tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE ||
        tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX ||
        tax.categoryCode === TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED ||
        tax.categoryCode === TAX_CATEGORY_CODES.INTRA_COMMUNITY_SUPPLY_VAT_EXEMPT ||
        tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    ) {
        tax = {
            ...tax,
            rateApplicablePercent: 0
        };
    }

    return tax;
}

export function createComfortTradeLineItemFromSimpleInput(easyLine: SimpleTradeLineItem): ComfortTradeLineItem {
    const productPriceAgreement = createLComfortLineTradeAgreementFromSimpleInput(easyLine.productPriceAgreement);
    const netTotal = calculateLineTotals(
        productPriceAgreement.productNetPricing.netPricePerItem,
        easyLine.delivery.itemQuantity.quantity,
        productPriceAgreement.productNetPricing.priceBaseQuantity?.quantity,
        easyLine.settlement.lineLevelAllowancesAndCharges
    );

    const tax = createComfortTaxTypeFromSimpleInput(easyLine.settlement.tax);

    return {
        ...easyLine,
        productPriceAgreement,
        settlement: { ...easyLine.settlement, tax, lineTotals: { netTotal } }
    };
}

export type TaxExemptionReason = z.infer<typeof zExemptionReason>;

function findExistingTaxInBreakdown(
    taxBreakdown: ComfortDocumentLevelTradeTaxType[],
    tax: BasicLineLevelTradeTaxType
): ComfortDocumentLevelTradeTaxType | undefined {
    if (
        tax.categoryCode === TAX_CATEGORY_CODES.IGIC ||
        tax.categoryCode === TAX_CATEGORY_CODES.IPSI ||
        tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    ) {
        return taxBreakdown.find(
            breakdownItem =>
                breakdownItem.categoryCode === tax.categoryCode &&
                breakdownItem.rateApplicablePercent === tax.rateApplicablePercent
        );
    }
    return taxBreakdown.find(breakdownItem => breakdownItem.categoryCode === tax.categoryCode);
}

function createNewTaxBreakdownItem(
    tax: BasicLineLevelTradeTaxType,
    exemptionReasons?: TaxExemptionReason[],
    taxDueDates?: TaxDueDate[]
): ComfortDocumentLevelTradeTaxType {
    const taxBreakdownItem: ComfortDocumentLevelTradeTaxType = {
        typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
        categoryCode: tax.categoryCode,
        rateApplicablePercent: tax.rateApplicablePercent,
        basisAmount: 0,
        calculatedAmount: 0,
        ...createExemptionReason(tax.categoryCode, exemptionReasons),
        ...createTaxDueDate(tax, taxDueDates)
    };
    return taxBreakdownItem;
}

export type TaxDueDate = z.infer<typeof zTaxDueDate>;

function createTaxDueDate(tax: BasicLineLevelTradeTaxType, optionalTaxDueDates?: TaxDueDate[]) {
    if (!optionalTaxDueDates || optionalTaxDueDates.length === 0) {
        return {};
    }
    if (
        tax.categoryCode === TAX_CATEGORY_CODES.IGIC ||
        tax.categoryCode === TAX_CATEGORY_CODES.IPSI ||
        tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    ) {
        const optionalTaxDueDate = optionalTaxDueDates.find(
            date => date.categoryCode === tax.categoryCode && date.rateApplicablePercent === tax.rateApplicablePercent
        );
        if (!optionalTaxDueDate) return {};
        if ('dueDateTimeCode' in optionalTaxDueDate) return { dueDateTimeCode: optionalTaxDueDate.dueDateTimeCode };
        if ('taxPointDate' in optionalTaxDueDate) return { taxPointDate: optionalTaxDueDate.taxPointDate };
    }
    return {};
}

function createExemptionReason(taxCategory: TAX_CATEGORY_CODES, exemptionReasons?: TaxExemptionReason[]) {
    if (
        taxCategory === TAX_CATEGORY_CODES.IGIC ||
        taxCategory === TAX_CATEGORY_CODES.IPSI ||
        taxCategory === TAX_CATEGORY_CODES.STANDARD_RATE ||
        taxCategory === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    ) {
        return {};
    }
    switch (taxCategory) {
        case TAX_CATEGORY_CODES.EXEMPT_FROM_TAX: {
            const exemptionReason = exemptionReasons?.find(
                reason => reason.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
            );
            if (!exemptionReasons) throw new Error('Exemption reasons are required for tax category EXEMPT_FROM_TAX');
            return { exemptionReason: exemptionReason?.reason };
        }
        case TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE: {
            const reverseChargeReason = exemptionReasons?.find(
                reason => reason.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
            );
            return {
                exemptionReason: reverseChargeReason?.reason,
                exemptionReasonCode: EXEMPTION_REASON_CODES.Reverse_charge
            };
        }
        case TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED: {
            const exportTaxReason = exemptionReasons?.find(
                reason => reason.categoryCode === TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED
            );
            return {
                exemptionReason: exportTaxReason?.reason,
                exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU
            };
        }
        case TAX_CATEGORY_CODES.INTRA_COMMUNITY_SUPPLY_VAT_EXEMPT: {
            const intraCommunityReason = exemptionReasons?.find(
                reason => reason.categoryCode === TAX_CATEGORY_CODES.INTRA_COMMUNITY_SUPPLY_VAT_EXEMPT
            );
            return {
                exemptionReason: intraCommunityReason?.reason,
                exemptionReasonCode: EXEMPTION_REASON_CODES.Intra_Community_supply
            };
        }
        case TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT: {
            const notSubjectToVatReason = exemptionReasons?.find(
                reason => reason.categoryCode === TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT
            );
            return {
                exemptionReason: notSubjectToVatReason?.reason,
                exemptionReasonCode: EXEMPTION_REASON_CODES.Not_subject_to_VAT
            };
        }
    }
}

function createTaxBreakdownFromTradeLineItems(
    tradeLineItems: ComfortTradeLineItem[],
    documentLevelAllowancesAndCharges?: BasicDocumentLevelTradeAllowanceChargeType,
    exemptionReasons?: TaxExemptionReason[]
): ComfortDocumentLevelTradeTaxType[] {
    let taxBreakdown = tradeLineItems.reduce((acc, line) => {
        let tax = findExistingTaxInBreakdown(acc, line.settlement.tax);
        if (!tax) {
            tax = createNewTaxBreakdownItem(line.settlement.tax, exemptionReasons);
            acc.push(tax);
        }
        tax.basisAmount += line.settlement.lineTotals.netTotal;
        return acc;
    }, [] as ComfortDocumentLevelTradeTaxType[]);

    taxBreakdown = (documentLevelAllowancesAndCharges?.allowances || ([] as TradeAllowanceType[])).reduce(
        (acc, allowance) => {
            let tax = findExistingTaxInBreakdown(acc, allowance.categoryTradeTax);
            if (!tax) {
                tax = createNewTaxBreakdownItem(allowance.categoryTradeTax, exemptionReasons);
                acc.push(tax);
            }
            tax.basisAmount -= allowance.actualAmount;
            return acc;
        },
        taxBreakdown
    );

    taxBreakdown = (documentLevelAllowancesAndCharges?.charges || ([] as TradeChargeType[])).reduce((acc, charge) => {
        let tax = findExistingTaxInBreakdown(acc, charge.categoryTradeTax);
        if (!tax) {
            tax = createNewTaxBreakdownItem(charge.categoryTradeTax, exemptionReasons);
            acc.push(tax);
        }
        tax.basisAmount += charge.actualAmount;
        return acc;
    }, taxBreakdown);

    return taxBreakdown.map(tax => {
        if (!tax.rateApplicablePercent || tax.rateApplicablePercent === 0) return tax;
        tax.calculatedAmount = round((tax.basisAmount * tax.rateApplicablePercent) / 100, 2);
        return tax;
    });
}

export type DocumentLevelAllowancesAndCharges = z.infer<typeof ZBasicDocumentLevelTradeAllowanceChargeType_modified>;

function createDocumentLevelAllowancesAndCharges(
    simpleDocumentLevelAllowancesAndCharges?: DocumentLevelAllowancesAndCharges
): BasicDocumentLevelTradeAllowanceChargeType | undefined {
    if (!simpleDocumentLevelAllowancesAndCharges) return undefined;
    const allowances = simpleDocumentLevelAllowancesAndCharges.allowances?.map(allowance => ({
        ...allowance,
        categoryTradeTax: createComfortTaxTypeFromSimpleInput(allowance.categoryTradeTax)
    }));
    const charges = simpleDocumentLevelAllowancesAndCharges.charges?.map(charge => ({
        ...charge,
        categoryTradeTax: createComfortTaxTypeFromSimpleInput(charge.categoryTradeTax)
    }));
    return { allowances, charges };
}

function calculateNetSumWithoutAllowancesAndCharges(tradeLineItems: ComfortTradeLineItem[]): number {
    const sum = tradeLineItems.reduce((acc, line) => acc + line.settlement.lineTotals.netTotal, 0);
    return round(sum, 2);
}

function calculateAllowanceAndChargeSum(
    documentLevelAllowancesAndCharges?: BasicDocumentLevelTradeAllowanceChargeType
): { allowanceTotalAmount: number; chargeTotalAmount: number } {
    if (!documentLevelAllowancesAndCharges) return { allowanceTotalAmount: 0, chargeTotalAmount: 0 };
    const allowanceTotalAmount =
        documentLevelAllowancesAndCharges.allowances?.reduce((sum, allowance) => sum + allowance.actualAmount, 0) || 0;
    const chargeTotalAmount =
        documentLevelAllowancesAndCharges.charges?.reduce((sum, charge) => sum + charge.actualAmount, 0) || 0;
    return { allowanceTotalAmount, chargeTotalAmount };
}

export type ForeignTaxCurrency = z.infer<typeof ZOptionalForeignTaxCurrencyType>;
function calculateTaxSum(
    taxBreakdown: ComfortDocumentLevelTradeTaxType[],
    invoiceCurrency: CURRENCY_CODES,
    foreignTaxCurrency?: ForeignTaxCurrency
): [AmountTypeWithRequiredCurrency] | [AmountTypeWithRequiredCurrency, AmountTypeWithRequiredCurrency] {
    const taxInInvoiceCurrency: AmountTypeWithRequiredCurrency = {
        amount: round(
            taxBreakdown.reduce((sum, tax) => sum + tax.calculatedAmount, 0),
            2
        ),
        currency: invoiceCurrency
    };
    if (!foreignTaxCurrency) {
        return [taxInInvoiceCurrency];
    }
    const taxInForeignCurrency: AmountTypeWithRequiredCurrency = {
        amount: round(taxInInvoiceCurrency.amount * foreignTaxCurrency.exchangeRate, 2),
        currency: foreignTaxCurrency.taxCurrency
    };

    return [taxInInvoiceCurrency, taxInForeignCurrency];
}

export function totalsCalculator(simpleInvoice: TotalsCalculatorInputType): ComfortProfile {
    const tradeLineItems = simpleInvoice.invoiceLines.map(createComfortTradeLineItemFromSimpleInput);
    const netSumWithoutAllowancesAndCharges = calculateNetSumWithoutAllowancesAndCharges(tradeLineItems);
    const documentLevelAllowancesAndCharges = createDocumentLevelAllowancesAndCharges(
        simpleInvoice.totals?.documentLevelAllowancesAndCharges
    );
    const { allowanceTotalAmount, chargeTotalAmount } = calculateAllowanceAndChargeSum(
        documentLevelAllowancesAndCharges
    );
    const taxBreakdown = createTaxBreakdownFromTradeLineItems(
        tradeLineItems,
        documentLevelAllowancesAndCharges,
        simpleInvoice.totals?.taxExemptionReason
    );
    const taxTotal = calculateTaxSum(
        taxBreakdown,
        simpleInvoice.document.currency,
        simpleInvoice.totals?.optionalTaxCurrency
    );
    const netTotal = round(netSumWithoutAllowancesAndCharges - allowanceTotalAmount + chargeTotalAmount, 2);
    const grossTotal = round(netTotal + taxTotal[0].amount, 2);

    const totals: ComfortProfile['totals'] = {
        sumWithoutAllowancesAndCharges: netSumWithoutAllowancesAndCharges,
        documentLevelAllowancesAndCharges,
        allowanceTotalAmount,
        chargeTotalAmount,
        netTotal,
        taxBreakdown,
        taxTotal,
        taxCurrency: simpleInvoice.totals?.optionalTaxCurrency?.taxCurrency,
        grossTotal,
        prepaidAmount: simpleInvoice.totals?.prepaidAmount,
        roundingAmount: simpleInvoice.totals?.roundingAmount,
        openAmount:
            grossTotal - (simpleInvoice.totals?.prepaidAmount || 0) + (simpleInvoice.totals?.roundingAmount || 0)
    };

    return {
        ...simpleInvoice,
        profile: PROFILES.COMFORT,
        invoiceLines: tradeLineItems,
        totals
    };
}
