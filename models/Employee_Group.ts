import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Employee_Group = dbREG.define<any>(
    "tdx_employee_group",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull: false,
        },
        site_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
        },
        sort_num: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lft: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rgt: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_default: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue:0
        },
        create_time: {
            type: DataTypes.DATE,

        },
        update_time: {
            type: DataTypes.DATE,
        },
        create_user: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        update_user: {
            type: DataTypes.STRING(64),
        },
        deleted_flag: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue:0
        }
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        indexes:[
            {
                unique: false,
                fields:['site_id']
                },
                {
                unique: false,
                fields:['lft']
                },
                {
                unique: false,
                fields:['rgt']
                },
            ]
    }
);

export default Employee_Group;
