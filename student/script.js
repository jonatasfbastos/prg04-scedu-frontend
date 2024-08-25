let editingStudentId = null;
let token = null;
const email = 'exemplo@email';
const password = 'exemplosenha';

// Função de login
function login() {
  fetch('http://localhost:8080/user/auth/login', {  // URL de login
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })  // Ajuste no nome da variável
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    token = data.token;  // Armazena o token JWT
    fetchStudents();  // Faz a requisição autenticada após o login
  })
  .catch(error => console.error('Error during login:', error));
}

document.addEventListener("DOMContentLoaded", () => {
  login();  // Chama login ao carregar a página

  // Implementação da funcionalidade de busca
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function() {
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#students-table-body tr");

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
});

// Função para realizar requisições autenticadas
function authenticatedFetch(url, options = {}) {
  if (!token) {
    console.error('No token available, please log in.');
    return;
  }

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,  // Adiciona o token JWT ao cabeçalho
    'Content-Type': 'application/json'
  };

  return fetch(url, options);
}

// Função para buscar todos os alunos
function fetchStudents() {
  authenticatedFetch("http://localhost:8080/students")
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById("students-table-body");
      tableBody.innerHTML = "";
      data.content.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.code}</td>
          <td>${student.studentCpf}</td>
          <td>${student.studentRg}</td>
          <td>
            <button onclick="openEditForm(
              ${student.id}, 
              '${student.code}', 
              '${student.name}', 
              '${student.socialName}', 
              '${student.gender}', 
              '${student.genderIdentity}', 
              '${student.studentRg}', 
              '${student.studentRgIssuingAuthority}', 
              '${student.studentRgIssueDate}', 
              '${student.studentCpf}', 
              '${student.voterRegistration}', 
              '${student.birthDate}', 
              '${student.fatherName}', 
              '${student.motherName}', 
              '${student.fatherRg}', 
              '${student.fatherRgIssuingAuthority}', 
              '${student.fatherRgIssueDate}', 
              '${student.fatherCpf}', 
              '${student.fatherProfession}', 
              '${student.motherRg}', 
              '${student.motherRgIssuingAuthority}', 
              '${student.motherRgIssueDate}', 
              '${student.motherCpf}', 
              '${student.motherProfession}', 
              '${student.legalGuardian}', 
              '${student.studentPhone}', 
              '${student.guardianPhone}', 
              '${student.zipCode}', 
              '${student.street}', 
              '${student.number}', 
              '${student.city}', 
              '${student.neighborhood}', 
              '${student.state}', 
              '${student.livingRegion}', 
              '${student.nationality}', 
              '${student.birthPlace}', 
              '${student.previousSchool}', 
              '${student.disability}', 
              '${student.allergies}', 
              '${student.relevantMedicalConditions}', 
              '${student.regularMedications}'
            )">Edit</button>
        </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching students:", error));
}

// Função para adicionar um novo aluno
function addStudent() {
  const form = document.getElementById('create-student-form');
  const student = {
      code: form.code.value,
      name: form.name.value,
      socialName: form.socialName.value,
      gender: form.gender.value,
      genderIdentity: form.genderIdentity.value,
      studentRg: form.studentRg.value,
      studentRgIssuingAuthority: form.studentRgIssuingAuthority.value,
      studentRgIssueDate: form.studentRgIssueDate.value,
      studentCpf: form.studentCpf.value,
      voterRegistration: form.voterRegistration.value,
      birthDate: form.birthDate.value,
      fatherName: form.fatherName.value,
      motherName: form.motherName.value,
      fatherRg: form.fatherRg.value,
      fatherRgIssuingAuthority: form.fatherRgIssuingAuthority.value,
      fatherRgIssueDate: form.fatherRgIssueDate.value,
      fatherCpf: form.fatherCpf.value,
      fatherProfession: form.fatherProfession.value,
      motherRg: form.motherRg.value,
      motherRgIssuingAuthority: form.motherRgIssuingAuthority.value,
      motherRgIssueDate: form.motherRgIssueDate.value,
      motherCpf: form.motherCpf.value,
      motherProfession: form.motherProfession.value,
      legalGuardian: form.legalGuardian.value,
      studentPhone: form.studentPhone.value,
      guardianPhone: form.guardianPhone.value,
      zipCode: form.zipCode.value,
      street: form.street.value,
      number: form.number.value,
      city: form.city.value,
      neighborhood: form.neighborhood.value,
      state: form.state.value,
      livingRegion: form.livingRegion.value,
      nationality: form.nationality.value,
      birthPlace: form.birthPlace.value,
      previousSchool: form.previousSchool.value,
      disability: form.disability.value,
      allergies: form.allergies.value,
      relevantMedicalConditions: form.relevantMedicalConditions.value,
      regularMedications: form.regularMedications.value
  };

  authenticatedFetch("http://localhost:8080/students", {
      method: "POST",
      body: JSON.stringify(student)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Failed to add student");
      }
      return response.json();
  })
  .then(data => {
      alert("Student added successfully!");
      form.reset();  // Limpa o formulário após o envio
      fetchStudents();  // Atualiza a lista de estudantes
  })
  .catch(error => console.error("Error adding student:", error));
}

