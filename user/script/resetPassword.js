// Adiciona um listener para o evento de submissão do formulário de solicitação de redefinição de senha
document.getElementById("request-reset-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário, que seria recarregar a página
    
    // Obtém o valor do campo de email do formulário
    const email = document.getElementById("email").value;
    
    // Envia uma requisição POST para o endpoint de solicitação de redefinição de senha
    fetch('http://localhost:8080/resetPassword', {
        method: 'POST', // Define o método HTTP como POST
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ email: email }) // Converte o email para JSON e inclui no corpo da requisição
    })
    .then(response => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (response.ok) {
            // Se o status for 200-299, oculta o formulário de solicitação e exibe o formulário de redefinição de senha
            document.getElementById("request-reset").style.display = "none";
            document.getElementById("reset-password").style.display = "block";
            document.getElementById("message").textContent = "Código enviado para " + email;
        } else {
            // Se a resposta não for bem-sucedida, lança uma exceção com a mensagem de erro retornada pelo servidor
            return response.json().then(err => {
                throw new Error(err.message || 'Falha ao enviar código!');
            });
        }
    })
    .catch(error => {
        // Se houver um erro na requisição, exibe a mensagem de erro no elemento de mensagem
        document.getElementById("message").textContent = error.message;
    });
});

// Adiciona um listener para o evento de submissão do formulário de redefinição de senha
document.getElementById("reset-password-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário, que seria recarregar a página
    
    // Obtém os valores dos campos de token e nova senha do formulário
    const token = document.getElementById("token").value;
    const newPassword = document.getElementById("new-password").value;

    // Envia uma requisição PATCH para o endpoint de redefinição de senha
    fetch('http://localhost:8080/resetPassword', {
        method: 'PATCH', // Define o método HTTP como PATCH
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ token: token, newPassword: newPassword }) // Converte o token e a nova senha para JSON e inclui no corpo da requisição
    })
    .then(response => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (response.ok) {
            // Se o status for 200-299, exibe uma mensagem de sucesso, reseta o formulário de redefinição de senha e redireciona o usuário para a página de login
            document.getElementById("message").textContent = "Senha redefinida com sucesso!";
            document.getElementById("reset-password-form").reset(); // Reseta o formulário
            window.location.href = './login.html'; // Redireciona o usuário para a página de login
        } else {
            // Se a resposta não for bem-sucedida, lança uma exceção com a mensagem de erro retornada pelo servidor
            return response.json().then(err => {
                throw new Error(err.message || 'Erro ao redefinir senha!');
            });
        }
    })
    .catch(error => {
        // Se houver um erro na requisição, exibe a mensagem de erro no elemento de mensagem
        document.getElementById("message").textContent = error.message;
    });
});
