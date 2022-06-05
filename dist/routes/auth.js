"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('email', 'Email is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Email is not valid').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').isLength({ min: 6 }),
    validar_campos_1.validarCampos
], auth_1.login);
router.post('/validacionToken', auth_1.validacionToken);
router.post('/recovery-account', [
    (0, express_validator_1.check)('email', 'Email is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Email is not valid').isEmail(),
    validar_campos_1.validarCampos
], auth_1.recoveryAccount);
router.post('/recovery-account/:token', [
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').isLength({ min: 6 }),
    validar_campos_1.validarCampos
], auth_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map