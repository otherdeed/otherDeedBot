import {startCommand} from './msgBot.js'
import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot('7171580107:AAFqiIAXr_WkZheoOjjFrSowRsa9wLTdQpc', {
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
bot.on('polling_error', (err) => {
    console.log(err.data.error.message)
});
bot.on('message', (msg)=>{
    startCommand(msg)
})