// Listener para o formulário
document.addEventListener('DOMContentLoaded', function() {
  const createStudentForm = document.getElementById('create-student-form');
  
  if (createStudentForm) {
    createStudentForm.addEventListener('submit', function(event) {
      event.preventDefault();  // Previne o comportamento padrão do formulário
      addStudent();  // Chama a função de adicionar estudante
    });
  } else {
    console.error("Formulário de criação de estudante não encontrado.");
  }
});

// Abre o formulário de edição e preenche com os dados do estudante
function openEditForm(id, code, name, socialName, gender, genderIdentity, studentRg, studentRgIssuingAuthority, studentRgIssueDate, studentCpf, voterRegistration, birthDate, fatherName, motherName, fatherRg, fatherRgIssuingAuthority, fatherRgIssueDate, fatherCpf, fatherProfession, motherRg, motherRgIssuingAuthority, motherRgIssueDate, motherCpf, motherProfession, legalGuardian, studentPhone, guardianPhone, zipCode, street, number, city, neighborhood, state, livingRegion, nationality, birthPlace, previousSchool, disability, allergies, relevantMedicalConditions, regularMedications) {
  editingStudentId = id;
  
  document.getElementById("editCode").value = code || "";
  document.getElementById("editName").value = name || "";
  document.getElementById("editSocialName").value = socialName || "";
  document.getElementById("editGender").value = gender || "";
  document.getElementById("editGenderIdentity").value = genderIdentity || "";
  document.getElementById("editStudentRg").value = studentRg || "";
  document.getElementById("editStudentRgIssuingAuthority").value = studentRgIssuingAuthority || "";
  document.getElementById("editStudentRgIssueDate").value = studentRgIssueDate ? studentRgIssueDate.substring(0, 10) : "";
  document.getElementById("editStudentCpf").value = studentCpf || "";
  document.getElementById("editVoterRegistration").value = voterRegistration || "";
  document.getElementById("editBirthDate").value = birthDate ? birthDate.substring(0, 10) : "";
  document.getElementById("editFatherName").value = fatherName || "";
  document.getElementById("editMotherName").value = motherName || "";
  document.getElementById("editFatherRg").value = fatherRg || "";
  document.getElementById("editFatherRgIssuingAuthority").value = fatherRgIssuingAuthority || "";
  document.getElementById("editFatherRgIssueDate").value = fatherRgIssueDate ? fatherRgIssueDate.substring(0, 10) : "";
  document.getElementById("editFatherCpf").value = fatherCpf || "";
  document.getElementById("editFatherProfession").value = fatherProfession || "";
  document.getElementById("editMotherRg").value = motherRg || "";
  document.getElementById("editMotherRgIssuingAuthority").value = motherRgIssuingAuthority || "";
  document.getElementById("editMotherRgIssueDate").value = motherRgIssueDate ? motherRgIssueDate.substring(0, 10) : "";
  document.getElementById("editMotherCpf").value = motherCpf || "";
  document.getElementById("editMotherProfession").value = motherProfession || "";
  document.getElementById("editLegalGuardian").value = legalGuardian || "";
  document.getElementById("editStudentPhone").value = studentPhone || "";
  document.getElementById("editGuardianPhone").value = guardianPhone || "";
  document.getElementById("editZipCode").value = zipCode || "";
  document.getElementById("editStreet").value = street || "";
  document.getElementById("editNumber").value = number || "";
  document.getElementById("editCity").value = city || "";
  document.getElementById("editNeighborhood").value = neighborhood || "";
  document.getElementById("editState").value = state || "";
  document.getElementById("editLivingRegion").value = livingRegion || "";
  document.getElementById("editNationality").value = nationality || "";
  document.getElementById("editBirthPlace").value = birthPlace || "";
  document.getElementById("editPreviousSchool").value = previousSchool || "";
  document.getElementById("editDisability").value = disability || "";
  document.getElementById("editAllergies").value = allergies || "";
  document.getElementById("editRelevantMedicalConditions").value = relevantMedicalConditions || "";
  document.getElementById("editRegularMedications").value = regularMedications || "";

  document.getElementById("editFormContainer").style.display = "block";
}

