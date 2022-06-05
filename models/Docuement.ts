import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

//Colcar las columnas de la bd que se actualizan en este caso el id no va porque es autoincrementable
const Document = dbREG.define<any>(
    "tdx_document",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement:true
        },
        id_employment: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deleted_flag: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        freezeTableName: true,
    }
);

export default Document;
