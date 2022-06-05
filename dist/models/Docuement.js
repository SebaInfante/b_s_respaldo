"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
//Colcar las columnas de la bd que se actualizan en este caso el id no va porque es autoincrementable
const Document = connectionResgisters_1.default.define("tdx_document", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_employment: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    deleted_flag: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    freezeTableName: true,
});
exports.default = Document;
//# sourceMappingURL=Docuement.js.map