// Fecha o formulário de edição
function closeEditForm() {
  document.getElementById("editFormContainer").style.display = "none";
  editingGradeId = null;
}

// Manipula a submissão do formulário para atualizar um aluno
const editStudentForm = document.getElementById("editStudentForm");
if (editStudentForm) {
  editStudentForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const student = {
      code: document.getElementById("editCode").value,
      name: document.getElementById("editName").value,
      socialName: document.getElementById("editSocialName").value,
      gender: document.getElementById("editGender").value,
      genderIdentity: document.getElementById("editGenderIdentity").value,
      studentRg: document.getElementById("editStudentRg").value,
      studentRgIssuingAuthority: document.getElementById("editStudentRgIssuingAuthority").value,
      studentRgIssueDate: document.getElementById("editStudentRgIssueDate").value,
      studentCpf: document.getElementById("editStudentCpf").value,
      voterRegistration: document.getElementById("editVoterRegistration").value,
      birthDate: document.getElementById("editBirthDate").value,
      fatherName: document.getElementById("editFatherName").value,
      motherName: document.getElementById("editMotherName").value,
      fatherRg: document.getElementById("editFatherRg").value,
      fatherRgIssuingAuthority: document.getElementById("editFatherRgIssuingAuthority").value,
      fatherRgIssueDate: document.getElementById("editFatherRgIssueDate").value,
      fatherCpf: document.getElementById("editFatherCpf").value,
      fatherProfession: document.getElementById("editFatherProfession").value,
      motherRg: document.getElementById("editMotherRg").value,
      motherRgIssuingAuthority: document.getElementById("editMotherRgIssuingAuthority").value,
      motherRgIssueDate: document.getElementById("editMotherRgIssueDate").value,
      motherCpf: document.getElementById("editMotherCpf").value,
      motherProfession: document.getElementById("editMotherProfession").value,
      legalGuardian: document.getElementById("editLegalGuardian").value,
      studentPhone: document.getElementById("editStudentPhone").value,
      guardianPhone: document.getElementById("editGuardianPhone").value,
      zipCode: document.getElementById("editZipCode").value,
      street: document.getElementById("editStreet").value,
      number: document.getElementById("editNumber").value,
      city: document.getElementById("editCity").value,
      neighborhood: document.getElementById("editNeighborhood").value,
      state: document.getElementById("editState").value,
      livingRegion: document.getElementById("editLivingRegion").value,
      nationality: document.getElementById("editNationality").value,
      birthPlace: document.getElementById("editBirthPlace").value,
      previousSchool: document.getElementById("editPreviousSchool").value,
      disability: document.getElementById("editDisability").value,
      allergies: document.getElementById("editAllergies").value,
      relevantMedicalConditions: document.getElementById("editRelevantMedicalConditions").value,
      regularMedications: document.getElementById("editRegularMedications").value
    };

    authenticatedFetch(`http://localhost:8080/students/${editingStudentId}`, {
      method: "PUT",
      body: JSON.stringify(student)
    })
    .then(response => response.json())
    .then(() => {
      alert("Student updated successfully!");
      closeEditForm();
      fetchStudents();
    })
    .catch(error => console.error("Error updating student:", error));
  });
}