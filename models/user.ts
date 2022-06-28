import { DataTypes } from "sequelize";
import db from "../db/connectionResgisters";

//Colcar las columnas de la bd que se actualizan en este caso el id no va porque es autoincrementable
const User = db.define<any>(
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
  { createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

export default User;

