import {getAttributes, getInfoEarth, filterEarthAttributes, calculateRarity, msgBotAttributes, conclusionRarity, getFloorPrice} from './getEarth.js'

async function main() {
    const a = await getInfoEarth('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258','10698')
    console.log(a);
}
main()