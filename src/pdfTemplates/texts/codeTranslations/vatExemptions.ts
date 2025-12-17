import { EXEMPTION_REASON_CODES } from '../../../types/codes';
import { TranslatedTexts } from '../types';

type VATEXCodes = `${EXEMPTION_REASON_CODES}`;

const vatExemptionReasons_en: Record<VATEXCodes, string> = {
    'VATEX-EU-79-C': 'Exempt based on article 79, point c of Council Directive 2006/112/EC',
    'VATEX-EU-132': 'Exempt based on article 132 of Council Directive 2006/112/EC',
    'VATEX-EU-132-1A': 'Exempt based on article 132, section 1 (a) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1B': 'Exempt based on article 132, section 1 (b) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1C': 'Exempt based on article 132, section 1 (c) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1D': 'Exempt based on article 132, section 1 (d) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1E': 'Exempt based on article 132, section 1 (e) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1F': 'Exempt based on article 132, section 1 (f) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1G': 'Exempt based on article 132, section 1 (g) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1H': 'Exempt based on article 132, section 1 (h) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1I': 'Exempt based on article 132, section 1 (i) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1J': 'Exempt based on article 132, section 1 (j) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1K': 'Exempt based on article 132, section 1 (k) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1L': 'Exempt based on article 132, section 1 (l) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1M': 'Exempt based on article 132, section 1 (m) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1N': 'Exempt based on article 132, section 1 (n) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1O': 'Exempt based on article 132, section 1 (o) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1P': 'Exempt based on article 132, section 1 (p) of Council Directive 2006/112/EC',
    'VATEX-EU-132-1Q': 'Exempt based on article 132, section 1 (q) of Council Directive 2006/112/EC',
    'VATEX-EU-143': 'Exempt based on article 143 of Council Directive 2006/112/EC',
    'VATEX-EU-143-1A': 'Exempt based on article 143, section 1 (a) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1B': 'Exempt based on article 143, section 1 (b) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1C': 'Exempt based on article 143, section 1 (c) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1D': 'Exempt based on article 143, section 1 (d) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1E': 'Exempt based on article 143, section 1 (e) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1F': 'Exempt based on article 143, section 1 (f) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1FA': 'Exempt based on article 143, section 1 (fa) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1G': 'Exempt based on article 143, section 1 (g) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1H': 'Exempt based on article 143, section 1 (h) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1I': 'Exempt based on article 143, section 1 (i) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1J': 'Exempt based on article 143, section 1 (j) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1K': 'Exempt based on article 143, section 1 (k) of Council Directive 2006/112/EC',
    'VATEX-EU-143-1L': 'Exempt based on article 143, section 1 (l) of Council Directive 2006/112/EC',
    'VATEX-EU-148': 'Exempt based on article 148 of Council Directive 2006/112/EC',
    'VATEX-EU-148-A': 'Exempt based on article 148, section (a) of Council Directive 2006/112/EC',
    'VATEX-EU-148-B': 'Exempt based on article 148, section (b) of Council Directive 2006/112/EC',
    'VATEX-EU-148-C': 'Exempt based on article 148, section (c) of Council Directive 2006/112/EC',
    'VATEX-EU-148-D': 'Exempt based on article 148, section (d) of Council Directive 2006/112/EC',
    'VATEX-EU-148-E': 'Exempt based on article 148, section (e) of Council Directive 2006/112/EC',
    'VATEX-EU-148-F': 'Exempt based on article 148, section (f) of Council Directive 2006/112/EC',
    'VATEX-EU-148-G': 'Exempt based on article 148, section (g) of Council Directive 2006/112/EC',
    'VATEX-EU-151': 'Exempt based on article 151 of Council Directive 2006/112/EC',
    'VATEX-EU-151-1A': 'Exempt based on article 151, section 1 (a) of Council Directive 2006/112/EC ',
    'VATEX-EU-151-1AA': 'Exempt based on article 151, section 1 (aa) of Council Directive 2006/112/EC ',
    'VATEX-EU-151-1B': 'Exempt based on article 151, section 1 (b) of Council Directive 2006/112/EC ',
    'VATEX-EU-151-1C': 'Exempt based on article 151, section 1 (c) of Council Directive 2006/112/EC ',
    'VATEX-EU-151-1D': 'Exempt based on article 151, section 1 (d) of Council Directive 2006/112/EC ',
    'VATEX-EU-151-1E': 'Exempt based on article 151, section 1 (e) of Council Directive 2006/112/EC ',
    'VATEX-EU-309': 'Exempt based on article 309 of Council Directive 2006/112/EC ',
    'VATEX-EU-AE': 'Reverse charge',
    'VATEX-EU-D': 'Intra-Community acquisition from second hand means of transport',
    'VATEX-EU-F': 'Intra-Community acquisition of second hand goods',
    'VATEX-EU-G': 'Export outside the EU',
    'VATEX-EU-I': 'Intra-Community acquisition of works of art',
    'VATEX-EU-IC': 'Intra-Community supply',
    'VATEX-EU-J': 'Intra-Community acquisition of collectors items and antiques',
    'VATEX-EU-O': 'Not subject to VAT',
    'VATEX-FR-FRANCHISE': 'France domestic VAT franchise in base',
    'VATEX-FR-CNWVAT': 'France domestic Credit Notes without VAT, due to supplier forfeit of VAT for discount',
    'VATEX-EU-144': 'Exempt based on article 144 of Council Directive 2006/112/EC',
    'VATEX-EU-146-1E': 'Exempt based on article 146 section 1 (e) of Council Directive 2006/112/EC',
    'VATEX-EU-153': 'Exempt based on article 153 of Council Directive 2006/112/EC',
    'VATEX-EU-159': 'Exempt based on article 159 of Council Directive 2006/112/EC',
    'VATEX-FR-CGI261-1': 'Exempt based on 1 of article 261 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261-2': 'Exempt based on 2 of article 261 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261-3': 'Exempt based on 3 of article 261 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261-4': 'Exempt based on 4 of article 261 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261-5': 'Exempt based on 5 of article 261 of the Code Général des Impôts (CGI ; General tax code) ',
    'VATEX-FR-CGI261-7': 'Exempt based on 7 of article 261 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261-8': 'Exempt based on 8 of article 261 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261A': 'Exempt based on article 261 A of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261B': 'Exempt based on article 261 B of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261C-1': 'Exempt based on 1° of article 261 C of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261C-2': 'Exempt based on 2° of article 261 C of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261C-3': 'Exempt based on 3° of article 261 C of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261D-1': 'Exempt based on 1° of article 261 D of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261D-1BIS':
        'Exempt based on 1°bis of article 261 D of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261D-2': 'Exempt based on 2° of article 261 D of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261D-3':
        'Exempt based on 3° of article 261 D of the Code Général des Impôts (CGI ; General tax code) Exonération de TVA - Article 261 D-3° du Code Général des Impôts ',
    'VATEX-FR-CGI261D-4': 'Exempt based on 4° of article 261 D of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261E-1': 'Exempt based on 1° of article 261 E of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI261E-2': 'Exempt based on 2° of article 261 E of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI277A': 'Exempt based on article 277 A of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI275': 'Exempt based on article 275 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-298SEXDECIESA':
        'Exempt based on article 298 sexdecies A of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-CGI295': 'Exempt based on article 295 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-FR-AE': 'Exempt based on 2 of article 283 of the Code Général des Impôts (CGI ; General tax code)',
    'VATEX-EU-135-1': 'Exempt based on article 135, section 1 of Council Directive 2006/112/EC'
};

