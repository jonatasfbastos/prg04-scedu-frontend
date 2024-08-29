const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXZpLmFuZHJhZGUuMjAyM0BlbWFpbC5jb20iLCJpc3MiOiJhdXRoLWFwaSIsImV4cCI6MTcyNDkwODc0NH0.M7hhso73R4wmTTXIM8oPuQx6d0pzLF3a5ArWEQKPHL4';

const tabela = document.getElementById('escolasTable');

const a = fetch('http://localhost:8080/escola/findall?page=0&size=6', {
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
        // Continue preenchendo as células conforme necessário
            });
        } else {
            console.error("A 'content' não é um array.");
        }
    })
    .catch(error => {
        console.error("Erro ao buscar escolas:", error);
    });