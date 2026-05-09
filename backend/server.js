const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "your_secret_key"; // use env variable in production

// SQLite setup
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./student_system.db", (err) => {
  if (err) console.error("SQLite error:", err.message);
  else console.log("SQLite connected successfully");
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    course TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT,
    name TEXT,
    lecturer TEXT,
    credits INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    message TEXT,
    date TEXT
  )`);
});

// Auth middleware
function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ message: "No token" });
  const token = header.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "1h" });
    return res.json({ token, role: "admin" });
  }
  if (username === "student" && password === "student123") {
    const token = jwt.sign({ role: "student" }, SECRET, { expiresIn: "1h" });
    return res.json({ token, role: "student" });
  }
  res.status(401).json({ message: "Invalid credentials" });
});


// ---------------- STUDENTS CRUD ----------------

// GET all students
app.get("/students", auth, (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add student
app.post("/students", auth, (req, res) => {
  const { name, email, course } = req.body.student;
  db.run(
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
    [name, email, course],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Student added" });
    }
  );
});

// PUT update student
app.put("/students/:id", auth, (req, res) => {
  const { name, email, course } = req.body.student;
  db.run(
    "UPDATE students SET name=?, email=?, course=? WHERE id=?",
    [name, email, course, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Student updated" });
    }
  );
});

// DELETE student
app.delete("/students/:id", auth, (req, res) => {
  db.run("DELETE FROM students WHERE id=?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student deleted" });
  });
});


// ---------------- COURSES CRUD ----------------

// GET all courses
app.get("/courses", auth, (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add course
app.post("/courses", auth, (req, res) => {
  const { code, name, lecturer, credits } = req.body.course;
  db.run(
    "INSERT INTO courses (code, name, lecturer, credits) VALUES (?, ?, ?, ?)",
    [code, name, lecturer, credits],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Course added" });
    }
  );
});

// PUT update course
app.put("/courses/:id", auth, (req, res) => {
  const { code, name, lecturer, credits } = req.body.course;
  db.run(
    "UPDATE courses SET code=?, name=?, lecturer=?, credits=? WHERE id=?",
    [code, name, lecturer, credits, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Course updated" });
    }
  );
});

// DELETE course
app.delete("/courses/:id", auth, (req, res) => {
  db.run("DELETE FROM courses WHERE id=?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Course deleted" });
  });
});


// ---------------- ANNOUNCEMENTS CRUD ----------------

// GET all announcements
app.get("/announcements", auth, (req, res) => {
  db.all("SELECT * FROM announcements", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add announcement
app.post("/announcements", auth, (req, res) => {
  const { title, message, date } = req.body.announcement;
  db.run(
    "INSERT INTO announcements (title, message, date) VALUES (?, ?, ?)",
    [title, message, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Announcement added" });
    }
  );
});

// PUT update announcement
app.put("/announcements/:id", auth, (req, res) => {
  const { title, message, date } = req.body.announcement;
  db.run(
    "UPDATE announcements SET title=?, message=?, date=? WHERE id=?",
    [title, message, date, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Announcement updated" });
    }
  );
});

// DELETE announcement
app.delete("/announcements/:id", auth, (req, res) => {
  db.run("DELETE FROM announcements WHERE id=?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Announcement deleted" });
  });
});


// ---------------- SERVER START ----------------
app.listen(10000, () => {
  console.log("Server running on http://localhost:10000");
});
