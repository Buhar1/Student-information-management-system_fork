const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "your_secret_key"; // use env variable in production

// Connect to MongoDB Atlas
mongoose.connect("mongodb://studentAdmin:vIMywiKIU6rQgRO7@cluster0-shard-00-00.vesg4am.mongodb.net:27017,cluster0-shard-00-01.vesg4am.mongodb.net:27017,cluster0-shard-00-02.vesg4am.mongodb.net:27017/student_system?ssl=true&replicaSet=atlas-xyz-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Atlas connected"))
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


// Optional root route
app.get("/", (req, res) => {
  res.send("API is running and connected to MongoDB Atlas!");
});

const PORT = 10000; // you can change this if you want
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
