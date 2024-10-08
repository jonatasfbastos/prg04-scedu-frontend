const escolaId = new URLSearchParams(window.location.search).get("inep");

document.addEventListener('DOMContentLoaded', function () {
    const escolaForm = document.getElementById('escolaForm');

    // Função para buscar os dados da escola e preencher o formulário
    async function fetchEscolaData() {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXZpLmFuZHJhZGUuMjAyM0BlbWFpbC5jb20iLCJpc3MiOiJhdXRoLWFwaSIsImV4cCI6MTcyNTY3MzEwMn0.AR8CKWsbbSVctF-2cUaB1eIeS2WXRXgAqwk_IzDQ9xw'; // Substitua pelo token obtido na autenticação
        
        const url = `http://localhost:8080/escola/findById/${escolaId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }

            const escolaData = await response.json();

            // Preencher o formulário com os dados da escola
            document.getElementById('nome').value = escolaData.nome || '';
            document.getElementById('inep').value = escolaData.inep || '';
            document.getElementById('localizacao').value = escolaData.localizacao || '';
            document.getElementById('cep').value = escolaData.cep || '';
            document.getElementById('bairro').value = escolaData.bairro || '';
            document.getElementById('logradouro').value = escolaData.logradouro || '';
            document.getElementById('complemento').value = escolaData.complemento || '';
            document.getElementById('telefone').value = escolaData.telefone || '';
            document.getElementById('modalidade').value = escolaData.modalidade || '';
            document.getElementById('nomeDiretor').value = escolaData.nomeDiretor || '';

        } catch (error) {
            console.error('Erro ao buscar os dados da escola:', error);
            alert('Erro ao carregar os dados da escola.');
        }
    }

    // Chama a função para buscar e preencher os dados da escola
    fetchEscolaData();
});

// Adiciona um evento para quando o formulário for enviado
document.getElementById("btnEditar").addEventListener("click", function (event) {
    // Previne o comportamento padrão de submissão do formulário
    event.preventDefault();

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXZpLmFuZHJhZGUuMjAyM0BlbWFpbC5jb20iLCJpc3MiOiJhdXRoLWFwaSIsImV4cCI6MTcyNTIyMTMyNH0.n7OdUEActJIr9_EWKGs5vl4yZQu9vtjQ7tNonxIkz_o';
    
    // Coleta o ID da escola e os dados do formulário

    const escolaData = {
        nome: document.getElementById("nome").value,
        inep: document.getElementById("inep").value,
        localizacao: document.getElementById("localizacao").value,
        cep: document.getElementById("cep").value,
        bairro: document.getElementById("bairro").value,
        logradouro: document.getElementById("logradouro").value,
        complemento: document.getElementById("complemento").value,
        telefone: document.getElementById("telefone").value,
        modalidade: document.getElementById("modalidade").value,
        nomeDiretor: document.getElementById("nomeDiretor").value,
    };

    // Faz uma requisição PUT para atualizar os dados da escola
    fetch(`http://localhost:8080/escola/update/${escolaId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(escolaData),
    })
        .then(response => {
            // Se a atualização for bem-sucedida, exibe uma mensagem de sucesso
            if (response.ok) {
                alert("Escola atualizada com sucesso!");
            } else {
                // Se houver um erro na atualização, lança um erro
                throw new Error("Erro ao atualizar a escola.");
            }
        })
        .catch(error => {
            // Exibe uma mensagem de erro caso a atualização falhe
            alert(error.message);
        });
});