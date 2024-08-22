const apiUrl = 'http://localhost:8080/gestaoTerceirizados';

// Função para buscar todos os terceirizados e exibir na tabela
function fetchTerceirizados() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#terceirizados-table tbody');
            tableBody.innerHTML = '';
            data.forEach(terceirizado => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${terceirizado.id}</td>
                    <td>${terceirizado.name}</td>
                    <td>${terceirizado.cpf}</td>
                    <td>${terceirizado.email}</td>
                    <td>
                        <button onclick="viewTerceirizado(${terceirizado.id})">Ver</button>
                        <button onclick="editTerceirizado(${terceirizado.id})">Editar</button>
                        <button onclick="deleteTerceirizado(${terceirizado.id})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

// Função para criar um novo terceirizado
document.getElementById('create-form')?.addEventListener('submit', function (event) {
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
        observations: document.getElementById('observations').value,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(terceirizado)
    }).then(() => {
        window.location.href = 'tc-index.html';
    });
});

// Função para atualizar um terceirizado existente
document.getElementById('update-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const id = document.getElementById('id').value;
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
        observations: document.getElementById('observations').value,
    };

    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(terceirizado)
    }).then(() => {
        window.location.href = 'tc-index.html';
    });
});

// Função para visualizar detalhes de um terceirizado
function viewTerceirizado(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('id').textContent = data.id;
            document.getElementById('name').textContent = data.name;
            document.getElementById('cpf').textContent = data.cpf;
            document.getElementById('rg').textContent = data.rg;
            document.getElementById('phone').textContent = data.phone;
            document.getElementById('address').textContent = data.address;
            document.getElementById('email').textContent = data.email;
            document.getElementById('position').textContent = data.position;
            document.getElementById('enterprise').textContent = data.enterprise;
            document.getElementById('department').textContent = data.department;
            document.getElementById('status').textContent = data.status ? 'Ativo' : 'Inativo';
            document.getElementById('observations').textContent = data.observations;
            window.location.href = 'view.html';
        });
}

// Função para editar um terceirizado (preencher o formulário)
function editTerceirizado(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('id').value = data.id;
            document.getElementById('name').value = data.name;
            document.getElementById('cpf').value = data.cpf;
            document.getElementById('rg').value = data.rg;
            document.getElementById('phone').value = data.phone;
            document.getElementById('address').value = data.address;
            document.getElementById('email').value = data.email;
            document.getElementById('position').value = data.position;
            document.getElementById('enterprise').value = data.enterprise;
            document.getElementById('department').value = data.department;
            document.getElementById('status').checked = data.status;
            document.getElementById('observations').value = data.observations;
            window.location.href = 'update.html';
        });
}

// Função para excluir um terceirizado
function deleteTerceirizado(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    }).then(() => {
        fetchTerceirizados();
    });
}

// Chamar a função para listar os terceirizados ao carregar a página
if (document.querySelector('#terceirizados-table')) {
    fetchTerceirizados();
}
