// Adiciona um listener para o evento de submissão do formulário de registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário, que seria recarregar a página

    // Obtém os valores dos campos de nome, email e senha do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envia uma requisição POST para o endpoint de registro de usuário
    fetch('http://localhost:8080/user/auth', {
        method: 'POST', // Define o método HTTP como POST
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ name: name, email: email, password: password }) // Converte os dados do formulário para JSON e inclui no corpo da requisição
    })
    .then(response => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (response.ok) {
            // Se o status for 200-299, exibe uma mensagem de sucesso e redireciona o usuário para a página de login
            alert('Registro efetuado com sucesso!');
            window.location.href = 'login.html'; 
        } else {
            // Se a resposta não for bem-sucedida, lança uma exceção com a mensagem de erro retornada pelo servidor
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        // Se houver um erro na requisição, exibe a mensagem de erro no elemento de mensagem de erro
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = error.message; // Define o texto do elemento de mensagem de erro como a mensagem de erro
        errorMessage.style.display = 'block'; // Torna o elemento de mensagem de erro visível
    });
});
