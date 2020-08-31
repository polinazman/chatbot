const TelegramBot = require('telegraf');
const TOKEN = require('./TOKEN.js');
const options = {
    webHook: {
        port: process.env.PORT
    }
};
const url = "https://polinazman.com/chatbot.html";
const bot = new TelegramBot(TOKEN, options);
const fetch = require("node-fetch");
const fs = require('fs');
const Jimp = require('jimp');
const Tesseract = require('tesseract.js');

const trigger1 = "Домофон Этаж Кв./офис";
const trigger2 = "Заказ";
const re1 = new RegExp(trigger1, "i");
const re2 = new RegExp(trigger2, "i");
let downloadlink = "";
let fromUser = "";

bot.on("sticker", (ctx) => ctx.reply("\u{1F300}"));

bot.hears(/цк/i, (ctx) => ctx.deleteMessage(ctx.chatId, ctx.messageId));

bot.on("photo", (ctx) => {
	let fileId = ctx.message.photo[2].file_id;
	const tgLink = "https://api.telegram.org/bot"+TOKEN+"/getFile?file_id="+fileId;

	fetch(tgLink)
	.then((response) => {
		return response.json();
	})
	.then(jsonArray => {
		let filepath = jsonArray.result.file_path;
		downloadlink = "https://api.telegram.org/file/bot"+TOKEN+"/"+filepath;

	Jimp.read(downloadlink)
		.then(image => {
			image.greyscale()
				.brightness(+0.3)
				.contrast(+1)
				.write("img.jpg");

		Tesseract.recognize(
			  'img.jpg',
			  'rus',
			  { logger: m => console.log(m) }
			).then(({ data: { text } }) => {
			  console.log(text);

				if ((text.match(re1) || text.match(re2))) {
					ctx.deleteMessage(ctx.chatId, ctx.messageId);
					ctx.reply("Такое тут нельзя");

					fromUser = ctx.from.username;
					updateSheet();
					deleteImg();
				} else {
					deleteImg();
				}
			})
		})
		.catch(error => {
			console.error(error);
		});
	});
});


function updateSheet() {
	const {google} = require('googleapis');
	const keys = require('./hazel-sphinx-272007-1f1e4067201a.json');

	const client = new google.auth.JWT(
		keys.client_email,
		null,
		keys.private_key,
		['https://www.googleapis.com/auth/spreadsheets']
	);

	client.authorize(function(err, tokens){

		if (err){
			conslog.log(err);
			return;
		} else {
			gsrun(client);
		}
	});

	async function gsrun(client){
		const gsapi = google.sheets({version:'v4', auth: client });

		const  options = {
			spreadsheetId: '1nH3w9owqwhDjL1Ht_8FW8VZQjIQ7Pgy-Ygw02HvR8YA',
			range: 'Ark 1!A1:A100',
			majorDimension: 'COLUMNS'
		};

		let data = await gsapi.spreadsheets.values.get(options);
		let dataArray = data.data.values;
		let newDataArray = {
			spreadsheetId: '1nH3w9owqwhDjL1Ht_8FW8VZQjIQ7Pgy-Ygw02HvR8YA',
			range: 'Ark 1!A1',
			valueInputOption: 'USER_ENTERED',
			resource: {values: [[fromUser]]}
		}

		let res = await gsapi.spreadsheets.values.append(newDataArray);
	};	
};

function deleteImg() {
	if (fs.existsSync("img.jpg")) {
				fs.unlinkSync("img.jpg");
				console.log("done");
	} else {
		console.log("saved");
	}
};

bot.launch();