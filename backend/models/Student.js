const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./student_system.db");

db.run(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  course TEXT
)`);

module.exports = db;
