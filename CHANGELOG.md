# CHANGELOG

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
