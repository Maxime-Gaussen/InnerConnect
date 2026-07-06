import { AbstractModel } from "./AbstractModel.js";
import db from "../database.js";

export class Methodologie extends AbstractModel {
    table = "Methodologie";
    primaryKey = "id_methodologie";
    colones = ["titre", "descriptif", "img_presentation"];

    async getAllMethodoByPro(id_user) {
        return await db.getall('SELECT * FROM Exercer WHERE id_pro = ?', [id_user]);
    }
}
