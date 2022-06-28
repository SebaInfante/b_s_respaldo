import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Employee = dbREG.define<any>(
    "tdx_employee",
    {
        id_table: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull:false
        },
        id: {
            type: DataTypes.INTEGER,
            allowNull:true
        },
        site_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        person_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        group_id: {
            type: DataTypes.INTEGER,
        },
        gender: {
            type: DataTypes.SMALLINT,
            allowNull:false
        },
        phone: {
            type: DataTypes.STRING(32),
        },
        second_contact: {
            type: DataTypes.STRING(32),
        },
        email: {
            type: DataTypes.STRING(64),
        },
        birthday: {
            type: DataTypes.STRING,
        },
        entry_date: {
            type: DataTypes.STRING,
        },
        attendance_flag: {
            type: DataTypes.TINYINT,
            defaultValue:0,
            allowNull:false
        },
        attendance_rule_id: {
            type: DataTypes.INTEGER,
        },
        device_group_ids: {
            type: DataTypes.STRING(255),
        },
        temperature_alarm: {
            type: DataTypes.TINYINT,
            allowNull:false
        },
        notice_email_list: {
            type: DataTypes.STRING(512),
        },
        vaccination: {
            type: DataTypes.INTEGER,
        },
        vaccination_time: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING(64),
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull:false
        },
        update_time: {
            type: DataTypes.STRING,
        },
        create_user: {
            type: DataTypes.STRING(64),
            allowNull:false
        },
        update_user: {
            type: DataTypes.STRING(64),
        },
        deleted_flag: {
            type: DataTypes.TINYINT,
            defaultValue: 0 ,
            allowNull:false
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
                fields:['group_id']
                },
            ]
    }
);

export default Employee;
