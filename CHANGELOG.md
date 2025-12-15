# CHANGELOG

## [0.2.0] - 2025-12-15

### Changed

-   The header image for the pdf is now not a string anymore but a Uint8Array. This allows the usage of this in the browser

## [0.1.6] - 2025-09-28

### Fixed

-   Fixes ESM build compatibility issue by removing the CJS-specific import from pdf-lib/cjs/core/embedders/FileEmbedder in /core/pdf (Thanks to [ahelmberger](https://github.com/ahelmberger) for finding and fixing the issue)

### Added

-   This Changelog

## [0.1.5] - 2025-09-02

### Changed

-   Updated Codelists to fit to latestst Factur-X/ZUGFeRD specification 'FACTUR-X 1.07.3'
-   Updated XSDs and SCHEMATRONs to fit to lastst Factur-X/ZUGFeRD specification 'FACTUR-X 1.07.3'
