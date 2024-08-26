const avaliacaoForm = document.querySelector("form");
const Iname = document.querySelector("#form_name");
const Idescricao = document.querySelector("#form_descricao");
const Idata = document.querySelector("#form_data");
const Ipeso = document.querySelector("#form_peso");

function criarAvaliacao() {
    const avaliacaoData = {
        name: Iname.value,
        descricao: Idescricao.value,
        data_avaliacao: Idata.value, 
        peso: Ipeso.value
    };

    console.log("Dados enviados para o backend:", avaliacaoData);

    fetch("http://localhost:8081/avaliacao/save", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('user:062bc7fc-f3f5-48f2-9595-cfa8a95f5a63')
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
    Idescricao.value = "";
    Idata.value = "";
    Ipeso.value = "";
}

avaliacaoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    criarAvaliacao();
    limpar();
});

