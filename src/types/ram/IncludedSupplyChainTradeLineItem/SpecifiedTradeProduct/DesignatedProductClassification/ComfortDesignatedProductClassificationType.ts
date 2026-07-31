import { z } from 'zod';

import { UNTDID_7143 } from '../../../../codes';
import { ZTokenType } from '../../../../xs/TokenConverter';

export const ZComfortDesignatedProductClassificationType = z.object({
    productClass: z
        .object({
            code: z.string().describe('BT-158'),
            codeScheme: z.enum(UNTDID_7143).describe('BT-158-1'),
            codeSchemeVersion: ZTokenType.optional().describe('BT-158-2')
        })
        .optional()
});

export type ComfortDesignatedProductClassificationType = z.infer<typeof ZComfortDesignatedProductClassificationType>;

export const ZComfortDesignatedProductClassificationTypeXml = z.object({
    'ram:ClassCode': z
        .object({
            '#text': z.string(),
            '@listID': z.string(),
            '@listVersionID': ZTokenType.optional()
        })
        .optional()
});

export type ComfortDesignatedProductClassificationTypeXml = z.infer<
    typeof ZComfortDesignatedProductClassificationTypeXml
>;
