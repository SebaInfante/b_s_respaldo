"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Divice_Base_Info = connectionResgisters_1.default.define("tdx_device_base_info", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    site_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    group_id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true
    },
    device_key: {
        type: sequelize_1.DataTypes.STRING(24),
        allowNull: false,
        unique: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(65),
    },
    logo_uri: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    current_version_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    current_version_name: {
        type: sequelize_1.DataTypes.STRING(16),
    },
    person_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    face_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    disk_space: {
        type: sequelize_1.DataTypes.BIGINT,
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(15),
    },
    last_active_time: {
        type: sequelize_1.DataTypes.DATE,
    },
    is_online: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
    },
    direction: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
    },
    create_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    update_time: {
        type: sequelize_1.DataTypes.DATE,
    },
    create_user: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
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
});
exports.default = Divice_Base_Info;
//# sourceMappingURL=Device_Base_Info.js.map