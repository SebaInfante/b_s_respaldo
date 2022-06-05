import { Router } from "express";
import { check } from "express-validator";
import {
  createDocument,
  createEmployement,
  createUser,
  deleteUser,
  getemploxmandanteAdmin,
  getUser,
  getUserEmpleado,
  getUserEmpleadoPorMandanteYAdmin,
  getUserMandante,
  getUsers,
  putUser,
  getUserEmpleadoPorAdmin
} from "../controllers/users";

import { validarCampos } from "../middlewares/validar-campos";
import { validarJWT } from "../middlewares/validar-jwt";
import {
  esAdminMandanteRole,
  esAdminRole,
  esMandanteRole,
} from "../middlewares/validar-role";

const router = Router();

router.get("/", [validarJWT, esAdminRole], getUsers);

router.get("/mandantes", [validarJWT, esAdminRole], getUserMandante);

router.get("/empleados", [validarJWT, esAdminRole], getUserEmpleado);

router.get(
  "/empleadosXadmin",
  [validarJWT, esAdminRole],
  getUserEmpleadoPorAdmin
);

router.get(
  "/empleadosXmandante",
  [validarJWT],
  getUserEmpleadoPorMandanteYAdmin
);

router.post(
  "/emploxmandanteAdmin",
  [
    validarJWT,
    // esAdminRole,  :TODO
    // check('mandante','Mandante is required').not().isEmpty(),
    // check('mandante','Mandante is a number').isNumeric(),
    // validarCampos,
  ],
  getemploxmandanteAdmin
);

router.get(
  "/:id",
  [validarJWT, esAdminRole, check("id", "Id is required").not().isEmpty()],
  getUser
);

router.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password is required").isLength({ min: 6 }),
    check("role", "Role is required").not().isEmpty(),
    check("role", "Role is not valid").isIn(["ADM", "USM", "USC"]),
    check("email", "Email is not valid").isEmail(),
    validarCampos,
  ],
  createUser
);

router.post(
  "/employment",
  [
    validarJWT,
    esAdminRole,
    check("mandante", "Mandante is required").not().isEmpty(),
    check("employee", "Employee is required").not().isEmpty(),
    check("employment", "Employment is required").not().isEmpty(),
    validarCampos,
  ],
  createEmployement
);

router.post(
  "/document",
  [
    validarJWT,
    esAdminRole,
    check("id_employment", "Employment is required").not().isEmpty(),
    check("name", "Document is required").not().isEmpty(),
    validarCampos,
  ],
  createDocument
);

router.put(
  "/:id",
  [validarJWT, esAdminRole, check("id", "Id is required").not().isEmpty()],
  putUser
);

router.delete(
  "/:id",
  [validarJWT, esAdminRole, check("id", "Id is required").not().isEmpty()],
  deleteUser
);

export default router;
