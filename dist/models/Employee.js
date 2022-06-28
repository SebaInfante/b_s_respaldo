"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Employee = connectionResgisters_1.default.define("tdx_employee", {
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
    person_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    group_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    gender: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(32),
    },
    second_contact: {
        type: sequelize_1.DataTypes.STRING(32),
    },
    email: {
        type: sequelize_1.DataTypes.STRING(64),
    },
    birthday: {
        type: sequelize_1.DataTypes.STRING,
    },
    entry_date: {
        type: sequelize_1.DataTypes.STRING,
    },
    attendance_flag: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false
    },
    attendance_rule_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    device_group_ids: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    temperature_alarm: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    },
    notice_email_list: {
        type: sequelize_1.DataTypes.STRING(512),
    },
    vaccination: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    vaccination_time: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(64),
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
        },
        {
            unique: false,
            fields: ['group_id']
        },
    ]
});
exports.default = Employee;
//# sourceMappingURL=Employee.js.map