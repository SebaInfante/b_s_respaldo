import { Response, Request } from "express";

const FtpDeploy = require("ftp-deploy");
import sharp from "sharp";
import fs from "fs";
import Document from "../models/Docuement";
import Employment from "../models/Employment";
import path from "path";
import nodemailer from "nodemailer";

const { QueryTypes } = require("sequelize");
import Pass_Record from "../models/Pass_Record";

import { restarDias, sumarDias, formatDate } from "../utils/fecha";
import { uuid } from "uuidv4";
const xl = require("excel4node");
import Resource_Data from "../models/Resource_Data";
import Employee_Group from "../models/Employee_Group";
import Employee from "../models/Employee";
import Person from "../models/Person";
import { generarPDF } from "../lib/pdfkit";
const imageDownloader = require("../lib/image-downloader").download;

const fecha = new Date();
// import dateFormat from "dateformat";
// const now = dateFormat(fecha, "yyyy-mm-dd hh:mm:ss");


// ************************************************************************************************************************
// !                                              VER TODOS LOS USUARIOS
// ************************************************************************************************************************

export const getPersons = async (req: Request, res: Response) => {
  const userAuth = req.body.userAuth;
  const name = req.body.name || "";
  const ocupacion = req.body.ocupacion || "";
  const rut = req.body.rut || "";
  const intervalo = req.body.intervalo || 365;
  const initDate =
    req.body.fecha || new Date().toISOString().split("T", 1).toString();
  const fecha = new Date(initDate);
  const fechaActual = sumarDias(fecha, 1).split("T", 1).toString();
  const fechaAnterior = restarDias(fecha, intervalo).split("T", 1).toString();

  try {
    let turno = req.body.turno || "";
    let contratista = req.body.contratista || "";
    let egroupName: string;

    if (contratista == "all") {
      contratista = "";
    }

    if (turno == "all") {
      turno = "";
    }

    if (userAuth.role === "ADM" || userAuth.role === "USM") {
      !contratista ? (egroupName = "") : (egroupName = contratista);
    } else {
      egroupName = userAuth.name;
    }
    const resource =
      (await Pass_Record.sequelize?.query(
        `
        SELECT TOP 500  person.id AS id, 
              data.resource_url, 
              employee.email AS email, 
              person.name,  
              person.id_card, 
              egroup.name AS empresa, 
              person.create_time, 
              employment.employment AS ocupacion
        FROM  (SELECT * FROM tdx_person WHERE deleted_flag = 0) AS person, 
              (SELECT * FROM tdx_person_photo WHERE deleted_flag = 0) AS photo, 
              (SELECT * FROM tdx_resource_data) AS data, 
              (SELECT * FROM tdx_employee_group WHERE deleted_flag = 0) AS egroup, 
              (SELECT * FROM tdx_employee WHERE deleted_flag = 0) AS employee, 
              tdx_employment AS employment
        WHERE 
            (person.id = photo.person_id AND 
            (person.name LIKE '%${name}%' AND 
            person.id_card LIKE '%${rut}%') AND
            photo.resource_id = data.id AND 
            person.id = employee.person_id AND 
            employee.employment = employment.id AND 
            employment.id LIKE '%${ocupacion}%' AND
            employee.group_id = egroup.id AND
            egroup.name LIKE '%${egroupName}%') AND
            person.create_time BETWEEN '${fechaAnterior}' AND '${fechaActual}'
        ORDER BY person.create_time DESC
      `,
        { type: QueryTypes.SELECT }
      )) || "";
    return res.json(resource);
  } catch (error) {
    console.log(error);
  }
};
//*********************

//*********************
export const getEmployment = async (req: Request, res: Response) => {
  let empresa; //Es un id
  const userAuth = req.body.userAuth;

  if (userAuth.role === "USC") {
    let employeeGroup = await Employee_Group.findOne({
      where: { name: userAuth.name },
    });
    empresa = employeeGroup.id;
  } else {
    let employeeGroup = await Employee_Group.findOne({
      where: { name: req.body.empresa },
    });
    empresa = employeeGroup.id;
  }
  console.log(
    "🚀 ~ file: person.ts ~ line 111 ~ getEmployment ~ empresa",
    empresa
  );

  let employment = await Employment.findAll({ where: { employee: empresa } });
  if (employment.length == 0) {
    console.log("hola");

    employment = [
      {
        id: 2,
        employment: "No seleccionado",
      },
    ];
  }
  console.log(
    "🚀 ~ file: person.ts ~ line 115 ~ getEmployment ~ employment",
    employment
  );
  return res.json(employment);
};
//*********************

