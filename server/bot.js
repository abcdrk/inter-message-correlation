import { Telegraf } from 'telegraf';
import axios from 'axios';

const telegram_token = '7148609687:AAH86dzb8dX0Z7Xm4UlHybccncLo2cmIUm0';
const bot = new Telegraf(telegram_token);
const orderRecievedUrl = "https://lehre.bpm.in.tum.de/ports/5858/engine/orderRecieved";
const cpeeEngineUrl = "https-get://cpee.org/ing/correlators/message/receive/";

/**
 * Greeting & list the menu in the start.
 */
bot.start((ctx) => {
    ctx.reply("Welcome to the Cocktailbot. What would you like to to order?\nPlease only put in the drink name: after /order");
});


/**
 * ORDER ACTION
 */
bot.command('order', (ctx) => {
    let body =  {
        _id: `No order id yet.`,
        drink_name: ctx.payload,
        customer_name: ctx.update.message.from.first_name,
        order_time: new Date(),
        update_info: ctx.update
    };
    console.log("Got new order request.");
    axios.post(
        orderRecievedUrl, 
        body
    )
    .then((res) => {
        // SHOULD SEND THIS ORDER TO CPEE CORRELATOR
        ctx.reply('Drink ordered recieved!\nYou will be notified when it\'s preparing.');
    })
    .catch(error => {
        console.error(error);
        ctx.reply('Could not order the cocktail.');
    });
})

/**
 * HELP COMMAND LIST
 */
bot.help((ctx) => {
    ctx.reply(`This bot can help you order cocktails!
    The commands are:
    - /start
    - /help
    `)
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))