import { AbstractModel } from "./AbstractModel.js";

export class User extends AbstractModel {
    table = "User";
    colones = ["nom", "prenom", "age", "email", "password"];
}
