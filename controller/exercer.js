import { Exercer } from "../model/exercer.js";


const model = new Exercer();

export async function getOneByProAndMethodo(req, res) {
    const exercer = await model.getBy({ id_pro: req.params.id_pro, id_methodologie: req.params.id_methodologie });
    if (exercer) {
        res.json({ exercer });
    } else {
        res.status(404).json({ error: "Entrée introuvable" });
    }
}

export async function getOneByPro(req, res) {
    const exercer = await model.getAllBy({ id_pro: req.params.id_pro });
    if (exercer) {
        res.json({ exercer });
    } else {
        res.status(404).json({ error: "Professionnel introuvable" });
    }
}

export async function create(req, res) {
    const exercer = {
        id_pro: req.body.id_pro,
        id_methodologie: req.body.id_methodologie,
    };
    const newExercer = await model.create(exercer);
    if(newExercer.error){
        res.status(404).json({ error: "Utilisateur a déja une méthodologie exercer" })
    }
    res.json({ exercer: newExercer });
}

export async function remove(req, res) {
    const { id_pro, id_methodologie } = req.params;
    await model.removeEntry(id_pro, id_methodologie);
    res.json({ success: true });
}

export async function update(req, res) {
    const newExercer = await model.update(req.body, req.params.id_pro);
    res.json({ exercer: newExercer });
}
