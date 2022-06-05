"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const records_1 = require("../controllers/records");
const validar_role_1 = require("../middlewares/validar-role");
const router = (0, express_1.Router)();
router.post('/', [validar_jwt_1.validarJWT], records_1.recordsToDay);
router.post('/report', records_1.downloadReportRecords);
router.get('/downreport/:resource_url', records_1.downReport);
router.put('/editarPasada/:id', [validar_jwt_1.validarJWT, validar_role_1.esAdminRole], records_1.updateRecord);
router.delete("/deleteRecord/:id", [validar_jwt_1.validarJWT, validar_role_1.esAdminRole], records_1.deleteRecord);
exports.default = router;
//# sourceMappingURL=records.js.map