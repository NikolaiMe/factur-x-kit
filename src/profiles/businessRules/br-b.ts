import { availableProfiles } from '../../core/factur-x';
import { PROFILES } from '../../types/ProfileTypes';
import { COUNTRY_ID_CODES, TAX_CATEGORY_CODES } from '../../types/codes';
import { BusinessRuleWithError } from './br_co';

// Preperation when "B" (Split) is added to Category Codes. Tests need to be implemented then.

export function BR_B_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;
    // To be uncommented when "B" (Split) is added to Category Codes
    /*if (!hasLineAllowanceOrChargeWithCategoryCode(val, TAX_CATEGORY_CODES.SPLIT_PAYMENT)) {
        return true;
    }
    if (val.buyer.postalAddress?.country != COUNTRY_ID_CODES.ITALY) return false;
    if (val.seller.postalAddress?.country != COUNTRY_ID_CODES.ITALY) return false;
    if (val.sellerTaxRepresentative?.postalAddress?.country != COUNTRY_ID_CODES.ITALY) return false;
    if (val.delivery?.recipient?.postalAddress.country != COUNTRY_ID_CODES.ITALY) return false;
    */
    return true;
}

export const BR_B_1_ERROR = {
    message:
        '[BR-B-01]-An Invoice where the VAT category code (BT-151, BT-95 or BT-102) is “Split payment” shall be a domestic Italian invoice.',
    path: []
};

export function BR_B_2(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true;
    // To be uncommented when "B" (Split) is added to Category Codes
    /*if (
        hasLineAllowanceOrChargeWithCategoryCode(val, TAX_CATEGORY_CODES.SPLIT_PAYMENT) &&
        hasLineAllowanceOrChargeWithCategoryCode(val, TAX_CATEGORY_CODES.STANDARD_RATE)
    ) {
        return false;
    }*/
    return true;
}

export const BR_B_2_ERROR = {
    message:
        '[BR-B-02]-An Invoice that contains an Invoice line (BG-25), a Document level allowance (BG-20) or a Document level charge (BG-21) where the VAT category code (BT-151, BT-95 or BT-102) is “Split payment" shall not contain an invoice line (BG-25), a Document level allowance (BG-20) or  a Document level charge (BG-21) where the VAT category code (BT-151, BT-95 or BT-102) is “Standard rated”.',
    path: []
};

export function hasLineAllowanceOrChargeWithCategoryCode(
    val: availableProfiles,
    categoryCode: TAX_CATEGORY_CODES
): boolean {
    if (val.profile === PROFILES.MINIMUM) return false;

    let lineWithCategoryCodeExisting = false;
    if ('invoiceLines' in val && val.invoiceLines) {
        lineWithCategoryCodeExisting = val.invoiceLines.some(line => line.settlement.tax.categoryCode === categoryCode);
    }
    const allowancesWithCategoryCodeExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === categoryCode
    );
    const chargesWithCategoryCodeExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === categoryCode
    );
    if (lineWithCategoryCodeExisting || allowancesWithCategoryCodeExisting || chargesWithCategoryCodeExisting)
        return true;
    return false;
}

export const BR_B: BusinessRuleWithError[] = [
    { rule: BR_B_1, error: BR_B_1_ERROR },
    { rule: BR_B_2, error: BR_B_2_ERROR }
];
