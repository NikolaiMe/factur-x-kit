import { PageSizes, rgb } from 'pdf-lib';
import { PDFDocument } from 'pdf-lib';

import openSansBoldPath from '../../assets/fonts/OpenSans/OpenSans-Bold.ttf';
import openSansLightPath from '../../assets/fonts/OpenSans/OpenSans-Light.ttf';
import openSansRegularPath from '../../assets/fonts/OpenSans/OpenSans-Regular.ttf';
import { availableProfiles } from '../core/factur-x';
import { dataUrlToUint8Array } from '../helper/calculation';
import { facturXKitMultiPage } from './facturXKitMultiPage';
import { addCustomerAddressBlock } from './invoiceBlocks/customerAddressBlock';
import { addFooter } from './invoiceBlocks/footerBlock';
import { addHeaderImage } from './invoiceBlocks/headerImage';
import { addIntroTextBlock } from './invoiceBlocks/introTextBlock';
import { addItemTable } from './invoiceBlocks/itemTable/itemTable';
import { addMetaBlock } from './invoiceBlocks/metaDataBlock';
import { addMonetarySummary } from './invoiceBlocks/monetarySummary';
import { addOutroTextBlock } from './invoiceBlocks/outroTextBlock';
import { addSenderLineBlock } from './invoiceBlocks/senderLineBlock';
import { addTitleBlock } from './invoiceBlocks/titleBlock';
import { HeaderImageType, SupportedLocales, mmToPt } from './types';

export async function facturXKitSinglePage(
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales,
    headerImage?: HeaderImageType
): Promise<PDFDocument> {
    const openSansRegularBytes = await dataUrlToUint8Array(openSansRegularPath);
    const openSansBoldBytes = await dataUrlToUint8Array(openSansBoldPath);
    const openSansLightBytes = await dataUrlToUint8Array(openSansLightPath);

    const page = pdfDoc.addPage(PageSizes.A4);
    const openSansRegular = await pdfDoc.embedFont(openSansRegularBytes);
    const openSansBold = await pdfDoc.embedFont(openSansBoldBytes);
    const openSansLight = await pdfDoc.embedFont(openSansLightBytes);
    const footerHeight = 100;

    async function createMultiPageDocument(): Promise<PDFDocument> {
        pdfDoc.removePage(0);
        return facturXKitMultiPage(data, pdfDoc, locale, headerImage);
    }

    if (headerImage) {
        await addHeaderImage(headerImage.imageBytes, headerImage.dimensions, headerImage.dataType, page);
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
    const [yItemTable, tableInformation] = await addItemTable(data, page, openSansRegular, openSansBold, locale, {
        position: { y: yIntroNoteBlock - 15 }
    });

    if (yItemTable < footerHeight) return createMultiPageDocument();

    const monetarySummaryXStart = tableInformation
        ? tableInformation.startX + tableInformation.columnsWidth[0] + tableInformation.padding
        : undefined;
    const monetarySummaryXEnd = tableInformation
        ? tableInformation.startX + tableInformation.width - tableInformation.padding
        : undefined;

    const yMonetarySummary = await addMonetarySummary(data, page, openSansRegular, openSansBold, locale, {
        position: { x: monetarySummaryXStart, y: yItemTable - 15 },
        rightBorder: monetarySummaryXEnd
    });

    if (yMonetarySummary < footerHeight) return createMultiPageDocument();

    page.drawLine({
        start: {
            x: tableInformation ? tableInformation.startX + tableInformation.columnsWidth[0] : 25 * mmToPt,
            y: yMonetarySummary - 6
        },
        end: {
            x: tableInformation ? tableInformation.startX + tableInformation.width : page.getWidth() - 20 * mmToPt,
            y: yMonetarySummary - 6
        },
        thickness: 0.5,
        color: rgb(0, 0, 0),
        opacity: 1
    });

    const yOutroBlock = await addOutroTextBlock(data, page, openSansRegular, openSansBold, locale, {
        position: { y: yMonetarySummary - 30 }
    });

    if (yOutroBlock < footerHeight) return createMultiPageDocument();

    /*page.drawLine({
        start: { x: 0, y: footerHeight },
        end: { x: 800, y: footerHeight },
        thickness: 1,
        color: rgb(0.75, 0.2, 0.2),
        opacity: 1
    })

    page.drawLine({
        start: { x: 0, y: footerHeight },
        end: { x: 800, y: footerHeight},
        thickness: 1,
        color: rgb(0.75, 0.2, 0.2),
        opacity: 1
    })*/

    addFooter(data, page, openSansLight, locale, {
        position: { x: 15 * mmToPt, y: footerHeight },
        fontSize: 8,
        color: rgb(0, 0, 0)
    });

    return pdfDoc;
}
