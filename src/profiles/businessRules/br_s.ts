import { availableProfiles } from '../../core/factur-x';
import { PROFILES } from '../../types/ProfileTypes';
import { TAX_CATEGORY_CODES } from '../../types/codes';
import { BusinessRuleWithError } from './br_co';

export function BR_S_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;

    let linesWithStandardTaxExisting = false;
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithStandardTaxExisting = val.invoiceLines.some(
            line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
        );
    }

    const allowancesWithStandardTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );

    const chargesWithStandardTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );
    if (!linesWithStandardTaxExisting && !allowancesWithStandardTaxExisting && !chargesWithStandardTaxExisting)
        return true;

    const taxBreakdownWithStandardRate = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );

    if (taxBreakdownWithStandardRate.length >= 1) {
        return true;
    }
    return false;
}

export const BR_S_1_ERROR = {
    message:
        '[BR-S-1] An Invoice that contains an Invoice line (BG-25), a Document level allowance (BG-20) or a Document level charge (BG-21) where the VAT category code (BT-151, BT-95 or BT-102) is "Standard Rate" shall contain in the VAT breakdown (BG-23) at least one VAT category code (BT-118) equal with "Standard Rate".',
    path: ['totals', 'taxBreakdown']
};

export function BR_S_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;

    const linesWithStandardTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );
    if (!linesWithStandardTaxExisting) return true;

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true;
    }

    return false;
}

export const BR_S_2_ERROR = {
    message:
        '[BR-S-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Standard Rate" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
};

export function BR_S_3(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;

    const allowancesWithStandardTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );
    if (!allowancesWithStandardTaxExisting) return true;

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true;
    }

    return false;
}

export const BR_S_3_ERROR = {
    message:
        '[BR-S-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Standard Rate" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
};

export function BR_S_4(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;

    const chargesWithStandardTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );
    if (!chargesWithStandardTaxExisting) return true;

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true;
    }

    return false;
}

export const BR_S_4_ERROR = {
    message:
        '[BR-S-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Standard Rate" shall contain the Seller VAT Identifier (BT-31), the Seller Tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
};

export function BR_S_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.STANDARD_RATE) continue;
        if (line.settlement.tax.rateApplicablePercent == null || line.settlement.tax.rateApplicablePercent <= 0) {
            //printError(`Business Rule BR-S-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false;
        }
    }

    return true;
}

export const BR_S_5_ERROR = {
    message:
        '[BR-S-5] In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Standard Rate" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
};

export function BR_S_6(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true;
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.STANDARD_RATE) continue;
        if (
            allowance.categoryTradeTax.rateApplicablePercent == null ||
            allowance.categoryTradeTax.rateApplicablePercent <= 0
        ) {
            //printError(`Business Rule BR-S-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false;
        }
    }

    return true;
}

export const BR_S_6_ERROR = {
    message:
        '[BR-S-6] In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Standard Rate" the Document level allowance VAT rate (BT-96) shall be greater than zero.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
};

export function BR_S_7(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true;
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.STANDARD_RATE) continue;
        if (
            charge.categoryTradeTax.rateApplicablePercent == null ||
            charge.categoryTradeTax.rateApplicablePercent <= 0
        ) {
            //printError(`Business Rule BR-S-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false;
        }
    }

    return true;
}

export const BR_S_7_ERROR = {
    message:
        '[BR-S-7] In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Standard Rate" the Document level charge VAT rate (BT-103) shall be greater than zero.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
};

