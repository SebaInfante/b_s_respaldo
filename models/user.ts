import { DataTypes } from "sequelize";
import dbREG from "../db/connectionResgisters";

//Colcar las columnas de la bd que se actualizan en este caso el id no va porque es autoincrementable
const User = dbREG.define<any>(
  "tdx_users",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    employee: {
      type: DataTypes.INTEGER,
    },
    deleted_flag: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;
