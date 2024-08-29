// import TelegramBot from 'node-telegram-bot-api';
const options = {
    method: 'GET',
    headers: {
        accept: '*/*',
        Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
    }
};
let repeated = []
async function msgFloorNFT(contract, limit){
    let price = new Object()
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&sortBy=floorAskPrice&limit=${limit}&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    let data = await response.json()
    for(let i = 0; i < limit; i++) {
        price[i + 1] = data.tokens[i].market.floorAsk.price.amount.usd.toFixed(0);
    }
    if(((price[2] - price[1])/price[2]*100) > 0.000001){
        if (repeated.find(i => i === data.tokens[0].token.tokenId) === undefined) {
            repeated.push(data.tokens[0].token.tokenId);
            console.log();
            
            console.log(((price[2] - price[1])/price[2]*100).toFixed(2) + '%')        
        }         
    }    
    
}
setInterval(async () => {msgFloorNFT('0x769272677fab02575e84945f03eca517acc544cc',2)},2000)
setInterval(async () => {repeated = []},10800000)
