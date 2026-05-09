const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./student_system.db");

db.run(`CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT,
  name TEXT,
  lecturer TEXT,
  credits INTEGER
)`);

module.exports = db;
