import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot('7171580107:AAFqiIAXr_WkZheoOjjFrSowRsa9wLTdQpc', {
    polling: {
        interval: 300,
        autoStart: true
    }
});
try{
    const options = {
        method: 'GET',
        headers: {accept: '*/*', Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'}
    };
    let limit  = 20
    async function getTopColletions(per = 1){
      const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/collections/trending/v1?period=${per}d&sortBy=sales&normalizeRoyalties=false&useNonFlaggedFloorAsk=false`, options)
      let data = await response.json()
      limit = data.collections.length
      const collection = new Object()
      for(let i = 0; i < data.collections.length; i++){
        collection[i+1] = data.collections[i].id
      }
      return collection;
    }
    let repid = []
    async function msgFloorNFT(contract, limit){
      let price = new Object()
      const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&sortBy=floorAskPrice&limit=${limit}&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
      let data = await response.json()
      for(let i = 0; i < limit; i++) {
          price[i + 1] = await data.tokens[i].market.floorAsk.price.amount.usd.toFixed(0); 
      }
      if(((price[2] - price[1])/price[2]*100) >= 0){
          if (repid.find(i => i === data.tokens[0].token.tokenId) === undefined) {
              repid.push(data.tokens[0].token.tokenId);
            //   bot.sendMessage(1875576355, `Найдена хороша цена на NFT в коллекции "${data.tokens[0].token.collection.name}"\nОтличие состовляет ${((price[2] - price[1])/price[2]*100).toFixed(2)}%\nЦена данной NFT равна ${data.tokens[0].market.floorAsk.price.amount.usd.toFixed(0)} USD`,{
            //     reply_markup: {
            //         inline_keyboard:[
            //           [{
            //             text: "Купить NFT",
            //             callback_data: data.tokens[0].token.tokenId,
            //           }, ],
            //         ]
            //     }
            // });
              console.log(`Найдена хороша цена на NFT в коллекции ${data.tokens[0].token.collection.name}`);
              console.log(`Отличие состовляет ${((price[2] - price[1])/price[2]*100).toFixed(2)}%`)
              console.log(`Цена данной NFT равна ${data.tokens[0].market.floorAsk.price.amount.usd.toFixed(0)} USD`);
              bot.on('callback_query', function(msg){
                if(msg.data === data.tokens[0].token.tokenId){
                  console.log('Вы нажали на коллекцию ' + data.tokens[0].token.collection.name);
                  //Здесь обрабатывается нажатие на кнопку в боте, и нужно запускать смарт-контракт для покупки NFT
                }
              })
          }         
      }    
    }
    async function getTopNFT(limit){
      const collection = await getTopColletions(limit)
      for(let i = 1; i <= limit; i++){
        msgFloorNFT(collection[`${i}`], limit)
      }
    }
    bot.on('message',(msg)=>{
      if(msg.text === '/start'){
        bot.sendMessage(msg.chat.id, 'Привет! Это бот для оповещения о новых NFT с хорошей ценой в коллекциях MagicEden',{
          reply_markup: {
              keyboard: [
                  ['Топ NFT', 'Найти землю по ID'],
                  ['Инструкция','Обратная связь']
              ],
              resize_keyboard: true
          }
      })
      }
    })
    getTopNFT(20)
    setInterval(()=> getTopNFT(20), 60000)// каждую минуту проверяет на наличие новый NFT с хорошей ценой 
    setInterval(()=> repid = [], 10800000)//обнуляет массив с id повтроряющихся NFT
}catch(error){
    console.log(error)
}

//10800000 - 3 часа