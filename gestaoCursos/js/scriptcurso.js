var token = null;
const email = 'ribeirowiliam562@gmail.com';
const password = 'wiiam123';

// Função para realizar o login
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
      localStorage.setItem('jwtToken', token); // Armazena o token no localStorage
      fetchCourses();
    })
    .catch(error => console.error('Error during login', error));
}

// Função para realizar requisições autenticadas
function authenticatedFetch(url, options = {}) {
  const token = getAuthToken();
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

// Obtém o token do localStorage
function getAuthToken() {
  return localStorage.getItem('jwtToken');
}

// Função para listar cursos
function fetchCourses() {
  authenticatedFetch('http://localhost:8080/Cursos/findall')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#coursesTable tbody');
      tableBody.innerHTML = ''; // Limpa o corpo da tabela
      data.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${course.code}</td>
          <td>${course.name}</td>
          <td>${course.description}</td>
          <td>${course.courseHours}</td>
          <td>${course.status}</td>
          <td>${course.mode}</td>
          <td>
            <button class="btn" onclick="window.location.href='form-update-course.html'">Editar</button>
            <button class="btn" onclick="deleteCourse(${course.code})">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Erro ao buscar cursos', error));
}

// Evento para buscar cursos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  fetchCourses();
});

// Função para salvar curso
document.getElementById('courseForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const formData = new FormData(this);
  const formObject = Object.fromEntries(formData.entries());
  const json = JSON.stringify(formObject);

  authenticatedFetch('http://localhost:8080/Cursos/save', {
    method: 'POST',
    body: json
  })
    .then(response => response.json())
    .then(data => {
      console.log('Salvo com sucesso', data);
    })
    .catch((error) => {
      console.error('Erro ao salvar', error);
    });
});

// Função para buscar dados do curso
function fetchCourseData(code) {
  authenticatedFetch(`http://localhost:8080/Cursos/find/${code}`)
    .then(response => response.json())
    .then(course => {
      document.getElementById('code').value = course.code;
      document.getElementById('name').value = course.name;
      document.getElementById('description').value = course.description;
      document.getElementById('courseHours').value = course.courseHours;
      document.getElementById('status').value = course.status;
      document.getElementById('mode').value = course.mode;
    })
    .catch((error) => console.error('Erro ao buscar dados do curso', error));
}

// Função para atualizar curso
function updateCourse(code) {
  const formData = new FormData(document.getElementById('editCourseForm'));
  const data = Object.fromEntries(formData.entries());

  authenticatedFetch(`http://localhost:8080/Cursos/update/${code}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        alert('Curso atualizado com sucesso.');
        window.location.href = '/gestaoCursos/indexcurso.html'; // Redireciona após sucesso
      } else {
        alert('Erro ao atualizar o curso.');
      }
    })
    .catch(error => console.error('Erro ao atualizar o curso:', error));
}

// Função para deletar curso
function deleteCourse(code) {
  if (confirm('Tem certeza que deseja excluir esse curso?')) {
    authenticatedFetch(`http://localhost:8080/Cursos/delete/${code}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          alert('Curso deletado com sucesso.');
          document.querySelector(`button[onclick="deleteCourse(${code})"]`).closest('tr').remove(); // Remove a linha da tabela após a exclusão
        } else {
          alert('Erro ao deletar curso');
        }
      }).catch(error => console.error('Erro ao deletar curso:', error));
  }
}

// Função para filtrar cursos
function filterCourses() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#coursesTable tbody tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(searchInput));
    row.style.display = match ? '' : 'none';
  });
}
