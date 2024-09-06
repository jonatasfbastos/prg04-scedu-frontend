const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXZpLmFuZHJhZGUuMjAyM0BlbWFpbC5jb20iLCJpc3MiOiJhdXRoLWFwaSIsImV4cCI6MTcyNTY3MzEwMn0.AR8CKWsbbSVctF-2cUaB1eIeS2WXRXgAqwk_IzDQ9xw';
const tabela = document.getElementById('escolasTable').getElementsByTagName('tbody')[0];
let escolasArray = [];

// Função para buscar todas as escolas e armazená-las em um array
function fetchAllEscolas() {
    fetch('http://localhost:8080/escola/findAll?page=0&size=', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        escolasArray = data.content; // Armazena os dados no array
        updateTable(escolasArray); // Atualiza a tabela com todas as escolas
    })
    .catch(error => {
        console.error("Erro ao buscar todas as escolas:", error);
    });
}

// Função para atualizar a tabela com os dados das escolas
function updateTable(escolas) {
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizar

    escolas.forEach(escola => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = escola.nome;
        row.insertCell(1).textContent = escola.inep;
        row.insertCell(2).textContent = escola.localizacao;
        row.insertCell(3).textContent = escola.cep;
        row.insertCell(4).textContent = escola.bairro;
        row.insertCell(5).textContent = escola.logradouro;
        row.insertCell(6).textContent = escola.complemento;
        row.insertCell(7).textContent = escola.telefone;
        row.insertCell(8).textContent = escola.modalidade;
        row.insertCell(9).textContent = escola.nomeDiretor;

        // Adiciona a célula de ações com os botões de editar e deletar
        const acaoEditar = row.insertCell(10);
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => {
            window.location.href = `editarEscola.html?inep=${escola.id}`;
        };
        acaoEditar.appendChild(editButton);

        const acaoDeletar = row.insertCell(11);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.onclick = () => deleteEscola(escola.id);
        acaoDeletar.appendChild(deleteButton);
    });
}

// Função para filtrar as escolas pelo nome
function searchByName(name) {
    const filtered = escolasArray.filter(escola => escola.nome.toLowerCase().includes(name.toLowerCase()));
    updateTable(filtered); // Atualiza a tabela com os resultados filtrados
}

// Configura o manipulador de eventos para o campo de busca
document.getElementById('searchInput').addEventListener('input', (event) => {
    searchByName(event.target.value);
});

// Função para deletar a escola
function deleteEscola(id) {
    if (confirm('Tem certeza que deseja deletar esta escola?')) {
        fetch(`http://localhost:8080/escola/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Escola deletada com sucesso!');
                fetchAllEscolas(); // Recarrega a lista de escolas após a exclusão
            } else {
                alert('Erro ao deletar a escola.');
            }
        })
        .catch(error => {
            console.error('Erro ao deletar a escola:', error);
        });
    }
}

// Chama a função para buscar e armazenar os dados ao carregar a página
fetchAllEscolas();