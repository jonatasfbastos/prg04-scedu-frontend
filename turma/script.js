// Constantes
const API_URL = 'http://localhost:8080';
const AUTH_TOKEN_KEY = 'authToken';

// Variáveis globais
let turmas = [];
let turmaSelecionada = null;

// Função de login
function login() {
  fetch(`${API_URL}user/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'user@email.com', password: 'password' })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    carregarTurmas();
  })
  .catch(error => console.error('Error during login:', error));
}

// Função para carregar as turmas
function carregarTurmas() {
  authenticatedFetch(`${API_URL}/turmas`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    turmas = data.content; // Use "data.content" se estiver paginando
    renderizarTurmas(turmas);
  })
  .catch(error => console.error('Error fetching turmas:', error));
}

// Função para renderizar as turmas
function renderizarTurmas(turmas) {
  const turmasTbody = document.getElementById('turmas-tbody');
  turmasTbody.innerHTML = '';
  turmas.forEach(turma => {
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
        <button class="editar-btn" data-id="${turma.id}">Editar</button>
        <button class="excluir-btn" data-id="${turma.id}">Excluir</button>
      </td>
    `;
    turmasTbody.appendChild(row);
  });
}

// Função para cadastrar ou alterar uma turma
function cadastrarTurma() {
  const turmaForm = document.getElementById('turma-form');
  const turma = {
    codigo: turmaForm.codigo.value,
    escola: turmaForm.escola.value,
    nome: turmaForm.nome.value,
    serie: turmaForm.serie.value,
    anoLetivo: parseInt(turmaForm.anoLetivo.value, 10), // Garantir que anoLetivo é um int
    numeroSala: parseInt(turmaForm.numeroSala.value, 10), // Garantir que numeroSala é um int
    turno: turmaForm.turno.value,
    numeroMaximoAlunos: parseInt(turmaForm.numeroMaximoAlunos.value, 10), // Garantir que numeroMaximoAlunos é um int
  };

  const method = turmaSelecionada ? 'PUT' : 'POST';
  const url = turmaSelecionada ? `${API_URL}/turmas/${turmaSelecionada.id}` : `${API_URL}/turmas`;

  authenticatedFetch(url, {
    method: method,
    body: JSON.stringify(turma)
  })
  .then(response => response.json())
  .then(() => {
    console.log('Turma salva com sucesso!');
    carregarTurmas();
  })
  .catch(error => console.error('Error saving turma:', error));
}

// Função para excluir uma turma
function excluirTurma(id) {
  if (confirm('Tem certeza que deseja excluir esta turma?')) {
    authenticatedFetch(`${API_URL}/turmas/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      console.log('Turma excluída com sucesso!');
      carregarTurmas();
    })
    .catch(error => console.error('Error deleting turma:', error));
  }
}

// Função para pesquisar turmas
function pesquisarTurmas() {
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTurmas = turmas.filter(turma => {
    return Object.values(turma).some(value => 
      value.toString().toLowerCase().includes(searchTerm)
    );
  });
  renderizarTurmas(filteredTurmas);
}

// Função para fazer requisições autenticadas
function authenticatedFetch(url, options) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    return fetch(url, options);
  }
  
 // Eventos
document.addEventListener('DOMContentLoaded', function() {
    login();
    const submitBtn = document.getElementById('submit-btn');
    const searchBtn = document.getElementById('search-btn');
    const turmasTbody = document.getElementById('turmas-tbody');
  
    if (submitBtn && searchBtn && turmasTbody) {
      submitBtn.addEventListener('click', cadastrarTurma);
      searchBtn.addEventListener('click', pesquisarTurmas);
      turmasTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('editar-btn')) {
          const id = e.target.dataset.id;
          turmaSelecionada = turmas.find(turma => turma.id === id);
          const turmaForm = document.getElementById('turma-form');
          turmaForm.codigo.value = turmaSelecionada.codigo;
          turmaForm.escola.value = turmaSelecionada.escola;
          turmaForm.nome.value = turmaSelecionada.nome;
          turmaForm.serie.value = turmaSelecionada.serie;
          turmaForm.anoLetivo.value = turmaSelecionada.anoLetivo;
          turmaForm.numeroSala.value = turmaSelecionada.numeroSala;
          turmaForm.turno.value = turmaSelecionada.turno;
          turmaForm.numeroMaximoAlunos.value = turmaSelecionada.numeroMaximoAlunos;
        } else if (e.target.classList.contains('excluir-btn')) {
          excluirTurma(e.target.dataset.id);
        }
      });
    } else {
      console.error('Erro: elementos não encontrados no DOM');
    }
  });