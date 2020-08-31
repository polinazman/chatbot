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

	const username = "Frediieeee";

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
			resource: {values: [[username]]}
		}

		let res = await gsapi.spreadsheets.values.append(newDataArray);
	};	