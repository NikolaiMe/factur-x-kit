// ==========================================
// 1. MINIMUM
// ==========================================
// ==========================================
// 3. BASIC
// ==========================================
import xsd_BASIC_main from '../assets/xsd/basic/Factur-X_1.09.2_BASIC.xsd';
import xsd_BASIC_qdt from '../assets/xsd/basic/Factur-X_1.09.2_BASIC_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd';
import xsd_BASIC_ram from '../assets/xsd/basic/Factur-X_1.09.2_BASIC_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd';
import xsd_BASIC_udt from '../assets/xsd/basic/Factur-X_1.09.2_BASIC_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd';
// ==========================================
// 2. BASIC WL
// ==========================================
import xsd_BASICWL_main from '../assets/xsd/basicwl/Factur-X_1.09.2_BASICWL.xsd';
import xsd_BASICWL_qdt from '../assets/xsd/basicwl/Factur-X_1.09.2_BASICWL_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd';
import xsd_BASICWL_ram from '../assets/xsd/basicwl/Factur-X_1.09.2_BASICWL_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd';
import xsd_BASICWL_udt from '../assets/xsd/basicwl/Factur-X_1.09.2_BASICWL_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd';
// ==========================================
// 4. EN16931
// ==========================================
import xsd_EN16931_main from '../assets/xsd/en16931/Factur-X_1.09.2_EN16931.xsd';
import xsd_EN16931_qdt from '../assets/xsd/en16931/Factur-X_1.09.2_EN16931_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd';
import xsd_EN16931_ram from '../assets/xsd/en16931/Factur-X_1.09.2_EN16931_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd';
import xsd_EN16931_udt from '../assets/xsd/en16931/Factur-X_1.09.2_EN16931_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd';
// ==========================================
// 5. EXTENDED
// ==========================================
import xsd_EXTENDED_main from '../assets/xsd/extended/Factur-X_1.09.2_EXTENDED.xsd';
import xsd_EXTENDED_qdt from '../assets/xsd/extended/Factur-X_1.09.2_EXTENDED_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd';
import xsd_EXTENDED_ram from '../assets/xsd/extended/Factur-X_1.09.2_EXTENDED_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd';
import xsd_EXTENDED_udt from '../assets/xsd/extended/Factur-X_1.09.2_EXTENDED_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd';
import xsd_MINIMUM_main from '../assets/xsd/minimum/Factur-X_1.09.2_MINIMUM.xsd';
import xsd_MINIMUM_qdt from '../assets/xsd/minimum/Factur-X_1.09.2_MINIMUM_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd';
import xsd_MINIMUM_ram from '../assets/xsd/minimum/Factur-X_1.09.2_MINIMUM_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd';
import xsd_MINIMUM_udt from '../assets/xsd/minimum/Factur-X_1.09.2_MINIMUM_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd';
import sef_BASIC from '../assets/xslt/basic/FACTUR-X_BASIC.sef.json';
import codedb_BASIC from '../assets/xslt/basic/FACTUR-X_BASIC_codedb.xml';
import sef_BASICWL from '../assets/xslt/basicwl/FACTUR-X_BASIC-WL.sef.json';
import codedb_BASICWL from '../assets/xslt/basicwl/FACTUR-X_BASIC-WL_codedb.xml';
import sef_EN16931 from '../assets/xslt/en16931/FACTUR-X_EN16931.sef.json';
import codedb_EN16931 from '../assets/xslt/en16931/FACTUR-X_EN16931_codedb.xml';
import sef_EXTENDED from '../assets/xslt/extended/FACTUR-X_EXTENDED.sef.json';
import codedb_EXTENDED from '../assets/xslt/extended/FACTUR-X_EXTENDED_codedb.xml';
import sef_MINIMUM from '../assets/xslt/minimum/FACTUR-X_MINIMUM.sef.json';
import codedb_MINIMUM from '../assets/xslt/minimum/FACTUR-X_MINIMUM_codedb.xml';

// ==========================================
// Types & Data Structures
// ===========================================
export type FacturXProfile = 'MINIMUM' | 'BASICWL' | 'BASIC' | 'EN16931' | 'EXTENDED';

export interface XsdFile {
    fileName: string;
    contents: string;
}

export interface FacturXProfileAssets {
    /** The main XSD for the 'schema' parameter in xmllint-wasm */
    mainXsd: XsdFile;
    /** All sub-XSDs for the 'preload' parameter in xmllint-wasm */
    preload: XsdFile[];
    /** Schematron rules as precompiled SEF-JSON */
    sef: any;
    /** Code list database for Saxon-JS */
    codeDb: {
        fileName: string;
        contents: string;
    };
}

