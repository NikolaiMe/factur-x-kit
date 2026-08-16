import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Preload environment variables from .env for tests
    setupFiles: ['dotenv/config'],
    verbose: false,
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '\\.(icc|ttf|xsd|xml)$': '<rootDir>/jest-config/jest.assetTransformer.cjs'
    },
    transformIgnorePatterns: ['/node_modules/(?!pdf-lib|other-relevant-module)']
};
export default config;
