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
exports.deleteUser = exports.putUser = exports.createDocument = exports.createEmployement = exports.createUser = exports.getUser = exports.getemploxmandanteAdmin = exports.getUserEmpleadoPorMandanteYAdmin = exports.getUserEmpleadoPorAdmin = exports.getUserEmpleado = exports.getUserMandante = exports.getUsers = void 0;
const bcrypt_1 = require("../lib/bcrypt");
const Docuement_1 = __importDefault(require("../models/Docuement"));
const Employment_1 = __importDefault(require("../models/Employment"));
const Employee_Group_1 = __importDefault(require("../models/Employee_Group"));
const user_1 = __importDefault(require("../models/user"));
// ************************************************************************************************************************
// !                                              VER TODOS LOS USUARIOS
// ************************************************************************************************************************
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.findAll();
    res.json(users);
});
exports.getUsers = getUsers;
// ************************************************************************************************************************
// !                                              VER USUARIO MANDANTE
// ************************************************************************************************************************
const getUserMandante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.findAll({ where: { role: "USM" } });
    res.json(users);
});
exports.getUserMandante = getUserMandante;
// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO
// ************************************************************************************************************************
const getUserEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.findAll({ where: { role: "USC" } });
    res.json(users);
});
exports.getUserEmpleado = getUserEmpleado;
// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO POR MANDANTE
// ************************************************************************************************************************
const getUserEmpleadoPorAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.findAll({
        where: { role: "USC" },
    });
    res.json(users);
});
exports.getUserEmpleadoPorAdmin = getUserEmpleadoPorAdmin;
// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO POR MANDANTE
// ************************************************************************************************************************
const getUserEmpleadoPorMandanteYAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = req.body.userAuth;
    let users;
    if (userAuth.role === "USM") {
        users = yield user_1.default.findAll({ where: { role: "USC", employee: userAuth.id }, });
    }
    else {
        users = yield user_1.default.findAll({ where: { role: "USC" }, });
    }
    res.json(users);
});
exports.getUserEmpleadoPorMandanteYAdmin = getUserEmpleadoPorMandanteYAdmin;
// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO POR MANDANTE
// ************************************************************************************************************************
const getemploxmandanteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mandante = req.body.mandante;
    const users = yield user_1.default.findAll({
        where: { role: "USC", employee: mandante },
    });
    res.json(users);
});
exports.getemploxmandanteAdmin = getemploxmandanteAdmin;
// ************************************************************************************************************************
// !                                              VER SOLO UN USUARIO
// ************************************************************************************************************************
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findByPk(id);
    user
        ? res.json(user)
        : res.status(404).json({ msg: `User with id ${id} not found` });
});
exports.getUser = getUser;
// ************************************************************************************************************************
// !                                              CREAR UN NUEVO USUARIO
// ************************************************************************************************************************
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, employee = null } = req.body;
    try {
        const existsEmail = yield user_1.default.findOne({ where: { email } }); //Buscar si existe un email
        if (existsEmail) {
            return res.status(401).json({ msg: "Email already used" });
        } // Si tal email existe ...
        const hashPassword = yield (0, bcrypt_1.encriptar)(password); //Encriptar la password
        const newUser = {
            //Creo el nuevo usuario
            name,
            email,
            password: hashPassword,
            role,
            employee,
        };
        const user = user_1.default.build(newUser); //Cargo el nuevo usuario
        yield user.save(); //Envío el usuario a la BD
        if (role === 'USC') {
            const existsUSC = yield Employee_Group_1.default.findOne({ where: { name } }); //Buscar si existe un email
            if (!existsUSC) {
                const x = yield Employee_Group_1.default.count();
                const rgt = (x + 1) * 2;
                const lft = rgt - 1;
                const sort_num = x + 1;
                const newEmployeeGroup = {
                    id: x,
                    site_id: 1,
                    name,
                    parent_id: 0,
                    sort_num,
                    lft,
                    rgt,
                    create_user: 'system'
                };
                const employee_group = Employee_Group_1.default.build(newEmployeeGroup); //Cargo el nuevo usuario
                yield employee_group.save(); //Envío el usuario a la BD
            }
        }
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Contact the administrator" });
    }
});
exports.createUser = createUser;
// ************************************************************************************************************************
// !                                              CREAR UN NUEVA OCUPACION
// ************************************************************************************************************************
const createEmployement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mandante, employee, employment } = req.body;
    try {
        const employeeGroup = yield Employee_Group_1.default.findOne({ where: { name: employee } });
        const newEmployement = {
            mandante,
            employee: employeeGroup.id,
            employment,
        };
        const employmentM = Employment_1.default.build(newEmployement);
        yield employmentM.save();
        res.json(employmentM);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Contact the administrator" });
    }
});
exports.createEmployement = createEmployement;
// ************************************************************************************************************************
// !                                              CREAR UN NUEVO DOCUMENTO
// ************************************************************************************************************************
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_employment, name } = req.body;
    try {
        const newDocument = {
            id_employment,
            name,
        };
        const DocumentM = Docuement_1.default.build(newDocument);
        yield DocumentM.save();
        res.json(DocumentM);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Contact the administrator" });
    }
});
exports.createDocument = createDocument;
// ************************************************************************************************************************
// !                                              ACTUALIZAR UN USUARIO
// ************************************************************************************************************************
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    try {
        const user = yield user_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (body.email) {
            const existsEmail = yield user_1.default.findOne({ where: { email: body.email } });
            if (existsEmail) {
                return res.status(400).json({ msg: "Email already used" });
            }
        }
        yield user.update(body);
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Contact the administrator" });
    }
});
exports.putUser = putUser;
// ************************************************************************************************************************
// !                                              ELIMINAR UN USUARIO
// ************************************************************************************************************************
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findByPk(id);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    yield user.update({ status: false }); // Eliminación Logica   //await user.destroy(); Eliminación Fisica
    res.json(user);
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.js.map