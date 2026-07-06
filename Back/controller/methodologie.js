import { Methodologie } from "../model/methodologie.js";

const model = new Methodologie();

export async function getOne(req, res) {
    const methodologies = await model.get(req.params.id);
    if (methodologies) {
        res.json({methodo : methodologies});
    } else {
        res.status(404).json({ error: "Méthodologie introuvable" });
    }
}

export async function getAll(req, res) {
    const methodologies = await model.getAll();
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(methodologies);
}

export async function create(req, res) {
    const methodologie = {
        titre: req.body.titre,
        descriptif: req.body.descriptif,
        img_presentation: req.body.img_presentation,
    };
    const created = await model.create(methodologie);
    res.json(created);
}

export async function getAllMethodologieByPro(req, res) {
    const methodologies = await model.getAllMethodoByPro(req.params.id_user);
    if (methodologies) {
        res.json(methodologies);
    } else {
        res.status(404).json({ error: "Professionnel introuvable" });
    }
}
