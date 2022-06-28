import { NextFunction, Request, Response } from "express";
import { desencriptar, encriptar } from "../lib/bcrypt";
import { generarJWT } from "../lib/jsonwebtoken";

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/user";
const { QueryTypes } = require("sequelize");

// ************************************************************************************************************************
// !                                                     LOGIN
// ************************************************************************************************************************
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    //Confirmar email y status

    console.log(email);
    console.log(password);
    
    const user = await User.findOne({ where: { email } });


    // const user:any = await User.sequelize?.query(
    //   `SELECT * FROM [tdx_users] WHERE email = '${email}' AND deleted_flag = 0`,
    //   { type: QueryTypes.SELECT }
    // ) || "";


    if (!user) {
      return res.status(400).json({ msg: "E Username or password do not match" });
    }


//Confirmar eliminación
// if (user.deleted_flag==1) {
//   return res.status(400).json({ msg: "P Username or password do not match" });
// }
// console.log('eliminacion');

//Confirmar password
const validPassword = await desencriptar(password, user.password);
if (!validPassword) {
  return res.status(400).json({ msg: "V Username or password do not match" });
}
console.log('valiacion');

    const token = await generarJWT(user.id);

    res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Contact the administrator" });
  }
};

// ************************************************************************************************************************
// !                                                     VALIDACIÓN DE TOKEN
// ************************************************************************************************************************
export const validacionToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");
  if (!token) {
    token = req.body.token;
  }
  const secretKey = process.env.SECRETTOPRIVATEKEY!;
  try {
    if (!token) {
      return res.status(401).json({ msg: "No hay token en la petición" });
    }
    const payload: any = jwt.verify(token, secretKey);
    const userAuth: any = await User.findByPk(payload.uid); //Aqui tengo el usuario
    if (!userAuth) {
      return res.status(401).json({ msg: "Token no valido" });
    }
    if (userAuth.deleted_flag==1) {
      return res.status(401).json({ msg: "Token no valido" });
    }

    switch (userAuth.role) {
      case "ADM":
        return res.status(200).json({ token, role: "ADM" });
        break;
      case "USM":
        return res.status(200).json({ token, role: "USM" });
        break;
      case "USC":
        return res.status(200).json({ token, role: "USC" });
        break;
      default:
        return res.status(401).json({ msg: "Token no valido" });
        break;
    }
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token no valido" });
    console.log(e);
  }
};
// ************************************************************************************************************************
// !                                                     RECUPERAR CUENTA
// ************************************************************************************************************************
export const recoveryAccount = async (req: Request, res: Response) => {
  const email = req.body.email;
  const user = await User.findOne({ where: { email } });

  console.log("Correo a recuperar para el usuario", user);

  if (!user) {
    return res.status(400).json({ mensaje: "Usuario no encontrado" });
  } else {
    const token = await generarJWT(user.id);

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_RECOVERY,
        pass: process.env.PASSW_RECOVERY,
      },
    });

    let mailOption = await transporter.sendMail({
      from: '"Equipo Auditar" <aisense_bot@aisense.cl>', // sender address
      to: email, // list of receivers
      subject: "Recovery Password - SmartBoarding", // Subject line
      html: `
        <h1>Sistema de recuperación de contraseñas</h1>
        <p>Usted solicito una recuperación de contraseña desde el sitio www.smartboarding.cl. <br> Para recuperar su contraseña ingrese al siguiente link y genere una nueva contraseña</p>
        
        <small>http://66.94.105.200/recoveryAccount/${token}</small>
        </br>
        <a href="http://66.94.105.200/recoveryAccount/${token}">Recuperar contraseña</a>

        `, // html body
    });

    transporter.sendMail(mailOption, (error: any, info: any) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        console.log("Email enviado");
        res.status(200).json(req.body);
      }
    });

    return res
      .status(200)
      .json({ mensaje: "Se envió un correo de recuperación", estado: "ok" });
  }
};
// ************************************************************************************************************************
// !                                                     CAMBIAR CONTRASEÑA
// ************************************************************************************************************************
export const changePassword = async (req: Request, res: Response) => {
    const token = req.params.token;
    const password = req.body.password;
    const secretKey = process.env.SECRETTOPRIVATEKEY!;

    if (!token) {
        return res.status(401).json({ msg: "No hay token en la petición" })}

try {
    const payload: any = jwt.verify(token, secretKey);
    const userAuth: any = await User.findByPk(payload.uid);

    if (!userAuth) {
        return res.status(401).json({ msg: "Token no valido" });
    }
    if (userAuth.deleted_flag == 1) {
        return res.status(401).json({ msg: "Token no valido" });
    }
    const newPassword = await encriptar(password)

    
    await User.update({ password: newPassword }, {
        where: {
            id: userAuth.id
        }
    });
    return res.status(200).json({msg:"Cambio de contraseña exitoso"});  
} catch (error) {
    return res.status(500).json({msg:"Contacte a la administración"});  
}
};
