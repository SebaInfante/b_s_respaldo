import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

//Colcar las columnas de la bd que se actualizan en este caso el id no va porque es autoincrementable
const Employment = dbREG.define<any>(
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
        deleted_flag: {
        type: DataTypes.BOOLEAN,
        },
    },
    {
        freezeTableName: true,
    }
);

export default Employment;
