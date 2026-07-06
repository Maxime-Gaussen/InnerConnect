import { Pro } from "../model/pro.js";
import { findMedecinByIdentification } from "./apiController.js";

const model = new Pro();

export async function getOne(req, res) {
    const pro = await model.get(req.params.id);
    if (pro) {
        res.json({ pro });
    } else {
        res.status(404).json({ error: "Professionnel introuvable" });
    }
}

export async function getByUser(req, res) {
    const pro = await model.getBy({ id_user: req.params.id_user });
    if (pro) {
        res.json({ pro });
    } else {
        res.status(404).json({ error: "Professionnel introuvable" });
    }
}

export async function update(req, res) {
    req.body.id = req.params.id;
    const pro = await model.update(req.body,req.params.id);
    res.json({pro : pro});
}

export async function create(req, res) {
    const pro = {
        id_user: req.body.id_user,
        nom_cabinet: req.body.nom_cabinet,
        description: req.body.description,
        horaire_cabinet: req.body.horaire_cabinet,
    };
    const created = await model.create(pro);
    res.json({ pro: created });
}

export async function addMethodologie(req, res) {
    const result = await model.addMethodo(req.params.id_user, req.params.id_methodo);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Professionnel introuvable" });
    }
}

export async function searchByVille(req, res) {
    const { ville, id_methodo } = req.query;
    if (!id_methodo)
        return res.status(400).json({ error: "id_methodo requis" });
    try {
        const pros = await model.searchByMethodo(id_methodo, ville || '');
        res.json(pros);
    } catch {
        res.status(500).json({ error: "Erreur serveur" });
    }
}

export async function getAllProByMethodologie(req, res) {
    const pros = await model.getAllProByMethodo(req.params.id_methodologie);
    if (pros) {
        res.json(pros);
    } else {
        res.status(404).json({ error: "Aucun professionnel trouvé" });
    }
}

export async function verify(req, res) {
    const { identificationNationale } = req.body;
    if (!identificationNationale)
        return res.status(400).json({ error: "identificationNationale requis" });
    try {
        const medecinData = await findMedecinByIdentification(identificationNationale);
        if (!medecinData)
            return res.status(404).json({ error: "Numéro d'identification non reconnu" });
        res.json({
            identificationNationale: medecinData["Identification nationale PP"],
            nom: medecinData["Nom d'exercice"],
            prenom: medecinData["Prénom d'exercice"],
            profession: medecinData["Libellé profession"],
            specialite: medecinData["Libellé spécialité"],
        });
    } catch {
        res.status(503).json({ error: "Service indisponible, réessayez dans quelques instants." });
    }
}

export async function register(req, res) {
    const { identificationNationale, id_user, nom_cabinet, description, horaire_cabinet } = req.body;
    if (!identificationNationale || !id_user)
        return res.status(400).json({ error: "identificationNationale et id_user requis" });

    const medecinData = await findMedecinByIdentification(identificationNationale);
    if (!medecinData)
        return res.status(403).json({ error: "Numéro d'identification non reconnu" });

    const existing = await model.getBy({ id_user });
    if (existing)
        return res.status(409).json({ error: "Ce professionnel a déjà un profil" });

    const { adresse, ville } = req.body;
    const profil = { id_user, nom_cabinet, adresse: adresse || '', ville: ville || '', description, horaire_cabinet };
    const created = await model.create(profil);
    res.status(201).json(created);
}
