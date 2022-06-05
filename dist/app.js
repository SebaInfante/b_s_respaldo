"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
dotenv_1.default.config(); //Habilito el dotenv en la app
const server = new server_1.default(); //Instancio el server
server.listen(); //Ejecuto el server
//# sourceMappingURL=app.js.map