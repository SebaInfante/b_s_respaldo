"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv/config");
const host = process.env.BD_REG_HOST || "";
const name = process.env.BD_REG_NAME || "";
const user = process.env.BD_REG_USER || "";
const pass = process.env.BD_REG_PASSWORD || "";
const db = new sequelize_1.Sequelize(name, user, pass, {
    host,
    port: 1433,
    dialect: "mssql",
    logging: false,
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
    },
});
exports.default = db;
//# sourceMappingURL=connectionResgisters.js.map