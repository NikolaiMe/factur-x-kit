# CHANGELOG

## [0.3.0] - 2025-12-17

### Changed

-   Updated Codelists to fit to latestst Factur-X/ZUGFeRD specification 'FACTUR-X 1.08'.
-   Updated SCHEMATRON and XSD to test against latest Factur-X version 'FACTUR-X 1.08'.
-   **BREAKING** Added new business rules 'CII-SR' to comply with the latest SCHEMATRON schemes.
-   Added new business rules BR-B, because they are described in latest schematron. Not used until now, as the TaxCode which is checked here is not yet introduced to Factur-X Codes.

### Fixed

-   **BREAKING** Fixed attachmentBinaryObject. Until now it was not possible to write/read the Base64 Data which should be integrated via this tag. Now the new attribute 'base64Data' was added, to allow writing and reading here.
-   Fixed test objects to ensure that they pass the new CII-SR Rules and that they comply to the fix mentioned above.

### Migration Guide

You most likely need to adapt your code if you used one of the two features below:

1. You added a contact person to your invoice via `seller.tradeContact[]` or `seller.tradeContact[]`
2. You tried to attach/read data via the following key: `referencedDocuments.additionalReferences.invoiceSupportingDocuments[].attachmentBinaryObject`

If you didn't use one of the two features above you don't need to adapt anything. If you used one of the things above, you can read below how you might need to adapt the code

#### 1. Changes in tradeContact

The latest Factur-X release has new business rules which do not allow you to use `departmentName` and `personName` at the same time in the same `tradeContract` object anymore (this applies to both, `seller` and `buyer`). The latest version of factur-x-kit now checks whether the data-object contains both values. If it finds both values in your data-object, the validation/build of your invoice will fail.

If you never used both, department- and personName, congratulations you don't need to do anything. If you used both of them, you can now decide whether one of the two tags is enough information (e.g. just add the department or the contact's name) or whether you need both. If one is enough, just delete the one you don't need. If you need both, you now need to add the full information in one of both tags:

```typescript
// Example before (not compliant anmore):
const dataObject = {
    // ...
    buyer: {
        // ...
        tradeContract: [
            {
                departmentName: 'Purchasing department',
                personName: 'Peter Buyer'
                // ...
            }
        ];
        // ...
    }
}

// ######################################################

// Example after:

const dataObject = {
    // ...
    buyer: {
        // ...
        tradeContract: [
            {
                personName: 'Peter Buyer (Purchasing department)'
                // departmentName: '', --> Do not use it. If you used personName
                // ...
            }
        ];
        // ...
    }
}
```

#### 2. Changes in `attachmentBinaryObject`

Most likely you didn't use this feature, yet. Because it was not working properly (and nobody ever wrote an issue for that). But in any case, here's what changed:

`referencedDocuments.additionalReferences.invoiceSupportingDocuments[].attachmentBinaryObject` has got a new mandatory value, which is called `base64Data`. You can write/read the data you want to attach as Base64 encoded string here. If you used it before and don't change anything, the validation of your created data will fail, because it expects the data as mandatory field.

## [0.2.0] - 2025-12-15

### Changed

-   **BREAKING:** The header image for the pdf is now not a string anymore but a Uint8Array. Therefore we don't rely on the fs.readFile function anymore, which is not supported in browser.

### Migration Guide

If you didn't use the function to add a header image to your pdf invoice until now: you don't need to change anything.

If you used the function you need to convert the imagePath you used until now, into a Uint8Array first:

```typescript
// Before:
// ...
    const imagePath = path.join(__dirname, 'header.jpg');

    const headerImage: HeaderImageType = {
        path: imagePath,                                    // this is changed
        dimensions: {
            width: imageWidth,
            height: imageHeight
        }
    };
    const instance = await FacturX.fromObject(myInvoiceData);
    const pdfBytesDE = await instance.getPDF({
        locale: 'de-DE',
        headerImage
    });
// ...

/////////////////////////////////////////////////////////////

// After:
// ...
    const imagePath = path.join(__dirname, 'header.jpg');

    const imageBuffer = await fs.readFile(imagePath);       // this is new
    const imageUint8Array = new Uint8Array(imageBuffer);    // this is new

    const headerImage: HeaderImageType = {
        imageBytes: imageUint8Array,                        // this is new
        dataType: 'jpg',                                    // this is new
        dimensions: {
            width: imageWidth,
            height: imageHeight
        }
    };
    const instance = await FacturX.fromObject(myInvoiceData);
    const pdfBytesDE = await instance.getPDF({
        locale: 'de-DE',
        headerImage
    });
// ...
```

## [0.1.6] - 2025-09-28

### Fixed

-   Fixes ESM build compatibility issue by removing the CJS-specific import from pdf-lib/cjs/core/embedders/FileEmbedder in /core/pdf (Thanks to [ahelmberger](https://github.com/ahelmberger) for finding and fixing the issue)

### Added

-   This Changelog

## [0.1.5] - 2025-09-02

### Changed

-   Updated Codelists to fit to latestst Factur-X/ZUGFeRD specification 'FACTUR-X 1.07.3'
-   Updated XSDs and SCHEMATRONs to fit to lastst Factur-X/ZUGFeRD specification 'FACTUR-X 1.07.3'
