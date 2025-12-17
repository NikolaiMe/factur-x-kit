import { availableProfiles } from '../../src/core/factur-x';
import { CII_SR_465, CII_SR_466 } from '../../src/profiles/businessRules/cii_sr';
import { testComfortProfile } from '../profiles/comfort_test_objects';

describe('CII_SR', () => {
    describe('CII_SR_465', () => {
        it('CII_SR_465 should return true when only personName is present in seller tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                seller: {
                    ...testComfortProfile.seller,
                    tradeContact: [
                        {
                            personName: 'Hans Müller',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_465(val)).toBe(true);
        });

        it('CII_SR_465 should return true when only departmentName is present in seller tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                seller: {
                    ...testComfortProfile.seller,
                    tradeContact: [
                        {
                            departmentName: 'Verkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'verkauf@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_465(val)).toBe(true);
        });

        it('CII_SR_465 should return true when only departmentName or only personName is present in every seller tradeContact (multiple contacts)', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                seller: {
                    ...testComfortProfile.seller,
                    tradeContact: [
                        {
                            personName: 'Erika Mustermann',
                            telephoneNumber: '+49 444555666',
                            email: 'asdf@firma.de'
                        },
                        {
                            departmentName: 'Verkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'verkauf@firma.de'
                        },
                        {
                            personName: 'Hans Müller',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_465(val)).toBe(true);
        });

        it('CII_SR_465 should return false when both personName and departmentName are present in seller tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                seller: {
                    ...testComfortProfile.seller,
                    tradeContact: [
                        {
                            personName: 'Hans Müller',
                            departmentName: 'Verkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_465(val)).toBe(false);
        });

        it('CII_SR_465 should return false when both personName and departmentName are present in at least one seller tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                seller: {
                    ...testComfortProfile.seller,
                    tradeContact: [
                        {
                            personName: 'Erika Mustermann',
                            telephoneNumber: '+49 444555666',
                            email: 'asdf@firma.de'
                        },
                        {
                            departmentName: 'Verkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'verkauf@firma.de'
                        },
                        {
                            personName: 'Hans Müller',
                            departmentName: 'Verkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_465(val)).toBe(false);
        });
    });

    describe('CII_SR_466', () => {
        it('CII_SR_466 should return true when only personName is present in buyer tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                buyer: {
                    ...testComfortProfile.buyer,
                    tradeContact: [
                        {
                            personName: 'Hans Müller',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_466(val)).toBe(true);
        });

        it('CII_SR_466 should return true when only departmentName is present in buyer tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                buyer: {
                    ...testComfortProfile.buyer,
                    tradeContact: [
                        {
                            departmentName: 'Einkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'einkauf@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_466(val)).toBe(true);
        });

        it('CII_SR_466 should return true when only departmentName or only personName is present in every buyer tradeContact (multiple contacts)', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                buyer: {
                    ...testComfortProfile.buyer,
                    tradeContact: [
                        {
                            personName: 'Erika Mustermann',
                            telephoneNumber: '+49 444555666',
                            email: 'asdf@firma.de'
                        },
                        {
                            departmentName: 'Einkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'einkauf@firma.de'
                        },
                        {
                            personName: 'Hans Müller',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_466(val)).toBe(true);
        });

        it('CII_SR_466 should return false when both personName and departmentName are present in buyer tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                buyer: {
                    ...testComfortProfile.buyer,
                    tradeContact: [
                        {
                            personName: 'Hans Müller',
                            departmentName: 'Einkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_466(val)).toBe(false);
        });

        it('CII_SR_466 should return false when both personName and departmentName are present in at least one buyer tradeContact', () => {
            const val: availableProfiles = {
                ...testComfortProfile,
                buyer: {
                    ...testComfortProfile.buyer,
                    tradeContact: [
                        {
                            personName: 'Erika Mustermann',
                            telephoneNumber: '+49 444555666',
                            email: 'asdf@firma.de'
                        },
                        {
                            departmentName: 'Einkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'einkauf@firma.de'
                        },
                        {
                            personName: 'Hans Müller',
                            departmentName: 'Einkauf',
                            telephoneNumber: '+49 111222333',
                            email: 'hans.mueller@firma.de'
                        }
                    ]
                }
            };
            expect(CII_SR_466(val)).toBe(false);
        });
    });
});
