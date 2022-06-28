"use strict";
const fs = require('fs');
const request = require('request');
const download = function (uri, filename, callback) {
    try {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    }
    catch (error) {
        console.log("☢☣☢ 🧟‍♂️ ☣☢☣ ~ file: image-downloader.ts ~ line 9 ~ download ~ error", error);
    }
};
module.exports = {
    download
};
//# sourceMappingURL=image-downloader.js.map