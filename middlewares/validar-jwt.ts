import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const validarJWT = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header("Authorization");
        const secretKey = process.env.SECRETTOPRIVATEKEY!
        if (!token) {return res.status(401).json({ msg: "No hay token en la petición" })}

        const payload:any = jwt.verify( token, secretKey );
        const userAuth:any = await User.findByPk(payload.uid);
        
        if(!userAuth){return res.status(401).json({msg: 'Token no valido'})}
        if(userAuth.deleted_flag==1){return res.status(401).json({msg: 'Token no valido'})}

        req.body.userAuth = userAuth;
        next();
        
    } catch (error) {
        res.status(401).json({ msg: "Token no valido" });
        console.log(error);
    }
};
