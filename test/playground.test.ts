/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema } from 'node-schematron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { printNode, zodToTs } from 'zod-to-ts';

import { ZComfortProfileStructure_modified } from '../src/adapter/totalsCalculator/easyInputType';
import { FacturX } from '../src/core/factur-x';
import { HeaderImageFileType } from '../src/pdfTemplates/invoiceBlocks/headerImage';
import { HeaderImageType, dinA4Width, mmToPt } from '../src/pdfTemplates/types';
import { ZBasicProfile } from '../src/profiles/basic/BasicProfile';
import { ZMinimumProfile } from '../src/profiles/minimum';
import { designTestObject } from './design_test_object';
import { designTestObject_easy } from './design_test_object_easy';
import { testDesignObjectKleinunternehmer } from './design_test_object_kleinunternehmer';
import './profiles/codeDb/xPathDocumentFunction';

// This is just a testcase which helps me printing out the ts-objects which are built from the zod types

describe('playground', () => {
    it('shall run', () => {
        const identifier = 'basicwl';
        const { node } = zodToTs(ZComfortProfileStructure_modified, identifier);
        const nodeString = printNode(node);
        //logTypeWithComments(nodeString);

        const identifier4 = 'basic';
        const { node: node4 } = zodToTs(ZBasicProfile, identifier4);
        const nodeString4 = printNode(node4);
        //logTypeWithComments(nodeString4);

        const min = 'minimum';
        const { node: minimum } = zodToTs(ZMinimumProfile, min);
        const nodeStringMin = printNode(minimum);
        //logTypeWithComments(nodeStringMin);

        expect(true).toBeTruthy();
    });
});

function logTypeWithComments(nodeString: string) {
    const splittedString = nodeString.split('\n');
    let commentedString = '';
    let currComment = '';
    for (const line of splittedString) {
        const trimmedText = line.trim();
        if (trimmedText.startsWith('/**') && trimmedText.endsWith('*/')) {
            const comment = trimmedText.replace('/**', '').replace('*/', '');
            currComment = comment;
            continue;
        }
        commentedString = `${commentedString}${line}`;
        if (currComment) {
            commentedString = `${commentedString}\t//${currComment}`;
            currComment = '';
        }
        commentedString = `${commentedString}\n`;
    }
    console.log(commentedString);
}

describe('factur-x validity check', () => {
    let xml: string;
    beforeAll(async () => {
        xml = await fs.readFile('C:/Users/User/Documents/factur-x_bwl.xml', 'utf-8');
    });

    test('Builds Valid XML According to SCHEMATRON Schema', async () => {
        const schematron = (
            await fs.readFile(
                path.join(__dirname, 'profiles', 'schematronSchemes', 'Factur-X_1.07.4_BASIC-WL.sch'),
                'utf-8'
            )
        ).toString();

        const schema = Schema.fromString(schematron);

        const result = schema.validateString(xml);

        if (result.length > 0) console.log(result.map(res => res.message?.trim()));

        expect(result.length).toBe(0);
    });
});

describe('pdf-creation', () => {
    test('pdf creation', async () => {
        const projectRoot = process.cwd();
        const imagePath = path.join(projectRoot, 'assets', 'images', 'test_header', 'header.jpg');

        const imageBuffer = await fs.readFile(imagePath);
        const imageUint8Array = new Uint8Array(imageBuffer);

        const headerImage: HeaderImageType = {
            imageBytes: imageUint8Array,
            dataType: 'jpg',
            dimensions: {
                width: dinA4Width * mmToPt,
                height: ((dinA4Width * mmToPt) / 1408) * 504
            }
        };
        const instance = await FacturX.fromObject(designTestObject_easy);
        const pdfBytesDE = await instance.getPDF({
            locale: 'de-DE',
            headerImage
        });
        expect(pdfBytesDE).toBeDefined();
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_DE.pdf'), pdfBytesDE);

        const pdfBytesEN = await instance.getPDF({
            locale: 'en-US',
            headerImage
        });
        expect(pdfBytesEN).toBeDefined();
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_EN.pdf'), pdfBytesEN);

        const pdfBytesFR = await instance.getPDF({
            locale: 'fr-FR',
            headerImage
        });
        expect(pdfBytesFR).toBeDefined();
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_FR.pdf'), pdfBytesFR);

        const complexInstance = await FacturX.fromObject(designTestObject);
        const pdfBytesEN_multiPage = await complexInstance.getPDF({
            locale: 'en-US',
            headerImage
        });
        expect(pdfBytesEN_multiPage).toBeDefined();
        await fs.writeFile(
            path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_EN_MultiPage.pdf'),
            pdfBytesEN_multiPage
        );

        const pdfBytesDE_multiPage = await complexInstance.getPDF({
            locale: 'de-DE',
            headerImage
        });
        expect(pdfBytesDE_multiPage).toBeDefined();
        await fs.writeFile(
            path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_DE_MultiPage.pdf'),
            pdfBytesDE_multiPage
        );

        const kleinunternehmerInstance = await FacturX.fromObject(testDesignObjectKleinunternehmer);
        const pdfBytesDE_Kleinunternehmer = await kleinunternehmerInstance.getPDF({
            locale: 'de-DE',
            headerImage
        });
        expect(pdfBytesDE_Kleinunternehmer).toBeDefined();
        await fs.writeFile(
            path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_DE_Kleinunternehmer.pdf'),
            pdfBytesDE_Kleinunternehmer
        );
    }, 100000);
});
