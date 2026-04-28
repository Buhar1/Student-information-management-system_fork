const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const name = document.getElementById("name").value;
  const id = document.getElementById("id").value;
  const course = document.getElementById("course").value;

  const row = table.insertRow();
  row.insertCell(0).innerText = id;
  row.insertCell(1).innerText = name;
  row.insertCell(2).innerText = course;

  form.reset();
});
