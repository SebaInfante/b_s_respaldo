import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Person_Photo = dbREG.define<any>(
    "tdx_person_photo",
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
        person_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        resource_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        status: {
            type: DataTypes.SMALLINT,
            allowNull:false
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
                fields:['person_id']
                },
            ]
    }
);

export default Person_Photo;
