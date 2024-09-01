const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXZpLmFuZHJhZGUuMjAyM0BlbWFpbC5jb20iLCJpc3MiOiJhdXRoLWFwaSIsImV4cCI6MTcyNTIxNzI3Mn0.Pdnfr3iDnMoUMhE9cYVXt_F15dW4G1mpUWg1LS6NO1I';

const tabela = document.getElementById('escolasTable').getElementsByTagName('tbody')[0];

fetch('http://localhost:8080/escola/findAll?page=0&size=', {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
    }
})
    .then(response => response.json())
    .then(data => {
        const escolas = data.content;  // Acessa o array de escolas dentro do 'content'
        
        if (Array.isArray(escolas)) {
            escolas.forEach(escola => {
                console.log(escola.nome);

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
        } else {
            console.error("A 'content' não é um array.");
        }
    })
    .catch(error => {
        console.error("Erro ao buscar escolas:", error);
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
                location.reload(); // Recarrega a página para atualizar a lista
            } else {
                alert('Erro ao deletar a escola.');
            }
        })
        .catch(error => {
            console.error('Erro ao deletar a escola:', error);
        });
    }
}
