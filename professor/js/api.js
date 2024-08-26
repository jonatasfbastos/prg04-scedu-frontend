// Funções para chamadas à API

// Buscar todos os professores
async function fetchProfessors() {
    const response = await fetch(API_URL);
    return await response.json();
}

// Buscar professor por ID
async function fetchProfessorById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
}

// Salvar novo professor
async function saveProfessor(professor) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(professor)
    });
    return await response.json();
}

// Atualizar professor
async function updateProfessor(id, professor) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(professor)
    });
}

// Deletar professor
async function deleteProfessor(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: HEADERS
    });
}
