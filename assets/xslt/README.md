## Translate xslt to sef.json via cmd

Navigate with cmd into folder of xslt and execute:

`npx xslt3 -xsl:FACTUR-X_EXTENDED.xslt -export:FACTUR-X_EXTENDED.sef.json -nogo`

Make sure to replace the filenames properly.

Also make sure to update the registry correctly when updating the files (src/facturxRegistry.ts)