//*********************
export const updateDatos = async (req: Request, res: Response) => {
  try {
    const id_person = req.params.person_id;

    const RespuestaPerson =
      (await Pass_Record.sequelize?.query(
        `
      UPDATE tdx_person SET name = '${req.body.name}' WHERE id = '${id_person}'
    `
      )) || "";
    const RespuestaEmployee =
      (await Pass_Record.sequelize?.query(
        `
      UPDATE tdx_employee SET email = '${req.body.email}', employment = '${req.body.ocupacion}' WHERE person_id = '${id_person}'
    `
      )) || "";
    return res.json({ RespuestaPerson, RespuestaEmployee });
  } catch (error) {
    console.log(error);
  }
};
//*********************

//*********************
export const getFichaPerson = async (req: Request, res: Response) => {
  try {
    const rut = req.params.rut;
    const Person: any =
      (await Pass_Record.sequelize?.query(
        `
        SELECT person.name AS Nombre, person.person_no AS Rut, Person.id AS id, data.resource_url AS Avatar
        FROM  tdx_person AS person , tdx_person_photo AS photo, tdx_resource_data AS data
        WHERE  
          person.id_card = '${rut}' AND  
          person.deleted_flag = 0 AND
          photo.deleted_flag = 0 AND
          person.id = photo.person_id AND
          photo.resource_id = data.id

        `,
        { type: QueryTypes.SELECT }
      )) || "";

    const Employee: any =
      (await Pass_Record.sequelize?.query(
        `
        SELECT employment.employment AS Ocupacion, egroup.name AS Empresa, employment.id, employee.email AS Email
        FROM  
              tdx_employee AS employee,
              tdx_employee_group AS egroup, 
              tdx_employment AS employment
        WHERE 
            ( ${Person[0].id} = employee.person_id AND 
              employee.employment = employment.id AND 
              employee.group_id = egroup.id AND
              employee.deleted_flag = 0)
      `,
        { type: QueryTypes.SELECT }
      )) || "";

    // const Documents = await Pass_Record.sequelize?.query(
    //     `
    //       SELECT docfile.name AS docName , docfile.resource_url AS docURL, docfile.resource_alias AS docAlias, docfile.id_document AS id
    //       FROM  tdx_docfile AS docfile
    //       WHERE docfile.id_person = '${person_id}'
    //       `,
    //     { type: QueryTypes.SELECT }) || "";

    const Filename = `${uuid()}.pdf`;

    const data = {
      Nombre: Person[0].Nombre,
      Foto: Person[0].Avatar,
      Rut: Person[0].Rut,
      Email: Employee[0].Email,
      Ocupacion: Employee[0].Ocupacion,
      Empresa: Employee[0].Empresa,
      Filename,
    };

    await generarPDF(data);

    setTimeout(() => {
      res.status(200).json(Filename);
    }, 3000);
  } catch (error) {
    console.log(error);
  }
};
//*********************

//*********************
export const downloadFicha = async (req: Request, res: Response) => {
  let filename = req.params.resource_url;
  let url = path.join(__dirname, "../..", "uploads/fichas", filename);
  res.status(200).download(url);
};
//*********************

//*********************
export const getPerson = async (req: Request, res: Response) => {
  const rut = req.params.rut;
  const Person: any =
    (await Pass_Record.sequelize?.query(
      `
              SELECT person.* , person.id  AS id, data.resource_url, data.resource_alias
              FROM  tdx_person AS person , tdx_person_photo AS photo, tdx_resource_data AS data
              WHERE  
                person.id_card = '${rut}' AND  
                person.deleted_flag = 0 AND
                photo.deleted_flag = 0 AND
                person.id = photo.person_id AND
                photo.resource_id = data.id

              `,
      { type: QueryTypes.SELECT }
    )) || "";

  const person_id = Person[0].id;

  const Employee =
    (await Pass_Record.sequelize?.query(
      `
              SELECT employment.employment, egroup.name, employment.id, employee.email
              FROM  
                    tdx_employee AS employee,
                    tdx_employee_group AS egroup, 
                    tdx_employment AS employment

              WHERE 
                  ( ${person_id} = employee.person_id AND 
                    employee.employment = employment.id AND 
                    employee.group_id = egroup.id AND
                    employee.deleted_flag = 0)
              `,
      { type: QueryTypes.SELECT }
    )) || "";

  const Documents =
    (await Pass_Record.sequelize?.query(
      `
              SELECT docfile.name AS docName , docfile.resource_url AS docURL, docfile.resource_alias AS docAlias, docfile.id_document AS id
              FROM  tdx_docfile AS docfile
              WHERE docfile.id_person = '${person_id}'
                  
              `,
      { type: QueryTypes.SELECT }
    )) || "";

  return res.json({ Person, Employee, Documents });
};
//*********************

