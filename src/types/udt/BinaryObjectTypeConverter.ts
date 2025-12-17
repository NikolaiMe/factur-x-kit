import { z } from 'zod';

import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';
import { MIME_CODES } from '../codes';

export const ZBinaryObjectType = z.object({
    mimeCode: z.nativeEnum(MIME_CODES),
    fileName: z.string(),
    base64Data: z.string()
});

export type BinaryObjectType = z.infer<typeof ZBinaryObjectType>;

export const ZBinaryObjectTypeXml = z.object({
    '@mimeCode': z.string(),
    '@filename': z.string(),
    '#text': z.string()
});

export type BinaryObjectTypeXml = z.infer<typeof ZBinaryObjectTypeXml>;

export class BinaryObjectTypeConverter extends BaseTypeConverter<BinaryObjectType, BinaryObjectTypeXml> {
    _toValue(xml: BinaryObjectTypeXml): BinaryObjectType {
        const { success, data } = ZBinaryObjectTypeXml.safeParse(xml);
        if (!success) {
            throw new TypeConverterError('INVALID_XML');
        }

        const convertedData = {
            mimeCode: data['@mimeCode'] as MIME_CODES,
            fileName: data['@filename'],
            base64Data: data['#text']
        };

        const { success: succes_val, data: data_val } = ZBinaryObjectType.safeParse(convertedData);
        if (!succes_val) {
            throw new TypeConverterError('INVALID_XML');
        }

        return data_val;
    }

    _toXML(value: BinaryObjectType): BinaryObjectTypeXml {
        const { success, data } = ZBinaryObjectType.safeParse(value);

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE');
        }

        return {
            '@mimeCode': data.mimeCode,
            '@filename': data.fileName,
            '#text': data.base64Data
        };
    }
}
