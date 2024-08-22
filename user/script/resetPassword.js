document.getElementById("request-reset-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    
    fetch('http://localhost:8080/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("request-reset").style.display = "none";
            document.getElementById("reset-password").style.display = "block";
            document.getElementById("message").textContent = "Código enviado para " + email;
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Falha ao enviar código!');
            });
        }
    })
    .catch(error => {
        document.getElementById("message").textContent = error.message;
    });
});

document.getElementById("reset-password-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const token = document.getElementById("token").value;
    const newPassword = document.getElementById("new-password").value;

    fetch('http://localhost:8080/resetPassword', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, newPassword: newPassword })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("message").textContent = "Senha redefinida com sucesso!";
            document.getElementById("reset-password-form").reset();
            window.location.href = './login.html';
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Erro ao redefinir senha!');
            });
        }
    })
    .catch(error => {
        document.getElementById("message").textContent = error.message;
    });
});