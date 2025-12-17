# factur-x-kit

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/NikolaiMe/factur-x-kit)
[![NPM version](https://img.shields.io/npm/v/factur-x-kit.svg?style=flat-square)](https://www.npmjs.org/package/factur-x-kit)

[![Factur-X Version 1.08](https://img.shields.io/badge/factur--X_version-1.08-ED3C44?labelColor=192444)](https://fnfe-mpe.org/factur-x/factur-x_en/)
[![ZUGFeRD Version 2.4](https://img.shields.io/badge/ZUGFeRD_version-2.4-138ECC?labelColor=B7BE2A)](https://www.ferd-net.de/standards/zugferd)

An all-in-one library for Hybrid Invoice Documents (Factur-X / ZUGFeRD) for JavaScript/TypeScript. Built by developers, for developers. You don't need to be an e-invoice expert to use it; so this documentation also provides some helpful information about ZUGFeRD/Factur-X basics.

You can use this library to:

-   Create hybrid invoices (PDF/A-3 and XML content) from the same data object
-   Convert a standard PDF invoice to the PDF/A-3 format and attach XML content to it
-   Parse data from a hybrid invoice
-   Validate the content of a hybrid invoice
-   Edit the XML content of a hybrid invoice (e.g., to switch to a higher profile)

The library also supports you in creating invoice data by calculating totals, line totals, and taxes, and creating the tax-breakdown just from the invoice-line prices.

> **Attention!** <br>This library is still in active development. As a result, not all features are available yet. Right now the "Extended" and "XRechnung" profiles are not yet supported. Also, it is not yet possible to attach files other than the Factur-X XML to your invoice. This documentation represents the current implementation state (everything described here is already supported).

## Showcase

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/pdfs/createdPDFs/PDF_DESIGN_EN.pdf) is how a generated e-invoice looks (of course, you can change the header).

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy.ts) is the data used to create this Factur-X invoice / the data you would get if you parse the e-invoice given above.

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy_preCalc.ts) is the data you pass to the library in case you want the library to auto-calculate the invoice sums and taxes.

## General idea

You build an object based on a provided TypeScript type. You pass that object to the library, and you get a complete Factur-X/ZUGFeRD invoice back.

Or, you pass a hybrid invoice to the library and you get an object of the same TypeScript type.

## General information about Factur-X/ZUGFeRD hybrid invoices

If you are familiar with the Factur-X/ZUGFeRD standard, you can skip this chapter. If not, this chapter might help you understand the rest of this documentation better.

**Standardization and Interoperability:** Factur-X and ZUGFeRD are essentially the same standard, developed collaboratively by France and Germany to ensure interoperability. They are based on the European standard EN 16931 and the UN/CEFACT Cross Industry Invoice (CII) XML schema, which facilitates cross-border and cross-industry e-invoicing. For better readability, the rest of this documentation will only use the term "Factur-X" (instead of Factur-X/ZUGFeRD).

**Accessibility for All Businesses:** The standard is designed to be accessible not only to large corporations but also to small and medium-sized enterprises and freelancers, without the need for prior arrangements between the sender and receiver.

**Hybrid Format:** Invoices consist of two parts: a human-readable PDF file (specifically, a PDF/A-3 file) and a machine-readable XML file embedded within the PDF. This allows for both manual and automated processing of invoices.

**Multiple Profiles:** The standard offers different profiles (such as MINIMUM, BASIC, EN 16931 (aka COMFORT), and EXTENDED) that allow the sender to include varying levels of detail in the structured data, catering to the recipient's needs and processing capabilities. In Germany, only the BASIC, COMFORT, and EXTENDED profiles are considered valid e-invoices.

## Usage

### Installation

```bash
npm install factur-x-kit
```

### Create the data for the invoice

To use this library, you need to format your invoice data into a structure the library can understand. This can be approached by either creating the data yourself or using an adapter which supports you in creating the data.

#### Create the data manually

As this library is written in TypeScript, there are data types for every Factur-X profile. These data types assist you in creating the data by making fields, which are not optional in the Factur-X standard, mandatory in the type definition. Optional fields in Factur-X are also optional in the data types. Important note: only because a field is optional, it does not mean that it can be always omitted. There are some business-rules which every Factur-X invoice needs to comply with. This library also checks these business rules and throws helpful errors in case your data does not comply with those rules.

If you want to create the data, you can import the profile you want to use from this library:

```typescript
import { MinimumProfile, BasicWithoutLinesProfile, BasicProfile, ComfortProfile, ExtendedProfile, PROFILES } from 'factur-x-kit';

const myData: BasicProfile ={
    profile: PROFILES.BASIC,
    ...
};
```

If you need help to understand which data corresponds to which key, you can use [this table](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/DataDescription_v2.md), which describes the data for each key (as this library does not support Extended yet, this table also only describes the keys for Comfort and lower profiles).

For an easier overview of which profile supports which keys, you can check out the TypeScript type definitions of every profile. As you can see the datatypes are backward compatible and the lower profiles are just subsets of the higher profiles:

-   [Minimum](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/minimum_datatype.ts)
-   [Basic Without Lines](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/basicWL_datatype.ts)
-   [Basic](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/basic_datatype.ts)
-   [Comfort](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/comfort_datatype.ts)
-   Extended right now uses the exact same type as comfort (Do not use!)
-   X-Rechnung not yet implemented

> **Attention!** <br>Minimum and Basic Without Lines profiles are not considered valid e-invoices in Germany and also won't be accepted by France in the near future. It's highly recommended to use at least the Basic profile. The recommended profile is Comfort (EN 16931).

All the custom enums used in the profiles, like `CURRENCY_CODES` or `COUNTRY_ID_CODES`, are exported by the library:

```typescript
// Usage of the custom enums
import {
  COUNTRY_ID_CODES,
  CURRENCY_CODES,
  PROFILES,
  BasicProfile
} from "factur-x-kit";

const myData: BasicProfile ={
    profile: PROFILES.BASIC,
    document: {
        id: 'INV-2023-EASY-001',
        type: DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE,
        ...
    }
    ...
};
```

Example data:

-   [Standard invoice (Comfort Profile)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy.ts)
-   [Standard invoice with more fields used (Comfort Profile)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object.ts)
-   [Simple invoice for German 'Kleinunternehmer' Exempt from tax (Comfort Profile)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_kleinunternehmer.ts)
-   [Basic Without Lines Profile invoice](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/profiles/basicwithoutlines_test_objects.ts)
-   [Basic Profile invoice (based on the BasicWL invoice above)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/profiles/basicwithoutlines_test_objects.ts)

#### Create the data with the help of adapters

Adapters are here to support you with creating the data. Basically, they are just functions which take an object of a specific data type and return a valid profile object. Right now there is only one adapter available.

_**totalsCalculator adapter**_

A Factur-X invoice has a lot of values which must be properly calculated from other values (e.g., totals, tax sums, and tax breakdown). Also, there are a lot of mandatory values which must be filled with a constant value. This can be pretty overwhelming and confusing if you are not very familiar with e-invoices. The `totalsCalculator` function uses as input an [object which omits unnecessary values](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/totalsCalculatorType.ts) which can be calculated by other values. It calculates all those values for you and returns a proper object for the Comfort (EN 16931) profile.

Some information about the changes from the standard Comfort profile:

-   `totals.taxExemptionReason` was added. If you use `TAX_CATEGORY_CODES.EXEMPT_FROM_TAX` in any of your lines (e.g., if you are a German "Kleinunternehmer"), this field is mandatory and should contain the reason why your tax rate is 0. If you use any other tax category from `TaxTypeWithoutTaxRate`, it is highly recommended to use this field, but it's not mandatory (TaxExemptionReasonCodes will be used as a backup).
-   `totals.optionalTaxDueDates` is usually not used because the taxDueDate is usually the same as the invoice date. If you need this field for some reason, you can add the due dates for the given tax category here.
-   `totals.optionalTaxCurrency` is also typically not used, as the tax currency is the same as the invoice currency. If you need it, you can enter the currency and the exchange rate between the invoice currency and the tax currency here, and `totalsCalculator` will add the tax amount also in that other currency.

Usage:

```typescript
import { TotalsCalculatorInputType, totalsCalculator } from 'factur-x-kit';

const myInvoiceData: TotalsCalculatorInputType = {
        document: {
            id: 'INV-2023-EASY-001',
            type: DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE,
            dateOfIssue: { year: 2023, month: 10, day: 1 },
            ...
        }
    ...
}

const myInvoiceDataInComfortProfile = totalsCalculator(myInvoiceData);
```

> **Attention!**<br>
> Factur-X is known for its rounding issues: every `lineTotals` amount of your invoice will be rounded to two decimals, although your `basisPricePerItem` and your `itemQuantity` can have up to 4 decimals. If you have several lines which will be rounded, it could end up in a slightly wrong total amount (e.g., two lines with an actual value of 0.375 € will be rounded to 0.38 + 0.38 = 0.76, although the "correct" amount would be 0.375 + 0.375 = 0.75).<br>
> Therefore, always check the `grossTotal` of the output of `totalsCalculator`. In case it does not match the grossTotal you would expect (minimal rounding differences only!), use the `totals.roundingAmount` value to fix this.<br>
>
> ```typescript
> // example check
> ...
> let myInvoiceDataInComfortProfile = totalsCalculator(myInvoiceData);
> const expectedGrossTotal = ...; // your expected total
> const diff = expectedGrossTotal - myInvoiceDataInComfortProfile.totals.grossTotal;
> if(diff !== 0){
>   if(Math.abs(diff) > 0.05) throw new Error('Something went wrong in calculation');
>   myInvoiceData.totals.roundingAmount = diff;
>   myInvoiceDataInComfortProfile = totalsCalculator(myInvoiceData);
> }
> ...
> ```

### Create Invoices

After you have prepared your data, you are ready to create your Factur-X invoice. This library offers you several different ways to achieve that goal.

#### Create a complete hybrid invoice (PDF and XML) from an object

The easiest way to create a Factur-X invoice is to let factur-x-kit create everything for you. factur-x-kit comes with an invoice template that creates an appealing PDF-invoice and automatically attaches the e-invoice XML to it. The PDFs created with factur-x-kit meet the PDF/A-3 standard. If the entire content does not fit on a single page, the standard's recommendation is followed: The invoice summary is shown on the first page, and the table with the line items is presented on the following page. _The PDF template does not yet handle the case, if the line items do not fit on a single page!_

Currently supported languages in the pdf-invoice are:

| Language | locale | state                             |
| -------- | ------ | --------------------------------- |
| German   | de-DE  | Translated and checked by a human |
| English  | de-US  | Translated and checked by a human |
| French   | fr-FR  | AI-translated (needs review)      |

_If you want to support this library, feel free to add your langauage by editing [these files (including sub-folders)](https://github.com/NikolaiMe/factur-x-kit/tree/main/src/pdfTemplates/texts) and opening a PR._

```typescript
// Create a complete factur-x invoice
import { FacturX } from 'factur-x-kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Use whatever approach described above to create data
const myInvoiceData = ... ;

// Create a FacturX instance from that data
const facturX = await FacturX.fromObject(myInvoiceData);

// Create a PDF
const pdfBytes = await facturX.getPDF({
    locale: 'en-US'
});

// Store the PDF
await fs.writeFile(path.join(__dirname, 'pdfs', 'myInvoice.pdf'), pdfBytes);
```

> **Attention!** <br>
> The Factur-X standard expects you to display all the data which is in the XML part of the invoice, also in the human-readable PDF part. Not every key of the Comfort profile is supported by the PDF-template, yet. Please check [this table](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/DataDescription_v2.md) to ensure that all the keys you are using are supported.

_**Header Image**_

You can add a header image to give the invoice a personal touch. You can add .jpg or .png files as the header image. The header image will be placed in the upper right corner and will be printed in the background. The dimension parameters 'width' and 'height' are the width and the height of the image in pdf-pt (1mm = 2,83pt). You can use the `dinA4Width` and `mmToPt` constants exported by factur-x-kit to stretch the image to the full PDF width (see example below).

```typescript
const imageWidthInPx = 1200; // add real image width in px here
const imageHeightInPx = 500; // add real image height in px here
const pathToImage = path.join(__dirname, 'assets', 'header.jpg'); // add real path to image file her (only png or jpg supported)

const imageBuffer = await fs.readFile(pathToImage);
const imageUint8Array = new Uint8Array(imageBuffer);

const headerImage = {
    imageBytes: imageUint8Array,
    dataType: 'jpg', // you can use 'png', 'jpg' or 'jpeg' here
    dimensions: {
        width: dinA4Width * mmToPt,
        height: ((dinA4Width * mmToPt) / imageWidthInPx) * imageHeightInPx
    }
};

const facturX = await FacturX.fromObject(myInvoiceData);
const pdfBytes = await facturX.getPDF({
    locale: 'en-US',
    headerImage: headerImage
});
await fs.writeFile(path.join(__dirname, 'pdfs', 'myInvoice.pdf'), pdfBytes);
```

#### Create a complete hybrid invoice (PDF and XML) with a custom template

In case you do not like the template provided by factur-x-kit, you can also create your own template. The library exports all the invoice text blocks (like the address field, the item table...), so you can re-use the parts you would like to keep. Then just add your template to the `FacturX.getPDF()` options:

```typescript
import { FacturX } from 'factur-x-kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Use whatever approach described above to create data
const myInvoiceData = ... ;

// Create a FacturX instance from that data
const facturX = await FacturX.fromObject(myInvoiceData);

// Get the PDF and pass your own template
const pdfBytes = await facturX.getPDF({
    pdfTemplate: myTemplate, // Add Your template here
    locale: 'en-US',
    headerImage: headerImage
});
```

A template is just a function with the following type:

```typescript
type FacturXKitPDFTemplate = (
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales,
    headerImage?: {
        path: string;
        dimensions: ImageDimensions;
    }
) => Promise<PDFDocument>;
```

This documentation won't go into detail on creating custom templates. If you would like to use this feature, please check the implementation of the [current standard template](https://github.com/NikolaiMe/factur-x-kit/blob/main/src/pdfTemplates/facturXKitSinglePage.ts). If you have more questions, feel free to open an issue in the GitHub repository.

_Short hint for using the invoice text blocks exported by this library: They usually return the y-position of the bottom edge, so that you know where to add the next block below._

#### Use a "normal" pdf-invoice and convert it into a hybrid-invoice

If you already have a PDF invoice and just want to convert it to a Factur-X hybrid invoice, you can do this with this library, too. It also edits your invoice PDF to meet the PDF-A/3 standard (Please read the info box at the bottom of this chapter to make sure that the PDF you are passing can be converted to a proper PDF-A/3).

```typescript
// Create a complete factur-x invoice
import { FacturX } from 'factur-x-kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Use whatever approach described above to create data
const myInvoiceData = ... ;

// Create a FacturX instance from that data
const facturX = await FacturX.fromObject(myInvoiceData);

// Read the data of your existing invoice PDF
const pdfBuff = new Uint8Array(fs.readFileSync(path.join(__dirname, 'PathToYourPDF', `non_compliant_pdf.pdf`)));

// Create a PDF
const pdfBytes = await facturX.getPDF({
    existingNonConformantPdf: pdfBuff
});

// Store the PDF
await fs.writeFile(path.join(__dirname, 'pdfs', 'myInvoice.pdf'), pdfBytes);
```

> **Attention!**<br>You can only use this feature if your PDF invoice does not use any PDF function which is not conformant to PDF/A-3. Therefore your PDF must not have any audio or video file embedded. Also, every font you are using must be embedded. You cannot use the 14 PDF standard fonts.

#### Replace XML in an existing Factur-X invoice

In case you already have a valid Factur-X invoice and want to edit the XML data attached to it, Factur-X can help you, too. To use this feature, you first need to [parse an existing Factur-X invoice](#user-content-read-the-data-from-a-hybrid-invoice-pdf).

You can then access and edit the data-object via `facturX.object`.

After that, you can get the edited Factur-X invoice by calling:

```typescript
const pdfBytes = await facturX.getPDF({
    keepInitialPdf: true
});
```

> **Attention!**<br>Invoices must not be changed after being issued! Only use this feature right after creation (e.g., if you already created a Factur-X invoice with a different tool, but the tool you are using is only supporting the BASIC profile and you want to increase it to COMFORT). In case you want to correct an existing invoice, leave the original invoice untouched and create a new correction invoice with `document.type` set to `DOCUMENT_TYPE_CODES.CORRECTED_INVOICE`.

#### Just create and get the XML part

```typescript
// ... Create your data and the Factur-X instance as described above

const xml = await facturX.getXML();
console.log(xml); // "<?xml version="1.0" encoding="UTF-8" ...

await fs.writeFile('./invoice-data.xml', xml);
```

### Parse/Interpret Invoices

factur-x-kit helps you interpret the machine-readable (XML) part of a Factur-X invoice. You can pass either a full Factur-X PDF or just the XML part of the e-invoice. factur-x-kit converts the data into a profile object [described above in detail](#user-content-create-the-data-manually). It will detect the profile used in the document and returns the corresponding datatype.

Current state about EXTENDED profile: If EXTENDED profile is detected it will only parse the data from COMFORT profile. Everything else will be ignored.

Current state about X-Rechnung profile: If X-Rechnung profile is detected an error is thrown that an unknown profile is used.

#### Read the data from a hybrid invoice pdf

```typescript
// read the pdf-file
const pdf = await fs.readFile('./e-invoice.pdf');

// create a Factur-X instance from PDF
const facturX = await FacturX.fromPDF(new Uint8Array(pdf));

// access the data
console.log(facturX.object);
```

#### Read the data from the XML of a hybrid invoice

```typescript
// read the xml-file
const xml = await fs.readFile('./e-invoice.xml');

// create a Factur-X instance from XML
const facturX = await FacturX.fromXML(new Uint8Array(xml));

// access the data
console.log(facturX.object);
```

### Validate Invoices

factur-x-kit helps you validate Factur-X invoices. It checks both: the data structure (Is every mandatory field available?) and the content (is the datatype of every key correct? Are all business-rules met?).

It is highly recommended to do a manual check of your data before creating the final Factur-X invoice. factur-x-kit will not build a Factur-X invoice where data is missing or wrong. It will throw an error instead, giving you a hint about which data is wrong.

You can do a manual check of your data by calling the following function:

```typescript
const instance = await FacturX.fromObject(data);
const validationResult = instance.validate();

if (!validationResult.valid) {
    console.log(validationResult.errors);
}
```

The return value is structured like this.

```typescript
interface validationResult {
    valid: boolean;
    errors?: { message: string; path: (string | number)[] }[];
}
```

When you call `FacturX.fromObject`, `FacturX.fromPDF`, or `FacturX.fromXML`, the data already needs to have the correct structure. If there are mandatory fields missing, the profile won't be identified properly, and therefore factur-x-kit will throw an error. The business-rules (whether all data was calculated properly...) won't be checked when you create a factur-x-kit instance but will be checked before you try to export the final Factur-X invoice.

In current state of factur-x-kit the PDF/A-3 conformance is **not** checked if you call `facturX.validate()`

> **Attention!**<br>Validation is performed on the object level before it is parsed to XML. The big advantage of this approach is that it has a much better performance; the downside is that there can be issues in the conversion. In general this library is tested against the official XSD and SCHEMATRON files, provided with the Factur-X documentation, but not every invoice will be checked against those.

## Disclaimer

This free software has been written with the greatest possible care, but like all software, it may contain errors. Use at your own risk! There is no warranty and no liability.

## Changelog

Can be found [here](https://github.com/NikolaiMe/factur-x-kit/blob/main/CHANGELOG.md)

## Dependencies

-   pdf-lib
-   zod
-   fast-xml-parser
-   object-path
-   mime-types

## Contributors

-   [schwarmco](https://github.com/schwarmco)
-   [ahelmberger](https://github.com/ahelmberger)

## Special Thanks

... to [Joachim](https://github.com/schwarmco) for starting this journey with me!
<br>
... to my wife because she's cool.

## Next steps

-   [ ] XRechnung Profile
-   [ ] Extended Profile
-   [ ] Attachment of Referenced Documents
-   [ ] Upgrade to zod 4
    -   [ ] Switch BR function from zod.refine to zod.check
    -   [ ] Add proper paths to BR-Errors (including correct array item)
