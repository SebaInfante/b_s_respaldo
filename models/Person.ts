import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

const Person = dbREG.define<any>(
    "tdx_person",
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
        person_no: {
        type: DataTypes.STRING(64),
        allowNull:false,
        unique:true
        },
        type: {
        type: DataTypes.SMALLINT,
        allowNull:false
        },
        name: {
        type: DataTypes.STRING(128),
        allowNull:false
        },
        id_card: {
        type: DataTypes.STRING(255),
        },
        expire_time: {
        type: DataTypes.STRING,
        },
        remark: {
        type: DataTypes.STRING(255),
        },
        create_time: {
        type: DataTypes.DATE,
        allowNull:true
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
        defaultValue:0,
        allowNull:false
        },
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

export default Person;
