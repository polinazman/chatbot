const Telegraf = require("telegraf");
const bot = new Telegraf("892772497:AAH2dQzRHp9kKBPGw7bBtWygbcmTx7Gf6jM");

bot.hears("hi", (ctx) => {
	return ctx.reply("Hey there");
});

bot.startPolling();