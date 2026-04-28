const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    course: document.getElementById("course").value
  };

  try {
    await fetch("http://localhost:3000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });

    form.reset();
    loadStudents();
  } catch (err) {
    console.error("Error adding student:", err);
  }
});

loadStudents();
