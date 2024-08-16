import { Fetch ,FetchObj} from "./fetch.js";
let earth = new Object()
export async function getEarth(contract, id) {
    let data = await FetchObj(contract, id)
    earth['id'] = id
    earth['contact'] = contract
    earth['colletionName'] = data.token.collection.name
    earth['image'] = data.token.imageLarge
    earth['usdPrice'] = data.market.floorAsk.price.amount.usd.toFixed(0)
    earth['ethPrice'] = data.market.floorAsk.price.amount.native
    async function getAttributes(){
        for(let i = 0; i < data.token.attributes.length; i++) {
            earth[data.token.attributes[i].key] = data.token.attributes[i].value
            delete earth[Object.keys(earth).find(key =>earth[key] === 'No')]
            if((data.token.attributes[i].key).search('Tier') >= 0){
                console.log(data.token.attributes[i].value);
                
            }
        }
        delete earth['Category'] 
        delete earth['Plot'] 
    }
    if(contract == '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258'){
        await getAttributes()
    }
    console.log(earth);
}
getEarth('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', '98055')