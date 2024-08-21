document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            alert('Registro efetuado com sucesso!');
            window.location.href = 'login.html'; 
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    });
});