/* eslint-disable @typescript-eslint/no-explicit-any */
import objectPath from 'object-path';

import { BaseTypeConverter, TypeConverterError } from '../types/BaseTypeConverter';
import { XML_OBJECT_BOILERPLATE_AFTER, XML_OBJECT_BOILERPLATE_BEFORE } from '../types/additionalTypes';

// Main DotNotation type that delegates to ArrayDotNotation for array
export type DotNotation<T> = T extends object
    ? {
          [K in keyof T & string]:
              | K
              | (NonNullable<T[K]> extends (infer U)[]
                    ? `${K}.${number}` | (U extends object ? `${K}.${number}.${DotNotation<U>}` : never)
                    : NonNullable<T[K]> extends object
                      ? `${K}.${DotNotation<NonNullable<T[K]>>}`
                      : never);
      }[keyof T & string]
    : never;

export interface MappingItem<Profile, ProfileXml> {
    obj: DotNotation<Profile>;
    xml: DotNotation<ProfileXml>;
    default?: string;
    converter: BaseTypeConverter<any, any>;
}

export interface SimplifiedMappingItem {
    obj: string;
    xml: string;
    default?: string;
    converter: BaseTypeConverter<any, any>;
}

export interface checkResult {
    valid: boolean;
    errors?: { message: string; path: (string | number)[] }[];
}

// export interface Converter<Profile, ProfileXml> {
//     xml2obj(xml: object, map: MappingItem<Profile>): Profile
//     obj2xml(obj: Profile): ProfileXml
// }

export abstract class Converter<Profile, ProfileXml> {
    // protected readonly map: MappingItem<Profile, ProfileXml>[] = []
    protected readonly map: SimplifiedMappingItem[] = [];
    protected abstract isProperXMLScheme(xmlObject: any): xmlObject is ProfileXml;
    protected abstract isProperObjectScheme(object: any): object is Profile;
    public abstract validateProfile(profile: any): checkResult;

    xml2obj(xml: object, map: SimplifiedMappingItem[] = this.map): Profile {
        let out: object = {};

        for (const item of map) {
            const value = objectPath.get<any>(xml, item.xml, item.default);
            if (!value) {
                continue;
            }

            objectPath.set(out, item.obj, item.converter.toValue(value));
        }

        out = Converter.cleanObject(out);

        if (!this.isProperObjectScheme(out)) throw new TypeConverterError('INVALID_STRUCTURE');

        return out as Profile;
    }

    obj2xml(obj: object, map: SimplifiedMappingItem[] = this.map): ProfileXml {
        const checkerResults = this.validateProfile(obj);
        if (!checkerResults.valid) {
            console.warn('Profile Validation failed with the following errors:', checkerResults.errors);
            throw new Error('There are Errors in the given Data. Please correct the data to get a valid Invoice');
        }
        let xml: any = {};

        for (const item of map) {
            const value = objectPath.get<any>(obj, item.obj, item.default);
            if (value == null) {
                continue;
            }

            objectPath.set(xml, item.xml, item.converter?.toXML(value));
        }

        if (!xml['rsm:CrossIndustryInvoice'])
            throw new Error('Conversion from Obj to Xml failed! No rsm:CrossIndustryInvoice');

        if (!xml['rsm:CrossIndustryInvoice']['rsm:SupplyChainTradeTransaction']['ram:ApplicableHeaderTradeDelivery']) {
            const newSupplyChainTradeTransaction = Converter.insertPropertyBefore(
                xml['rsm:CrossIndustryInvoice']['rsm:SupplyChainTradeTransaction'],
                'ram:ApplicableHeaderTradeDelivery',
                { '#text': '' },
                'ram:ApplicableHeaderTradeSettlement'
            );
            xml = {
                'rsm:CrossIndustryInvoice': {
                    'rsm:ExchangedDocumentContext': xml['rsm:CrossIndustryInvoice']['rsm:ExchangedDocumentContext'],
                    'rsm:ExchangedDocument': xml['rsm:CrossIndustryInvoice']['rsm:ExchangedDocument'],
                    'rsm:SupplyChainTradeTransaction': newSupplyChainTradeTransaction
                }
            };
        }
        xml = {
            'rsm:CrossIndustryInvoice': { ...xml['rsm:CrossIndustryInvoice'], ...XML_OBJECT_BOILERPLATE_AFTER }
        };
        xml = { ...XML_OBJECT_BOILERPLATE_BEFORE, ...xml };
        xml = Converter.cleanObject(xml);

        if (!this.isProperXMLScheme(xml)) throw new TypeConverterError('INVALID_STRUCTURE');
        return xml as ProfileXml;
    }

    private static cleanObject(obj: any, parentKey?: string): any {
        /* This function makes sure that objects which are completely undefined, will be set to undefined on the higher level
            example:
            {
                something:{
                    x: undefined,
                    y: undefined,
                },
                somethingElse:{
                    z:"test",
                },
                delivery: { // Special case
                    a: undefined,
                    b: undefined
                }
            }

            --> Will be converted to:
            {
                something: undefined,
                somethingElse:{
                    z:"test",
                },
                delivery: {} // Should remain an empty object or object with undefineds
            }
        */

        if (typeof obj !== 'object' || obj === null || obj === undefined || obj instanceof Date) {
            return obj;
        }

        const cleanedObj: any = Array.isArray(obj) ? [] : {};
        let allPropertiesAreUndefined = true;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const cleanedValue = this.cleanObject(obj[key], key);

                if (cleanedValue !== undefined) {
                    allPropertiesAreUndefined = false;
                }
                cleanedObj[key] = cleanedValue;
            }
        }

        if (
            allPropertiesAreUndefined &&
            !(parentKey === 'delivery' || parentKey === 'ram:ApplicableHeaderTradeDelivery')
        ) {
            return undefined;
        } else {
            return cleanedObj;
        }
    }

    private static insertPropertyBefore<T extends Record<string, any>>(
        originalObj: T,
        keyToInsert: string,
        valueToInsert: any,
        beforeKey: keyof T // Der Schlüssel, vor dem eingefügt werden soll
    ): Record<string, any> {
        const newObj: Record<string, any> = {};
        let inserted = false;

        for (const key in originalObj) {
            if (Object.prototype.hasOwnProperty.call(originalObj, key)) {
                if (key === beforeKey && !inserted) {
                    newObj[keyToInsert] = valueToInsert;
                    inserted = true;
                }
                newObj[key] = originalObj[key];
            }
        }

        if (!inserted)
            throw new Error(
                `Property could not be inserted into object, because key ${String(beforeKey)} could not be found in Object`
            );

        return newObj;
    }
}
