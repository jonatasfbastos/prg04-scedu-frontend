let token = null;
const email = 'exemplo@email';
const password = 'exemplosenha';

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
        localStorage.setItem('authToken', token); // Armazena o token no localStorage
        loadTerceirizados(); // Carrega os terceirizados após o login
    })
    .catch(error => console.error('Error during login:', error));
}

// Função para realizar requisições autenticadas
function authenticatedFetch(url, options = {}) {
    if (!token) {
        console.error('No token available, please log in.');
        return;
    }

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    return fetch(url, options);
}

// Função para carregar todos os terceirizados
function loadTerceirizados() {
    authenticatedFetch('http://localhost:8080/gestaoTerceirizados')
    .then(response => response.json())
    .then(terceirizados => {
        const tbody = document.querySelector('#terceirizados-table tbody');
        tbody.innerHTML = '';
        terceirizados.forEach(tc => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${tc.id}</td>
                <td>${tc.name}</td>
                <td>${tc.cpf}</td>
                <td>${tc.email}</td>
                <td>
                    <button onclick="editTerceirizado(${tc.id})">Editar</button>
                    <button onclick="deleteTerceirizado(${tc.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error loading terceirizados:', error));
}

// Cria um novo terceirizado
document.getElementById('create-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const terceirizado = {
        name: document.getElementById('name').value,
        cpf: document.getElementById('cpf').value,
        rg: document.getElementById('rg').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        position: document.getElementById('position').value,
        enterprise: document.getElementById('enterprise').value,
        department: document.getElementById('department').value,
        status: document.getElementById('status').checked,
        observations: document.getElementById('observations').value
    };

    authenticatedFetch('http://localhost:8080/gestaoTerceirizados/save', {
        method: 'POST',
        body: JSON.stringify(terceirizado)
    })
    .then(response => {
        if (response.ok) {
            alert('Terceirizado criado com sucesso!');
            window.location.href = 'tc-index.html';
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => alert('Erro: ' + error.message));
}); 

// Atualiza um terceirizado
document.getElementById('update-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const terceirizado = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        cpf: document.getElementById('cpf').value,
        rg: document.getElementById('rg').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        position: document.getElementById('position').value,
        enterprise: document.getElementById('enterprise').value,
        department: document.getElementById('department').value,
        status: document.getElementById('status').checked,
        observations: document.getElementById('observations').value
    };

    authenticatedFetch(`http://localhost:8080/gestaoTerceirizados/edit/${terceirizado.id}`, {
        method: 'PUT',
        body: JSON.stringify(terceirizado)
    })
    .then(response => {
        if (response.ok) {
            alert('Terceirizado atualizado com sucesso!');
            window.location.href = 'tc-index.html';
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => alert('Erro: ' + error.message));
});

// Exclui um terceirizado
function deleteTerceirizado(id) {
    if (confirm('Tem certeza que deseja excluir este terceirizado?')) {
        authenticatedFetch(`http://localhost:8080/gestaoTerceirizados/delete/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Terceirizado excluído com sucesso!');
            loadTerceirizados();
        })
        .catch(error => alert('Erro: ' + error.message));
    }
}

// Carrega dados do terceirizado no formulário de edição
function editTerceirizado(id) {
    authenticatedFetch(`http://localhost:8080/gestaoTerceirizados/id/${id}`)
    .then(response => response.json())
    .then(terceirizado => {
        document.getElementById('id').value = terceirizado.id;
        document.getElementById('name').value = terceirizado.name;
        document.getElementById('cpf').value = terceirizado.cpf;
        document.getElementById('rg').value = terceirizado.rg;
        document.getElementById('phone').value = terceirizado.phone;
        document.getElementById('address').value = terceirizado.address;
        document.getElementById('email').value = terceirizado.email;
        document.getElementById('position').value = terceirizado.position;
        document.getElementById('enterprise').value = terceirizado.enterprise;
        document.getElementById('department').value = terceirizado.department;
        document.getElementById('status').checked = terceirizado.status;
        document.getElementById('observations').value = terceirizado.observations;
    })
    .catch(error => alert('Erro: ' + error.message));
}

// Inicializa a lista de terceirizados ao carregar a página
document.addEventListener('DOMContentLoaded', login);
