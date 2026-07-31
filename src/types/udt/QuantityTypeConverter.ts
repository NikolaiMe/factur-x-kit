import { z } from 'zod';

import { round } from '../../helper/calculation';
import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';
import { UNIT_CODES } from '../codes';

export const ZQuantityType = z.object({
    quantity: z.number(),
    unit: z.enum(UNIT_CODES).optional()
});

export type QuantityType = z.infer<typeof ZQuantityType>;

export const ZQuantityTypeXml = z.object({
    '#text': z.string(),
    '@unitCode': z.string().optional()
});

export type QuantityTypeXml = z.infer<typeof ZQuantityTypeXml>;

export class QuantityTypeConverter extends BaseTypeConverter<QuantityType, QuantityTypeXml> {
    _toValue(xml: QuantityTypeXml) {
        const { success, data } = ZQuantityTypeXml.safeParse(xml);
        if (!success) {
            throw new TypeConverterError('INVALID_XML');
        }

        const quantity = parseFloat(data['#text']);
        if (quantity == null || isNaN(quantity)) {
            throw new TypeConverterError('INVALID_XML');
        }

        const value = {
            quantity,
            unit: data['@unitCode'] as UNIT_CODES | undefined
        };

        const { success: success_val, data: data_val } = ZQuantityType.safeParse(value);
        if (!success_val) {
            throw new TypeConverterError('INVALID_XML');
        }

        return data_val;
    }

    _toXML(value: QuantityType): QuantityTypeXml {
        const { success, data } = ZQuantityType.safeParse(value);

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE');
        }

        return {
            '#text': round(data.quantity, 4).toFixed(4),
            '@unitCode': data.unit
        };
    }
}
