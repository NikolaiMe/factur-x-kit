import { PDFImage, PDFPage } from 'pdf-lib';

export interface ImageDimensions {
    width: number;
    height: number;
}

export type HeaderImageFileType = 'png' | 'jpg' | 'jpeg';

export async function addHeaderImage(
    imageBytes: Buffer,
    dimensions: ImageDimensions,
    headerImageFileType: HeaderImageFileType,
    page: PDFPage
): Promise<void> {
    try {
        const imageUint8Array = new Uint8Array(imageBytes);

        const pdfDoc = page.doc;
        let embeddedImage: PDFImage;

        if (headerImageFileType === 'png') {
            embeddedImage = await pdfDoc.embedPng(imageUint8Array);
        } else if (headerImageFileType === 'jpg' || headerImageFileType === 'jpeg') {
            embeddedImage = await pdfDoc.embedJpg(imageUint8Array);
        } else {
            throw new Error('Unsupported image type. Only PNG and JPG/JPEG are supported.');
        }

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const x = pageWidth - dimensions.width;
        const y = pageHeight - dimensions.height;

        page.drawImage(embeddedImage, {
            x: x,
            y: y,
            width: dimensions.width,
            height: dimensions.height
        });
    } catch (error) {
        console.error('Error when trying to print header to pdf:', error);
        throw error;
    }
}
