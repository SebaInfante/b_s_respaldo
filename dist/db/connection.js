"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv/config");
const host = process.env.BD_HOST || "";
const name = process.env.BD_NAME || "";
const user = process.env.BD_USER || "";
const pass = process.env.BD_PASSWORD || "";
const db = new sequelize_1.Sequelize(name, user, pass, {
    host,
    dialect: "mysql",
    logging: false
});
exports.default = db;
//# sourceMappingURL=connection.js.map