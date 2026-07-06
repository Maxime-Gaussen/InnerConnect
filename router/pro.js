import { Router } from "express";
import { getMedecins } from "../controller/apiController.js";
import * as proCtrl from '../controller/pro.js';
import { authByToken } from '../midelware/auth.js';

const router = Router();

router.get("/opendata", getMedecins);
router.get("/search", proCtrl.searchByVille);
router.get("/user/:id_user", proCtrl.getByUser);
router.post("/verify", authByToken, proCtrl.verify);
router.post("/register", authByToken, proCtrl.register);
router.get('/:id', proCtrl.getOne);
router.post('/', authByToken, proCtrl.create);
router.put('/:id', authByToken, proCtrl.update);

export default router;