const vatExemptionReasons_de: Record<VATEXCodes, string> = {
    'VATEX-EU-79-C': 'Steuerbefreit gemäß Artikel 79 Buchstabe c der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132': 'Steuerbefreit gemäß Artikel 132 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1A': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe a der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1B': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe b der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1C': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe c der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1D': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe d der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1E': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe e der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1F': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe f der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1G': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe g der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1H': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe h der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1I': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe i der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1J': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe j der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1K': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe k der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1L': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe l der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1M': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe m der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1N': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe n der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1O': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe o der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1P': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe p der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-132-1Q': 'Steuerbefreit gemäß Artikel 132 Absatz 1 Buchstabe q der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143': 'Steuerbefreit gemäß Artikel 143 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1A': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe a der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1B': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe b der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1C': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe c der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1D': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe d der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1E': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe e der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1F': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe f der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1FA': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe fa der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1G': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe g der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1H': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe h der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1I': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe i der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1J': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe j der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1K': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe k der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-143-1L': 'Steuerbefreit gemäß Artikel 143 Absatz 1 Buchstabe l der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148': 'Steuerbefreit gemäß Artikel 148 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-A': 'Steuerbefreit gemäß Artikel 148 Buchstabe a der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-B': 'Steuerbefreit gemäß Artikel 148 Buchstabe b der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-C': 'Steuerbefreit gemäß Artikel 148 Buchstabe c der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-D': 'Steuerbefreit gemäß Artikel 148 Buchstabe d der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-E': 'Steuerbefreit gemäß Artikel 148 Buchstabe e der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-F': 'Steuerbefreit gemäß Artikel 148 Buchstabe f der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-148-G': 'Steuerbefreit gemäß Artikel 148 Buchstabe g der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151': 'Steuerbefreit gemäß Artikel 151 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151-1A': 'Steuerbefreit gemäß Artikel 151 Absatz 1 Buchstabe a der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151-1AA': 'Steuerbefreit gemäß Artikel 151 Absatz 1 Buchstabe aa der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151-1B': 'Steuerbefreit gemäß Artikel 151 Absatz 1 Buchstabe b der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151-1C': 'Steuerbefreit gemäß Artikel 151 Absatz 1 Buchstabe c der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151-1D': 'Steuerbefreit gemäß Artikel 151 Absatz 1 Buchstabe d der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-151-1E': 'Steuerbefreit gemäß Artikel 151 Absatz 1 Buchstabe e der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-309': 'Steuerbefreit gemäß Artikel 309 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-AE': 'Umkehrung der Steuerschuldnerschaft',
    'VATEX-EU-D': 'Innergemeinschaftlicher Erwerb von gebrauchten Beförderungsmitteln',
    'VATEX-EU-F': 'Innergemeinschaftlicher Erwerb von Gebrauchtwaren',
    'VATEX-EU-G': 'Ausfuhr außerhalb der EU',
    'VATEX-EU-I': 'Innergemeinschaftlicher Erwerb von Kunstwerken',
    'VATEX-EU-IC': 'Innergemeinschaftliche Lieferung',
    'VATEX-EU-J': 'Innergemeinschaftlicher Erwerb von Sammlerstücken und Antiquitäten',
    'VATEX-EU-O': 'Nicht der Mehrwertsteuer unterliegend',
    'VATEX-FR-FRANCHISE': 'Französische inländische Umsatzsteuerbefreiung (Kleinunternehmerregelung)',
    'VATEX-FR-CNWVAT':
        'Französische inländische Gutschriften ohne Mehrwertsteuer, aufgrund des Verzichtes des Lieferanten auf die Mehrwertsteuer für Skonto',
    'VATEX-EU-144': 'Steuerbefreiung gemäß Artikel 144 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-146-1E': 'Steuerbefreiung gemäß Artikel 146 Absatz 1 (e) der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-153': 'Steuerbefreiung gemäß Artikel 153 der Richtlinie 2006/112/EG des Rates',
    'VATEX-EU-159': 'Steuerbefreiung gemäß Artikel 159 der Richtlinie 2006/112/EG des Rates',
    'VATEX-FR-CGI261-1':
        'Steuerbefreiung gemäß Absatz 1 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261-2':
        'Steuerbefreiung gemäß Absatz 2 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261-3':
        'Steuerbefreiung gemäß Absatz 3 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261-4':
        'Steuerbefreiung gemäß Absatz 4 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261-5':
        'Steuerbefreiung gemäß Absatz 5 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261-7':
        'Steuerbefreiung gemäß Absatz 7 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261-8':
        'Steuerbefreiung gemäß Absatz 8 des Artikels 261 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261A':
        'Steuerbefreiung gemäß Artikel 261 A des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261B':
        'Steuerbefreiung gemäß Artikel 261 B des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261C-1':
        'Steuerbefreiung gemäß Ziffer 1° des Artikels 261 C des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261C-2':
        'Steuerbefreiung gemäß Ziffer 2° des Artikels 261 C des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261C-3':
        'Steuerbefreiung gemäß Ziffer 3° des Artikels 261 C des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261D-1':
        'Steuerbefreiung gemäß Ziffer 1° des Artikels 261 D des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261D-1BIS':
        'Steuerbefreiung gemäß Ziffer 1°bis des Artikels 261 D des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261D-2':
        'Steuerbefreiung gemäß Ziffer 2° des Artikels 261 D des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261D-3':
        'Steuerbefreiung gemäß Ziffer 3° des Artikels 261 D des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch) Mehrwertsteuerbefreiung - Artikel 261 D-3° des Code Général des Impôts',
    'VATEX-FR-CGI261D-4':
        'Steuerbefreiung gemäß Ziffer 4° des Artikels 261 D des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261E-1':
        'Steuerbefreiung gemäß Ziffer 1° des Artikels 261 E des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI261E-2':
        'Steuerbefreiung gemäß Ziffer 2° des Artikels 261 E des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI277A':
        'Steuerbefreiung gemäß Artikel 277 A des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI275':
        'Steuerbefreiung gemäß Artikel 275 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-298SEXDECIESA':
        'Steuerbefreiung gemäß Artikel 298 sexdecies A des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-CGI295':
        'Steuerbefreiung gemäß Artikel 295 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-FR-AE':
        'Steuerbefreiung gemäß Absatz 2 des Artikels 283 des Code Général des Impôts (CGI; Allgemeines Steuergesetzbuch)',
    'VATEX-EU-135-1': 'Steuerbefreit gemäß Artikel 135 Absatz 1 der Richtlinie 2006/112/EG des Rates'
};

