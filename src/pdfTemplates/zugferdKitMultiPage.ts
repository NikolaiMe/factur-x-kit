import { PageSizes, rgb } from 'pdf-lib';
import { PDFDocument } from 'pdf-lib';

import openSansBoldPath from '../../assets/fonts/OpenSans/OpenSans-Bold.ttf';
import openSansLightPath from '../../assets/fonts/OpenSans/OpenSans-Light.ttf';
import openSansRegularPath from '../../assets/fonts/OpenSans/OpenSans-Regular.ttf';
import { availableProfiles } from '../core/factur-x';
import { dataUrlToUint8Array } from '../helper/calculation';
import addCustomerAddressBlock from './invoiceBlocks/customerAddressBlock';
import addFooter from './invoiceBlocks/footerBlock';
import { ImageDimensions, addHeaderImage } from './invoiceBlocks/headerImage';
import addIntroTextBlock from './invoiceBlocks/introTextBlock';
import addItemTable from './invoiceBlocks/itemTable/itemTable';
import addMetaBlock from './invoiceBlocks/metaDataBlock';
import addMonetarySummary from './invoiceBlocks/monetarySummary';
import addOutroTextBlock from './invoiceBlocks/outroTextBlock';
import addSenderLineBlock from './invoiceBlocks/senderLineBlock';
import addTitleBlock from './invoiceBlocks/titleBlock';
import { SupportedLocales, dinA4Height, mmToPt } from './types';

export default async function zugferdKitSinglePage(
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales,
    headerImage?: {
        path: string;
        dimensions: ImageDimensions;
    }
): Promise<PDFDocument> {
    const openSansRegularBytes = await dataUrlToUint8Array(openSansRegularPath);
    const openSansBoldBytes = await dataUrlToUint8Array(openSansBoldPath);
    const openSansLightBytes = await dataUrlToUint8Array(openSansLightPath);

    const page = pdfDoc.addPage(PageSizes.A4);
    const openSansRegular = await pdfDoc.embedFont(openSansRegularBytes);
    const openSansBold = await pdfDoc.embedFont(openSansBoldBytes);
    const openSansLight = await pdfDoc.embedFont(openSansLightBytes);
    const footerHeight = 100;

    if (headerImage) {
        await addHeaderImage(headerImage.path, headerImage.dimensions, page);
    }

    await addSenderLineBlock(data, page, openSansRegular, locale);
    const yCustomerAddress = await addCustomerAddressBlock(data, page, openSansRegular, locale);
    const yMetaBlock = await addMetaBlock(data, page, openSansRegular, openSansBold, locale);
    const titleBlockYPosition = Math.min(yCustomerAddress - 50, yMetaBlock - 20);

    const yTitleBlock = await addTitleBlock(data, page, openSansBold, locale, {
        position: { y: titleBlockYPosition }
    });
    const yIntroNoteBlock = await addIntroTextBlock(data, page, openSansRegular, locale, {
        position: { y: yTitleBlock - 20 }
    });

    page.drawLine({
        start: { x: 25 * mmToPt, y: yIntroNoteBlock - 15 },
        end: { x: page.getWidth() - 20 * mmToPt, y: yIntroNoteBlock - 15 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
        opacity: 1
    });

    const yMonetarySummary = await addMonetarySummary(data, page, openSansRegular, openSansBold, locale, {
        position: { y: yIntroNoteBlock - 30 }
    });

    page.drawLine({
        start: { x: 25 * mmToPt, y: yMonetarySummary - 6 },
        end: { x: page.getWidth() - 20 * mmToPt, y: yMonetarySummary - 6 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
        opacity: 1
    });

    await addOutroTextBlock(data, page, openSansRegular, openSansBold, locale, {
        position: { y: yMonetarySummary - 30 }
    });

    addFooter(data, page, openSansLight, locale, {
        position: { x: 15 * mmToPt, y: footerHeight },
        fontSize: 8,
        color: rgb(0, 0, 0)
    });

    const page2 = pdfDoc.addPage(PageSizes.A4); // Add a new page for the item table

    await addItemTable(data, page2, openSansRegular, openSansBold, locale, {
        position: { y: (dinA4Height - 25) * mmToPt }
    });

    return pdfDoc;
}
