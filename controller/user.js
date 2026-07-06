import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const model = new User();

export async function getAll(req, res) {
    const users = await model.getAll();
    for (const user of users) delete user.password;
    res.json(users);
}

export async function getOne(req, res) {
    const user = await model.get(req.params.id);
    if (user) {
        delete user.password;
        res.json(user);
    } else {
        res.status(404).json({ error: "Utilisateur introuvable" });
    }
}

const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const JWT_TTL_SEC   = 7 * 24 * 60 * 60;

export async function create(req, res) {
    const user = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        age: req.body.age,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
    };
    const created = await model.create(user);
    if (created) {
        const token = jwt.sign({ id: created.id_user }, process.env.JWT_SECRET, { expiresIn: JWT_TTL_SEC });
        res.cookie('token', token, {
            maxAge: COOKIE_TTL_MS,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        const { password: _pw, ...safeUser } = created;
        res.json({ token, user: safeUser });
    } else {
        res.status(500).json({ error: "Erreur lors de la création du compte" });
    }
}

export async function update(req, res) {
    if (String(req.user.id_user) !== String(req.params.id)) {
        return res.status(403).json({ error: "Action non autorisée" });
    }
    let updated;
    if (req.body.password) {
        updated = await model.update({ password: await bcrypt.hash(req.body.password, 12) }, req.params.id);
    } else {
        const { password: _pw, ...safe } = req.body;
        updated = await model.update(safe, req.params.id);
    }
    const { password: _pw, ...safeUser } = updated;
    res.json({ user: safeUser });
}

export async function remove(req, res) {
    const result = await model.remove(req.params.id);
    res.json(result);
}
