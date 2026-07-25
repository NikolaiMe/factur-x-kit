import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib';

import { availableProfiles } from '../../core/factur-x';
import { round } from '../../helper/calculation';
import { TAX_CATEGORY_CODES } from '../../types/codes';
import { textTranslations } from '../texts/textTranslations';
import { SupportedLocales, dinA4Height, mmToPt } from '../types';

export async function addMonetarySummary(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    boldFont: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number };
        rightBorder?: number;
        fontSize?: number;
        color?: RGB;
    }
): Promise<number> {
    const {
        position = { x: 25 * mmToPt, y: (dinA4Height - 85) * mmToPt },
        rightBorder = page.getWidth() - 20 * mmToPt,
        fontSize = 10,
        color = rgb(0, 0, 0)
    } = options || {};

    const currencyConverter = new Intl.NumberFormat(locale, { style: 'currency', currency: data.document.currency });

    let currentY = position.y || (dinA4Height - 85) * mmToPt;
    const leftBorder = position.x || 25 * mmToPt;

    const printerMeta = {
        page,
        currencyConverter,
        xPositionStart: leftBorder,
        rightBorder,
        font,
        fontSize,
        color
    };

    currentY = optionallyPrintAllowanceCharge(data, locale, currentY, printerMeta);

    printMonetarySummaryLine(
        textTranslations[locale].NET_TOTAL_AMOUNT,
        data.totals.netTotal,
        currentY,
        false,
        printerMeta
    );

    currentY -= fontSize * 1.5;

    currentY = printTaxBreakdown(data, locale, currentY, printerMeta);

    printMonetarySummaryLine(textTranslations[locale].GROSS_TOTAL_AMOUNT, data.totals.grossTotal, currentY, false, {
        ...printerMeta,
        font: boldFont
    });

    currentY = printOpenAmount(data, locale, currentY, boldFont, printerMeta);
    return currentY;
}

function printOpenAmount(
    data: availableProfiles,
    locale: SupportedLocales,
    currentY: number,
    fontBold: PDFFont,
    meta: {
        page: PDFPage;
        currencyConverter: Intl.NumberFormat;
        xPositionStart: number;
        rightBorder: number;
        font: PDFFont;
        fontSize: number;
        color: RGB;
    }
): number {
    if (data.totals.openAmount === data.totals.grossTotal) return currentY;
    const { fontSize } = meta;
    currentY -= fontSize * 1.5;

    if ('roundingAmount' in data.totals && data.totals.roundingAmount) {
        printMonetarySummaryLine(
            textTranslations[locale].ROUNDING_AMOUNT,
            data.totals.roundingAmount,
            currentY,
            false,
            meta
        );
        currentY -= fontSize * 1.5;
    }
    if ('prepaidAmount' in data.totals && data.totals.prepaidAmount) {
        printMonetarySummaryLine(
            textTranslations[locale].PREPAID_AMOUNT,
            data.totals.prepaidAmount,
            currentY,
            false,
            meta
        );
        currentY -= fontSize * 1.5;
    }

    printMonetarySummaryLine(textTranslations[locale].OPEN_AMOUNT, data.totals.openAmount, currentY, false, {
        ...meta,
        font: fontBold
    });

    return currentY;
}

function printTaxBreakdown(
    data: availableProfiles,
    locale: SupportedLocales,
    currentY: number,
    meta: {
        page: PDFPage;
        currencyConverter: Intl.NumberFormat;
        xPositionStart: number;
        rightBorder: number;
        font: PDFFont;
        fontSize: number;
        color: RGB;
    }
): number {
    if (!('taxBreakdown' in data.totals)) return printTaxTotal(data, locale, currentY, meta);
    if (!data.totals.taxBreakdown || data.totals.taxBreakdown.length === 0)
        return printTaxTotal(data, locale, currentY, meta);

    const { fontSize } = meta;
    for (const tax of data.totals.taxBreakdown) {
        if (tax.calculatedAmount === 0) continue;
        const taxRate = tax.rateApplicablePercent
            ? ` (${Intl.NumberFormat(locale, {
                  style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              }).format(
                  round(tax.rateApplicablePercent / 100, 4)
              )} ${textTranslations[locale].OF} ${meta.currencyConverter.format(round(tax.basisAmount, 2))}) `
            : '';

        let taxDescription: string;
        switch (tax.categoryCode) {
            case TAX_CATEGORY_CODES.IGIC:
                taxDescription = `IGIC${taxRate}`;
                break;
            case TAX_CATEGORY_CODES.IPSI:
                taxDescription = `IPSI${taxRate}`;
                break;
            case TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE:
                taxDescription = `${textTranslations[locale].VAT} Reverse Charge${taxRate}`;
                break;
            default:
                taxDescription = `${textTranslations[locale].VAT}${taxRate}`;
                break;
        }

        printMonetarySummaryLine(taxDescription, tax.calculatedAmount, currentY, false, meta);
        currentY -= fontSize * 1.5;
    }

    return currentY;
}