export const FACTURX_REGISTRY: Record<FacturXProfile, FacturXProfileAssets> = {
    MINIMUM: {
        mainXsd: {
            fileName: 'Factur-X_1.09.2_MINIMUM.xsd',
            contents: xsd_MINIMUM_main
        },
        preload: [
            {
                fileName: 'Factur-X_1.09.2_MINIMUM_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                contents: xsd_MINIMUM_qdt
            },
            {
                fileName:
                    'Factur-X_1.09.2_MINIMUM_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                contents: xsd_MINIMUM_ram
            },
            {
                fileName: 'Factur-X_1.09.2_MINIMUM_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd',
                contents: xsd_MINIMUM_udt
            }
        ],
        sef: sef_MINIMUM as any,
        codeDb: {
            fileName: 'FACTUR-X_MINIMUM_codedb.xml',
            contents: codedb_MINIMUM
        }
    },
    BASICWL: {
        mainXsd: {
            fileName: 'Factur-X_1.09.2_BASICWL.xsd',
            contents: xsd_BASICWL_main
        },
        preload: [
            {
                fileName: 'Factur-X_1.09.2_BASICWL_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                contents: xsd_BASICWL_qdt
            },
            {
                fileName:
                    'Factur-X_1.09.2_BASICWL_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                contents: xsd_BASICWL_ram
            },
            {
                fileName: 'Factur-X_1.09.2_BASICWL_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd',
                contents: xsd_BASICWL_udt
            }
        ],
        sef: sef_BASICWL as any,
        codeDb: {
            fileName: 'FACTUR-X_BASIC-WL_codedb.xml',
            contents: codedb_BASICWL
        }
    },
    BASIC: {
        mainXsd: {
            fileName: 'Factur-X_1.09.2_BASIC.xsd',
            contents: xsd_BASIC_main
        },
        preload: [
            {
                fileName: 'Factur-X_1.09.2_BASIC_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                contents: xsd_BASIC_qdt
            },
            {
                fileName:
                    'Factur-X_1.09.2_BASIC_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                contents: xsd_BASIC_ram
            },
            {
                fileName: 'Factur-X_1.09.2_BASIC_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd',
                contents: xsd_BASIC_udt
            }
        ],
        sef: sef_BASIC as any,
        codeDb: {
            fileName: 'FACTUR-X_BASIC_codedb.xml',
            contents: codedb_BASIC
        }
    },
    EN16931: {
        mainXsd: {
            fileName: 'Factur-X_1.09.2_EN16931.xsd',
            contents: xsd_EN16931_main
        },
        preload: [
            {
                fileName: 'Factur-X_1.09.2_EN16931_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                contents: xsd_EN16931_qdt
            },
            {
                fileName:
                    'Factur-X_1.09.2_EN16931_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                contents: xsd_EN16931_ram
            },
            {
                fileName: 'Factur-X_1.09.2_EN16931_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd',
                contents: xsd_EN16931_udt
            }
        ],
        sef: sef_EN16931 as any,
        codeDb: {
            fileName: 'FACTUR-X_EN16931_codedb.xml',
            contents: codedb_EN16931
        }
    },
    EXTENDED: {
        mainXsd: {
            fileName: 'Factur-X_1.09.2_EXTENDED.xsd',
            contents: xsd_EXTENDED_main
        },
        preload: [
            {
                fileName: 'Factur-X_1.09.2_EXTENDED_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                contents: xsd_EXTENDED_qdt
            },
            {
                fileName:
                    'Factur-X_1.09.2_EXTENDED_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                contents: xsd_EXTENDED_ram
            },
            {
                fileName: 'Factur-X_1.09.2_EXTENDED_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd',
                contents: xsd_EXTENDED_udt
            }
        ],
        sef: sef_EXTENDED as any,
        codeDb: {
            fileName: 'FACTUR-X_EXTENDED_codedb.xml',
            contents: codedb_EXTENDED
        }
    }
};

/**
 * Convenience function to retrieve all assets for a specific profile
 */
export function getFacturXAssets(profile: FacturXProfile): FacturXProfileAssets {
    const assets = FACTURX_REGISTRY[profile];
    if (!assets) {
        throw new Error(
            `Invalid Factur-X profile: '${profile}'. Valid options are: MINIMUM, BASICWL, BASIC, EN16931, EXTENDED`
        );
    }
    return assets;
}
