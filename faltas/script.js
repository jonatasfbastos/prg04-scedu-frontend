
// Função para adicionar uma falta
function addAbsence() {
    document.addEventListener('DOMContentLoaded', () => {
        const addForm = document.getElementById('addAbsenceForm');

        addForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const studentName = document.getElementById('studentName').value;
            const absenceDate = document.getElementById('absenceDate').value;
            const justified = document.getElementById('justified').value === 'true';
            const subject = document.getElementById('subject').value;

            const absenceData = {
                student: studentName,
                date: absenceDate,
                justified,
                subject
            };

            try {
                const response = await fetch('http://localhost:8080/absences/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(absenceData),
                });

                if (response.ok) {
                    alert('Falta adicionada com sucesso!');
                    addForm.reset();
                } else {
                    alert('Erro ao adicionar a falta.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao adicionar a falta.');
            }
        });
    });
}

addAbsence();

// Função para listar todas as faltas
function listAbsences() {
    document.addEventListener('DOMContentLoaded', async () => {
        const absencesList = document.getElementById('absencesList');

        try {
            const response = await fetch('http://localhost:8080/absences');
            const data = await response.json();

            data.content.forEach(absence => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${absence.id}</td>
                    <td>${absence.student}</td>
                    <td>${absence.date}</td>
                    <td>${absence.justified ? 'Sim' : 'Não'}</td>
                    <td>${absence.subject}</td>
                    <td>
                        <a href="./editar_faltas.html?id=${absence.id}">Editar</a>
                        <button onclick="deleteAbsence(${absence.id})">Deletar</button>
                    </td>
                `;
                absencesList.appendChild(row);
            });
        } catch (error) {
            console.error('Erro:', error);
        }
    });
}

// Função para deletar uma falta
async function deleteAbsence(id) {
    try {
        const response = await fetch(`http://localhost:8080/absences/delete/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Falta deletada com sucesso!');
            window.location.reload();
        } else {
            alert('Erro ao deletar a falta.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar a falta.');
    }
}

listAbsences();


// Função para carregar dados da falta e atualizar
function editAbsence() {
    document.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            alert('ID da falta não fornecido.');
            return;
        }

        const editForm = document.getElementById('editAbsenceForm');

        try {
            const response = await fetch(`http://localhost:8080/absences/${id}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar dados da falta.');
            }

            const data = await response.json();

            document.getElementById('studentName').value = data.student;
            document.getElementById('absenceDate').value = data.date;
            document.getElementById('justified').value = data.justified ? 'true' : 'false';
            document.getElementById('subject').value = data.subject;
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }

        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const studentName = document.getElementById('studentName').value;
            const absenceDate = document.getElementById('absenceDate').value;
            const justified = document.getElementById('justified').value === 'true';
            const subject = document.getElementById('subject').value;

            const absenceData = {
                student: studentName,
                date: absenceDate,
                justified,
                subject
            };

            try {
                const response = await fetch(`http://localhost:8080/absences/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(absenceData),
                });

                if (response.ok) {
                    alert('Falta atualizada com sucesso!');
                    window.location.href = './listar_faltas.html'; // Redireciona para a lista de faltas após atualização
                } else {
                    throw new Error('Erro ao atualizar a falta.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert(error.message);
            }
        });
    });
}

editAbsence();





