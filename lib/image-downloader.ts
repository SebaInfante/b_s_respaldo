const fs = require('fs');
const request = require('request');

const download = function(uri:any, filename:any, callback:any){
  try {
    request.head(uri, function(err:any, res:any, body:any){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback) });
  } catch (error) {
    console.log("☢☣☢ 🧟‍♂️ ☣☢☣ ~ file: image-downloader.ts ~ line 9 ~ download ~ error", error)
  }
};

module.exports = {
    download
};
