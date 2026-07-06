import { Router } from "express";
import * as sessionCtrl from '../controller/session.js';
import { authByToken } from '../midelware/auth.js';

const router = Router();

router.post('/', sessionCtrl.login);
router.get('/', authByToken, sessionCtrl.get);
router.delete('/', sessionCtrl.logout);

export default router;
