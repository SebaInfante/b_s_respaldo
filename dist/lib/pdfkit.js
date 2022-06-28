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
const PDFDocument = require("pdfkit");
const fs = require("fs");
const imageDownloader = require("../lib/image-downloader").download;
const generarPDF = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Nombre, Foto, Rut, Email, Ocupacion, Empresa, Filename } = data;
        const imageUrl = `http://173.249.58.215:9000${Foto}`;
        const extension = imageUrl.split('.').pop();
        const filenameImg = path_1.default.join(__dirname, "../..", "uploads/fichas/images", `${Rut}.${extension}`);
        imageDownloader(imageUrl, filenameImg, function () { console.log(`${imageUrl} image download!!`); });
        setTimeout(() => {
            return crearPdf(Nombre, filenameImg, Rut, Email, Ocupacion, Empresa, Filename);
        }, 3000);
    }
    catch (error) {
        console.log("☢☣☢ 🧟‍♂️ ☣☢☣ ~ file: pdfkit.ts ~ line 11 ~ generarPDF ~ error", error);
    }
});
exports.generarPDF = generarPDF;
function crearPdf(Nombre, FotoUrl, Rut, Email, Ocupacion, Empresa, Filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlPath = path_1.default.join(__dirname, "../..", "uploads/fichas", Filename);
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(urlPath));
        doc.fontSize(25).text("Ficha del trabajador", { align: "center" });
        doc.moveTo(50, 110).lineTo(570, 110).stroke();
        doc.moveTo(270, 175).lineTo(570, 175).stroke();
        doc.image(FotoUrl, 100, 155, { width: 150 });
        doc.fontSize(16).text(`${Nombre}`, 270, 155);
        doc.fontSize(12).text(`Rut: ${Rut}`, 270, 190);
        doc.fontSize(12).text(`Correo: ${Email}`, 270, 210);
        doc.fontSize(12).text(`Ocupacion: ${Ocupacion}`, 270, 230);
        doc.fontSize(12).text(`Empresa: ${Empresa}`, 270, 250);
        doc.fontSize(12).text(`Estado de documentos:`, 270, 270);
        doc.fontSize(12).fillColor('#127CC1').text(`Pendiente`, 405, 270);
        doc.fontSize(12).fillColor('black').text(`Estado de enrolamiento:`, 270, 290);
        doc.fontSize(12).fillColor('#127CC1').text(`Pendiente`, 410, 290);
        doc.end();
        const result = {
            Filename,
            urlPath,
            Estado: "OK",
        };
        return result;
    });
}
//# sourceMappingURL=pdfkit.js.map