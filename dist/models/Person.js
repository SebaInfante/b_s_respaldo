"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Person = connectionResgisters_1.default.define("tdx_person", {
    id_table: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    site_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    person_no: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    type: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    id_card: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    expire_time: {
        type: sequelize_1.DataTypes.STRING,
    },
    remark: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    create_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    update_time: {
        type: sequelize_1.DataTypes.STRING,
    },
    create_user: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false
    },
    update_user: {
        type: sequelize_1.DataTypes.STRING(64),
    },
    deleted_flag: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    indexes: [
        {
            unique: false,
            fields: ['site_id']
        }
    ]
});
exports.default = Person;
//# sourceMappingURL=Person.js.map