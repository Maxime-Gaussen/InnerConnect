import Database from "mysql2-async";

const db = new Database({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASS,
database: process.env.DB_NAME,
skiptzfix : true,
dateStrings : true,
});

export default db
