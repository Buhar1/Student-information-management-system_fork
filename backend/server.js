const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "your_secret_key"; // use env variable in production

// Connect to MongoDB
mongoose.connect("mongodb+srv://studentAdmin:StrongPassword123@cluster0.abcd.mongodb.net/student_system", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB error:", err));


// Import models
const Student = require("./models/Student");
const Course = require("./models/Course");
const Announcement = require("./models/Announcement");

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

// Example: Students CRUD
app.get("/students", auth, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/students", auth, async (req, res) => {
  const newStudent = new Student(req.body.student);
  await newStudent.save();
  res.json({ message: "Student added" });
});

// … same pattern for Courses and Announcements
