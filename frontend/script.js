let role = null; // will be set after login

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const studentForm = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

// localhost with Render backend URL
const BASE_URL = "https://student-information-management-system-nbid.onrender.com";

// Handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
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
    const res = await fetch(`${BASE_URL}/students`);
    const students = await res.json();

    table.innerHTML = "<tr><th>ID</th><th>Name</th><th>Course</th><th>Actions</th></tr>";

    students.forEach(s => {
      const row = table.insertRow();
      row.insertCell(0).innerText = s.id;
      row.insertCell(1).innerText = s.name;
      row.insertCell(2).innerText = s.course;

      const actionsCell = row.insertCell(3);

      // Show buttons only if admin
      if (role === "admin") {
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.onclick = () => editStudent(s.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => deleteStudent(s.id);

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
      }
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
    await fetch(`${BASE_URL}/students`, {
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

// Edit student (admin only)
async function editStudent(id) {
  const newName = prompt("Enter new name:");
  const newCourse = prompt("Enter new course:");

  if (!newName || !newCourse) return;

  const student = { id, name: newName, course: newCourse };

  await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, student })
  });

  loadStudents();
}

// Delete student (admin only)
async function deleteStudent(id) {
  await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role })
  });

  loadStudents();
}
