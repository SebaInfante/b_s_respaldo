import path from "path";
const PDFDocument = require("pdfkit");
const fs = require("fs");
const imageDownloader = require("../lib/image-downloader").download;

export const generarPDF = async (data: any) => {

    try {
        const { Nombre, Foto, Rut, Email, Ocupacion, Empresa, Filename } = data;
        const imageUrl = `http://173.249.58.215:9000${Foto}`;
    
        const extension = imageUrl.split('.').pop();
        const filenameImg = path.join(__dirname,"../..","uploads/fichas/images",`${Rut}.${extension}`);
    
        imageDownloader(imageUrl, filenameImg, function () {console.log(`${imageUrl} image download!!`);});
            setTimeout(() => {
                return crearPdf( Nombre, filenameImg, Rut, Email, Ocupacion, Empresa, Filename)
            }, 3000);
    } catch (error) {
        console.log("☢☣☢ 🧟‍♂️ ☣☢☣ ~ file: pdfkit.ts ~ line 11 ~ generarPDF ~ error", error)
    }

};

async function crearPdf( Nombre:any, FotoUrl:any, Rut:any, Email:any, Ocupacion:any, Empresa:any, Filename:any) {
    const urlPath = path.join(__dirname, "../..", "uploads/fichas", Filename);
    
    const doc  =  new PDFDocument();
    doc.pipe(fs.createWriteStream(urlPath));
    doc.fontSize(25).text("Ficha del trabajador", { align: "center" });

    doc.moveTo(50, 110).lineTo(570, 110).stroke();
    doc.moveTo(270, 175).lineTo(570, 175).stroke();

    doc.image(FotoUrl, 100,155 ,{ width: 150 });

    doc.fontSize(16).text(`${Nombre}`, 270,155);

    doc.fontSize(12).text(`Rut: ${Rut}`, 270,190);

    doc.fontSize(12).text(`Correo: ${Email}`, 270,210);

    doc.fontSize(12).text(`Ocupacion: ${Ocupacion}`, 270,230);

    doc.fontSize(12).text(`Empresa: ${Empresa}`, 270,250);

    doc.fontSize(12).text(`Estado de documentos:`, 270,270);
    doc.fontSize(12).fillColor('#127CC1').text(`Pendiente`, 405,270);

    doc.fontSize(12).fillColor('black').text(`Estado de enrolamiento:`, 270,290);
    doc.fontSize(12).fillColor('#127CC1').text(`Pendiente`, 410,290);
    doc.end();

    const result = {
        Filename,
        urlPath,
        Estado: "OK",
    };
    return result
}