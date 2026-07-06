import db from "../database.js";

export class AbstractModel {
    table;
    colones;

    async get(id) {
        const idCol = this.primaryKey || ('id_' + this.table);
        return await db.getrow('SELECT * FROM ' + this.table + ' WHERE ' + idCol + ' = ?', [id]);
    }

    async getAll() {
        return await db.getall('SELECT * FROM ' + this.table);
    }

    async getBy(data) {
        return (await this.getAllBy(data))[0];
    }

    async getAllBy(data) {
        const cols = [];
        for (const key in data) {
            if (this.colones.includes(key))
                cols.push(key + ' = :' + key);
        }
        return await db.getall('SELECT * FROM ' + this.table + ' WHERE ' + cols.join(' AND '), data);
    }

    async create(data) {
        const cols = this.colones.map(c => c);
        const vals = this.colones.map(c => ':' + c);
        const sql = `INSERT INTO ${this.table}(${cols.join(', ')}) VALUES (${vals.join(', ')})`;
        const insertId = await db.insert(sql, data);
        return await this.get(insertId);
    }

    async update(data, id) {
        const idCol = this.primaryKey || ('id_' + this.table);
        const cols = [];
        for (const key in data) {
            if (this.colones.includes(key))
                cols.push(key + ' = :' + key);
        }
        await db.update('UPDATE ' + this.table + ' SET ' + cols.join(', ') + ' WHERE ' + idCol + ' = ' + String(id), data);
        return await this.get(id);
    }

    async remove(objOrId) {
        const id = objOrId?.id ?? objOrId;
        const idCol = this.primaryKey || ('id_' + this.table);
        const rowsAffected = await db.delete('DELETE FROM ' + this.table + ' WHERE ' + idCol + ' = ?', [id]);
        return !!rowsAffected;
    }
}
