const options = {
    method: 'GET',
    headers: {
        accept: '*/*',
        Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
    }
};

export async function Fetch(contract,limit){
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&sortBy=floorAskPrice&limit=${limit}&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    let data = await response.json()
    data = data.tokens
    return data
}
export async function FetchObj(contract,id) {
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&tokenName=${id}&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    let data = await response.json()
    data = data.tokens[0]
    return data
}
// let a = await FetchObj('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258','61410')
// console.log(a);

