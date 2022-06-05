"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.desencriptar = exports.encriptar = void 0;
const bcrypt = require('bcrypt');
const encriptar = (planePassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.hash(planePassword, 10);
});
exports.encriptar = encriptar;
const desencriptar = (planePassword, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(planePassword, hashPassword);
});
exports.desencriptar = desencriptar;
//# sourceMappingURL=bcrypt.js.map