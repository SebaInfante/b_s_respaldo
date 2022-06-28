"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.recoveryAccount = exports.validacionToken = exports.login = void 0;
const bcrypt_1 = require("../lib/bcrypt");
const jsonwebtoken_1 = require("../lib/jsonwebtoken");
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = __importDefault(require("../models/user"));
const { QueryTypes } = require("sequelize");
// ************************************************************************************************************************
// !                                                     LOGIN
// ************************************************************************************************************************
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //Confirmar email y status
        console.log(email);
        console.log(password);
        const user = yield user_1.default.findOne({ where: { email } });
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
        const validPassword = yield (0, bcrypt_1.desencriptar)(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: "V Username or password do not match" });
        }
        console.log('valiacion');
        const token = yield (0, jsonwebtoken_1.generarJWT)(user.id);
        res.json({ user, token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Contact the administrator" });
    }
});
exports.login = login;
// ************************************************************************************************************************
// !                                                     VALIDACIÓN DE TOKEN
// ************************************************************************************************************************
const validacionToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.header("Authorization");
    if (!token) {
        token = req.body.token;
    }
    const secretKey = process.env.SECRETTOPRIVATEKEY;
    try {
        if (!token) {
            return res.status(401).json({ msg: "No hay token en la petición" });
        }
        const payload = jsonwebtoken_2.default.verify(token, secretKey);
        const userAuth = yield user_1.default.findByPk(payload.uid); //Aqui tengo el usuario
        if (!userAuth) {
            return res.status(401).json({ msg: "Token no valido" });
        }
        if (userAuth.deleted_flag == 1) {
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
    }
    catch (e) {
        res.status(401).json({ msg: "Token no valido" });
        console.log(e);
    }
});
exports.validacionToken = validacionToken;
// ************************************************************************************************************************
// !                                                     RECUPERAR CUENTA
// ************************************************************************************************************************
const recoveryAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_1.default.findOne({ where: { email } });
    console.log("Correo a recuperar para el usuario", user);
    if (!user) {
        return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }
    else {
        const token = yield (0, jsonwebtoken_1.generarJWT)(user.id);
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.office365.com",
            port: 587,
            auth: {
                user: process.env.EMAIL_RECOVERY,
                pass: process.env.PASSW_RECOVERY,
            },
        });
        let mailOption = yield transporter.sendMail({
            from: '"Equipo Auditar" <aisense_bot@aisense.cl>',
            to: email,
            subject: "Recovery Password - SmartBoarding",
            html: `
        <h1>Sistema de recuperación de contraseñas</h1>
        <p>Usted solicito una recuperación de contraseña desde el sitio www.smartboarding.cl. <br> Para recuperar su contraseña ingrese al siguiente link y genere una nueva contraseña</p>
        
        <small>http://66.94.105.200/recoveryAccount/${token}</small>
        </br>
        <a href="http://66.94.105.200/recoveryAccount/${token}">Recuperar contraseña</a>

        `, // html body
        });
        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                res.status(500).send(error.message);
            }
            else {
                console.log("Email enviado");
                res.status(200).json(req.body);
            }
        });
        return res
            .status(200)
            .json({ mensaje: "Se envió un correo de recuperación", estado: "ok" });
    }
});
exports.recoveryAccount = recoveryAccount;
// ************************************************************************************************************************
// !                                                     CAMBIAR CONTRASEÑA
// ************************************************************************************************************************
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const password = req.body.password;
    const secretKey = process.env.SECRETTOPRIVATEKEY;
    if (!token) {
        return res.status(401).json({ msg: "No hay token en la petición" });
    }
    try {
        const payload = jsonwebtoken_2.default.verify(token, secretKey);
        const userAuth = yield user_1.default.findByPk(payload.uid);
        if (!userAuth) {
            return res.status(401).json({ msg: "Token no valido" });
        }
        if (userAuth.deleted_flag == 1) {
            return res.status(401).json({ msg: "Token no valido" });
        }
        const newPassword = yield (0, bcrypt_1.encriptar)(password);
        yield user_1.default.update({ password: newPassword }, {
            where: {
                id: userAuth.id
            }
        });
        return res.status(200).json({ msg: "Cambio de contraseña exitoso" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Contacte a la administración" });
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=auth.js.map