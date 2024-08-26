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
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    token = data.token;
    listTurmas();  // Chama a função para listar turmas após o login
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
      const rows = document.querySelectorAll("#turmasTableBody tr");

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

// Função para listar todas as turmas
function listTurmas() {
  authenticatedFetch('http://localhost:8080/turmas')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao listar as turmas.');
      }
      return response.json();
    })
    .then(data => {
      const turmasTableBody = document.getElementById('turmasTableBody');
      if (turmasTableBody) {
        turmasTableBody.innerHTML = '';

        // Ordena os dados pelo id em ordem crescente
        data.content.sort((a, b) => a.id - b.id);

        data.content.forEach(turma => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${turma.codigo}</td>
            <td>${turma.escola}</td>
            <td>${turma.nome}</td>
            <td>${turma.serie}</td>
            <td>${turma.anoLetivo}</td>
            <td>${turma.numeroSala}</td>
            <td>${turma.turno}</td>
            <td>${turma.numeroMaximoAlunos}</td>
            <td>
              <a href="./editar_turmas.html?id=${turma.id}">Editar</a>
              <button onclick="deleteTurma(${turma.id})">Deletar</button>
            </td>
          `;
          turmasTableBody.appendChild(row);
        });
      } else {
        console.error('Elemento turmasTableBody não encontrado!');
      }
    })
    .catch(error => console.error('Erro ao listar as turmas:', error));
}

// Função para deletar uma turma
async function deleteTurma(id) {
  try {
    const response = await authenticatedFetch(`http://localhost:8080/turmas/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Turma deletada com sucesso!');
      window.location.reload();
    } else {
      alert('Erro ao deletar a turma.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao deletar a turma.');
  }
}

// Função para adicionar uma turma
function addTurma() {
  document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addTurmaForm');
    if (addForm) {
      addForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const codigo = document.getElementById('codigo').value;
        const escola = document.getElementById('escola').value;
        const nome = document.getElementById('nome').value;
        const serie = document.getElementById('serie').value;
        const anoLetivo = parseInt(document.getElementById('anoLetivo').value);
        const numeroSala = parseInt(document.getElementById('numeroSala').value);
        const turno = document.getElementById('turno').value;
        const numeroMaximoAlunos = parseInt(document.getElementById('numeroMaximoAlunos').value);

        const turmaData = {
          codigo,
          escola,
          nome,
          serie,
          anoLetivo,
          numeroSala,
          turno,
          numeroMaximoAlunos
        };

        try {
          const response = await authenticatedFetch('http://localhost:8080/turmas/save', {
            method: 'POST',
            body: JSON.stringify(turmaData),
          });

          if (response.ok) {
            alert('Turma adicionada com sucesso!');
            addForm.reset();
          } else {
            alert('Erro ao adicionar a turma.');
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Erro ao adicionar a turma.');
        }
      });
    } else {
      console.error('Formulário de adição de turma não encontrado!');
    }
  });
}

addTurma();

// Função para carregar dados da turma e atualizar
function editTurma() {
  document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
      alert('ID da turma não fornecido.');
      return;
    }

    const editForm = document.getElementById('editTurmaForm');
    if (!editForm) {
      console.error('Formulário de edição de turma não encontrado!');
      return;
    }

    try {
      const response = await authenticatedFetch(`http://localhost:8080/turmas/${id}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar dados da turma.');
      }

      const data = await response.json();

      document.getElementById('codigo').value = data.codigo;
      document.getElementById('escola').value = data.escola;
      document.getElementById('nome').value = data.nome;
      document.getElementById('serie').value = data.serie;
      document.getElementById('anoLetivo').value = data.anoLetivo;
      document.getElementById('numeroSala').value = data.numeroSala;
      document.getElementById('turno').value = data.turno;
      document.getElementById('numeroMaximoAlunos').value = data.numeroMaximoAlunos;
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    }

    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const codigo = document.getElementById('codigo').value;
      const escola = document.getElementById('escola').value;
      const nome = document.getElementById('nome').value;
      const serie = document.getElementById('serie').value;
      const anoLetivo = parseInt(document.getElementById('anoLetivo').value);
      const numeroSala = parseInt(document.getElementById('numeroSala').value);
      const turno = document.getElementById('turno').value;
      const numeroMaximoAlunos = parseInt(document.getElementById('numeroMaximoAlunos').value);

      const turmaData = {
        codigo,
        escola,
        nome,
        serie,
        anoLetivo,
        numeroSala,
        turno,
        numeroMaximoAlunos
      };

      try {
        const response = await authenticatedFetch(`http://localhost:8080/turmas/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify(turmaData),
        });

        if (response.ok) {
          alert('Turma atualizada com sucesso!');
          window.location.href = './listar_turmas.html';
        } else {
          throw new Error('Erro ao atualizar a turma.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
      }
    });
  });
}

editTurma();
