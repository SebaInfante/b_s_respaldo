import {Request, NextFunction,Response } from "express";


export const esAdminRole = (req:Request, res:Response, next:NextFunction) => {

    const userAuth = req.body.userAuth || '';
    if(!userAuth){return res.status(500).json({msg:'Se quiere verificar el role sin validar el token primero'})}

    const { role, name } = userAuth
    if(role !== 'ADM'){ res.status(401).json({msg:`${name} no es administrador`})};

    next()
}
export const esMandanteRole = (req:Request, res:Response, next:NextFunction) => {

    const userAuth = req.body.userAuth || '';
    if(!userAuth){return res.status(500).json({msg:'Se quiere verificar el role sin validar el token primero'})}

    const { role, name } = userAuth
    if(role !== 'USM'){ res.status(401).json({msg:`${name} no es administrador`})};

    next()
}

export const esAdminMandanteRole = (req:Request, res:Response, next:NextFunction) => {

    const userAuth = req.body.userAuth || '';
    if(!userAuth){return res.status(500).json({msg:'Se quiere verificar el role sin validar el token primero'})}

    const { role, name } = userAuth
    if(role !== 'USM' || role !== 'ADM'){ res.status(401).json({msg:`${name} no es administrador o mandante`})};

    next()
}
