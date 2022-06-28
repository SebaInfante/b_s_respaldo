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
exports.updateRecord = exports.deleteRecord = exports.downReport = exports.downloadReportRecords = exports.recordsToDay = void 0;
const { QueryTypes } = require("sequelize");
const Pass_Record_1 = __importDefault(require("../models/Pass_Record"));
const fecha_1 = require("../utils/fecha");
const xl = require("excel4node");
const path_1 = __importDefault(require("path"));
const uuidv4_1 = require("uuidv4");
// ************************************************************************************************************************
// !                                                ULTIMAS 1000 PASADAS / 2dias
// ************************************************************************************************************************
const recordsToDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userAuth = req.body.userAuth;
    const name = req.body.name || "";
    const rut = req.body.rut || "";
    const intervalo = req.body.intervalo || 365;
    const initDate = req.body.fecha || new Date().toISOString().split("T", 1).toString();
    const fecha = new Date(initDate);
    const fechaActual = fecha.toISOString().split("T", 1).toString();
    const fechaAnterior = (0, fecha_1.restarDias)(fecha, intervalo).split("T", 1).toString();
    let temp = req.body.temp || "";
    let turno = req.body.turno || "";
    let contratista = req.body.contratista || "";
    console.log(contratista);
    console.log(temp);
    console.log(turno);
    let egroupName;
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
    }
    else {
        egroupName = userAuth.name;
    }
    const resource = (yield ((_a = Pass_Record_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(`
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

                `, { type: QueryTypes.SELECT }))) || "";
    return res.json(resource);
});
exports.recordsToDay = recordsToDay;
const downloadReportRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    console.log(req.body);
    try {
        const userAuth = req.body.userAuth;
        const name = req.body.name || "";
        const rut = req.body.rut || "";
        const intervalo = req.body.intervalo || 1000;
        const initDate = req.body.fecha || new Date().toISOString().split("T", 1).toString();
        const fecha = new Date(initDate);
        const fechaActual = fecha.toISOString().split("T", 1).toString();
        const fechaAnterior = (0, fecha_1.restarDias)(fecha, intervalo).split("T", 1).toString();
        let temp = req.body.temp || "";
        let turno = req.body.turno || "";
        let contratista = req.body.contratista || "";
        console.log(contratista);
        console.log(temp);
        console.log(turno);
        let egroupName;
        if (contratista == "all") {
            contratista = "";
        }
        if (turno == "all") {
            turno = "";
        }
        if (temp == "all") {
            temp = "";
        }
        if (req.body.role === "ADM" || req.body.role === "USM") {
            !contratista ? (egroupName = "") : (egroupName = contratista);
        }
        else {
            console.log(userAuth);
            egroupName = userAuth.name;
        }
        const resource = yield ((_b = Pass_Record_1.default.sequelize) === null || _b === void 0 ? void 0 : _b.query(`
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

                    `, { type: QueryTypes.SELECT }));
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
        yield (resource === null || resource === void 0 ? void 0 : resource.forEach((row, index) => {
            ws.cell(index + 2, 1).date(new Date((row === null || row === void 0 ? void 0 : row.create_time)));
            ws.cell(index + 2, 2).string(row === null || row === void 0 ? void 0 : row.id_card);
            ws.cell(index + 2, 3).string(row === null || row === void 0 ? void 0 : row.name);
            ws.cell(index + 2, 4).string(row === null || row === void 0 ? void 0 : row.resource_url);
            ws.cell(index + 2, 5).string(row === null || row === void 0 ? void 0 : row.img_uri);
            ws.cell(index + 2, 6).string(row === null || row === void 0 ? void 0 : row.empresa);
            ws.cell(index + 2, 7).string(row === null || row === void 0 ? void 0 : row.temperature);
            ws.cell(index + 2, 8).number(row === null || row === void 0 ? void 0 : row.temperature_state);
            ws.cell(index + 2, 9).number(row === null || row === void 0 ? void 0 : row.direction);
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
                    return res.status(200).json({ Filename: Filename, url: 'http://localhost:8000/api/records/downreport' });
                }
                downloadFile();
                return false;
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.downloadReportRecords = downloadReportRecords;
const downReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filename = req.params.resource_url;
        let url = path_1.default.join(__dirname, "../..", "excel", filename);
        res.status(200).download(url);
    }
    catch (error) {
        console.log(error);
    }
});
exports.downReport = downReport;
//*********************
const deleteRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const ID = req.params.id;
        const userAuth = req.body.userAuth;
        const fecha = new Date();
        const today = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        const DeleteRecord = (yield ((_c = Pass_Record_1.default.sequelize) === null || _c === void 0 ? void 0 : _c.query(`
              UPDATE tdx_pass_record SET deleted_flag = 1, update_time = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
          `))) || "";
        return res.status(200).json({ DeleteRecord });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteRecord = deleteRecord;
const updateRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const ID = req.params.id;
        const userAuth = req.body.userAuth;
        const fecha = new Date();
        const today = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        const DeleteRecord = (yield ((_d = Pass_Record_1.default.sequelize) === null || _d === void 0 ? void 0 : _d.query(`
                  UPDATE tdx_pass_record SET person_id = '${req.body.person_id}', direction ='${req.body.turno}',update_time = '${today}', update_user = '${userAuth.name}' WHERE id = '${ID}'
              `))) || "";
        return res.status(200).json({ DeleteRecord });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateRecord = updateRecord;
//# sourceMappingURL=records.js.map