import { Sequelize } from "sequelize/types"

export type role = 'ADM' | 'USM' | 'USC'

export interface iUser extends Sequelize{
    id?:any,
    name?:any,
    email?:any,
    password?:any,
    role?:any,
    employee?:any,
    status?:any,
    createdAt?:any,
    updatedAt?:any
    // id?:number,
    // name?:string,
    // email?:string,
    // password?:string,
    // role?:role,
    // employee?:number,
    // status?:boolean,
    // createdAt?:string,
    // updatedAt?:string
}