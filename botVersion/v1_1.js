import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot('7171580107:AAFqiIAXr_WkZheoOjjFrSowRsa9wLTdQpc', {
    polling: {
        interval: 300,
        autoStart: true
    }
});
const botErorr = new TelegramBot('7074118463:AAEpq0E6fnG_8QE3znqjTGJUN7dmD4FEKYQ', {
    polling: {
        interval: 300,
        autoStart: true
    }
});
const commands = [{
    command: "floor",
    description: "Floor price Otherdeed",
  },
  {
    command: "search",
    description: "Otherdeed information by tokenId",
  },
  {
    command: "info",
    description: "Documentation",
  },
  {
    command: "help",
    description: "Feedback",
  }
];
bot.setMyCommands(commands);
let users = {};  // Инициализация объекта для хранения пользователей
let cnt = 0;  // Инициализация счетчика
let user = []

async function getUser(msg) {
    cnt += 1;
    let userName = '@' + msg.chat.username;

    // Проверка наличия пользователя
    if (users.hasOwnProperty(userName)) {
        console.log('user exists');
    } else {
        console.log('user not exists');
        users[userName] = cnt;
        user.push(users);
    }

    console.log(users);
    console.log(user);
}
botErorr.on('message',async (msg)=>{
    let message = await botErorr.sendMessage(msg.chat.id,'users')
})

bot.on('polling_error', (err) => {
    console.log(err.data.error.message)
});
async function getAttributes(id) {
    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
        }
    };
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&tokenName=${id}&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    const data = await response.json()
    const dataAttributes = data.tokens[0].token.attributes
    let Attributes = {
        sediment: {
            names: '',
            tier: 0
        },
        environment: {
            names: '',
            tier: 0
        },
        nResource: {
            names: '',
            tier: 0
        },
        sResource: {
            names: '',
            tier: 0
        },
        wResource: {
            names: '',
            tier: 0
        },
        eResource: {
            names: '',
            tier: 0
        },
        artifact: {
            names: ''
        },
        koda: false
    }

    function getEarthAttributes(type, objectKey) {
        const attributes = dataAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].key === type) {
                if (!Attributes[objectKey]) {
                    Attributes[objectKey] = {};
                }
                Attributes[objectKey].names = attributes[i].value;
                break;
            }
        }
    }
    getEarthAttributes('Sediment', 'sediment')
    getEarthAttributes('Environment', 'environment')
    getEarthAttributes('Northern Resource', 'nResource')
    getEarthAttributes('Southern Resource', 'sResource')
    getEarthAttributes('Western Resource', 'wResource')
    getEarthAttributes('Eastern Resource', 'eResource')
    getEarthAttributes('Artifact', 'artifact')

    function getEarthTier(type, objectKey) {
        const attributes = dataAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].key === type) {
                if (!Attributes[objectKey]) {
                    Attributes[objectKey] = {};
                }
                Attributes[objectKey].tier = attributes[i].value;
                break;
            }
        }
    }
    getEarthTier('Sediment Tier', 'sediment')
    getEarthTier('Environment Tier', 'environment')
    getEarthTier('Northern Resource Tier', 'nResource')
    getEarthTier('Southern Resource Tier', 'sResource')
    getEarthTier('Western Resource Tier', 'wResource')
    getEarthTier('Eastern Resource Tier', 'eResource')

    function getEarthKoda(type, objectKey) {
        const attributes = dataAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].key === type) {
                Attributes[objectKey] = true
                break;
            }
        }
    }
    getEarthKoda('Koda', 'koda')
    return Attributes;
}
async function getInfoEarth(id) {
    try{
        const options = {
            method: 'GET',
            headers: {
                accept: '*/*',
                Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
            }
        };
        const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&tokenName=${id}&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
        const data = await response.json()
        // console.log(data.tokens[0].token.tokenId)
        const Attributes = await getAttributes(id)
        const dataEarth = await data.tokens[0]
        const infoEarth = {
            id: dataEarth.token.tokenId,
            contract: dataEarth.token.contract,
            usdPrice: dataEarth.market.floorAsk && dataEarth.market.floorAsk.price && dataEarth.market.floorAsk.price.amount ? dataEarth.market.floorAsk.price.amount.usd.toFixed(2) : 'N/A',
            ethPrice: dataEarth.market.floorAsk && dataEarth.market.floorAsk.price && dataEarth.market.floorAsk.price.amount ? dataEarth.market.floorAsk.price.amount.native.toFixed(4) : 'N/A',
            image: dataEarth.token.imageLarge,
            sediment: Attributes.sediment.names,
            environment: Attributes.environment.names,
            sedimentTier: Attributes.sediment.tier,
            environmentTier: Attributes.environment.tier,
            nResource: Attributes.nResource.names,
            nResourceTier: Attributes.nResource.tier,
            sResource: Attributes.sResource.names,
            sResourceTier: Attributes.sResource.tier,
            wResource: Attributes.wResource.names,
            wResourceTier: Attributes.wResource.tier,
            eResource: Attributes.eResource.names,
            eResourceTier: Attributes.eResource.tier,
            artifact: Attributes.artifact.names,
            koda: Attributes.koda
        }
        return infoEarth
    }catch(erorr){
        botErorr.sendMessage(1875576355, 'Сейчас бот перегружен, попробуйте позже.');
        console.log(erorr);
    }
}

