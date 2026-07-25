import { z } from 'zod';

import { round } from '../../helper/calculation';
import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';
import { UNIT_CODES } from '../codes';

export const ZQuantityWithRequiredUnitType = z.object({
    quantity: z.number(),
    unit: z.enum(UNIT_CODES)
});

export type QuantityWithRequiredUnitType = z.infer<typeof ZQuantityWithRequiredUnitType>;

export const ZQuantityWithRequiredUnitTypeXml = z.object({
    '#text': z.string(),
    '@unitCode': z.string()
});

export type QuantityWithRequiredUnitTypeXml = z.infer<typeof ZQuantityWithRequiredUnitTypeXml>;

export class QuantityWithRequiredUnitTypeConverter extends BaseTypeConverter<
    QuantityWithRequiredUnitType,
    QuantityWithRequiredUnitTypeXml
> {
    _toValue(xml: QuantityWithRequiredUnitTypeXml) {
        const { success, data, error } = ZQuantityWithRequiredUnitTypeXml.safeParse(xml);
        if (!success) {
            console.error(error.message);
            throw new TypeConverterError('INVALID_XML');
        }

        const quantity = parseFloat(data['#text']);
        if (quantity == null || isNaN(quantity)) {
            throw new TypeConverterError('INVALID_XML');
        }

        const value = {
            quantity,
            unit: data['@unitCode'] as UNIT_CODES
        };

        const {
            success: success_val,
            data: data_val,
            error: error_val
        } = ZQuantityWithRequiredUnitType.safeParse(value);
        if (!success_val) {
            console.log(error_val.message);
            throw new TypeConverterError('INVALID_XML');
        }

        return data_val;
    }

    _toXML(value: QuantityWithRequiredUnitType): QuantityWithRequiredUnitTypeXml {
        const { success, data } = ZQuantityWithRequiredUnitType.safeParse(value);

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE');
        }

        return {
            '#text': round(data.quantity, 2).toFixed(2),
            '@unitCode': data.unit
        };
    }
}
