import { Response, Request } from "express";

const { QueryTypes } = require("sequelize");

import Pass_Record from "../models/Pass_Record";

import { restarDias, sumarDias } from "../utils/fecha";

const xl = require("excel4node");
import path from "path";
import { uuid } from "uuidv4";
// ************************************************************************************************************************
// !                                                ULTIMAS 1000 PASADAS / 2dias
// ************************************************************************************************************************

export const recordsToDay = async (req: Request, res: Response) => {
  const userAuth = req.body.userAuth;
  const name = req.body.name || "";
  const rut = req.body.rut || "";
  const intervalo = req.body.intervalo || 365;
  const initDate =
    req.body.fecha || new Date().toISOString().split("T", 1).toString();

  const fecha = new Date(initDate);
  const fechaActual = fecha.toISOString().split("T", 1).toString();
  const fechaAnterior = restarDias(fecha, intervalo).split("T", 1).toString();

  let temp = req.body.temp || "";
  let turno = req.body.turno || "";
  let contratista = req.body.contratista || "";
  console.log(contratista);
  console.log(temp);
  console.log(turno);

  let egroupName: string;
  if (contratista == "all") {
    contratista = "";
  }
  if (turno == "all") {
    turno = "";
  }
  if (temp == "all") {
    temp = "";
  }

  if (userAuth.role === "ADM" || userAuth.role === "USM") {
    !contratista ? (egroupName = "") : (egroupName = contratista);
  } else {
    egroupName = userAuth.name;
  }

  const resource =
    (await Pass_Record.sequelize?.query(
      `
                SELECT TOP 500  pass.id AS id, pass.create_time, egroup.name AS empresa,person.name, person.id_card,  data.resource_url ,pass.img_uri, pass.temperature, pass.temperature_state, pass.direction
                FROM (SELECT * FROM tdx_pass_record WHERE deleted_flag = 0) AS pass, 
                     (SELECT * FROM tdx_person WHERE deleted_flag = 0) AS person, 
                     (SELECT * FROM tdx_person_photo WHERE deleted_flag = 0) AS photo, 
                     (SELECT * FROM tdx_resource_data WHERE deleted_flag = 0) AS data, 
                     (SELECT * FROM tdx_employee_group WHERE deleted_flag = 0) AS egroup, 
                     (SELECT * FROM tdx_employee WHERE deleted_flag = 0) AS employee
                WHERE 
                    (
                    pass.person_id = person.id AND
                    pass.temperature_state LIKE '%${temp}%' AND
                    pass.direction LIKE '%${turno}%' AND
                    person.id = photo.person_id AND 
                    photo.resource_id = data.id AND 
                    person.id = employee.person_id AND 
                    employee.group_id = egroup.id AND
                    egroup.name LIKE '%${egroupName}%' AND
                    person.name LIKE '%${name}%' AND 
                    person.id_card LIKE '%${rut}%') AND 
                    pass.create_time BETWEEN '${fechaAnterior}' AND '${fechaActual}'
                ORDER BY pass.create_time DESC 

                `,
      { type: QueryTypes.SELECT }
    )) || "";
  return res.json(resource);
};