async function filterEarthAttributes(id) {
    let infoEarth = await getInfoEarth(id)

    function deleteEmpty(objKey, objTierKey) {
        if (infoEarth[objKey] == '' || infoEarth[objTierKey] == false) {
            delete infoEarth[objTierKey];
            delete infoEarth[objKey];
        }
    }
    deleteEmpty('wResource', 'wResourceTier');
    deleteEmpty('eResource', 'eResourceTier');
    deleteEmpty('nResource', 'nResourceTier');
    deleteEmpty('sResource', 'sResourceTier');
    deleteEmpty('artifact', 'artifact');
    deleteEmpty('koda', 'koda');
    return infoEarth
}

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function calculateRarity(id) {
    let infoEarth = await filterEarthAttributes(id);
    const filePath = path.resolve(__dirname, '../Attributes.json');
    const data = await fs.readFile(filePath, 'utf8');
    const attributes = JSON.parse(data);
    let EarthData = {};

    function getValue(key, keyValue, names) {
        if (attributes[key] && keyValue in attributes[key]) {
            EarthData[names] = attributes[key][keyValue];
        }
    }
    getValue('sediment', infoEarth['sediment'], 'sediment');
    getValue('environments', infoEarth['environment'], 'environment');
    getValue('resources', infoEarth['nResource'], 'nResource');
    getValue('resources', infoEarth['sResource'], 'sResource');
    getValue('resources', infoEarth['wResource'], 'wResource');
    getValue('resources', infoEarth['eResource'], 'eResource');
    getValue('artifacts', infoEarth['artifact'], 'artifact');

    function Rarity(attr, tier) {
        let rarityAttributes = 0
        if (EarthData.hasOwnProperty(attr) && typeof EarthData[attr].TotalAmount !== 'undefined') {
            const totalAmount = EarthData[attr].TotalAmount;
            const Tier = infoEarth[tier];
            const TierValue = EarthData[attr][Tier]
            rarityAttributes = (totalAmount - TierValue) / totalAmount;
        } else {
            rarityAttributes = 0
        }
        return rarityAttributes
    }

    Rarity('sediment', 'sedimentTier')
    const RaritySidement = Rarity('sediment', 'sedimentTier');
    const RarityEnvironment = Rarity('environment', 'environmentTier');
    const RarityNResource = Rarity('nResource', 'nResourceTier');
    const RaritySResource = Rarity('sResource', 'sResourceTier');
    const RarityWResource = Rarity('wResource', 'wResourceTier');
    const RarityEResource = Rarity('eResource', 'eResourceTier');
    const totalRarity = (RaritySidement + RarityEnvironment + RarityNResource + RaritySResource + RarityEResource + RarityWResource).toFixed(2);
    return totalRarity
}
async function msgBotAttributes(id) {
    let infoEarth = await filterEarthAttributes(id);

    function msgBotDecor(objKey) {
        let inf = '';
        if (infoEarth[objKey] == 1) {
            inf = '1️⃣';
        } else if (infoEarth[objKey] == 2) {
            inf = '2️⃣';
        } else if (infoEarth[objKey] == 3) {
            inf = '3️⃣';
        } else if (infoEarth[objKey] == 4) {
            inf = '4️⃣';
        } else if (infoEarth[objKey] == 5) {
            inf = '5️⃣';
        } else if (infoEarth[objKey] === undefined || infoEarth[objKey] === '') {
            inf = '';
        }
        return inf;
    }

    function msgBotKoda(objKey) {
        let inf = '';
        if (infoEarth[objKey] == true) {
            inf = 'Koda😳';
        }
        return inf;
    }

    function msgBotArtifact(objKey) {
        if (objKey in infoEarth && infoEarth[objKey]) {
            return infoEarth[objKey];
        } else {
            return '🚫';
        }
    }
    let resources = [{
            key: 'eResource',
            tier: 'eResourceTier'
        },
        {
            key: 'sResource',
            tier: 'sResourceTier'
        },
        {
            key: 'wResource',
            tier: 'wResourceTier'
        },
        {
            key: 'nResource',
            tier: 'nResourceTier'
        }
    ];

    let resourceStr = resources.map(r => {
        return infoEarth[r.key] ? `${infoEarth[r.key]}${msgBotDecor(r.tier)}` : '';
    }).filter(Boolean).join(',');

    function checkMsgBotDecor() {
        if (resourceStr == '') {
            return `${msgBotKoda('koda')}\nSediment: ${infoEarth.sediment}${msgBotDecor('sedimentTier')}\nEnvironment: ${infoEarth.environment}${msgBotDecor('environmentTier')}\nResource: 🚫\nArtifact: ${msgBotArtifact('artifact')}`;
        }
        return `${msgBotKoda('koda')}\nSediment: ${infoEarth.sediment}${msgBotDecor('sedimentTier')}\nEnvironment: ${infoEarth.environment}${msgBotDecor('environmentTier')}\nResource: ${resourceStr}\nArtifact: ${msgBotArtifact('artifact')}`;
    }
    let mess = checkMsgBotDecor()
    return mess;
}
async function conclusionRarity(id) {
    const rarity = await calculateRarity(id);
    const infoEarth = await filterEarthAttributes(id);
    const minPrice = 0.141
    const Price = infoEarth.ethPrice;
    let differencePrice = Price / minPrice;
    let Rarity = rarity * differencePrice
    let k = (Price / Rarity).toFixed(3);
    if (infoEarth.artifact && infoEarth.artifact.length > 0) {
        return 'На данный момент бот не умеет считать редкость земли с Артефактом 😔';
    }
    if (infoEarth.koda == true) {
        return 'На данный момент бот не умеет считать редкость земли с Koda 😔';
    }
    if (k < 0.06) {
        return 'Эта цена ниже рыночной';
    } else if (k >= 0.06 && k < 0.09) {  
        return 'Эта цена немного ниже рыночной';
    } else if (k >= 0.09 && k < 0.12) {
        return 'Эта цена соответствует рынку'
    } else if (k >= 0.12 && k < 0.18) {
        return 'Эта цена выше рынка';
    } else if (k >= 0.18) {
        return 'Эта цена сильно выше рынка'
    }
}
async function getFloorPrice() {
    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
        }
    };
    const response = await fetch('https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false', options)
    const data = await response.json()
    const floorId = data.tokens[0].token.tokenId
    return floorId
}

