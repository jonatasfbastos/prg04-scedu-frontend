document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('disciplina-form');
    const disciplinaList = document.getElementById('disciplina-list');
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');

    let disciplinas = [];

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const id = document.getElementById('disciplina-id').value;
        const codigo = document.getElementById('codigo').value;
        const nomeDisciplina = document.getElementById('nomeDisciplina').value;
        const nomeAbreviado = document.getElementById('nomeAbreviado').value;
        const baseCurricular = document.getElementById('baseCurricular').value;

        if (id) {
            // Editar disciplina existente
            const disciplina = disciplinas.find(d => d.id === parseInt(id));
            disciplina.codigo = codigo;
            disciplina.nomeDisciplina = nomeDisciplina;
            disciplina.nomeAbreviado = nomeAbreviado;
            disciplina.baseCurricular = baseCurricular;
        } else {
            // Adicionar nova disciplina
            const novaDisciplina = {
                id: Date.now(),
                codigo,
                nomeDisciplina,
                nomeAbreviado,
                baseCurricular
            };
            disciplinas.push(novaDisciplina);
        }

        form.reset();
        document.getElementById('disciplina-id').value = '';

        renderDisciplinas();
    });

    searchBtn.addEventListener('click', function() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredDisciplinas = disciplinas.filter(d => d.nomeDisciplina.toLowerCase().includes(searchValue));
        renderDisciplinas(filteredDisciplinas);
    });

    function renderDisciplinas(filteredDisciplinas = disciplinas) {
        disciplinaList.innerHTML = '';
        filteredDisciplinas.forEach(disciplina => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${disciplina.codigo} - ${disciplina.nomeDisciplina} (${disciplina.nomeAbreviado}) - ${disciplina.baseCurricular}
                <button onclick="editDisciplina(${disciplina.id})">Editar</button>
                <button onclick="deleteDisciplina(${disciplina.id})">Remover</button>
            `;
            disciplinaList.appendChild(li);
        });
    }

    window.editDisciplina = function(id) {
        const disciplina = disciplinas.find(d => d.id === id);
        document.getElementById('disciplina-id').value = disciplina.id;
        document.getElementById('codigo').value = disciplina.codigo;
        document.getElementById('nomeDisciplina').value = disciplina.nomeDisciplina;
        document.getElementById('nomeAbreviado').value = disciplina.nomeAbreviado;
        document.getElementById('baseCurricular').value = disciplina.baseCurricular;
    };

    window.deleteDisciplina = function(id) {
        disciplinas = disciplinas.filter(d => d.id !== id);
        renderDisciplinas();
    };

    // Renderizar a lista inicial de disciplinas (vazia)
    renderDisciplinas();
});
