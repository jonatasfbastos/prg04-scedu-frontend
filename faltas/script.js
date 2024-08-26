let token = null;
const email = 'teste@teste.com';
const password = '123';

// Função de login
function login() {
  fetch('http://localhost:8080/user/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    token = data.token;
    listAbsences();  // Chama a função para listar faltas após o login
  })
  .catch(error => console.error('Error during login:', error));
}

document.addEventListener("DOMContentLoaded", () => {
  login();  // Chama login ao carregar a página

  // Implementação da funcionalidade de busca
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const filter = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll("#gradesTableBody tr");

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });
  } else {
    console.error('Campo de busca não encontrado!');
  }
});

// Função para realizar requisições autenticadas
function authenticatedFetch(url, options = {}) {
  if (!token) {
    console.error('No token available, please log in.');
    return Promise.reject('No token available');
  }

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, options);
}

// Função para adicionar uma falta
function addAbsence() {
  document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addAbsenceForm');
    if (addForm) {
      addForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const studentName = document.getElementById('studentName').value;
        const absenceDate = document.getElementById('absenceDate').value;
        const justified = document.getElementById('justified').value === 'true';
        const subject = document.getElementById('subject').value;

        const absenceData = {
          student: studentName,
          date: absenceDate,
          justified,
          subject
        };

        try {
          const response = await authenticatedFetch('http://localhost:8080/absences/save', {
            method: 'POST',
            body: JSON.stringify(absenceData),
          });

          if (response.ok) {
            alert('Falta adicionada com sucesso!');
            addForm.reset();
          } else {
            alert('Erro ao adicionar a falta.');
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Erro ao adicionar a falta.');
        }
      });
    } else {
      console.error('Formulário de adição de falta não encontrado!');
    }
  });
}

addAbsence();

// Função para listar todas as faltas
function listAbsences() {
  authenticatedFetch('http://localhost:8080/absences')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao listar as faltas.');
      }
      return response.json();
    })
    .then(data => {
      const absencesList = document.getElementById('absencesList');
      if (absencesList) {
        absencesList.innerHTML = '';

        data.content.forEach(absence => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${absence.id}</td>
            <td>${absence.student}</td>
            <td>${absence.date}</td>
            <td>${absence.justified ? 'Sim' : 'Não'}</td>
            <td>${absence.subject}</td>
            <td>
              <a href="./editar_faltas.html?id=${absence.id}">Editar</a>
              <button onclick="deleteAbsence(${absence.id})">Deletar</button>
            </td>
          `;
          absencesList.appendChild(row);
        });
      } else {
        console.error('Elemento absencesList não encontrado!');
      }
    })
    .catch(error => console.error('Erro ao listar as faltas:', error));
}

// Função para deletar uma falta
async function deleteAbsence(id) {
  try {
    const response = await authenticatedFetch(`http://localhost:8080/absences/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Falta deletada com sucesso!');
      window.location.reload();
    } else {
      alert('Erro ao deletar a falta.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao deletar a falta.');
  }
}

// Função para carregar dados da falta e atualizar
function editAbsence() {
  document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
      alert('ID da falta não fornecido.');
      return;
    }

    const editForm = document.getElementById('editAbsenceForm');
    if (!editForm) {
      console.error('Formulário de edição de falta não encontrado!');
      return;
    }

    try {
      const response = await authenticatedFetch(`http://localhost:8080/absences/${id}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar dados da falta.');
      }

      const data = await response.json();

      document.getElementById('studentName').value = data.student;
      document.getElementById('absenceDate').value = data.date;
      document.getElementById('justified').value = data.justified ? 'true' : 'false';
      document.getElementById('subject').value = data.subject;
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    }

    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const studentName = document.getElementById('studentName').value;
      const absenceDate = document.getElementById('absenceDate').value;
      const justified = document.getElementById('justified').value === 'true';
      const subject = document.getElementById('subject').value;

      const absenceData = {
        student: studentName,
        date: absenceDate,
        justified,
        subject
      };

      try {
        const response = await authenticatedFetch(`http://localhost:8080/absences/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify(absenceData),
        });

        if (response.ok) {
          alert('Falta atualizada com sucesso!');
          window.location.href = './listar_faltas.html';
        } else {
          throw new Error('Erro ao atualizar a falta.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
      }
    });
  });
}

editAbsence();
