import { z } from 'zod';

import { CodeTypeConverter } from '../../CodeTypeConverter';
import { ExtendableBaseTypeConverter } from '../../ExtendableBaseTypeConverter';
import { UNTDID_1153 } from '../../codes';
import { DateTimeTypeConverter_qdt } from '../../qdt/DateTimeTypeConverter';
import { BinaryObjectTypeConverter } from '../../udt/BinaryObjectTypeConverter';
import { TextTypeConverter } from '../../udt/TextTypeConverter';
import { TokenTypeConverter } from '../../xs/TokenConverter';
import {
    ReferencedDocumentTypeXml_comfort_additionalSupportingDocuments,
    ReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier,
    ReferencedDocumentTypeXml_comfort_tenderOrLotReference,
    ReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter,
    ReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter,
    ReferencedDocumentType_comfort_tenderOrLotReference_forConverter
} from './AdditionalReferencedDocumentConverter/ComfortAdditonalReferencedDocumentTypes';
import {
    ReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort,
    ReferencedDocumentTypeXml_docId_issueDate,
    ReferencedDocumentTypeXml_documentId,
    ReferencedDocumentTypeXml_lineId,
    ReferencedDocumentType_additionalDocument_lineLevel_comfort,
    ReferencedDocumentType_docId_issueDate,
    ReferencedDocumentType_documentId,
    ReferencedDocumentType_lineId,
    ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort,
    ZReferencedDocumentTypeXml_docId_issueDate,
    ZReferencedDocumentTypeXml_documentId,
    ZReferencedDocumentTypeXml_lineId,
    ZReferencedDocumentType_additionalDocument_lineLevel_comfort,
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId,
    ZReferencedDocumentType_lineId
} from './ReferencedDocumentTypes';

export type allowedValueTypes_ReferencedDocumentType =
    | ReferencedDocumentType_docId_issueDate
    | ReferencedDocumentType_lineId
    | ReferencedDocumentType_additionalDocument_lineLevel_comfort
    | ReferencedDocumentType_documentId
    | ReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter
    | ReferencedDocumentType_comfort_tenderOrLotReference_forConverter
    | ReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter;
export type allowedXmlTypes_ReferencedDocumentType =
    | ReferencedDocumentTypeXml_docId_issueDate
    | ReferencedDocumentTypeXml_lineId
    | ReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort
    | ReferencedDocumentTypeXml_documentId
    | ReferencedDocumentTypeXml_comfort_additionalSupportingDocuments
    | ReferencedDocumentTypeXml_comfort_tenderOrLotReference
    | ReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier;

export class ReferencedDocumentTypeConverter<
    ValueType extends allowedValueTypes_ReferencedDocumentType,
    XmlType extends allowedXmlTypes_ReferencedDocumentType
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    idTypeConverter = new TokenTypeConverter();
    dateTimeTypeConverter = new DateTimeTypeConverter_qdt();
    textTypeConverter = new TextTypeConverter();
    binaryObjectTypeConverter = new BinaryObjectTypeConverter();
    referenceTypeCodeTypeConverter = new CodeTypeConverter(UNTDID_1153);
    typeCode: '50' | '130' | '916' | undefined = undefined;

    constructor(valueSchema?: z.ZodType<ValueType>, xmlSchema?: z.ZodType<XmlType>, typeCode?: '50' | '130' | '916') {
        if (!valueSchema) {
            valueSchema = ZReferencedDocumentType_docId_issueDate as unknown as z.ZodType<ValueType>;
        }
        if (!xmlSchema) {
            xmlSchema = ZReferencedDocumentTypeXml_docId_issueDate as unknown as z.ZodType<XmlType>;
        }
        super(valueSchema, xmlSchema);

        this.typeCode = typeCode;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            documentId:
                xml['ram:IssuerAssignedID'] != null
                    ? this.idTypeConverter.toValue(xml['ram:IssuerAssignedID'])
                    : undefined,
            uriid: xml['ram:URIID'] != null ? this.idTypeConverter.toValue(xml['ram:URIID']) : undefined,
            lineId: xml['ram:LineID'] != null ? this.idTypeConverter.toValue(xml['ram:LineID']) : undefined,
            typeCode: xml['ram:TypeCode'] != null ? this.idTypeConverter.toValue(xml['ram:TypeCode']) : undefined,
            name: xml['ram:Name'] != null ? this.textTypeConverter.toValue(xml['ram:Name']) : undefined,
            attachmentBinaryObject:
                xml['ram:AttachmentBinaryObject'] != null
                    ? this.binaryObjectTypeConverter.toValue(xml['ram:AttachmentBinaryObject'])
                    : undefined,
            referenceTypeCode:
                xml['ram:ReferenceTypeCode'] != null
                    ? this.referenceTypeCodeTypeConverter.toValue(xml['ram:ReferenceTypeCode'])
                    : undefined,
            issueDate:
                xml['ram:FormattedIssueDateTime'] != null
                    ? this.dateTimeTypeConverter.toValue(xml['ram:FormattedIssueDateTime'])
                    : undefined
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        const xml = {
            'ram:IssuerAssignedID': value.documentId != null ? this.idTypeConverter.toXML(value.documentId) : undefined,
            'ram:URIID': value.uriid != null ? this.idTypeConverter.toXML(value.uriid) : undefined,
            'ram:LineID': value.lineId != null ? this.idTypeConverter.toXML(value.lineId) : undefined,
            'ram:TypeCode': value.typeCode != null ? this.idTypeConverter.toXML(value.typeCode) : undefined,
            'ram:Name': value.name != null ? this.textTypeConverter.toXML(value.name) : undefined,
            'ram:AttachmentBinaryObject':
                value.attachmentBinaryObject != null
                    ? this.binaryObjectTypeConverter.toXML(value.attachmentBinaryObject)
                    : undefined,
            'ram:ReferenceTypeCode':
                value.referenceTypeCode != null
                    ? this.referenceTypeCodeTypeConverter.toXML(value.referenceTypeCode)
                    : undefined,
            'ram:FormattedIssueDateTime':
                value.issueDate != null ? this.dateTimeTypeConverter.toXML(value.issueDate) : undefined
        };
        return xml;
    }

    public static docId_issueDate() {
        return new ReferencedDocumentTypeConverter<
            ReferencedDocumentType_docId_issueDate,
            ReferencedDocumentTypeXml_docId_issueDate
        >(ZReferencedDocumentType_docId_issueDate, ZReferencedDocumentTypeXml_docId_issueDate);
    }

    public static lineId() {
        return new ReferencedDocumentTypeConverter<ReferencedDocumentType_lineId, ReferencedDocumentTypeXml_lineId>(
            ZReferencedDocumentType_lineId,
            ZReferencedDocumentTypeXml_lineId
        );
    }

    public static issuerId_type_referenceType() {
        return new ReferencedDocumentTypeConverter<
            ReferencedDocumentType_additionalDocument_lineLevel_comfort,
            ReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort
        >(
            ZReferencedDocumentType_additionalDocument_lineLevel_comfort,
            ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort
        );
    }

    public static documentId() {
        return new ReferencedDocumentTypeConverter<
            ReferencedDocumentType_documentId,
            ReferencedDocumentTypeXml_documentId
        >(ZReferencedDocumentType_documentId, ZReferencedDocumentTypeXml_documentId);
    }
}
