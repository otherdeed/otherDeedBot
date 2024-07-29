const options = {
    method: 'GET',
    headers: {
        accept: '*/*',
        Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
    }
};
async function getPrice(contract, id) {
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&tokenName=${id}&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    const data = await response.json()
    const dataAttributes = await data.tokens[0].token
    console.log(dataAttributes);
}
getPrice('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', '10698');