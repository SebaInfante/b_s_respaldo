"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionResgisters_1 = __importDefault(require("../db/connectionResgisters"));
const Employee_Group = connectionResgisters_1.default.define("tdx_employee_group", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    site_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
    },
    parent_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    sort_num: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    lft: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rgt: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    is_default: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    create_time: {
        type: sequelize_1.DataTypes.DATE,
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
    indexes: [
        {
            unique: false,
            fields: ['site_id']
        },
        {
            unique: false,
            fields: ['lft']
        },
        {
            unique: false,
            fields: ['rgt']
        },
    ]
});
exports.default = Employee_Group;
//# sourceMappingURL=Employee_Group.js.map