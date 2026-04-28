let role = null; // will be set after login

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const studentForm = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

// Handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      role = data.role;
      localStorage.setItem("role", role);
      loginStatus.innerText = `Logged in as ${role}`;
      loadStudents();
    } else {
      loginStatus.innerText = data.message;
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});

// Load students
async function loadStudents() {
  try {
    const res = await fetch("http://localhost:3000/students");
    const students = await res.json();

    table.innerHTML = "<tr><th>ID</th><th>Name</th><th>Course</th></tr>";

    students.forEach(s => {
      const row = table.insertRow();
      row.insertCell(0).innerText = s.id;
      row.insertCell(1).innerText = s.name;
      row.insertCell(2).innerText = s.course;
    });
  } catch (err) {
    console.error("Error loading students:", err);
  }
}

// Add student
studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!role) {
    alert("Please login first!");
    return;
  }

  const student = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    course: document.getElementById("course").value
  };

  try {
    await fetch("http://localhost:3000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, student })
    });

    studentForm.reset();
    loadStudents();
  } catch (err) {
    console.error("Error adding student:", err);
  }
});
