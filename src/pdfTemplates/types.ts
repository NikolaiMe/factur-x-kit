import { PDFDocument } from 'pdf-lib';

import { availableProfiles } from '../core/factur-x';
import { HeaderImageFileType, ImageDimensions } from './invoiceBlocks/headerImage';
import { TranslatedTexts } from './texts/types';

export type SupportedLocales = keyof TranslatedTexts<string>;

export interface HeaderImageType {
    imageBytes: Uint8Array;
    dimensions: ImageDimensions;
    dataType: HeaderImageFileType;
}

export type FacturXKitPDFTemplate = (
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales,
    headerImage?: HeaderImageType
) => Promise<PDFDocument>;

export const mmToPt = 72.0 / 25.4;
export const ptToMm = 25.4 / 72.0;
export const dinA4Width = 210;
export const dinA4Height = 297;