//*********************
export const getAllEmployment = async (req: Request, res: Response) => {
  const userAuth = req.body.userAuth;
  if (userAuth.role === "ADM") {
    const employment = await Employment.findAll();
    return res.json(employment);
  }
  return res.status(403);
};
//*********************

//*********************
export const getDocumentsPerson = async (req: Request, res: Response) => {
  const { idDoc, id_person } = req.body;
  const Document =
    (await Pass_Record.sequelize?.query(
      `
            SELECT docfile.*
            FROM  tdx_docfile AS docfile
            WHERE docfile.id_person = '${id_person}' AND docfile.id_document = ${idDoc} AND docfile.deleted_flag = 0
            `,
      { type: QueryTypes.SELECT }
    )) || "";
  return res.json(Document);
};
//*********************

//*********************
export const getDocuments = async (req: Request, res: Response) => {
  const ocupacion = req.body.ocupacion || "";
  const documents = await Document.findAll({
    where: { id_employment: ocupacion },
  });
  return res.json(documents);
};
//*********************

//*********************
export const downloadDoc = async (req: Request, res: Response) => {
  let filename = req.params.resource_url;
  let url = path.join(__dirname, "../..", "uploads", filename);
  res.status(200).download(url);
};
//*********************

//*********************
export const validarRut = async (req: Request, res: Response) => {
  const rut = req.body.rut;
  const resource =
    (await Pass_Record.sequelize?.query(
      `
              SELECT person.id , person.name , person.id_card 
              FROM  tdx_person AS person, tdx_employee AS employee
              WHERE person.id_card = '${rut}' AND
                person.id = employee.person_id AND 
                employee.deleted_flag = 0
              `,
      { type: QueryTypes.SELECT }
    )) || "";

  if (resource.length == 0) {
    return res.status(200).json(true);
  } else {
    return res.status(400).json({ msg: "Rut ya registrado" });
  }
};
//*********************

//*********************
export const cantPersonasTotales = async (req: Request, res: Response) => {
  const resource =
    (await Pass_Record.sequelize?.query(
      `
              SELECT COUNT(tdx_person.id) AS cantPersonas
              FROM  tdx_person
              `,
      { type: QueryTypes.SELECT }
    )) || "";
  return res.status(200).json(resource);
};
//*********************

//*********************
export const photoFile = async (req: Request, res: Response) => {

    const username = req.body.username;
    const imagen = req.file;
    const processedImage = sharp(imagen?.buffer);
    const resizedImage = processedImage.resize(700, 700, {
        fit: "cover",
        background: "#FFF",
    });
    const resizedImageBuffer = await resizedImage.toBuffer();

    const filename = `${uuid()}.png`;
    fs.writeFileSync(`uploads/${filename}`, resizedImageBuffer); //Aqui se envia o crea
    let url = path.join(__dirname, "../..", "uploads");

    const ftpDeploy = new FtpDeploy();

    const config = {
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        localRoot: url,
        include: ["*.png"],
        remoteRoot: "/avatar",
        deleteRemote: false,
        forcePasv: true,
        sftp: false,
    };

    ftpDeploy
        .deploy(config)
        .then((res: any) => console.log("finished:", res))
        .catch((err: any) => console.log("photoFile", err));

    const resource_url = `${filename}`; //TODO:Cambiar cuando se use la otra base de datos
    const resource_alias = req.file?.originalname;
    const resource_size = Math.trunc(resizedImageBuffer.byteLength / 1000);
    const resource_dimensions = "700*700";
    const suffix = ".png";

    const resource =
        (await Resource_Data.sequelize?.query(
            `
                    INSERT INTO tdx_resource_data (site_id, resource_url, resource_alias,resource_type, resource_size, resource_dimensions, suffix, create_user)
                    VALUES (1,'${resource_url}', '${resource_alias}', 1, '${resource_size}', '${resource_dimensions}', '${suffix}', '${username}')
                        `
        )) || "";

    return res.status(200).json(resource);
    try {
  } catch (error) {
    return res.status(500).json(error);
  }
};
//*********************