const vatExemptionReasons_fr: Record<VATEXCodes, string> = {
    'VATEX-EU-79-C': "Exonéré en vertu de l'article 79, point c de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132': "Exonéré en vertu de l'article 132 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1A':
        "Exonéré en vertu de l'article 132, paragraphe 1, point a) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1B':
        "Exonéré en vertu de l'article 132, paragraphe 1, point b) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1C':
        "Exonéré en vertu de l'article 132, paragraphe 1, point c) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1D':
        "Exonéré en vertu de l'article 132, paragraphe 1, point d) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1E':
        "Exonéré en vertu de l'article 132, paragraphe 1, point e) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1F':
        "Exonéré en vertu de l'article 132, paragraphe 1, point f) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1G':
        "Exonéré en vertu de l'article 132, paragraphe 1, point g) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1H':
        "Exonéré en vertu de l'article 132, paragraphe 1, point h) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1I':
        "Exonéré en vertu de l'article 132, paragraphe 1, point i) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1J':
        "Exonéré en vertu de l'article 132, paragraphe 1, point j) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1K':
        "Exonéré en vertu de l'article 132, paragraphe 1, point k) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1L':
        "Exonéré en vertu de l'article 132, paragraphe 1, point l) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1M':
        "Exonéré en vertu de l'article 132, paragraphe 1, point m) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1N':
        "Exonéré en vertu de l'article 132, paragraphe 1, point n) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1O':
        "Exonéré en vertu de l'article 132, paragraphe 1, point o) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1P':
        "Exonéré en vertu de l'article 132, paragraphe 1, point p) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-132-1Q':
        "Exonéré en vertu de l'article 132, paragraphe 1, point q) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143': "Exonéré en vertu de l'article 143 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1A':
        "Exonéré en vertu de l'article 143, paragraphe 1, point a) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1B':
        "Exonéré en vertu de l'article 143, paragraphe 1, point b) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1C':
        "Exonéré en vertu de l'article 143, paragraphe 1, point c) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1D':
        "Exonéré en vertu de l'article 143, paragraphe 1, point d) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1E':
        "Exonéré en vertu de l'article 143, paragraphe 1, point e) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1F':
        "Exonéré en vertu de l'article 143, paragraphe 1, point f) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1FA':
        "Exonéré en vertu de l'article 143, paragraphe 1, point fa) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1G':
        "Exonéré en vertu de l'article 143, paragraphe 1, point g) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1H':
        "Exonéré en vertu de l'article 143, paragraphe 1, point h) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1I':
        "Exonéré en vertu de l'article 143, paragraphe 1, point i) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1J':
        "Exonéré en vertu de l'article 143, paragraphe 1, point j) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1K':
        "Exonéré en vertu de l'article 143, paragraphe 1, point k) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-143-1L':
        "Exonéré en vertu de l'article 143, paragraphe 1, point l) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148': "Exonéré en vertu de l'article 148 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-A': "Exonéré en vertu de l'article 148, point a) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-B': "Exonéré en vertu de l'article 148, point b) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-C': "Exonéré en vertu de l'article 148, point c) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-D': "Exonéré en vertu de l'article 148, point d) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-E': "Exonéré en vertu de l'article 148, point e) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-F': "Exonéré en vertu de l'article 148, point f) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-148-G': "Exonéré en vertu de l'article 148, point g) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151': "Exonéré en vertu de l'article 151 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151-1A':
        "Exonéré en vertu de l'article 151, paragraphe 1, point a) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151-1AA':
        "Exonéré en vertu de l'article 151, paragraphe 1, point aa) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151-1B':
        "Exonéré en vertu de l'article 151, paragraphe 1, point b) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151-1C':
        "Exonéré en vertu de l'article 151, paragraphe 1, point c) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151-1D':
        "Exonéré en vertu de l'article 151, paragraphe 1, point d) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-151-1E':
        "Exonéré en vertu de l'article 151, paragraphe 1, point e) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-309': "Exonéré en vertu de l'article 309 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-AE': 'Autoliquidation',
    'VATEX-EU-D': "Acquisition intracommunautaire de moyens de transport d'occasion",
    'VATEX-EU-F': "Acquisition intracommunautaire de biens d'occasion",
    'VATEX-EU-G': 'Exportation hors UE',
    'VATEX-EU-I': "Acquisition intracommunautaire d'œuvres d'art",
    'VATEX-EU-IC': 'Livraison intracommunautaire',
    'VATEX-EU-J': "Acquisition intracommunautaire d'objets de collection et d'antiquités",
    'VATEX-EU-O': 'Non soumis à la TVA',
    'VATEX-FR-FRANCHISE': 'Franchise de TVA nationale française',
    'VATEX-FR-CNWVAT':
        'Notes de crédit nationales françaises sans TVA, en raison de la renonciation du fournisseur à la TVA pour escompte',
    'VATEX-EU-144': "Exonéré en vertu de l'article 144 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-146-1E':
        "Exonéré en vertu de l'article 146, paragraphe 1, point e) de la directive 2006/112/CE du Conseil",
    'VATEX-EU-153': "Exonéré en vertu de l'article 153 de la directive 2006/112/CE du Conseil",
    'VATEX-EU-159': "Exonéré en vertu de l'article 159 de la directive 2006/112/CE du Conseil",
    'VATEX-FR-CGI261-1': "Exonéré en vertu du 1 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261-2': "Exonéré en vertu du 2 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261-3': "Exonéré en vertu du 3 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261-4': "Exonéré en vertu du 4 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261-5': "Exonéré en vertu du 5 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261-7': "Exonéré en vertu du 7 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261-8': "Exonéré en vertu du 8 de l'article 261 du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261A': "Exonéré en vertu de l'article 261 A du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261B': "Exonéré en vertu de l'article 261 B du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261C-1': "Exonéré en vertu du 1° de l'article 261 C du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261C-2': "Exonéré en vertu du 2° de l'article 261 C du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261C-3': "Exonéré en vertu du 3° de l'article 261 C du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261D-1': "Exonéré en vertu du 1° de l'article 261 D du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261D-1BIS': "Exonéré en vertu du 1°bis de l'article 261 D du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261D-2': "Exonéré en vertu du 2° de l'article 261 D du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261D-3':
        "Exonéré en vertu du 3° de l'article 261 D du Code Général des Impôts (CGI) Exonération de TVA - Article 261 D-3° du Code Général des Impôts",
    'VATEX-FR-CGI261D-4': "Exonéré en vertu du 4° de l'article 261 D du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261E-1': "Exonéré en vertu du 1° de l'article 261 E du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI261E-2': "Exonéré en vertu du 2° de l'article 261 E du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI277A': "Exonéré en vertu de l'article 277 A du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI275': "Exonéré en vertu de l'article 275 du Code Général des Impôts (CGI)",
    'VATEX-FR-298SEXDECIESA': "Exonéré en vertu de l'article 298 sexdecies A du Code Général des Impôts (CGI)",
    'VATEX-FR-CGI295': "Exonéré en vertu de l'article 295 du Code Général des Impôts (CGI)",
    'VATEX-FR-AE': "Exonéré en vertu du 2 de l'article 283 du Code Général des Impôts (CGI)",
    'VATEX-EU-135-1': "Exonéré en vertu de l'article 135, paragraphe 1 de la directive 2006/112/CE du Conseil"
};

const _vatExemptionReasons: TranslatedTexts<VATEXCodes> = {
    'en-US': vatExemptionReasons_en,
    'de-DE': vatExemptionReasons_de,
    'fr-FR': vatExemptionReasons_fr
};

export const vatExemptions = Object.freeze(_vatExemptionReasons);