export function BR_S_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;

    // Step 1: Check which tax rates are available for Standard Rate

    const availableTaxRatesInLines = val.invoiceLines.reduce((acc, line) => {
        if (line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE) {
            const rate = line.settlement.tax.rateApplicablePercent;
            if (rate != null && rate > 0) {
                acc.add(rate);
            }
        }
        return acc;
    }, new Set<number>());

    const availableTaxRatesInAllowances =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((acc, allowance) => {
            if (allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE) {
                const rate = allowance.categoryTradeTax.rateApplicablePercent;
                if (rate != null && rate > 0) {
                    acc.add(rate);
                }
            }
            return acc;
        }, new Set<number>()) || new Set<number>();

    const availableTaxRatesInCharges =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((acc, charge) => {
            if (charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE) {
                const rate = charge.categoryTradeTax.rateApplicablePercent;
                if (rate != null && rate > 0) {
                    acc.add(rate);
                }
            }
            return acc;
        }, new Set<number>()) || new Set<number>();

    const allAvailableTaxRates = new Set([
        ...availableTaxRatesInLines,
        ...availableTaxRatesInAllowances,
        ...availableTaxRatesInCharges
    ]);

    // Step 2: Check whether there is exactly one Tax Breakdown for each tax rate in the totals and it contains the expected amount

    for (const rate of allAvailableTaxRates) {
        const taxBreakdownsWithStandardRate = val.totals.taxBreakdown.filter(
            tax => tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE && tax.rateApplicablePercent === rate
        );

        if (
            !taxBreakdownsWithStandardRate ||
            taxBreakdownsWithStandardRate.length === 0 ||
            taxBreakdownsWithStandardRate.length > 1
        ) {
            return false;
        }

        const taxBreakdownWithStandardRate = taxBreakdownsWithStandardRate[0];

        const totalProvidedStandardRateTaxAmount = taxBreakdownWithStandardRate.basisAmount;
        const sumOfLinesWithStandardRateTax = val.invoiceLines.reduce((sum, line) => {
            if (
                line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE &&
                line.settlement.tax.rateApplicablePercent === rate
            ) {
                return sum + line.settlement.lineTotals.netTotal;
            }
            return sum;
        }, 0);

        const sumOfDocumentLevelAllowancesWithStandardRateTax =
            val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
                if (
                    allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE &&
                    allowance.categoryTradeTax.rateApplicablePercent === rate
                ) {
                    return sum + allowance.actualAmount;
                }
                return sum;
            }, 0) || 0;

        const sumOfDocumentLevelChargesWithStandardRateTax =
            val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
                if (
                    charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE &&
                    charge.categoryTradeTax.rateApplicablePercent === rate
                ) {
                    return sum + charge.actualAmount;
                }
                return sum;
            }, 0) || 0;

        const totalExpectedStandardTaxAmount =
            sumOfLinesWithStandardRateTax -
            sumOfDocumentLevelAllowancesWithStandardRateTax +
            sumOfDocumentLevelChargesWithStandardRateTax;

        if (!(
            totalProvidedStandardRateTaxAmount - 0.1 <= totalExpectedStandardTaxAmount &&
            totalProvidedStandardRateTaxAmount + 0.1 >= totalExpectedStandardTaxAmount
        )) {
            return false;
        }
    }

    return true;
}

export const BR_S_8_ERROR = {
    message:
        '[BR-S-8] For each different value of VAT category rate (BT-119) where the VAT category code (BT-118) is "Standard Rate", the VAT category taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-95) is "Standard Rate" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119)..',
    path: ['totals', 'taxBreakdown', 'basisAmount']
};
export function BR_S_9(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;
    const taxBreakdownsWithStandardRate = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );

    if (taxBreakdownsWithStandardRate.length === 0) return true;

    for (const taxBreakdown of taxBreakdownsWithStandardRate) {
        if (taxBreakdown.rateApplicablePercent == null) return false;
        const expectedAmount = taxBreakdown.basisAmount * (taxBreakdown.rateApplicablePercent / 100);
        if (Math.abs(taxBreakdown.calculatedAmount - expectedAmount) > 0.01) return false;
    }

    return true;
}

export const BR_S_9_ERROR = {
    message:
        '[BR-S-9] The VAT category tax amount (BT-117) in a VAT breakdown (BG-23) where VAT category code (BT-118) is "Standard Rate" shall equal the VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119).',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
};

export function BR_S_10(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;
    const taxBreakdownsWithStandardRate = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.STANDARD_RATE
    );

    if (taxBreakdownsWithStandardRate.length === 0) return true;

    for (const taxBreakdown of taxBreakdownsWithStandardRate) {
        if (taxBreakdown.exemptionReason || taxBreakdown.exemptionReasonCode) return false;
    }

    return true;
}

export const BR_S_10_ERROR = {
    message:
        '[BR-S-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) "Standard Rate" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
};

export const BR_S: BusinessRuleWithError[] = [
    { rule: BR_S_1, error: BR_S_1_ERROR },
    { rule: BR_S_2, error: BR_S_2_ERROR },
    { rule: BR_S_3, error: BR_S_3_ERROR },
    { rule: BR_S_4, error: BR_S_4_ERROR },
    { rule: BR_S_5, error: BR_S_5_ERROR },
    { rule: BR_S_6, error: BR_S_6_ERROR },
    { rule: BR_S_7, error: BR_S_7_ERROR },
    { rule: BR_S_8, error: BR_S_8_ERROR },
    { rule: BR_S_9, error: BR_S_9_ERROR },
    { rule: BR_S_10, error: BR_S_10_ERROR }
];
