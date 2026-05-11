let role = null;
let token = null;
const BASE_URL = "https://student-information-management-system-nbid.onrender.com";

// Page switching
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
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
      token = data.token;
      role = data.role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainApp").style.display = "flex";

      showPage("dashboard");
      loadDashboard();
      loadStudents();
      loadCourses();
      loadAnnouncements();
    } else {
      document.getElementById("loginStatus").innerText = data.message;
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});

// Dashboard
async function loadDashboard() {
  const [studentsRes, coursesRes] = await Promise.all([
    fetch(`${BASE_URL}/students`, {headers: {"Authorization": `Bearer ${token}`}}),
    fetch(`${BASE_URL}/courses`, {headers: {"Authorization": `Bearer ${token}`}}),
  ]);
    
  const students = await studentsRes.json();
  const courses = await coursesRes.json();

  document.getElementById("totalStudents").innerText = students.length;
  document.getElementById("totalCourses").innerText = courses.length;

  // Placeholder for attendance until implemented
  document.getElementById("avgAttendance").innerText = "85%";

  //GPA chart
  const ctx = document.getElementById('gpaChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Fall 2024', 'Spring 2025'],
      datasets: [{
        label: 'GPA',
        data: [3.7, 3.8],
        borderColor: '#007bff',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

// Students
const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const student = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    course: document.getElementById("course").value
  };
  await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ student })
  });
  studentForm.reset();
  loadStudents();
});

async function loadStudents() {
  const res = await fetch(`${BASE_URL}/students`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const students = await res.json();
  studentTable.innerHTML = "<tr><th>ID</th><th>Name</th><th>Course</th><th>Actions</th></tr>";
  students.forEach(s => {
    const row = studentTable.insertRow();
    row.insertCell(0).innerText = s.id;
    row.insertCell(1).innerText = s.name;
    row.insertCell(2).innerText = s.course;
    const actions = row.insertCell(3);
    if (role === "admin") {
      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.onclick = () => editStudent(s.id);
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => deleteStudent(s.id);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
    }
  });
}

async function editStudent(id) {
  const newName = prompt("Enter new name:");
  const newCourse = prompt("Enter new course:");
  if (!newName || !newCourse) return;
  const student = { id, name: newName, course: newCourse };
  await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ student })
  });
  loadStudents();
}

async function deleteStudent(id) {
  await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadStudents();
}

// Courses
const courseForm = document.getElementById("courseForm");
const courseTable = document.getElementById("courseTable");

courseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const course = {
    id: document.getElementById("courseId").value,
    name: document.getElementById("courseName").value,
    instructor: document.getElementById("instructor").value,
    credits: document.getElementById("credits").value
  };
  await fetch(`${BASE_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ course })
  });
  courseForm.reset();
  loadCourses();
});

async function loadCourses() {
  const res = await fetch(`${BASE_URL}/courses`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const courses = await res.json();
  courseTable.innerHTML = "<tr><th>ID</th><th>Name</th><th>Instructor</th><th>Credits</th><th>Actions</th></tr>";
  courses.forEach(c => {
    const row = courseTable.insertRow();
    row.insertCell(0).innerText = c.id;
    row.insertCell(1).innerText = c.name;
    row.insertCell(2).innerText = c.instructor;
    row.insertCell(3).innerText = c.credits;
    const actions = row.insertCell(4);
    if (role === "admin") {
      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.onclick = () => editCourse(c.id);
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => deleteCourse(c.id);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
    }
  });
}

async function editCourse(id) {
  const newName = prompt("Enter new course name:");
  const newInstructor = prompt("Enter new instructor:");
  const newCredits = prompt("Enter new credits:");
  const course = { id, name: newName, instructor: newInstructor, credits: newCredits };
  await fetch(`${BASE_URL}/courses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ course })
  });
  loadCourses();
}

async function deleteCourse(id) {
  await fetch(`${BASE_URL}/courses/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadCourses();
}

// Announcements
const announcementForm = document.getElementById("announcementForm");
const announcementList = document.getElementById("announcementList");

announcementForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const announcement = {
    id: document.getElementById("announcementId").value,
    title: document.getElementById("announcementTitle").value,
    description: document.getElementById("announcementDesc").value
  };
  await fetch(`${BASE_URL}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ announcement })
  });
  announcementForm.reset();
  loadAnnouncements();
});

async function loadAnnouncements() {
  const res = await fetch(`${BASE_URL}/announcements`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const announcements = await res.json();
  announcementList.innerHTML = "";
  announcements.forEach(a => {
    const li = document.createElement("li");
    li.innerText = `${a.title}: ${a.description}`;
    if (role === "admin") {
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => deleteAnnouncement(a.id);
      li.appendChild(deleteBtn);
    }
    announcementList.appendChild(li);
  });
}

async function deleteAnnouncement(id) {
  await fetch(`${BASE_URL}/announcements/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadAnnouncements();
}


// Settings
function saveSettings() {
  const darkMode = document.getElementById("darkMode").checked;
  const notifications = document.getElementById("notifications").checked;
  alert(`Settings saved:\nDark Mode: ${darkMode}\nNotifications: ${notifications}`);
}

function setRole(role) {
  document.querySelectorAll('.role-item').forEach(btn => {
    btn.classList.remove('active');
  });

  event.currentTarget.classList.add('active');

  const loginBtn = document.getElementById('loginButton');
  loginBtn.innerText = `Login as ${role}`;
}