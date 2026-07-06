import { Router } from "express";
import * as methodologieCtrl from '../controller/methodologie.js';

const router = Router();

router.get('/all/:id', methodologieCtrl.getAllMethodologieByPro);
router.get('/all/', methodologieCtrl.getAll);
router.get('/:id', methodologieCtrl.getOne);
router.post('/', methodologieCtrl.create);

export default router;