import {getAttributes, getInfoEarth, filterEarthAttributes, calculateRarity, msgBotAttributes, conclusionRarity, getFloorPrice} from './getEarth.js'

async function arrEarth() {
    let arr = []
    const eatrh = await getInfoEarth('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258','96077')
    const eatrh1 = await getInfoEarth('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258','10698')
    arr.push(eatrh)
    arr.push(eatrh1)
}
arrEarth()