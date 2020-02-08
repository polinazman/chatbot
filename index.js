var TelegramBot = require("node-telegram-bot-api"),
	telegram = new TelegramBot("892772497:AAH2dQzRHp9kKBPGw7bBtWygbcmTx7Gf6jM", { polling: true });

telegram.on("text", (message) => {
	telegram.sendMessage(message.chat.id, "Hello world");
});