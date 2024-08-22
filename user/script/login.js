document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch("http://localhost:8080/user/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            return "Login realizado com sucesso!"
        } else if (response.status === 401 || response.status === 400) {
            return response.text().then(text => { throw new Error(text); });
        } else {
            throw new Error('Erro inesperado.');
        }
    })
    .then(message => {
        alert(message);
        window.location.href = '../home.html';
    })
    .catch(error => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    });
});