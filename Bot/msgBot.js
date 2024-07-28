import {getFloorPrice,getInfoEarth,msgBotAttributes,conclusionRarity} from './func.js'
import TelegramBot from 'node-telegram-bot-api' 
const bot = new TelegramBot('7171580107:AAFqiIAXr_WkZheoOjjFrSowRsa9wLTdQpc', {
    polling: {
        interval: 300,
        autoStart: true
    }
});
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
export async function startCommand(msg) {
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

