import { User } from "../model/user.js";
import jwt from 'jsonwebtoken';

const model = new User();

export async function authByToken(req, res, next) {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const reponse = await model.get(decoded.id);
        if (!reponse) {
            throw new Error()
        }
        req.user = reponse;
        next();
    } catch {
        res.status(401).json({ error: "Wrong token" });
    }
}