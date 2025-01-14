import { NoteTypeConverter } from '../../types/ram/index.js'
import { IdTypeConverter } from '../../types/udt/IdTypeConverter.js'
import { IdTypeWithSchemeConverter } from '../../types/udt/IdTypeWithSchemeConverter.js'
import type { MappingItem } from '../convert.js'
import MinimumProfileMapping from '../minimum/mapping.js'
import type { BasicWithoutLinesProfile } from './BasicWithoutLinesProfile.js'
import { BasicWithoutLinesProfileXml } from './BasicWithoutLinesProfileXml.js'

const mapping: MappingItem<BasicWithoutLinesProfile, BasicWithoutLinesProfileXml>[] = [
    /* ...MinimumProfileMapping, // That's not possible we need to make sure, that the order in the mapping table is the same as given by the xml. If order is not correct the XSD check won't resolve!
    {
        obj: 'notes',
        xml: 'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:IncludedNote',
        type: 'array',
        arrayMap: [], // @deprecated
        converter: new NoteTypeConverter()
    },
    {
        obj: 'seller.id',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:ID',
        type: 'string', // @deprecated
        converter: new IdTypeConverter()
    },
    {
        obj: 'seller.globalId',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:GlobalID',
        type: 'string', // @deprecated
        converter: new IdTypeWithSchemeConverter()
    },
    {
        obj: 'buyer.id',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:ID',
        type: 'string', // @deprecated
        converter: new IdTypeConverter()
    },
    {
        obj: 'buyer.globalId',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:GlobalID',
        type: 'string', // @deprecated
        converter: new IdTypeWithSchemeConverter()
    }*/
]

export default mapping
