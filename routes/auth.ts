
import { Router } from 'express'
import { check } from 'express-validator';
import { changePassword, login, recoveryAccount, validacionToken } from '../controllers/auth';
import { validarCampos } from '../middlewares/validar-campos';

const router = Router();


router.post('/login',[
    check('email','Email is required').not().isEmpty(),
    check('email','Email is not valid').isEmail(),
    check('password','Password is required').not().isEmpty(),
    check('password','Password is required').isLength( { min: 6 } ),
    validarCampos
], login);

router.post('/validacionToken', validacionToken);

router.post('/recovery-account', [    
    check('email','Email is required').not().isEmpty(),
    check('email','Email is not valid').isEmail(),
    validarCampos
] ,recoveryAccount);

router.post('/recovery-account/:token', [    
    check('password','Password is required').not().isEmpty(),
    check('password','Password is required').isLength( { min: 6 } ),
    validarCampos
] ,changePassword);


export default router