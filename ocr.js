function increaseContrast(){
	const { createWorker } = require('tesseract.js');
	const fs = require('fs');
	const worker = createWorker();
	const Jimp = require('jimp');
	const url = "https://cloud.githubusercontent.com/assets/2920003/19339892/a692cd96-9143-11e6-83de-282cc8416256.jpg";

	Jimp.read(url)
		.then(image => {
			image.greyscale()
				.contrast(+1)
				.normalize()
				.write("img.jpg");
			if (fs.existsSync("img.jpg")) {
				fs.unlinkSync("img.jpg");
				console.log("done");
			} else {
				console.log("saved");
			}
		})
		.catch(error => {
			console.error(error);
		});
	
}