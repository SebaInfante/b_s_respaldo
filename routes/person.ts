import { Router } from "express";
import { check } from "express-validator";
import multer from "multer";
const storageStrategy = multer.memoryStorage()
const bstorage = multer({storage:storageStrategy})


import {
  // getPrincipal,
  getPersons,
  addPerson,
  getEmployment,
  getDocuments,
  validarRut,
  cantPersonasTotales,
  photoFile,
  addPersonPhoto,
  photoPreview,
  addEmplyee,
  docsFile,
  getAllEmployment,
  deletePerson,
  getPerson,
  getDocumentsPerson,
  downloadDoc,
  updateDatos,
  deleteFile,
  sendEmailDeletePerson,
  downloadReportRecords,
  downReport,
  getFichaPerson,
  downloadFicha
} from "../controllers/person";
import  storage  from "../lib/multer";
import { validarCampos } from "../middlewares/validar-campos";
import { validarJWT } from "../middlewares/validar-jwt";
import { esAdminRole } from "../middlewares/validar-role";

const router = Router();


// router.get("/",                   [validarJWT], getPrincipal);
router.get("/allEmployement",     [validarJWT, esAdminRole], getAllEmployment);
router.get("/person/:rut",         [validarJWT,check("rut", "Rut is required").not().isEmpty(), validarCampos], getPerson);
router.get("/fichaPerson/:rut",   [validarJWT,check("rut", "Rut is required").not().isEmpty(), validarCampos], getFichaPerson);
router.post("/persons",           [validarJWT], getPersons);
router.post("/cantPersonas",      [validarJWT], cantPersonasTotales);
router.post("/validarRut",        [validarJWT,check("rut", "Rut is required").not().isEmpty(), validarCampos], validarRut);
router.post("/employement",       [validarJWT,check("empresa", "Empresa is required").not().isEmpty(), validarCampos], getEmployment);
router.post("/documents",         [validarJWT,check("ocupacion", "ocupacion is required").not().isEmpty(), validarCampos], getDocuments);
router.post("/photoFile",         [validarJWT, bstorage.single("file")], photoFile);
router.post("/photoPreview",      [validarJWT, bstorage.single("file")], photoPreview);
router.post("/addPerson",         [validarJWT, check("rut", "Rut is required").not().isEmpty(),check("nombre", "Rut is required").not().isEmpty(), validarCampos], addPerson);
router.post("/addPersonPhoto",    [validarJWT, check("id_person", "id_person is required").not().isEmpty(), check("id_resource_data", "id_resource_data is required").not().isEmpty(), validarCampos], addPersonPhoto);
router.post("/addEmplyee",        [validarJWT], addEmplyee);
router.post("/docsFile",          [validarJWT, storage.single("file")], docsFile);
router.post("/documentsPerson",   [validarJWT], getDocumentsPerson);
router.get("/downloadDoc/:resource_url",    downloadDoc);
router.put("/updateDatos/:person_id",  [validarJWT],   updateDatos);
// router.post("/downloadDoc",       [validarJWT], downloadDoc);

router.delete("/deletePerson/:id", [validarJWT], deletePerson);
router.delete("/deleteFile/:id", [validarJWT], deleteFile);

router.post("/sendEmailDeletePerson", [validarJWT], sendEmailDeletePerson);

router.post('/report', downloadReportRecords);
router.get('/downreport/:resource_url', downReport);
router.get('/downloadFicha/:resource_url', downloadFicha);
export default router;
// 