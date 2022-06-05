import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Pass_Record = dbREG.define<any>(
    "tdx_pass_record",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull:false
        },
        site_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        device_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        device_key: {
            type: DataTypes.STRING(32),
            allowNull:false
        },
        person_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        person_type: {
            type: DataTypes.SMALLINT,
            allowNull:false
        },
        img_uri: {
            type: DataTypes.STRING(255),
        },
        id_card: {
            type: DataTypes.STRING(255),
        },
        attach: {
            type: DataTypes.STRING,
        },
        direction: {
            type: DataTypes.SMALLINT,
            allowNull:false
        },
        pass_type: {
            type: DataTypes.STRING(32),
            allowNull:false
        },
        temperature: {
            type: DataTypes.STRING(8),
        },
        temperature_state: {
            type: DataTypes.SMALLINT,
        },
        mask_state: {
            type: DataTypes.SMALLINT,
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
            allowNull:false,
            defaultValue:0
        },
        sub_pass_type: {
            type: DataTypes.STRING(32),
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
                fields:['device_key']
                },
                {
                unique: false,
                fields:['person_id']
                },
            ]
    }
);

export default Pass_Record;
