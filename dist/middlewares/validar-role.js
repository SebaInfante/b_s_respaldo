"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAdminMandanteRole = exports.esMandanteRole = exports.esAdminRole = void 0;
const esAdminRole = (req, res, next) => {
    const userAuth = req.body.userAuth || '';
    if (!userAuth) {
        return res.status(500).json({ msg: 'Se quiere verificar el role sin validar el token primero' });
    }
    const { role, name } = userAuth;
    if (role !== 'ADM') {
        res.status(401).json({ msg: `${name} no es administrador` });
    }
    ;
    next();
};
exports.esAdminRole = esAdminRole;
const esMandanteRole = (req, res, next) => {
    const userAuth = req.body.userAuth || '';
    if (!userAuth) {
        return res.status(500).json({ msg: 'Se quiere verificar el role sin validar el token primero' });
    }
    const { role, name } = userAuth;
    if (role !== 'USM') {
        res.status(401).json({ msg: `${name} no es administrador` });
    }
    ;
    next();
};
exports.esMandanteRole = esMandanteRole;
const esAdminMandanteRole = (req, res, next) => {
    const userAuth = req.body.userAuth || '';
    if (!userAuth) {
        return res.status(500).json({ msg: 'Se quiere verificar el role sin validar el token primero' });
    }
    const { role, name } = userAuth;
    if (role !== 'USM' || role !== 'ADM') {
        res.status(401).json({ msg: `${name} no es administrador o mandante` });
    }
    ;
    next();
};
exports.esAdminMandanteRole = esAdminMandanteRole;
//# sourceMappingURL=validar-role.js.map