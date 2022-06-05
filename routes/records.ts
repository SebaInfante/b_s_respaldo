
import { Router } from 'express'

import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-jwt';

import { downloadReportRecords, recordsToDay, downReport ,deleteRecord, updateRecord} from '../controllers/records';
import { esAdminRole } from '../middlewares/validar-role';

const router = Router();


router.post('/',[validarJWT], recordsToDay);
router.post('/report', downloadReportRecords);
router.get('/downreport/:resource_url', downReport);

router.put('/editarPasada/:id', [validarJWT, esAdminRole], updateRecord);
router.delete("/deleteRecord/:id", [validarJWT, esAdminRole], deleteRecord);
export default router