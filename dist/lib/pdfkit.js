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
exports.generarPDF = void 0;
const path_1 = __importDefault(require("path"));
const uuidv4_1 = require("uuidv4");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const generarPDF = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { Nombre, Foto, Rut, Email, Ocupacion, Empresa } = data;
    const doc = new PDFDocument();
    const Filename = `${(0, uuidv4_1.uuid)()}.pdf`;
    const urlPath = path_1.default.join(__dirname, "..", "reports", Filename);
    doc.pipe(fs.createWriteStream(urlPath));
    doc.fontSize(35).text("Ficha del trabajador", { align: "center" });
    doc.moveDown();
    // TODO Descargar la imagen de la ruta... guardarlo en el servidor ... generar el pdf  ... eliminar foto
    // doc.image(Foto, {
    //     fit: [400, 400],
    //     align: 'center',
    //     valign: 'center'
    // }).rect(320, 15, 100, 100).stroke()
    doc.moveDown();
    doc.fontSize(20).text(`${Nombre}`);
    doc.fontSize(14).text(`Rut: ${Rut}`);
    doc.fontSize(14).text(`Correo: ${Email}`);
    doc.fontSize(14).text(`Ocupacion: ${Ocupacion}`);
    doc.fontSize(14).text(`Empresa: ${Empresa}`);
    doc.fontSize(14).text(`Estado de documentos: Pendiente`);
    doc.fontSize(14).text(`Estado de enrolamiento: Pendiente`);
    doc.end();
    console.log(urlPath);
    const result = {
        Filename,
        urlPath,
        Estado: "OK",
    };
    return result;
});
exports.generarPDF = generarPDF;
//# sourceMappingURL=pdfkit.js.map