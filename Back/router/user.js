import { Router } from "express";
import * as userCtrl from '../controller/user.js';
import { authByToken } from '../midelware/auth.js';

const router = Router();

router.post('/', userCtrl.create);
router.get('/', authByToken, userCtrl.getAll);
router.get('/:id', authByToken, userCtrl.getOne);
router.put('/:id', authByToken, userCtrl.update);
router.delete('/:id', authByToken, userCtrl.remove);

export default router;