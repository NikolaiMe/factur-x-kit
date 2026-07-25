import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib';

import { availableProfiles } from '../../core/factur-x';
import { PAYMENT_MEANS_CODES } from '../../types/codes';
import { textTranslations } from '../texts/textTranslations';
import { SupportedLocales, mmToPt } from '../types';
import { convertAddressBlockToString } from './customerAddressBlock';

export async function addFooter(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number };
        width?: number;
        fontSize?: number;
        color?: RGB;
    }
): Promise<void> {
    const startX = options?.position?.x || 25 * mmToPt;
    const yPosition = options?.position?.y || 100;
    const width = options?.width || page.getWidth() - startX - 15 * mmToPt;
    const fontSize = options?.fontSize || 8;
    const color = options?.color || rgb(0, 0, 0);
    const footerColumns: string[] = [];

    const companyAddress = convertAddressBlockToString(data.seller, locale, {
        useTradeContact: false,
        useTradingBusinessName: true
    });

    if (companyAddress) footerColumns.push(companyAddress);

    const personalContact = convertTradeContactToString(data, locale);
    if (personalContact) footerColumns.push(personalContact);

    const bankInformation = convertPaymentMeanToString(data);
    if (bankInformation) footerColumns.push(bankInformation);

    const registrationInformation = convertRegistrationInformationToString(data, locale);
    if (registrationInformation) footerColumns.push(registrationInformation);

    const contentWidths: number[] = [];
    let contentWidthSum = 0;

    for (const col of footerColumns) {
        const colWidth = getColumnWidth(col, font, fontSize);
        contentWidthSum += colWidth;
        contentWidths.push(colWidth);
    }

    let columnDistance = (width - contentWidthSum) / (footerColumns.length - 1);

    if (columnDistance < 10) {
        columnDistance = 10;
        const standardWidth = (width - (footerColumns.length - 1) * 10) / footerColumns.length;
        contentWidths.fill(standardWidth);
    }

    let currX = startX;

    for (let i = 0; i < footerColumns.length; i++) {
        page.drawText(footerColumns[i], {
            x: currX,
            y: yPosition,
            font: font,
            size: fontSize,
            lineHeight: fontSize * 1.25,
            color: color,
            maxWidth: contentWidths[i]
        });
        currX += columnDistance + contentWidths[i];
    }
}

function convertTradeContactToString(data: availableProfiles, locale: SupportedLocales): string {
    if (!('tradeContact' in data.seller && data.seller.tradeContact)) return '';
    const tradeContact = data.seller.tradeContact[0];
    const tradeContactName = tradeContact.personName ? `${tradeContact.personName}\n` : '';
    const tradeContactDepartment = tradeContact.departmentName ? `${tradeContact.departmentName}\n` : '';
    const tradeContactEmail = tradeContact.email ? `${textTranslations[locale].EMAIL}: ${tradeContact.email}\n` : '';
    const tradeContactPhone = tradeContact.telephoneNumber
        ? `${textTranslations[locale].PHONE}: ${tradeContact.telephoneNumber}\n`
        : '';
    return `${tradeContactName}${tradeContactDepartment}${tradeContactEmail}${tradeContactPhone}`;
}

function convertPaymentMeanToString(data: availableProfiles): string {
    if (!(
        'paymentInformation' in data &&
        data.paymentInformation.paymentMeans &&
        data.paymentInformation.paymentMeans.length > 0
    ))
        return '';

    const creditTransferMean = data.paymentInformation.paymentMeans.find(
        pm =>
            (pm.paymentType === PAYMENT_MEANS_CODES.Credit_transfer ||
                pm.paymentType === PAYMENT_MEANS_CODES.Debit_transfer ||
                pm.paymentType == PAYMENT_MEANS_CODES.SEPA_credit_transfer) &&
            pm.payeeBankAccount?.iban
    );
    if (!creditTransferMean?.payeeBankAccount) return '';

    const iban = `IBAN: ${creditTransferMean.payeeBankAccount.iban}\n`;

    let accountName = '';
    let bic = '';
    let description = '';

    if ('bic' in creditTransferMean.payeeBankAccount) {
        bic = creditTransferMean.payeeBankAccount?.bic ? `BIC: ${creditTransferMean.payeeBankAccount?.bic}\n` : '';
    }

    if ('description' in creditTransferMean) {
        description = creditTransferMean.description ? `${creditTransferMean.description}\n` : '';
    }

    if ('accountName' in creditTransferMean.payeeBankAccount) {
        accountName = creditTransferMean.payeeBankAccount.accountName
            ? `${creditTransferMean.payeeBankAccount.accountName}\n`
            : '';
    }

    return `${accountName}${description}${iban}${bic}`;
}

function convertRegistrationInformationToString(data: availableProfiles, locale: SupportedLocales) {
    let legalInfo = '';
    let vatId = '';

    if (data.seller.taxIdentification?.vatId) {
        vatId = `${textTranslations[locale].VAT_ID}: ${data.seller.taxIdentification.vatId}\n`;
    } else if (data.seller.taxIdentification?.localTaxId) {
        vatId = `${textTranslations[locale].TAX_ID}: ${data.seller.taxIdentification.localTaxId}\n`;
    }

    const registrationNumber = data.seller.specifiedLegalOrganization?.id
        ? `${data.seller.specifiedLegalOrganization?.id.id}\n`
        : '';

    if ('otherLegalInformation' in data.seller) {
        legalInfo = `${data.seller.otherLegalInformation ? `${data.seller.otherLegalInformation}\n` : ''}`;
    }

    return `${legalInfo}${registrationNumber}${vatId}`;
}

function getColumnWidth(column: string, font: PDFFont, fontSize: number): number {
    let maxWidth = 0;
    const lines = column.split('\n');
    for (const line of lines) {
        const lineWidth = font.widthOfTextAtSize(line, fontSize);
        if (lineWidth > maxWidth) maxWidth = lineWidth;
    }
    return maxWidth;
}
