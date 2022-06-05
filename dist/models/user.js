"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
//Colcar las columnas de la bd que se actualizan en este caso el id no va porque es autoincrementable
const User = connectionResgisters_1.default.define("tdx_users", {
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
    },
    employee: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    deleted_flag: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    freezeTableName: true,
});
exports.default = User;
//# sourceMappingURL=user.js.map