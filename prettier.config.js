export default {
    semi: true,
    tabWidth: 4,
    trailingComma: 'none',
    singleQuote: true,
    printWidth: 120,
    arrowParens: 'avoid',
    plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-packagejson'],
    importOrder: ['^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true
};