//*********************
export const docsFile = async (req: Request, res: Response) => {
  try {
    console.log(req.file);
    if (req.file) {
      const id_person = req.body.person;
      const id_document = req.body.id_document;
      const name_document = req.body.name_document;
      const resource_url = `uploads/${req.file?.filename}`;
      const resource_alias = req.file?.originalname;
      const resource_size = req.file?.size;
      const suffix = path.extname(req.file!.originalname);
      const create_user = req.body.username;
      let url = path.join(__dirname, "../..", "documents");
      const resource =
        (await Resource_Data.sequelize?.query(
          `
                    INSERT INTO tdx_docfile (id_person, id_document, name, resource_url, resource_alias, resource_size, suffix, create_user)
                    VALUES ('${id_person}', '${id_document}', '${name_document}' ,'${resource_url}', '${resource_alias}', '${resource_size}', '${suffix}', '${create_user}')
                    `
        )) || "";

      const ftpDeploy = new FtpDeploy();

      const config = {
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        localRoot: url,
        include: ["*"],
        remoteRoot: "/documents",
        deleteRemote: false,
        forcePasv: true,
        sftp: false,
      };

      ftpDeploy
        .deploy(config)
        .then((res: any) => console.log("finished:", res))
        .catch((err: any) => console.log("docsFile", err));

      return res.status(200).json(resource);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
//*********************

//*********************
export const photoPreview = async (req: Request, res: Response) => {
  try {
    const imagen = req.file;
    const processedImage = sharp(imagen?.buffer);
    const resizedImage = processedImage.resize(700, 700, {
      fit: "cover",
      background: "#FFF",
    });

    const resizedImageBuffer = await resizedImage.toBuffer();
    return res.status(200).json(resizedImageBuffer);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//*********************

//*********************
export const addPerson = async (req: Request, res: Response) => {
    try {
        const {userAuth, nombre, rut, genero, empresa, ocupacion, email } = req.body
        const rutValidator = await Person.findOne({where: { id_card: rut, deleted_flag: 1 }});
        const empresaEncontrada = await Employee_Group.findOne({where: { name: empresa }});

        if (rutValidator) {
            const updatePerson = {
                name: nombre,
                deleted_flag: 0,
                update_time: formatDate(fecha),
                create_time: formatDate(fecha),
                update_user: userAuth.name,
            };
            await Person.update({ updatePerson }, { where: { id_card: rut } });
            return res.status(200).json(rutValidator.id);
        } else {
            const newPerson = {
                site_id: 1,
                person_no: rut,
                type: 1,
                name: nombre,
                id_card: rut,
                create_user: userAuth.name,
            };
            const respPerson = Person.build(newPerson);
            await respPerson.save()
            

            const newEmployee = {
                id: (respPerson.id_table+400),
                site_id:1,
                person_id:(respPerson.id_table+400),
                email:email,
                attendance_flag:1,
                temperature_alarm:0,
                group_id:empresaEncontrada.id,
                gender:genero,
                employment:ocupacion,
                create_time:formatDate(fecha),
                create_user:userAuth.name,
                deleted_flag:0
            }
            const respEmployee = Employee.build(newEmployee);
            await respEmployee.save();

            return res.status(200).json(respPerson);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

//*********************
//*********************
export const addEmplyee = async (req: Request, res: Response) => {
    const {username, genero, id_person, email} = req.body
    const empresa = req.body.empresa || username;
    const ocupacion = req.body.ocupacion || 0;

    const empresaEncontrada = await Employee_Group.findOne({where: { name: empresa }});

    const newEmployee = {
        id: (id_person+400),
        site_id:1,
        person_id:(id_person+400),
        email:email,
        attendance_flag:1,
        temperature_alarm:0,
        group_id:empresaEncontrada.id,
        gender:genero,
        employment:ocupacion,
        create_user:username
    }

    const respEmployee = Employee.build(newEmployee);
    await respEmployee.save();

    console.log(respEmployee);
    

    try {
        return res.status(200).json(respEmployee);
    } catch (error) {
        return res.status(500).json(error);
    }
};

//*********************
//*********************
export const addPersonPhoto = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const id_person = req.body.id_person;
    const id_resource_data = req.body.id_resource_data;
    const resource =
      (await Resource_Data.sequelize?.query(
        `
            INSERT INTO tdx_person_photo (site_id, person_id, resource_id, status, create_user)
            VALUES (1 ,'${id_person}' ,'${id_resource_data}' ,0 ,'${username}' )
                    `
      )) || "";

    return res.status(200).json(resource);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//*********************
//*********************
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const ID = req.params.id;
    const userAuth = req.body.userAuth;
    const fecha = new Date();
    const today = `${fecha.getFullYear()}-${
      fecha.getMonth() + 1
    }-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

    const resourceEmployee =
      (await Resource_Data.sequelize?.query(
        `
            UPDATE tdx_employee SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE person_id = '${ID}'
                    `
      )) || "";

    const resourcePerson =
      (await Resource_Data.sequelize?.query(
        `
            UPDATE tdx_person SET deleted_flag = 1,expire_time = '${today}', update_time = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
                    `
      )) || "";

    const resourcePersonPhoto =
      (await Resource_Data.sequelize?.query(
        `
            UPDATE tdx_person_photo SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE person_id = '${ID}'
                    `
      )) || "";
    const resourcedocFile =
      (await Resource_Data.sequelize?.query(
        `
            UPDATE tdx_docfile SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE id_person = '${ID}'
                    `
      )) || "";

    return res
      .status(200)
      .json({ resourcePerson, resourceEmployee, resourcePersonPhoto });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//*********************
//*********************
export const deleteFile = async (req: Request, res: Response) => {
  const ID = req.params.id;
  const userAuth = req.body.userAuth;
  const fecha = new Date();
  const today = `${fecha.getFullYear()}-${
    fecha.getMonth() + 1
  }-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

  const resourceDoc =
    (await Resource_Data.sequelize?.query(
      `
            UPDATE tdx_docfile SET deleted_flag = 1, updatedAt = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
                    `
    )) || "";
  try {
    return res.status(200).json(resourceDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//*********************

export const sendEmailDeletePerson = async (req: Request, res: Response) => {
  console.log("hola");
  const rut = req.body.rut;
  const Mandante: any =
    (await Pass_Record.sequelize?.query(
      `
                SELECT *  FROM tdx_users WHERE id = 
                ( 
                SELECT users.employee
                FROM  tdx_person AS person, tdx_employee AS employee, tdx_employee_group AS Egroup, tdx_users AS users
                WHERE 
                    person.id_card = ${rut} AND
                    employee.person_id = person.id AND 
                    employee.deleted_flag = 0 AND
                    employee.group_id = Egroup.id AND
                    Egroup.name = users.name )
                    `,
      { type: QueryTypes.SELECT }
    )) || "";
  const Empresa: any =
    (await Pass_Record.sequelize?.query(
      `
        SELECT users.name AS empresaNombre, users.email AS empresaEmail, person.name AS personaNombre, person.id_card AS personaRut
        FROM  tdx_person AS person, tdx_employee AS employee, tdx_employee_group AS Egroup, tdx_users AS users
        WHERE 
            person.id_card = ${rut} AND
            employee.person_id = person.id AND 
            employee.deleted_flag = 0 AND
            employee.group_id = Egroup.id AND
            Egroup.name = users.name 
                    `,
      { type: QueryTypes.SELECT }
    )) || "";

  const email = Mandante[0].email;
  const nombre = Mandante[0].name;
  const empresaNombre = Empresa[0].empresaNombre;
  const empresaEmail = Empresa[0].empresaEmail;
  const personaNombre = Empresa[0].personaNombre;
  const personaRut = Empresa[0].personaRut;
  console.log();

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
    subject: "Solicitud de eliminación de usuario - SmartBoarding", // Subject line
    html: `
        <h1>Equipo de ${nombre}</h1>
        <p>Se solicita que se pueda poner en contacto con la empresa ${empresaNombre}, email: ${empresaEmail}, para poder dar de baja al trabajador ${personaNombre} con rut ${personaRut} ya 
        que otra empresa, que utiliza Smartboarding necesita enrolarlo a en su equipo de trabajo.</p>
        <p> Saludos</p>
        `,
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
};

export const downloadReportRecords = async (req: Request, res: Response) => {
  const userAuth = req.body.userAuth;
  const name = req.body.name || "";
  const ocupacion = req.body.ocupacion || "";
  const rut = req.body.rut || "";
  const intervalo = req.body.intervalo || 365;
  const initDate =
    req.body.fecha || new Date().toISOString().split("T", 1).toString();

  const fecha = new Date(initDate);
  const fechaActual = sumarDias(fecha, 1).split("T", 1).toString();
  const fechaAnterior = restarDias(fecha, intervalo).split("T", 1).toString();

  let turno = req.body.turno || "";
  let contratista = req.body.contratista || "";
  let egroupName: string;

  if (contratista == "all") {
    contratista = "";
  }
  if (turno == "all") {
    turno = "";
  }

  if (req.body.role === "ADM" || req.body.role === "USM") {
    !contratista ? (egroupName = "") : (egroupName = contratista);
  } else {
    egroupName = userAuth.name;
  }
  const resource = await Pass_Record.sequelize?.query(
    `
              SELECT DISTINCT  person.id AS id, data.resource_url ,employee.email AS email, person.name ,  person.id_card , egroup.name AS empresa , person.create_time , employment.employment AS ocupacion
              FROM  (SELECT * FROM tdx_person WHERE deleted_flag = 0) AS person, (SELECT * FROM tdx_person_photo WHERE deleted_flag = 0)  AS photo, tdx_resource_data AS data, tdx_employee_group AS egroup, (SELECT * FROM tdx_employee WHERE deleted_flag = 0) AS employee, tdx_employment AS employment
              WHERE 
                  (person.id = photo.person_id AND 
                  (person.name LIKE '%${name}%' AND person.id_card LIKE '%${rut}%') AND
                  photo.resource_id = data.id AND 
                  person.id = employee.person_id AND 
                  employee.employment = employment.id AND 
                  employment.id LIKE '%${ocupacion}%' AND
                  employee.group_id = egroup.id AND
                  egroup.name LIKE '%${egroupName}%') AND
                  person.create_time BETWEEN '${fechaAnterior}' AND '${fechaActual}'
              GROUP BY person.id_card
              ORDER BY person.create_time DESC
              `,
    { type: QueryTypes.SELECT }
  );

  const wb = new xl.Workbook();
  var ws = wb.addWorksheet("Sheet 1");
  var style = wb.createStyle({
    font: {
      color: "#095B90",
      size: 12,
    },
    numberFormat: "$#,##0.00; ($#,##0.00); -",
  });

  ws.cell(1, 1).string("Rut").style(style);
  ws.cell(1, 2).string("Nombre").style(style);
  ws.cell(1, 3).string("Email").style(style);
  ws.cell(1, 4).string("Foto").style(style);
  ws.cell(1, 5).string("Ocupación").style(style);
  ws.cell(1, 6).string("Empresa").style(style);
  ws.cell(1, 7).string("Creación").style(style);
  await resource?.forEach((row: any, index) => {
    ws.cell(index + 2, 1).string(row?.id_card || "");
    ws.cell(index + 2, 2).string(row?.name || "");
    ws.cell(index + 2, 3).string(row?.email || "");
    ws.cell(index + 2, 4).string(row?.resource_url || "");
    ws.cell(index + 2, 5).string(row?.ocupacion || "");
    ws.cell(index + 2, 6).string(row?.empresa || "");
    ws.cell(index + 2, 7).date(new Date(row?.create_time));
  });

  const Filename = `${uuid()}.xlsx`;
  const pathExcel = path.join(__dirname, "../..", "excel", Filename);

  await wb.write(pathExcel, function (err: any, stats: any) {
    if (err) {
      console.log(err);
    } else {
      function downloadFile() {
        res.download(pathExcel);
        return res.status(200).json({
          Filename: Filename,
          url: "http://localhost:8000/api/records/downreport",
        });
      }
      downloadFile();
      return false;
    }
  });
};

export const downReport = async (req: Request, res: Response) => {
  let filename = req.params.resource_url;
  let url = path.join(__dirname, "../..", "excel", filename);
  res.status(200).download(url);
};
//*********************
