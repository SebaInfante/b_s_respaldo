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
exports.downReport = exports.downloadReportRecords = exports.sendEmailDeletePerson = exports.deleteFile = exports.deletePerson = exports.addPersonPhoto = exports.addEmplyee = exports.addPerson = exports.photoPreview = exports.docsFile = exports.photoFile = exports.cantPersonasTotales = exports.validarRut = exports.downloadDoc = exports.getDocuments = exports.getDocumentsPerson = exports.getAllEmployment = exports.getPerson = exports.downloadFicha = exports.getFichaPerson = exports.updateDatos = exports.getEmployment = exports.getPersons = void 0;
const FtpDeploy = require("ftp-deploy");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const Docuement_1 = __importDefault(require("../models/Docuement"));
const Employment_1 = __importDefault(require("../models/Employment"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const { QueryTypes } = require("sequelize");
const Pass_Record_1 = __importDefault(require("../models/Pass_Record"));
const fecha_1 = require("../utils/fecha");
const uuidv4_1 = require("uuidv4");
const xl = require("excel4node");
const Resource_Data_1 = __importDefault(require("../models/Resource_Data"));
const Employee_Group_1 = __importDefault(require("../models/Employee_Group"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Person_1 = __importDefault(require("../models/Person"));
const pdfkit_1 = require("../lib/pdfkit");
const imageDownloader = require("../lib/image-downloader").download;
const fecha = new Date();
// import dateFormat from "dateformat";
// const now = dateFormat(fecha, "yyyy-mm-dd hh:mm:ss");
// ************************************************************************************************************************
// !                                              VER TODOS LOS USUARIOS
// ************************************************************************************************************************
const getPersons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userAuth = req.body.userAuth;
    const name = req.body.name || "";
    const ocupacion = req.body.ocupacion || "";
    const rut = req.body.rut || "";
    const intervalo = req.body.intervalo || 365;
    const initDate = req.body.fecha || new Date().toISOString().split("T", 1).toString();
    const fecha = new Date(initDate);
    const fechaActual = (0, fecha_1.sumarDias)(fecha, 1).split("T", 1).toString();
    const fechaAnterior = (0, fecha_1.restarDias)(fecha, intervalo).split("T", 1).toString();
    try {
        let turno = req.body.turno || "";
        let contratista = req.body.contratista || "";
        let egroupName;
        if (contratista == "all") {
            contratista = "";
        }
        if (turno == "all") {
            turno = "";
        }
        if (userAuth.role === "ADM" || userAuth.role === "USM") {
            !contratista ? (egroupName = "") : (egroupName = contratista);
        }
        else {
            egroupName = userAuth.name;
        }
        const resource = (yield ((_a = Pass_Record_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(`
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
      `, { type: QueryTypes.SELECT }))) || "";
        return res.json(resource);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getPersons = getPersons;
//*********************
//*********************
const getEmployment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let empresa; //Es un id
    const userAuth = req.body.userAuth;
    if (userAuth.role === "USC") {
        let employeeGroup = yield Employee_Group_1.default.findOne({
            where: { name: userAuth.name },
        });
        empresa = employeeGroup.id;
    }
    else {
        let employeeGroup = yield Employee_Group_1.default.findOne({
            where: { name: req.body.empresa },
        });
        empresa = employeeGroup.id;
    }
    console.log("🚀 ~ file: person.ts ~ line 111 ~ getEmployment ~ empresa", empresa);
    let employment = yield Employment_1.default.findAll({ where: { employee: empresa } });
    if (employment.length == 0) {
        console.log("hola");
        employment = [
            {
                id: 2,
                employment: "No seleccionado",
            },
        ];
    }
    console.log("🚀 ~ file: person.ts ~ line 115 ~ getEmployment ~ employment", employment);
    return res.json(employment);
});
exports.getEmployment = getEmployment;
//*********************
//*********************
const updateDatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const id_person = req.params.person_id;
        const RespuestaPerson = (yield ((_b = Pass_Record_1.default.sequelize) === null || _b === void 0 ? void 0 : _b.query(`
      UPDATE tdx_person SET name = '${req.body.name}' WHERE id = '${id_person}'
    `))) || "";
        const RespuestaEmployee = (yield ((_c = Pass_Record_1.default.sequelize) === null || _c === void 0 ? void 0 : _c.query(`
      UPDATE tdx_employee SET email = '${req.body.email}', employment = '${req.body.ocupacion}' WHERE person_id = '${id_person}'
    `))) || "";
        return res.json({ RespuestaPerson, RespuestaEmployee });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateDatos = updateDatos;
//*********************
//*********************
const getFichaPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const rut = req.params.rut;
        const Person = (yield ((_d = Pass_Record_1.default.sequelize) === null || _d === void 0 ? void 0 : _d.query(`
        SELECT person.name AS Nombre, person.person_no AS Rut, Person.id AS id, data.resource_url AS Avatar
        FROM  tdx_person AS person , tdx_person_photo AS photo, tdx_resource_data AS data
        WHERE  
          person.id_card = '${rut}' AND  
          person.deleted_flag = 0 AND
          photo.deleted_flag = 0 AND
          person.id = photo.person_id AND
          photo.resource_id = data.id

        `, { type: QueryTypes.SELECT }))) || "";
        const Employee = (yield ((_e = Pass_Record_1.default.sequelize) === null || _e === void 0 ? void 0 : _e.query(`
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
      `, { type: QueryTypes.SELECT }))) || "";
        // const Documents = await Pass_Record.sequelize?.query(
        //     `
        //       SELECT docfile.name AS docName , docfile.resource_url AS docURL, docfile.resource_alias AS docAlias, docfile.id_document AS id
        //       FROM  tdx_docfile AS docfile
        //       WHERE docfile.id_person = '${person_id}'
        //       `,
        //     { type: QueryTypes.SELECT }) || "";
        const Filename = `${(0, uuidv4_1.uuid)()}.pdf`;
        const data = {
            Nombre: Person[0].Nombre,
            Foto: Person[0].Avatar,
            Rut: Person[0].Rut,
            Email: Employee[0].Email,
            Ocupacion: Employee[0].Ocupacion,
            Empresa: Employee[0].Empresa,
            Filename,
        };
        yield (0, pdfkit_1.generarPDF)(data);
        setTimeout(() => {
            res.status(200).json(Filename);
        }, 3000);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getFichaPerson = getFichaPerson;
//*********************
//*********************
const downloadFicha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = req.params.resource_url;
    let url = path_1.default.join(__dirname, "../..", "uploads/fichas", filename);
    res.status(200).download(url);
});
exports.downloadFicha = downloadFicha;
//*********************
//*********************
const getPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    const rut = req.params.rut;
    const Person = (yield ((_f = Pass_Record_1.default.sequelize) === null || _f === void 0 ? void 0 : _f.query(`
              SELECT person.* , person.id  AS id, data.resource_url, data.resource_alias
              FROM  tdx_person AS person , tdx_person_photo AS photo, tdx_resource_data AS data
              WHERE  
                person.id_card = '${rut}' AND  
                person.deleted_flag = 0 AND
                photo.deleted_flag = 0 AND
                person.id = photo.person_id AND
                photo.resource_id = data.id

              `, { type: QueryTypes.SELECT }))) || "";
    const person_id = Person[0].id;
    const Employee = (yield ((_g = Pass_Record_1.default.sequelize) === null || _g === void 0 ? void 0 : _g.query(`
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
              `, { type: QueryTypes.SELECT }))) || "";
    const Documents = (yield ((_h = Pass_Record_1.default.sequelize) === null || _h === void 0 ? void 0 : _h.query(`
              SELECT docfile.name AS docName , docfile.resource_url AS docURL, docfile.resource_alias AS docAlias, docfile.id_document AS id
              FROM  tdx_docfile AS docfile
              WHERE docfile.id_person = '${person_id}'
                  
              `, { type: QueryTypes.SELECT }))) || "";
    return res.json({ Person, Employee, Documents });
});
exports.getPerson = getPerson;
//*********************
//*********************
const getAllEmployment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = req.body.userAuth;
    if (userAuth.role === "ADM") {
        const employment = yield Employment_1.default.findAll();
        return res.json(employment);
    }
    return res.status(403);
});
exports.getAllEmployment = getAllEmployment;
//*********************
//*********************
const getDocumentsPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const { idDoc, id_person } = req.body;
    const Document = (yield ((_j = Pass_Record_1.default.sequelize) === null || _j === void 0 ? void 0 : _j.query(`
            SELECT docfile.*
            FROM  tdx_docfile AS docfile
            WHERE docfile.id_person = '${id_person}' AND docfile.id_document = ${idDoc} AND docfile.deleted_flag = 0
            `, { type: QueryTypes.SELECT }))) || "";
    return res.json(Document);
});
exports.getDocumentsPerson = getDocumentsPerson;
//*********************
//*********************
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ocupacion = req.body.ocupacion || "";
    const documents = yield Docuement_1.default.findAll({
        where: { id_employment: ocupacion },
    });
    return res.json(documents);
});
exports.getDocuments = getDocuments;
//*********************
//*********************
const downloadDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = req.params.resource_url;
    let url = path_1.default.join(__dirname, "../..", "uploads", filename);
    res.status(200).download(url);
});
exports.downloadDoc = downloadDoc;
//*********************
//*********************
const validarRut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const rut = req.body.rut;
    const resource = (yield ((_k = Pass_Record_1.default.sequelize) === null || _k === void 0 ? void 0 : _k.query(`
              SELECT person.id , person.name , person.id_card 
              FROM  tdx_person AS person, tdx_employee AS employee
              WHERE person.id_card = '${rut}' AND
                person.id = employee.person_id AND 
                employee.deleted_flag = 0
              `, { type: QueryTypes.SELECT }))) || "";
    if (resource.length == 0) {
        return res.status(200).json(true);
    }
    else {
        return res.status(400).json({ msg: "Rut ya registrado" });
    }
});
exports.validarRut = validarRut;
//*********************
//*********************
const cantPersonasTotales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const resource = (yield ((_l = Pass_Record_1.default.sequelize) === null || _l === void 0 ? void 0 : _l.query(`
              SELECT COUNT(tdx_person.id) AS cantPersonas
              FROM  tdx_person
              `, { type: QueryTypes.SELECT }))) || "";
    return res.status(200).json(resource);
});
exports.cantPersonasTotales = cantPersonasTotales;
//*********************
//*********************
const photoFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    const username = req.body.username;
    const imagen = req.file;
    const processedImage = (0, sharp_1.default)(imagen === null || imagen === void 0 ? void 0 : imagen.buffer);
    const resizedImage = processedImage.resize(700, 700, {
        fit: "cover",
        background: "#FFF",
    });
    const resizedImageBuffer = yield resizedImage.toBuffer();
    const filename = `${(0, uuidv4_1.uuid)()}.png`;
    fs_1.default.writeFileSync(`uploads/${filename}`, resizedImageBuffer); //Aqui se envia o crea
    let url = path_1.default.join(__dirname, "../..", "uploads");
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
        .then((res) => console.log("finished:", res))
        .catch((err) => console.log("photoFile", err));
    const resource_url = `${filename}`; //TODO:Cambiar cuando se use la otra base de datos
    const resource_alias = (_m = req.file) === null || _m === void 0 ? void 0 : _m.originalname;
    const resource_size = Math.trunc(resizedImageBuffer.byteLength / 1000);
    const resource_dimensions = "700*700";
    const suffix = ".png";
    const resource = (yield ((_o = Resource_Data_1.default.sequelize) === null || _o === void 0 ? void 0 : _o.query(`
                    INSERT INTO tdx_resource_data (site_id, resource_url, resource_alias,resource_type, resource_size, resource_dimensions, suffix, create_user)
                    VALUES (1,'${resource_url}', '${resource_alias}', 1, '${resource_size}', '${resource_dimensions}', '${suffix}', '${username}')
                        `))) || "";
    return res.status(200).json(resource);
    try {
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.photoFile = photoFile;
//*********************
//*********************
const docsFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q, _r, _s;
    try {
        console.log(req.file);
        if (req.file) {
            const id_person = req.body.person;
            const id_document = req.body.id_document;
            const name_document = req.body.name_document;
            const resource_url = `uploads/${(_p = req.file) === null || _p === void 0 ? void 0 : _p.filename}`;
            const resource_alias = (_q = req.file) === null || _q === void 0 ? void 0 : _q.originalname;
            const resource_size = (_r = req.file) === null || _r === void 0 ? void 0 : _r.size;
            const suffix = path_1.default.extname(req.file.originalname);
            const create_user = req.body.username;
            let url = path_1.default.join(__dirname, "../..", "documents");
            const resource = (yield ((_s = Resource_Data_1.default.sequelize) === null || _s === void 0 ? void 0 : _s.query(`
                    INSERT INTO tdx_docfile (id_person, id_document, name, resource_url, resource_alias, resource_size, suffix, create_user)
                    VALUES ('${id_person}', '${id_document}', '${name_document}' ,'${resource_url}', '${resource_alias}', '${resource_size}', '${suffix}', '${create_user}')
                    `))) || "";
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
                .then((res) => console.log("finished:", res))
                .catch((err) => console.log("docsFile", err));
            return res.status(200).json(resource);
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.docsFile = docsFile;
//*********************
//*********************
const photoPreview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imagen = req.file;
        const processedImage = (0, sharp_1.default)(imagen === null || imagen === void 0 ? void 0 : imagen.buffer);
        const resizedImage = processedImage.resize(700, 700, {
            fit: "cover",
            background: "#FFF",
        });
        const resizedImageBuffer = yield resizedImage.toBuffer();
        return res.status(200).json(resizedImageBuffer);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.photoPreview = photoPreview;
//*********************
//*********************
const addPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAuth, nombre, rut, genero, empresa, ocupacion, email } = req.body;
        const rutValidator = yield Person_1.default.findOne({ where: { id_card: rut, deleted_flag: 1 } });
        const empresaEncontrada = yield Employee_Group_1.default.findOne({ where: { name: empresa } });
        if (rutValidator) {
            const updatePerson = {
                name: nombre,
                deleted_flag: 0,
                update_time: (0, fecha_1.formatDate)(fecha),
                create_time: (0, fecha_1.formatDate)(fecha),
                update_user: userAuth.name,
            };
            yield Person_1.default.update({ updatePerson }, { where: { id_card: rut } });
            return res.status(200).json(rutValidator.id);
        }
        else {
            const newPerson = {
                site_id: 1,
                person_no: rut,
                type: 1,
                name: nombre,
                id_card: rut,
                create_user: userAuth.name,
            };
            const respPerson = Person_1.default.build(newPerson);
            yield respPerson.save();
            const newEmployee = {
                id: (respPerson.id_table + 400),
                site_id: 1,
                person_id: (respPerson.id_table + 400),
                email: email,
                attendance_flag: 1,
                temperature_alarm: 0,
                group_id: empresaEncontrada.id,
                gender: genero,
                employment: ocupacion,
                create_time: (0, fecha_1.formatDate)(fecha),
                create_user: userAuth.name,
                deleted_flag: 0
            };
            const respEmployee = Employee_1.default.build(newEmployee);
            yield respEmployee.save();
            return res.status(200).json(respPerson);
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.addPerson = addPerson;
//*********************
//*********************
const addEmplyee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, genero, id_person, email } = req.body;
    const empresa = req.body.empresa || username;
    const ocupacion = req.body.ocupacion || 0;
    const empresaEncontrada = yield Employee_Group_1.default.findOne({ where: { name: empresa } });
    const newEmployee = {
        id: (id_person + 400),
        site_id: 1,
        person_id: (id_person + 400),
        email: email,
        attendance_flag: 1,
        temperature_alarm: 0,
        group_id: empresaEncontrada.id,
        gender: genero,
        employment: ocupacion,
        create_user: username
    };
    const respEmployee = Employee_1.default.build(newEmployee);
    yield respEmployee.save();
    console.log(respEmployee);
    try {
        return res.status(200).json(respEmployee);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.addEmplyee = addEmplyee;
//*********************
//*********************
const addPersonPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t;
    try {
        const username = req.body.username;
        const id_person = req.body.id_person;
        const id_resource_data = req.body.id_resource_data;
        const resource = (yield ((_t = Resource_Data_1.default.sequelize) === null || _t === void 0 ? void 0 : _t.query(`
            INSERT INTO tdx_person_photo (site_id, person_id, resource_id, status, create_user)
            VALUES (1 ,'${id_person}' ,'${id_resource_data}' ,0 ,'${username}' )
                    `))) || "";
        return res.status(200).json(resource);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.addPersonPhoto = addPersonPhoto;
//*********************
//*********************
const deletePerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _u, _v, _w, _x;
    try {
        const ID = req.params.id;
        const userAuth = req.body.userAuth;
        const fecha = new Date();
        const today = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        const resourceEmployee = (yield ((_u = Resource_Data_1.default.sequelize) === null || _u === void 0 ? void 0 : _u.query(`
            UPDATE tdx_employee SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE person_id = '${ID}'
                    `))) || "";
        const resourcePerson = (yield ((_v = Resource_Data_1.default.sequelize) === null || _v === void 0 ? void 0 : _v.query(`
            UPDATE tdx_person SET deleted_flag = 1,expire_time = '${today}', update_time = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
                    `))) || "";
        const resourcePersonPhoto = (yield ((_w = Resource_Data_1.default.sequelize) === null || _w === void 0 ? void 0 : _w.query(`
            UPDATE tdx_person_photo SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE person_id = '${ID}'
                    `))) || "";
        const resourcedocFile = (yield ((_x = Resource_Data_1.default.sequelize) === null || _x === void 0 ? void 0 : _x.query(`
            UPDATE tdx_docfile SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE id_person = '${ID}'
                    `))) || "";
        return res
            .status(200)
            .json({ resourcePerson, resourceEmployee, resourcePersonPhoto });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.deletePerson = deletePerson;
//*********************
//*********************
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _y;
    const ID = req.params.id;
    const userAuth = req.body.userAuth;
    const fecha = new Date();
    const today = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
    const resourceDoc = (yield ((_y = Resource_Data_1.default.sequelize) === null || _y === void 0 ? void 0 : _y.query(`
            UPDATE tdx_docfile SET deleted_flag = 1, updatedAt = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
                    `))) || "";
    try {
        return res.status(200).json(resourceDoc);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.deleteFile = deleteFile;
//*********************
const sendEmailDeletePerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _z, _0;
    console.log("hola");
    const rut = req.body.rut;
    const Mandante = (yield ((_z = Pass_Record_1.default.sequelize) === null || _z === void 0 ? void 0 : _z.query(`
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
                    `, { type: QueryTypes.SELECT }))) || "";
    const Empresa = (yield ((_0 = Pass_Record_1.default.sequelize) === null || _0 === void 0 ? void 0 : _0.query(`
        SELECT users.name AS empresaNombre, users.email AS empresaEmail, person.name AS personaNombre, person.id_card AS personaRut
        FROM  tdx_person AS person, tdx_employee AS employee, tdx_employee_group AS Egroup, tdx_users AS users
        WHERE 
            person.id_card = ${rut} AND
            employee.person_id = person.id AND 
            employee.deleted_flag = 0 AND
            employee.group_id = Egroup.id AND
            Egroup.name = users.name 
                    `, { type: QueryTypes.SELECT }))) || "";
    const email = Mandante[0].email;
    const nombre = Mandante[0].name;
    const empresaNombre = Empresa[0].empresaNombre;
    const empresaEmail = Empresa[0].empresaEmail;
    const personaNombre = Empresa[0].personaNombre;
    const personaRut = Empresa[0].personaRut;
    console.log();
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
        subject: "Solicitud de eliminación de usuario - SmartBoarding",
        html: `
        <h1>Equipo de ${nombre}</h1>
        <p>Se solicita que se pueda poner en contacto con la empresa ${empresaNombre}, email: ${empresaEmail}, para poder dar de baja al trabajador ${personaNombre} con rut ${personaRut} ya 
        que otra empresa, que utiliza Smartboarding necesita enrolarlo a en su equipo de trabajo.</p>
        <p> Saludos</p>
        `,
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
});
exports.sendEmailDeletePerson = sendEmailDeletePerson;
const downloadReportRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _1;
    const userAuth = req.body.userAuth;
    const name = req.body.name || "";
    const ocupacion = req.body.ocupacion || "";
    const rut = req.body.rut || "";
    const intervalo = req.body.intervalo || 365;
    const initDate = req.body.fecha || new Date().toISOString().split("T", 1).toString();
    const fecha = new Date(initDate);
    const fechaActual = (0, fecha_1.sumarDias)(fecha, 1).split("T", 1).toString();
    const fechaAnterior = (0, fecha_1.restarDias)(fecha, intervalo).split("T", 1).toString();
    let turno = req.body.turno || "";
    let contratista = req.body.contratista || "";
    let egroupName;
    if (contratista == "all") {
        contratista = "";
    }
    if (turno == "all") {
        turno = "";
    }
    if (req.body.role === "ADM" || req.body.role === "USM") {
        !contratista ? (egroupName = "") : (egroupName = contratista);
    }
    else {
        egroupName = userAuth.name;
    }
    const resource = yield ((_1 = Pass_Record_1.default.sequelize) === null || _1 === void 0 ? void 0 : _1.query(`
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
              `, { type: QueryTypes.SELECT }));
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
    yield (resource === null || resource === void 0 ? void 0 : resource.forEach((row, index) => {
        ws.cell(index + 2, 1).string((row === null || row === void 0 ? void 0 : row.id_card) || "");
        ws.cell(index + 2, 2).string((row === null || row === void 0 ? void 0 : row.name) || "");
        ws.cell(index + 2, 3).string((row === null || row === void 0 ? void 0 : row.email) || "");
        ws.cell(index + 2, 4).string((row === null || row === void 0 ? void 0 : row.resource_url) || "");
        ws.cell(index + 2, 5).string((row === null || row === void 0 ? void 0 : row.ocupacion) || "");
        ws.cell(index + 2, 6).string((row === null || row === void 0 ? void 0 : row.empresa) || "");
        ws.cell(index + 2, 7).date(new Date(row === null || row === void 0 ? void 0 : row.create_time));
    }));
    const Filename = `${(0, uuidv4_1.uuid)()}.xlsx`;
    const pathExcel = path_1.default.join(__dirname, "../..", "excel", Filename);
    yield wb.write(pathExcel, function (err, stats) {
        if (err) {
            console.log(err);
        }
        else {
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
});
exports.downloadReportRecords = downloadReportRecords;
const downReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = req.params.resource_url;
    let url = path_1.default.join(__dirname, "../..", "excel", filename);
    res.status(200).download(url);
});
exports.downReport = downReport;
//*********************
//# sourceMappingURL=person.js.map