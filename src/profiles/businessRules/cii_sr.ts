import { availableProfiles } from '../../core/factur-x';
import { PROFILES } from '../../types/ProfileTypes';
import { BusinessRuleWithError } from './br_co';

export function CII_SR_465(val: availableProfiles): boolean {
    if (
        val.profile === PROFILES.MINIMUM ||
        val.profile === PROFILES.BASIC_WITHOUT_LINES ||
        val.profile === PROFILES.BASIC
    )
        return true;

    for (const sellerTradeContact of val.seller.tradeContact ?? []) {
        if (sellerTradeContact.personName && sellerTradeContact.departmentName) return false;
    }
    return true;
}

export const CII_SR_465_ERROR = {
    message:
        '[CII-SR-465]-Only one BT-41 element is allowed on an invoice. Either personName or departmentName must be omitted in seller tradeContact.',
    path: ['seller', 'tradeContact']
};

export function CII_SR_466(val: availableProfiles): boolean {
    if (
        val.profile === PROFILES.MINIMUM ||
        val.profile === PROFILES.BASIC_WITHOUT_LINES ||
        val.profile === PROFILES.BASIC
    )
        return true;

    for (const buyerTradeContact of val.buyer.tradeContact ?? []) {
        if (buyerTradeContact.personName && buyerTradeContact.departmentName) return false;
    }
    return true;
}

export const CII_SR_466_ERROR = {
    message:
        '[CII-SR-466]-Only one BT-56 element is allowed on an invoice. Either personName or departmentName must be omitted in buyer tradeContact.',
    path: ['buyer', 'tradeContact']
};

export const CII_SR: BusinessRuleWithError[] = [
    { rule: CII_SR_465, error: CII_SR_465_ERROR },
    { rule: CII_SR_466, error: CII_SR_466_ERROR }
];
