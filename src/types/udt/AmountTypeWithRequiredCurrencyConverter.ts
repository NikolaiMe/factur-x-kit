import { z } from 'zod'

import { round } from '../../helper/calculation'
import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter'
import { CURRENCY_CODES } from '../codes'

export const ZAmountTypeWithRequiredCurrency = z.object({
    amount: z.number(),
    currency: z.nativeEnum(CURRENCY_CODES)
})

export type AmountTypeWithRequiredCurrency = z.infer<typeof ZAmountTypeWithRequiredCurrency>

export const ZAmountTypeWithRequiredCurrencyXml = z.object({
    '#text': z.string(),
    '@currencyID': z.string()
})

export type AmountTypeWithRequiredCurrencyXml = z.infer<typeof ZAmountTypeWithRequiredCurrencyXml>

export class AmountTypeWithRequiredCurrencyConverter extends BaseTypeConverter<
    AmountTypeWithRequiredCurrency,
    AmountTypeWithRequiredCurrencyXml
> {
    _toValue(xml: AmountTypeWithRequiredCurrencyXml) {
        const { success, data } = ZAmountTypeWithRequiredCurrencyXml.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        const amount = parseFloat(data['#text'])
        if (amount == null || isNaN(amount)) {
            throw new TypeConverterError('INVALID_XML')
        }

        const value = {
            amount,
            currency: data['@currencyID'] as CURRENCY_CODES
        }

        const { success: success_val, data: data_val } = ZAmountTypeWithRequiredCurrency.safeParse(value)
        if (!success_val) {
            throw new TypeConverterError('INVALID_XML')
        }

        return data_val
    }

    _toXML(value: AmountTypeWithRequiredCurrency): AmountTypeWithRequiredCurrencyXml {
        const { success, data } = ZAmountTypeWithRequiredCurrency.safeParse(value)

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        return {
            '#text': round(data.amount, 2).toFixed(2),
            '@currencyID': data.currency
        }
    }
}
