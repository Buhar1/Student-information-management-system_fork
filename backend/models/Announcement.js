const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./student_system.db");

db.run(`CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  message TEXT,
  date TEXT
)`);

module.exports = db;
