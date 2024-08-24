let editingGradeId = null;
let token = null;
const email = 'exemplo@email';
const password = 'exemplosenha';

// Função de login
function login() {
  fetch('http://localhost:8080/user/auth/login', {  // URL de login
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })  // Ajuste no nome da variável
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    token = data.token;  // Armazena o token JWT
    fetchGrades();  // Faz a requisição autenticada após o login
  })
  .catch(error => console.error('Error during login:', error));
}

document.addEventListener("DOMContentLoaded", () => {
  login();  // Chama login ao carregar a página

  // Implementação da funcionalidade de busca
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function() {
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#gradesTableBody tr");

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
});

// Função para realizar requisições autenticadas
function authenticatedFetch(url, options = {}) {
  if (!token) {
    console.error('No token available, please log in.');
    return;
  }

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,  // Adiciona o token JWT ao cabeçalho
    'Content-Type': 'application/json'
  };

  return fetch(url, options);
}

// Função para buscar todas as séries
function fetchGrades() {
  authenticatedFetch("http://localhost:8080/grades")
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById("gradesTableBody");
      tableBody.innerHTML = "";
      data.content.forEach(grade => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${grade.code}</td>
          <td>${grade.name}</td>
          <td>${grade.curriculumCode}</td>
          <td>
            <button onclick="openEditForm(${grade.id}, '${grade.code}', '${grade.name}', '${grade.curriculumCode}')">Edit</button>
            <button onclick="deleteGrade(${grade.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching grades:", error));
}

// Abre o formulário de edição e preenche com os dados da série
function openEditForm(id, code, name, curriculumCode) {
  editingGradeId = id;
  document.getElementById("editCode").value = code;
  document.getElementById("editName").value = name;
  document.getElementById("editCurriculumCode").value = curriculumCode;
  document.getElementById("editFormContainer").style.display = "block";
}

// Fecha o formulário de edição
function closeEditForm() {
  document.getElementById("editFormContainer").style.display = "none";
  editingGradeId = null;
}

// Manipula a submissão do formulário para atualizar uma série
const editGradeForm = document.getElementById("editGradeForm");
if (editGradeForm) {
  editGradeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const grade = {
      code: document.getElementById("editCode").value,
      name: document.getElementById("editName").value,
      curriculumCode: document.getElementById("editCurriculumCode").value
    };

    authenticatedFetch(`http://localhost:8080/grades/${editingGradeId}`, {
      method: "PUT",
      body: JSON.stringify(grade)
    })
    .then(response => response.json())
    .then(() => {
      alert("Grade updated successfully!");
      closeEditForm();
      fetchGrades();
    })
    .catch(error => console.error("Error updating grade:", error));
  });
}

// Função para excluir uma série
function deleteGrade(id) {
  if (confirm("Are you sure you want to delete this grade?")) {
    authenticatedFetch(`http://localhost:8080/grades/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      alert("Grade deleted successfully!");
      fetchGrades();
    })
    .catch(error => console.error("Error deleting grade:", error));
  }
}

