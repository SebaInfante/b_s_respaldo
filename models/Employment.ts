import { DataTypes } from "sequelize";
import db from "../db/connectionResgisters";

const Employment = db.define<any>(
    "tdx_employment",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement:true
        },
        mandante: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        employee: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        employment: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        deleted_flag: {
            type: DataTypes.BOOLEAN,
        },
    },
    {   createdAt: false,
        updatedAt: false,
        freezeTableName: true,
    }
);

export default Employment;