function timeConverter(timestamp) {
    let a = new Date(timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    if (sec <= 9) {
        sec = `0${sec}`
    }
    if (min <= 9) {
        min = `0${min}`
    }
    if (hour <= 9) {
        hour = `0${hour}`
    }
    let time = `${hour}:${min}:${sec} ${date} ${month} ${year}`
    return time
}
let moreInfo = false;
let currentQueryHandler = null;
const linkKeyboard = [
    [{
      text: "MagicEden",
      url: "https://magiceden.io/",
    }],
    [{
      text: "Коллекция Otherdeed",
      url: "https://magiceden.io/collections/ethereum/otherdeed",
    }],
  ];
async function startCommand(msg) {
    if (msg.text === '/start') {
        await bot.sendMessage(msg.chat.id, 'Привет! Это бот, который поможет тебе найти самую в Otherside. Какую операцию хочешь выполнить?', {
            reply_markup: {
                keyboard: [
                    ['Самая дешевая земля', 'Найти землю по ID'],
                    ['Инструкция','Обратная связь']
                ],
                resize_keyboard: true
            }
        });
    }

    if (msg.text === 'Самая дешевая земля' || msg.text === '/floor') {
        await commandFloor(msg);
    }

    if (msg.text === 'Найти землю по ID' || msg.text === '/search') {
        await commandSearch(msg);
    }
    if(msg.text === 'Инструкция' || msg.text === '/info'){
        await bot.sendMessage(msg.chat.id,'Этот бот был создан с целью помочь вам в покупке земли в коллекции NFT «Othredeed for Otherside».')
        await bot.sendMessage(msg.chat.id, 'Бот взаимодействует с торговой площадкой NFT MagicEden, берет с неё информацию о земле, и на основе алгоритмов выдаёт рекомендацию. Внимание!!! Бот всего лишь выдаёт рекомендацию на основе алгоритмов, решение о покупки земли лежит только на вас.',{reply_markup: {inline_keyboard: linkKeyboard,},});
        await bot.sendMessage(msg.chat.id,'Функционал:\n Кнопка “Самая дешевая земля”- показывает самую дешёвую землю на торговой площадке NFT MagicEden\n Кнопка “Найти землю по ID ”- команда даёт возможность посмотреть интересующию вас землю на торговой площадке NFT MagicEden\nИнструкция по поиску земли по ID:\n 1) Заходим на MagicEden находим коллекцию «Othredeed for Otherside».\n 2) Выбираем землю.\n 3) Берём её TokenID и отправляем боту.');
    }
    if(msg.text === 'Обратная связь' || msg.text === '/help'){
        await bot.sendMessage(msg.chat.id,'Если у вас есть вопросы или желания помочь, вы можете обратиться ко мне в любое время. Мой создатель - @ttimmur, он всегда готов помочь.');
    }
}

async function commandFloor(msg) {
    const floorId = await getFloorPrice();
    const infoEarth = await getInfoEarth(floorId);
    const attributes = await msgBotAttributes(floorId);
    const rarity = await conclusionRarity(floorId);
    await bot.sendMessage(msg.chat.id, `Цена данной земли равна:\n${infoEarth.usdPrice}USD(${infoEarth.ethPrice}ETH)`)
            await bot.sendPhoto(msg.chat.id, infoEarth.image)
            await bot.sendMessage(msg.chat.id, `${attributes}`)
            await bot.sendMessage(msg.chat.id, `Оценка: ${rarity}`,{
                reply_markup: {
                    keyboard: [
                        ['Самая дешевая земля', 'Найти землю по ID'],
                        ['Инструкция','Обратная связь']
                    ],
                    resize_keyboard: true
                }
            });
}

async function commandSearch(msg) {
    await bot.sendMessage(msg.chat.id, 'Введите ID земли',{
        reply_markup: {
          remove_keyboard: true,
        },
      });
    moreInfo = true;

    if (currentQueryHandler) {
        bot.removeListener('text', currentQueryHandler);
    }

    currentQueryHandler = async (msg) => {
        if (msg.text.length >= 3 && moreInfo && /^\d+$/.test(msg.text)) {
            moreInfo = false;
            const infoEarth = await getInfoEarth(msg.text);
            const attributes = await msgBotAttributes(msg.text);
            const rarity = await conclusionRarity(msg.text);

            await bot.sendMessage(msg.chat.id, `Цена данной земли равна:\n${infoEarth.usdPrice}USD(${infoEarth.ethPrice}ETH)`)
            await bot.sendPhoto(msg.chat.id, infoEarth.image)
            await bot.sendMessage(msg.chat.id, `${attributes}`)
            await bot.sendMessage(msg.chat.id, `Оценка: ${rarity}`,{
                reply_markup: {
                    keyboard: [
                        ['Самая дешевая земля', 'Найти землю по ID'],
                        ['Инструкция','Обратная связь']
                    ],
                    resize_keyboard: true
                }
            });
        }
    };

    bot.on('text', currentQueryHandler);
}


bot.on('text', async (msg) => {
    let tokenID = msg.text
    let time = timeConverter(msg.date)
    console.log(`пользователь @${msg.chat.username} отправил сообщение ${tokenID} в ${time} `)
    // getUser(msg)
    startCommand(msg);
});
