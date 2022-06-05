import path from "path";
import { uuid } from "uuidv4";
const PDFDocument = require("pdfkit");
const fs = require("fs");

export const generarPDF = async (data: any) => {
    const { Nombre, Foto, Rut, Email, Ocupacion, Empresa } = data;
    const doc = new PDFDocument();
    const Filename = `${uuid()}.pdf`
    const urlPath = path.join(__dirname, "..", "reports", Filename);

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
};
