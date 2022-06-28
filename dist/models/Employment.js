"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Employment = connectionResgisters_1.default.define("tdx_employment", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    mandante: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employment: {
        type: sequelize_1.DataTypes.STRING,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    deleted_flag: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, { createdAt: false,
    updatedAt: false,
    freezeTableName: true,
});
exports.default = Employment;
//# sourceMappingURL=Employment.js.map