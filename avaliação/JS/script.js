const avaliacaoForm = document.querySelector("form");
const Iname = document.querySelector("#form_name");
const Idescription = document.querySelector("#form_description");
const Idate_evaluation = document.querySelector("#form_date_evaluation");
const Inote = document.querySelector("#form_note");
const Isubject = document.querySelector("#form_subject");  
const Iclass = document.querySelector("#form_class");     
const Iteacher = document.querySelector("#form_teacher");  

function criarAvaliacao() {
    const avaliacaoData = {
        name: Iname.value,
        description: Idescription.value,
        date_evaluation: Idate_evaluation.value,
        note: Inote.value,
        disciplina: Isubject.value,  
        turma: Iclass.value,         
        professor: Iteacher.value    
    };

    console.log("Dados enviados para o backend:", avaliacaoData);

    
    let token = document.querySelector('meta[name="_csrf"]').getAttribute('content');

    fetch("http://localhost:8081/avaliacao/save", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('user:'), //Lembre de adicionar o token
            'X-CSRF-TOKEN': token
        },
        method: "POST",
        body: JSON.stringify(avaliacaoData)
    })
    .then(response => {
        console.log("Resposta do backend:", response);
        if (!response.ok) {
            throw new Error('Erro ao criar avaliação: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Avaliação criada com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

function limpar() {
    Iname.value = "";
    Idescription.value = "";
    Idate_evaluation.value = "";
    Inote.value = "";
    Isubject.value = "";   
    Iclass.value = "";     
    Iteacher.value = "";   
}

avaliacaoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    criarAvaliacao();
    limpar();
});
