// Variáveis globais para armazenar o token e o ID da avaliação atual
let token = null;
let currentId = null;
const email = 'Dudu@gmail.com';
const password = 'senha';

// Seleção dos elementos do DOM
    const avaliacaoForm = document.getElementById('avaliacaoForm');
    const Iname = document.getElementById('name');
    const Idescription = document.getElementById('description');
    const Idate_evaluation = document.getElementById('date_evaluation');
    const Inote = document.getElementById('note');
    const Isubject = document.getElementById('subject');
    const Iclass = document.getElementById('class');
    const Iteacher = document.getElementById('teacher');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

// Função de login
function login() {
    fetch('http://localhost:8081/user/auth/login', {
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

// Função para criar uma nova avaliação
function criarAvaliacao() {
    const avaliacaoData = {
        nome: Iname.value,  // Correspondente ao JSONProperty "nome"
        descricao: Idescription.value,  // Correspondente ao JSONProperty "descricao"
        data_avaliacao: Idate_evaluation.value,  // Correspondente ao JSONProperty "data_avaliacao"
        nota: Inote.value,  // Correspondente ao JSONProperty "nota"
        professor_nome: Iteacher.value,  // Correspondente ao JSONProperty "professor_nome"
        turma_nome: Iclass.value,  // Correspondente ao JSONProperty "turma_nome"
        disciplina_nome: Isubject.value  // Correspondente ao JSONProperty "disciplina_nome"
    };
    

        // Exibe os valores dos campos no console para verificação
        console.log("Nome da Avaliação:", Iname.value);
        console.log("Descrição:", Idescription.value);
        console.log("Data da Avaliação:", Idate_evaluation.value);
        console.log("Nota:", Inote.value);
        console.log("Professor:", Iteacher.value);
        console.log("Turma:", Iclass.value);
        console.log("Disciplina:", Isubject.value);


    authenticatedFetch("http://localhost:8081/evaluation/save", {
        method: "POST",
        body: JSON.stringify(avaliacaoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar avaliação: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Avaliação criada com sucesso:', data);
        atualizarTabela(); // Atualiza a tabela após a criação
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Função para alterar uma avaliação existente
function alterarAvaliacao(id) {
    const avaliacaoData = {
        nome: Iname.value,  
        descricao: Idescription.value,  
        data_avaliacao: Idate_evaluation.value, 
        nota: Inote.value, 
        professor_nome: Iteacher.value, 
        turma_nome: Iclass.value, 
        disciplina_nome: Isubject.value 
    };

    authenticatedFetch(`http://localhost:8081/evaluation/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(avaliacaoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao alterar avaliação: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Avaliação alterada com sucesso:', data);
        atualizarTabela(); // Atualiza a tabela após a alteração
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Função para deletar uma avaliação existente
function deletarAvaliacao(id) {
    authenticatedFetch(`http://localhost:8081/evaluation/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar avaliação: ' + response.statusText);
        }
        console.log('Avaliação deletada com sucesso');
        atualizarTabela(); // Atualiza a tabela após a exclusão
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Função para atualizar a tabela de avaliações
function atualizarTabela() {
    authenticatedFetch("http://localhost:8081/evaluation/findAll")
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao listar as avaliações.');
        }
        return response.json();
    })
    .then(data => {
        const tabelaBody = document.querySelector("#tabela tbody");
        tabelaBody.innerHTML = ''; // Limpa o conteúdo da tabela

        data.forEach(avaliacao => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${avaliacao.name}</td>
                <td>${avaliacao.description}</td>
                <td>${avaliacao.date_evaluation}</td>
                <td>${avaliacao.note}</td>
                <td>${avaliacao.disciplina}</td>
                <td>${avaliacao.turma}</td>
                <td>${avaliacao.professor}</td>
                <td>
                    <button type="button" onclick="editarAvaliacao(${avaliacao.id})">Editar</button>
                    <button type="button" onclick="removerAvaliacao(${avaliacao.id})">Excluir</button>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Erro ao listar as avaliações:', error);
    });
}

// Função para configurar o formulário para edição
function editarAvaliacao(id) {
    fetch(`http://localhost:8081/evaluation/${id}`)
    .then(response => response.json())
    .then(data => {
        Iname.value = data.name;
        Idescription.value = data.description;
        Idate_evaluation.value = data.date_evaluation;
        Inote.value = data.note;
        Isubject.value = data.disciplina;
        Iclass.value = data.turma;
        Iteacher.value = data.professor;

        currentId = id; // Armazena o ID da avaliação que está sendo editada
        updateBtn.disabled = false;
        deleteBtn.disabled = false;
    })
    .catch(error => {
        console.error('Erro ao carregar dados da avaliação:', error);
    });
}

// Função para remover a avaliação selecionada
function removerAvaliacao(id) {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
        deletarAvaliacao(id);
    }
}

// Função para limpar os campos do formulário
function limpar() {
    Iname.value = "";
    Idescription.value = "";
    Idate_evaluation.value = "";
    Inote.value = "";
    Isubject.value = "";
    Iclass.value = "";
    Iteacher.value = "";
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
}

// Adiciona o evento de submit ao formulário
avaliacaoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (currentId === null) {
        criarAvaliacao(); // Cria nova avaliação se não há um ID atual
    } else {
        alterarAvaliacao(currentId); // Atualiza a avaliação existente
    }
    limpar();
});

// Inicializa a página com login e atualiza a tabela
document.addEventListener('DOMContentLoaded', () => {
    login(); // Chama login ao carregar a página
});
