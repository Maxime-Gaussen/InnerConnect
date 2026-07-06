import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const model = new User();

const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const JWT_TTL_SEC   = 7 * 24 * 60 * 60;

export async function login(req, res) {
    const user = await model.getBy({ email: req.body.email });
    
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, { expiresIn: JWT_TTL_SEC });
        res.cookie('token', token, {
            maxAge: COOKIE_TTL_MS,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        const { password: _pw, ...safeUser } = user;
        res.json({ token, user: safeUser });
    } else {
        res.status(401).json({ error: "Identifiants incorrects" });
    }
}

export async function get(req, res) {
    delete req.user.password;
    res.json({user : req.user});
}

export async function logout(req, res) {
    res.clearCookie('token');
    res.json({ success: true });
}
