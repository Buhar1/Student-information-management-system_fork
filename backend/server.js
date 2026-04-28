const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let students = [];

// Root route (shows a welcome message)
app.get("/", (req, res) => {
  res.send("Backend is running! Use /students to view data.");
});

// Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// Add a student
app.post("/students", (req, res) => {
  const student = req.body;
  students.push(student);
  res.json({ message: "Student added!", student });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
