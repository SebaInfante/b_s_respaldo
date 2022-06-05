"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Resource_Data = connectionResgisters_1.default.define("tdx_resource_data", {
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
    resource_url: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    resource_alias: {
        type: sequelize_1.DataTypes.STRING(2255),
    },
    resource_type: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    },
    resource_size: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    resource_dimensions: {
        type: sequelize_1.DataTypes.STRING(16),
    },
    resource_date: {
        type: sequelize_1.DataTypes.STRING,
    },
    suffix: {
        type: sequelize_1.DataTypes.STRING(10),
    },
    is_display: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false
    },
    video_cover_id: {
        type: sequelize_1.DataTypes.STRING,
    },
    resource_m_url: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    resource_c_rul: {
        type: sequelize_1.DataTypes.STRING(255),
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
    },
    update_user: {
        type: sequelize_1.DataTypes.STRING(64),
    },
    deleted_flag: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false
    }
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
exports.default = Resource_Data;
//# sourceMappingURL=Resource_Data.js.map