export const downloadReportRecords = async (req: Request, res: Response) => {
  console.log(req.body);
  
  try {
    const userAuth = req.body.userAuth;
  const name = req.body.name || "";
  const rut = req.body.rut || "";
  const intervalo = req.body.intervalo || 1000;
  const initDate =
    req.body.fecha || new Date().toISOString().split("T", 1).toString();

  const fecha = new Date(initDate);
  const fechaActual = fecha.toISOString().split("T", 1).toString();
  const fechaAnterior = restarDias(fecha, intervalo).split("T", 1).toString();

  let temp = req.body.temp || "";
  let turno = req.body.turno || "";
  let contratista = req.body.contratista || "";
  console.log(contratista);
  console.log(temp);
  console.log(turno);

  let egroupName: string;
  if (contratista == "all") {
    contratista = "";
  }
  if (turno == "all") {
    turno = "";
  }
  if (temp == "all") {
    temp = "";
  }

  if  (req.body.role === "ADM" || req.body.role === "USM") {
    !contratista ? (egroupName = "") : (egroupName = contratista);
  } else {
    console.log(userAuth);
    
    egroupName = userAuth.name;
  }

  const resource = await Pass_Record.sequelize?.query(
        `
                    SELECT TOP 10000 pass.create_time, egroup.name AS empresa,person.name, person.id_card,  data.resource_url ,pass.img_uri, pass.temperature, pass.temperature_state, pass.direction
                    FROM tdx_pass_record AS pass, tdx_person AS person, tdx_person_photo AS photo, tdx_resource_data AS data, tdx_employee_group AS egroup, tdx_employee AS employee
                    WHERE 
                        (pass.person_id = person.id AND
                        pass.temperature_state LIKE '%${temp}%' AND
                        pass.direction LIKE '%${turno}%' AND
                        person.id = photo.person_id AND 
                        person.deleted_flag = 0 AND
                        photo.resource_id = data.id AND 
                        person.id = employee.person_id AND 
                        employee.deleted_flag = 0 AND
                        employee.group_id = egroup.id AND
                        egroup.name LIKE '%${egroupName}%' AND
                        person.name LIKE '%${name}%' AND 
                        person.id_card LIKE '%${rut}%') AND 
                        pass.create_time BETWEEN '${fechaAnterior}' AND '${fechaActual}'
                    ORDER BY pass.create_time DESC 

                    `,
        { type: QueryTypes.SELECT }
    );

    const wb = new xl.Workbook();
    var ws = wb.addWorksheet("Sheet 1");
    var style = wb.createStyle({
        font: {
        color: "#FF0800",
        size: 12,
        },
        numberFormat: "$#,##0.00; ($#,##0.00); -",
    });

    ws.cell(1, 1).string("Registro").style(style);
    ws.cell(1, 2).string("Rut").style(style);
    ws.cell(1, 3).string("Nombre").style(style);
    ws.cell(1, 4).string("Avatar").style(style);
    ws.cell(1, 5).string("Foto Registro").style(style);
    ws.cell(1, 6).string("Empresa").style(style);
    ws.cell(1, 7).string("Temperatura").style(style);
    ws.cell(1, 8).string("temperature_state").style(style);
    ws.cell(1, 9).string("Tipo").style(style);
    await  resource?.forEach((row: any, index) => {
        ws.cell(index + 2, 1).date(new Date((row?.create_time)))
        ws.cell(index + 2, 2).string(row?.id_card);
        ws.cell(index + 2, 3).string(row?.name);
        ws.cell(index + 2, 4).string(row?.resource_url);
        ws.cell(index + 2, 5).string(row?.img_uri);
        ws.cell(index + 2, 6).string(row?.empresa);
        ws.cell(index + 2, 7).string(row?.temperature);
        ws.cell(index + 2, 8).number(row?.temperature_state);
        ws.cell(index + 2, 9).number(row?.direction);
    });

    const Filename = `${uuid()}.xlsx`
    const pathExcel = path.join(__dirname, "../..", "excel", Filename);

    await wb.write(pathExcel, function (err: any, stats: any) {
        if (err) {
            console.log(err);
        } else {
            function downloadFile() {
                res.download(pathExcel);
                return res.status(200).json({Filename:Filename, url:'http://localhost:8000/api/records/downreport' });
                
            }
            downloadFile();
            return false;
        }

    });
  } catch (error) {
    console.log(error);
    
  }

};

export const downReport = async (req: Request, res: Response) => {
  try {
    let filename = req.params.resource_url;
    let url = path.join(__dirname, "../..", "excel", filename);
    res.status(200).download(url);
  } catch (error) {
    console.log(error);
  }

  };
  //*********************



  
export const deleteRecord = async (req: Request, res: Response) => {

  try {
    
  const ID = req.params.id;
  const userAuth = req.body.userAuth;
  const fecha = new Date();
  const today = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  const DeleteRecord =
        (await Pass_Record.sequelize?.query(
          `
              UPDATE tdx_pass_record SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
          `
        )) || "";

  return res.status(200).json({ DeleteRecord })
  } catch (error) {
    console.log(error);
    
  }

}



export const updateRecord = async (req: Request, res: Response) => {

  try {
    const ID = req.params.id;
    const userAuth = req.body.userAuth;
    const fecha = new Date();
    const today = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

      const DeleteRecord =
            (await Pass_Record.sequelize?.query(
              `
                  UPDATE tdx_pass_record SET person_id = '${req.body.person_id}', direction ='${req.body.turno}',update_time = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
              `
            )) || "";

    return res.status(200).json({ DeleteRecord })
  } catch (error) {
    console.log(error);
    
  }

}