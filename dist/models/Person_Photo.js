"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Person_Photo = connectionResgisters_1.default.define("tdx_person_photo", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    site_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    person_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    resource_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    },
    create_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
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
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    indexes: [
        {
            unique: false,
            fields: ['site_id']
        },
        {
            unique: false,
            fields: ['person_id']
        },
    ]
});
exports.default = Person_Photo;
//# sourceMappingURL=Person_Photo.js.map