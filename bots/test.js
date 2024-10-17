
const options = {
    method: 'GET',
    headers: {accept: '*/*', Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'}
};
async function getTopColletions( per = 1){
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/collections/trending/v1?period=${per}d&sortBy=sales&normalizeRoyalties=false&useNonFlaggedFloorAsk=false`, options)
    let data = await response.json()
    const collection = new Object()
    // for(let i = 0; i < 100; i++){
    //   collection[i+1] = data.collections[i].id
    // }
    // console.log(collection);
    console.log(data.collections.length);
    return collection;
}

getTopColletions()