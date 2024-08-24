// Adiciona um listener para o evento de submissão do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário, que seria recarregar a página

    // Obtém os valores dos campos de email e senha do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envia uma requisição POST para o endpoint de login
    fetch("http://localhost:8080/user/auth/login", {
        method: 'POST', // Define o método HTTP como POST
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ email: email, password: password }) // Converte os dados do formulário para JSON e inclui no corpo da requisição
    })
    .then(response => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (response.ok) {
            return "Login realizado com sucesso!"; // Se o status for 200-299, retorna uma mensagem de sucesso
        } else if (response.status === 401 || response.status === 400) {
            // Se o status for 401 (não autorizado) ou 400 (solicitação inválida), lança uma exceção com a mensagem de erro retornada pelo servidor
            return response.text().then(text => { throw new Error(text); });
        } else {
            // Para outros status de erro, lança uma exceção com uma mensagem genérica
            throw new Error('Erro inesperado.');
        }
    })
    .then(message => {
        // Se a requisição for bem-sucedida, exibe uma mensagem de sucesso e redireciona o usuário para a página inicial
        alert(message);
        window.location.href = '../home.html';
    })
    .catch(error => {
        // Se houver um erro na requisição, exibe a mensagem de erro no elemento de mensagem de erro
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = error.message; // Define o texto do elemento de mensagem de erro como a mensagem de erro
        errorMessage.style.display = 'block'; // Torna o elemento de mensagem de erro visível
    });
});
