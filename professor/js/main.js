// Função para carregar os professores e exibir na tabela
async function loadProfessors() {
    const professorList = document.getElementById('professor-list');
    professorList.innerHTML = '';

    const professors = await fetchProfessors();

    professors.forEach(professor => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${professor.id}</td>
            <td>${professor.name}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProfessor(${professor.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removeProfessor(${professor.id})">Deletar</button>
            </td>
        `;

        professorList.appendChild(row);
    });
}

// Função para salvar ou atualizar professor
async function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('professor-id').value;
    const name = document.getElementById('professor-name').value;

    const professor = { name };

    if (id) {
        await updateProfessor(id, professor);
        showAlert('Professor atualizado com sucesso!');
    } else {
        await saveProfessor(professor);
        showAlert('Professor salvo com sucesso!');
    }

    clearForm();
    loadProfessors();
}

// Função para carregar os dados do professor no formulário para edição
async function editProfessor(id) {
    const professor = await fetchProfessorById(id);
    document.getElementById('professor-id').value = professor.id;
    document.getElementById('professor-name').value = professor.name;
}

// Função para remover um professor
async function removeProfessor(id) {
    await deleteProfessor(id);
    showAlert('Professor deletado com sucesso!', 'danger');
    loadProfessors();
}

// Event listener para o formulário
document.getElementById('professor-form').addEventListener('submit', handleFormSubmit);

// Carregar a lista de professores ao carregar a página
window.onload = loadProfessors;
