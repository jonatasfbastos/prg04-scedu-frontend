/*
comentei porque ainda precisa de alterações
//method to list
document.addEventListener('DOMContentLoaded', () =>{
  fetchCourses();
});
function getAuthToken(){
    return localStorage.getItem('jwtToken');
}
function fetchCourses(){
    fetch('http://localhost:8080/Cursos/getall',{
        headers:{
            'Authorization': `Bearer ${getAuthToken()}`,
        }

    })
    .then(response => response.json())
    .then(data =>{
        const tableBody = document.querySelector('#coursesTable tbody');
        tableBody.innerHTML = '';// limpa o corpo da tabela
        data.forEach(course =>{
            const row = document.createElement('tr');
            row.innerHTML` 
            <td>${course.codigo}</td>
            <td>${course.nome}</td>
            <td>${course.status}</td>
            <td>${course.modalidade}</td>

            <td>
            <button class="btn" onclick="window.location.href='form-update-course.html'">Editar</button>
            <button class="btn" onclick="deleteCourse(${course.id})">Excluir</button>
            </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('erro ao buscar cursos', error));
}

// method to save
document.getElementById('courseForm').addEventListener('submit',function(event){
    event.preventDefault(); // impede o envio padrao do formulario
    
    // captura os dados do formulario
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());
    const json = JSON.stringify(formObject);
    
    // obtem o token JWT do armazenamento local
    const token = localStorage.getItem('jwtToken');
    // envia o jason para a api
    fetch('http://localhost:8080/Cursos/save',{
        method:'POST',
        headers:{
            'content-Type': 'application/json',
            'Authorization': `Bearer ${token}`// inclui token

        },
        body:json

    })
    .then(response => response.json())// converte a resposta em jason
    .then(data => {
        console.log('Salvo com sucesso', data);

    })
    .catch((error) => {
        console.error('erro ao salvar', error);
    });

});
// method to update
document.addEventListener('DOMContentLoaded',() =>{
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    if(courseId){
        fetchCourseData(courseId);
    }
    const form = document.getElementById('editCourseForm');
    form.addEventListener('submit', (event) =>{
        event.preventDefault();
        updateCourse(courseId);
    });
});
function fetchCourseData(id){
    fetch(`http://localhost:8080/Cursos/update`,{
        headers:{
            'Authorization': `Bearer ${getAuthToken()}`,
        }

    })
    .then(response => reponse.json())
    .then(course =>{
        document.getElementById('nome').value = course.nome;
        document.getElementById('codigo').value = course.codigo;
        document.getElementById('descricao').value = course.descricao;
        document.getElementById('cargaHoraria').value = course.cargaHoraria;
        document.getElementById('status').value = course.status;
        document.getElementById('modalidade').value = course.modalidade;
        

    })
    .catch( (error)=> console.error('Erro ao buscar dados do curso',error));
}
function updateCourse(id) {
    const formData = new FormData(document.getElementById('editCourseForm'));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    fetch(`http://localhost:8080/Cursos/update${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            alert('Curso atualizado com sucesso.');
            window.location.href = '/gestaoCursos/indexcurso.html'; // Redireciona após sucesso
        } else {
            alert('Erro ao atualizar o curso.');
        }
    })
    .catch(error => console.error('Erro ao atualizar o curso:', error));
}

function getAuthToken() {
    return localStorage.getItem('jwtToken');
}
// method to delete'
function deleteCourse(id){
    if(confirm('Tem certeza que deseja excluir esse curso?')){
        fetch(`http://localhost:8080/Cursos/delete${id}`,{
            method:'DELETE',
            headers:{
                'Authorization':`Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }

        })
        .then(response =>{
            if(response.ok){
                alert('Curso deletado com sucesso.');
                //remover a linha da tabela apos deletar
                document.querySelector(`button[onclick= "deleteCourse(${id})"]`).closest('tr').remove();
            }
            else{
                alert('Erro ao deletar curso');
            }
        }).catch(error =>{
            console.error('Erro ao deletar curso:', error)
        });
    }
}
//method para pesquisar
function filterCourses(){
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('coursesTable');
    const rows = document.getElementsByTagName('td');
    

    for(let i = 1; j< rows.length; i++){
        const cells = rows[i].getElementsByTagName('td');
        let match = false;
        
    }
    for(let j = 1; j< cells.length; j++){
        if(cells[j].textContent.toLowerCase().includes(searchInput)){
            match=true;
            break;
        }
        
    }
    if(match){
        rows[i].style.display = '';

    }else{
      rows[i].style.display = 'none'
    }
}
    */