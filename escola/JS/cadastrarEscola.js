document.getElementById('escolaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const escola = {
        nome: document.getElementById('nome').value,
        inep: document.getElementById('inep').value,
        localizacao: document.getElementById('localizacao').value,
        cep: document.getElementById('cep').value,
        bairro: document.getElementById('bairro').value,
        logradouro: document.getElementById('logradouro').value,
        complemento: document.getElementById('complemento').value,
        telefone: document.getElementById('telefone').value,
        modalidade: document.getElementById('modalidade').value,
        nomeDiretor: document.getElementById('nomeDiretor').value
    };

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXZpLmFuZHJhZGUuMjAyM0BlbWFpbC5jb20iLCJpc3MiOiJhdXRoLWFwaSIsImV4cCI6MTcyNDg2NjgxNH0.LKX-7L64uU2KDVs7z9J602V48HqUDZVnny0D1q_nk1s'; // Insira o token JWT aqui

    fetch('http://localhost:8080/escola/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(escola)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert('Escola cadastrada com sucesso!');
        document.getElementById('escolaForm').reset();
    })
    .catch(error => {
        alert('Erro ao cadastrar escola.');
        console.error('Erro:', error);
    });
});
