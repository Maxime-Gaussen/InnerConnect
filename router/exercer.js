import { Router } from "express";
import * as exercerCtrl from '../controller/exercer.js';
import { authByToken } from '../midelware/auth.js';

const router = Router();

router.get('/:id_pro/:id_methodologie', exercerCtrl.getOneByProAndMethodo);
router.get('/:id_pro', exercerCtrl.getOneByPro);
router.post('/', authByToken, exercerCtrl.create);
router.delete('/:id_pro/:id_methodologie', authByToken, exercerCtrl.remove);
router.put('/update/:id_pro', authByToken, exercerCtrl.update);

export default router;
