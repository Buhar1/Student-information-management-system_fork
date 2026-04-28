const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sample users with roles
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "student", password: "student123", role: "student" }
];

// In‑memory student list
let students = [];

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running! Use /login to authenticate and /students to manage data.");
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", role: user.role });
});

// Add student info (allowed for both admin and student)
app.post("/students", (req, res) => {
  const { role, student } = req.body;
  if (role !== "admin" && role !== "student") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  students.push(student);
  res.json({ message: "Student added!", student });
});

// Get all students (anyone can view)
app.get("/students", (req, res) => {
  res.json(students);
});

// Edit student info (admin only)
app.put("/students/:id", (req, res) => {
  const { role, student } = req.body;
  if (role !== "admin") {
    return res.status(403).json({ message: "Only admin can edit" });
  }

  const id = req.params.id;
  const index = students.findIndex(s => s.id === id);

  if (index === -1) return res.status(404).json({ message: "Student not found" });

  students[index] = student;
  res.json({ message: "Student updated!", student });
});

// Delete student info (admin only)
app.delete("/students/:id", (req, res) => {
  const { role } = req.body;
  if (role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete" });
  }

  const id = req.params.id;
  students = students.filter(s => s.id !== id);
  res.json({ message: "Student deleted!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
