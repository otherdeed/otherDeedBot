// import TelegramBot from 'node-telegram-bot-api';
const options = {
    method: 'GET',
    headers: {
        accept: '*/*',
        Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
    }
};
let repid = []
async function msgFloorNFT(contract, limit){
    let price = new Object()
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/solana/tokens/v6?collection=${contract}&sortBy=floorAskPrice&limit=${limit}&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    let data = await response.json()
    for(let i = 0; i < limit; i++) {
        price[i + 1] = data.tokens[i].market.floorAsk.price.amount.usd.toFixed(0);
    }
    if(((price[2] - price[1])/price[2]*100) > 0.01){
        if (repid.find(i => i === data.tokens[0].token.tokenId) === undefined) {
            repid.push(data.tokens[0].token.tokenId);
            console.log();
            
            console.log(((price[2] - price[1])/price[2]*100).toFixed(2) + '%')        
        }         
    }    
    
}
setInterval(async () => {msgFloorNFT('6zbJGdKJYmaZEMEuFQrZPHWcUfWu5bJ6D2BY1toa7n8U',2)},2000)
setInterval(async () => {repid = []},10800000)