function printTaxTotal(
    data: availableProfiles,
    locale: SupportedLocales,
    currentY: number,
    meta: {
        page: PDFPage;
        currencyConverter: Intl.NumberFormat;
        xPositionStart: number;
        rightBorder: number;
        font: PDFFont;
        fontSize: number;
        color: RGB;
    }
): number {
    if (!data.totals.taxTotal || data.totals.taxTotal.length === 0) return currentY;
    const { fontSize } = meta;
    const taxDescription = textTranslations[locale].TAX_TOTAL_AMOUNT;
    const documentCurrencyTax = data.totals.taxTotal.find(tax => tax.currency === data.document.currency);
    if (documentCurrencyTax) {
        printMonetarySummaryLine(taxDescription, documentCurrencyTax.amount, currentY, false, meta);
        currentY -= fontSize * 1.5;
        return currentY;
    }
    printMonetarySummaryLine(taxDescription, data.totals.taxTotal[0].amount, currentY, false, {
        ...meta,
        currencyConverter: new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: data.totals.taxTotal[0].currency
        })
    });

    currentY -= fontSize * 1.5;
    return currentY;
}

function optionallyPrintAllowanceCharge(
    data: availableProfiles,
    locale: SupportedLocales,
    currentY: number,
    meta: {
        page: PDFPage;
        currencyConverter: Intl.NumberFormat;
        xPositionStart: number;
        rightBorder: number;
        font: PDFFont;
        fontSize: number;
        color: RGB;
    }
): number {
    if (
        !('allowanceTotalAmount' in data.totals && data.totals.allowanceTotalAmount) &&
        !('chargeTotalAmount' in data.totals && data.totals.chargeTotalAmount)
    )
        return currentY;
    const { fontSize } = meta;

    if ('sumWithoutAllowancesAndCharges' in data.totals && data.totals.sumWithoutAllowancesAndCharges) {
        printMonetarySummaryLine(
            textTranslations[locale].LINE_TOTAL_AMOUNT,
            data.totals.sumWithoutAllowancesAndCharges,
            currentY,
            false,
            meta
        );
        currentY -= fontSize * 1.5;
    }

    const allowanceBreakdown = data.totals.documentLevelAllowancesAndCharges?.allowances || [];
    const percentageFormatter = (percent: number) =>
        Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(round(percent / 100, 4));

    if (data.totals.allowanceTotalAmount || allowanceBreakdown.length > 0) {
        if (allowanceBreakdown.length > 0) {
            for (const allowance of allowanceBreakdown) {
                printMonetarySummaryLine(
                    `${textTranslations[locale].ALLOWANCE} (${textTranslations[locale].TAX}: ${percentageFormatter(allowance.categoryTradeTax.rateApplicablePercent || 0)}): ${allowance.reason || ''}`,
                    allowance.actualAmount,
                    currentY,
                    true,
                    meta
                );
                currentY -= fontSize * 1.5;
            }
        } else if (data.totals.allowanceTotalAmount) {
            printMonetarySummaryLine(
                `${textTranslations[locale].DOCUMENT_LEVEL_ALLOWANCE}`,
                data.totals.allowanceTotalAmount,
                currentY,
                true,
                meta
            );
            currentY -= fontSize * 1.5;
        }
    }

    const chargeBreakdown = data.totals.documentLevelAllowancesAndCharges?.charges || [];

    if (data.totals.chargeTotalAmount || chargeBreakdown.length > 0) {
        if (chargeBreakdown.length > 0) {
            for (const charge of chargeBreakdown) {
                printMonetarySummaryLine(
                    `${textTranslations[locale].CHARGE} (${textTranslations[locale].TAX}: ${percentageFormatter(charge.categoryTradeTax.rateApplicablePercent || 0)}): ${charge.reason || ''}`,
                    charge.actualAmount,
                    currentY,
                    false,
                    meta
                );
                currentY -= fontSize * 1.5;
            }
        } else if (data.totals.chargeTotalAmount) {
            printMonetarySummaryLine(
                `${textTranslations[locale].DOCUMENT_LEVEL_CHARGE}`,
                data.totals.chargeTotalAmount,
                currentY,
                false,
                meta
            );
            currentY -= fontSize * 1.5;
        }
    }

    return currentY;
}

function xRightAlignedText(xRightBorder: number, content: string, font: PDFFont, fontSize: number): number {
    const textWidth = font.widthOfTextAtSize(content, fontSize);
    return xRightBorder - textWidth;
}

function printMonetarySummaryLine(
    description: string,
    amount: number,
    currentY: number,
    negativeAmount: boolean,
    meta: {
        page: PDFPage;
        currencyConverter: Intl.NumberFormat;
        xPositionStart: number;
        rightBorder: number;
        font: PDFFont;
        fontSize: number;
        color: RGB;
    }
): void {
    const { page, currencyConverter, xPositionStart, rightBorder, font, fontSize, color } = meta;
    page.drawText(`${description}`, {
        x: xPositionStart,
        y: currentY,
        size: fontSize,
        font,
        color
    });
    const lineAmount = `${negativeAmount ? '- ' : ''}${currencyConverter.format(round(amount, 2))}`;
    page.drawText(lineAmount, {
        x: xRightAlignedText(rightBorder, lineAmount, font, fontSize),
        y: currentY,
        size: fontSize,
        font,
        color
    });
}
