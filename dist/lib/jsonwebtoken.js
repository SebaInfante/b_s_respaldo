"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarJWT = (uid) => {
    return new Promise((resove, reject) => {
        const secretKey = process.env.SECRETTOPRIVATEKEY;
        const payload = { uid };
        jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '4h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo gener el token');
            }
            else {
                resove(token);
            }
        });
    });
};
exports.generarJWT = generarJWT;
//# sourceMappingURL=jsonwebtoken.js.map