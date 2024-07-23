const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('7171580107:AAFqiIAXr_WkZheoOjjFrSowRsa9wLTdQpc', {
    polling: {
        interval: 300,
        autoStart: true
    }
});
bot.on("polling_error", err => {
    if (err && err.data && err.data.error) {
        console.log(err.data.error.message);
    } else {
        console.error('Произошла ошибка при опросе:', err);
    }
});
const commands = [{
        command: "floor",
        description: "Floor price Otherdeed"
    },
    {
        command: "search",
        description: "Otherdeed information by tokenId"
    },
    {
        command: "info",
        description: "Documentation"
    }

]
bot.setMyCommands(commands);


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

async function calculateRarity(id) {
    let infoEarth = await filterEarthAttributes(id);
    const fs = require('fs').promises;
    var filePath = '/Users/new/Desktop/Otherdeed/Attributes.json'
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
        return 'На данный момент бот не уммет считать редкость земли с Артефактом 😔';
    }
    if (infoEarth.koda == true) {
        return 'На данный момент бот не уммет считать редкость земли с Koda 😔';
    }
    if (k < 0.06) {
        return 'Эта цена сильно ниже рыночной';
    } else if (k >= 0.06 && k < 0.09) {
        return 'Эта цена ниже рыночной';
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

async function informationAtAFloorPrice(count) {
    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
        }
    };
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&sortBy=floorAskPrice&limit=10&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    const data = await response.json()
    const dataInfo = data.tokens[count].token.tokenId
    return dataInfo
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

function keyboardButtons(id) {
    const keyboard = [
        [{
            text: 'Показать атрибуты',
            callback_data: 'attributes'
        }],
        [{
            text: 'Показать оценку редкости',
            callback_data: 'rarity'
        }],
        [{
            text: 'Купить землю',
            url: `https://magiceden.io/collections/ethereum/otherdeed?evmItemDetailsModal=1~0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258~${id}`
        }],
        [{
            text: 'Показать следующую землю',
            callback_data: 'next'
        }]

    ]
    return keyboard
}
const BackKeyboard = [
    [{
        text: 'Назад',
        callback_data: 'back'
    }],
]
const startKeyboard = [
    [{
        text: 'Самая дешевая земля',
        callback_data: 'startFloor'
    }],
    [{
        text: 'Найти землю по ID',
        callback_data: 'startSearch'
    }],
    [{
        text: 'Почитать инструкцию',
        callback_data: 'startDocumentation'
    }],
]

function deleteKeyboard(id) {
    let keyboard = keyboardButtons(id)
    keyboard = keyboard.filter(item => item[0].callback_data != 'next')
    return keyboard
}

let lastMessageId = null;
let moreInfo = false
let count = 0
let hasBeenCalled = false;
async function commnandFloor(msg) {
    if (msg.text == '/floor') {
        if (lastMessageId) {
            await bot.deleteMessage(msg.chat.id, lastMessageId);
        }
        const dataInfo = await informationAtAFloorPrice(count)
        const infoEarth = await getInfoEarth(dataInfo)
        const Keyboard = keyboardButtons(dataInfo)
        const sentMessage = await bot.sendMessage(msg.chat.id, `${infoEarth.image}\nЦена земли равна:\n${infoEarth.usdPrice}USD(${infoEarth.ethPrice}ETH)`, {
            reply_markup: {
                inline_keyboard: Keyboard
            }
        });
        lastMessageId = sentMessage.message_id;
        bot.on('callback_query', async (query) => {
            if (query.data === 'attributes') {
                if (lastMessageId) {
                    await bot.deleteMessage(msg.chat.id, lastMessageId);
                }
                const backMessage = await bot.sendMessage(msg.chat.id, `${attributes}`, {
                    reply_markup: {
                        inline_keyboard: BackKeyboard
                    }
                });
                lastMessageId = backMessage.message_id;
            }
            if (query.data === 'rarity') {
                const rarity = await conclusionRarity(msg.text);
                if (lastMessageId) {
                    await bot.deleteMessage(msg.chat.id, lastMessageId);
                }
                const backMessage = await bot.sendMessage(msg.chat.id, `Редкость: ${rarity}`, {
                    reply_markup: {
                        inline_keyboard: BackKeyboard
                    }
                });
                lastMessageId = backMessage.message_id;
            }
            if (query.data === 'back') {
                if (lastMessageId) {
                    await bot.deleteMessage(msg.chat.id, lastMessageId);
                }
                const sentMessage = await bot.sendMessage(msg.chat.id, `${infoEarth.image}\nЦена земли равна:\n${infoEarth.usdPrice}USD(${infoEarth.ethPrice}ETH)`, {
                    reply_markup: {
                        inline_keyboard: Keyboard
                    }
                });
                lastMessageId = sentMessage.message_id;
            }
        })
    }
}
async function deleteLastMessage(chatId) {
    if (lastMessageId) {
        try {
            await bot.deleteMessage(chatId, lastMessageId);
        } catch (error) {
            console.error('Ошибка удаления сообщения:', error.message);
        }
    }
}
async function commandStart(msg) {
    if (msg.text === '/start') {
        await deleteLastMessage(msg.chat.id);
        const startMessage = await bot.sendMessage(msg.chat.id, 'Привет! Это бот, который поможет тебе найти самую землю в Otherside. Какую операцию хочешь выполнить?', {
            reply_markup: {
                inline_keyboard: startKeyboard
            }
        });
        lastMessageId = startMessage.message_id;
    }
}

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    await deleteLastMessage(chatId);

    if (query.data === 'startSearch') {
        const idValue = await bot.sendMessage(chatId, 'введите ID земли');
        lastMessageId = idValue.message_id;
        moreInfo = true;
    }

    bot.on('message', async msg => {
        if (moreInfo && msg.text.length === 5 && /^\d+$/.test(msg.text) && msg.text.charAt(0) !== '/') {
            moreInfo = false;  // Предотвращение повторного срабатывания обработчика

            let infoEarth = await getInfoEarth(msg.text);
            let attributes = await msgBotAttributes(msg.text);
            let rarity = await conclusionRarity(msg.text);
            let Keyboard = deleteKeyboard(msg.text);

            await deleteLastMessage(chatId);

            let sentMessage = await bot.sendMessage(chatId, `${infoEarth.image}\nЦена земли равна:\n${infoEarth.usdPrice}USD(${infoEarth.ethPrice}ETH)`, {
                reply_markup: {
                    inline_keyboard: Keyboard
                }
            });
            lastMessageId = sentMessage.message_id;

            bot.on('callback_query', async (query) => {
                await deleteLastMessage(chatId);

                if (query.data === 'attributes') {
                    let backMessage = await bot.sendMessage(chatId, `${attributes}`, {
                        reply_markup: {
                            inline_keyboard: BackKeyboard
                        }
                    });
                    lastMessageId = backMessage.message_id;
                }
                if (query.data === 'rarity') {
                    let backMessage = await bot.sendMessage(chatId, `Редкость: ${rarity}`, {
                        reply_markup: {
                            inline_keyboard: BackKeyboard
                        }
                    });
                    lastMessageId = backMessage.message_id;
                }
                if (query.data === 'back') {
                    let sentMessage = await bot.sendMessage(chatId, `${infoEarth.image}\nЦена земли равна:\n${infoEarth.usdPrice}USD(${infoEarth.ethPrice}ETH)`, {
                        reply_markup: {
                            inline_keyboard: Keyboard
                        }
                    });
                    lastMessageId = sentMessage.message_id;
                }
            });
        }
    });
});

// Обработчик команды /start
bot.on('message', async msg => {
    await commandStart(msg);
});