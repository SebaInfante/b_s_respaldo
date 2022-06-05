"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Pass_Record = connectionResgisters_1.default.define("tdx_pass_record", {
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
    device_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    device_key: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false
    },
    person_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    person_type: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    },
    img_uri: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    id_card: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    attach: {
        type: sequelize_1.DataTypes.STRING,
    },
    direction: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    },
    pass_type: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false
    },
    temperature: {
        type: sequelize_1.DataTypes.STRING(8),
    },
    temperature_state: {
        type: sequelize_1.DataTypes.SMALLINT,
    },
    mask_state: {
        type: sequelize_1.DataTypes.SMALLINT,
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
    },
    sub_pass_type: {
        type: sequelize_1.DataTypes.STRING(32),
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
            fields: ['device_key']
        },
        {
            unique: false,
            fields: ['person_id']
        },
    ]
});
exports.default = Pass_Record;
//# sourceMappingURL=Pass_Record.js.map