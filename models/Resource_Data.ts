import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Resource_Data = dbREG.define<any>(
    "tdx_resource_data",
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
        resource_url: {
            type: DataTypes.STRING(255),
        },
        resource_alias: {
            type: DataTypes.STRING(2255),
        },
        resource_type: {
            type: DataTypes.SMALLINT,
            allowNull:false
        },
        resource_size: {
            type: DataTypes.INTEGER,
        },
        resource_dimensions: {
            type: DataTypes.STRING(16),
        },
        resource_date: {
            type: DataTypes.STRING,
        },
        suffix : {
            type: DataTypes.STRING(10),
        },
        is_display : {
            type: DataTypes.TINYINT,
            defaultValue:1,
            allowNull:false
        },
        video_cover_id  : {
            type: DataTypes.STRING,
        },
        resource_m_url   : {
            type: DataTypes.STRING(255),
        },
        resource_c_rul    : {
            type: DataTypes.STRING(255),
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
        },
        update_user: {
            type: DataTypes.STRING(64),
        },
        deleted_flag: {
            type: DataTypes.TINYINT,
            defaultValue:0,
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
                }
            ]
    }
);

export default Resource_Data;
