// Funções utilitárias

// Exibe alertas na tela
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 3000);
}

// Limpar formulário
function clearForm() {
    document.getElementById('professor-id').value = '';
    document.getElementById('professor-name').value = '';
}
