import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Divice_Base_Info = dbREG.define<any>(
    "tdx_device_base_info",
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
            unique:true
        },
        group_id: {
            type: DataTypes.INTEGER,
            unique:true
        },
        device_key: {
            type: DataTypes.STRING(24),
            allowNull: false,
            unique:true
        },
        name: {
            type: DataTypes.STRING(65),
        },
        logo_uri: {
            type: DataTypes.STRING(255),
        },
        current_version_id: {
            type: DataTypes.INTEGER,
        },
        current_version_name: {
            type: DataTypes.STRING(16),
        },
        person_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        face_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        disk_space: {
            type: DataTypes.BIGINT,
        },
        ip: {
            type: DataTypes.STRING(15),
        },
        last_active_time: {
            type: DataTypes.DATE,
        },
        is_online: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        direction: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: false,
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
            defaultValue: 0
        }
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
    }
);

export default Divice_Base_Info;
