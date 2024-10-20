document.getElementById('hamburgerIcon').addEventListener('click', function() {
  const sideMenu = document.querySelector('.Sidemenu');
  sideMenu.classList.toggle('active');
});

document.addEventListener('click', function(event) {
  const sideMenu = document.querySelector('.Sidemenu');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  if (!sideMenu.contains(event.target) && !hamburgerIcon.contains(event.target)) {
    sideMenu.classList.remove('active');
  }
});

document.getElementById('medicineInput').addEventListener('click', function() {
  const suggestionsContainer = document.getElementById('medicalInputSuggestions');
  suggestionsContainer.style.display = 'block';
});

fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class')
  .then(response => response.json())
  .then(data => {
    const suggestionsContainer = document.getElementById('medicalInputSuggestions');
    suggestionsContainer.innerHTML = '';

    data.forEach(drugClass => {
      const suggestion = document.createElement('div');
      suggestion.textContent = drugClass.name;
      suggestion.classList.add('suggestion-item');

      suggestion.addEventListener('click', function() {
        const selectedDrugClassId = drugClass.id;
        localStorage.setItem('selectedDrugClassId', selectedDrugClassId);
        document.getElementById('medicineInput').value = drugClass.name;
        suggestionsContainer.style.display = 'none';
      });

      suggestionsContainer.appendChild(suggestion);
    });
  })
  .catch(error => console.error('Error fetching drug classes:', error));

document.addEventListener('click', function(event) {
  const medicineInput = document.getElementById('medicineInput');
  const suggestionsContainer = document.getElementById('medicalInputSuggestions');

  if (!medicineInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
    suggestionsContainer.style.display = 'none';
  }
});

function fetchDrugNames(medicineCategoryId) {
  fetch('https://cliniqueplushealthcare.com.ng/prescriptions/all_medicine')
    .then(response => response.json())
    .then(data => {
      const nameSuggestionsContainer = document.getElementById('NameSuggestions');
      nameSuggestionsContainer.innerHTML = '';

      const filteredDrugs = data.filter(drug => drug.medicine_category_id === medicineCategoryId);

      filteredDrugs.forEach(drug => {
        const suggestion = document.createElement('div');
        suggestion.textContent = drug.medicine_name;
        suggestion.classList.add('suggestion-item');

        suggestion.addEventListener('click', function() {
          const selectedDrugId = drug.medicine_id;
          localStorage.setItem('selectedDrugId', selectedDrugId);
          document.getElementById('NameInput').value = drug.medicine_name;
          nameSuggestionsContainer.style.display = 'none';
        });

        nameSuggestionsContainer.appendChild(suggestion);
      });

      nameSuggestionsContainer.style.display = filteredDrugs.length > 0 ? 'block' : 'none';
    })
    .catch(error => console.error('Error fetching drug names:', error));
}

document.getElementById('NameInput').addEventListener('click', function() {
  const selectedDrugClassId = localStorage.getItem('selectedDrugClassId');
  if (selectedDrugClassId) {
    fetchDrugNames(selectedDrugClassId);
  }
});

document.addEventListener('click', function(event) {
  const nameInput = document.getElementById('NameInput');
  const nameSuggestionsContainer = document.getElementById('NameSuggestions');

  if (!nameInput.contains(event.target) && !nameSuggestionsContainer.contains(event.target)) {
    nameSuggestionsContainer.style.display = 'none';
  }
});

function fetchMedicineClasses() {
  fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class')
    .then(response => response.json())
    .then(data => {
      const medicalInputSuggestions = document.getElementById('medicalInputSuggestions');
      medicalInputSuggestions.innerHTML = '';

      data.forEach(item => {
        const suggestion = document.createElement('div');
        suggestion.textContent = item.name;
        suggestion.classList.add('suggestion-item');

        suggestion.addEventListener('click', function() {
          const selectedClassId = item.id;
          localStorage.setItem('selectedDrugClassId', selectedClassId);
          document.getElementById('medicineInput').value = item.name;
          fetchDrugNames(selectedClassId);
          medicalInputSuggestions.style.display = 'none';
        });

        medicalInputSuggestions.appendChild(suggestion);
      });

      medicalInputSuggestions.style.display = data.length > 0 ? 'block' : 'none';
    })
    .catch(error => console.error('Error fetching medicine classes:', error));
}

document.getElementById('medicineInput').addEventListener('click', fetchMedicineClasses);

document.getElementById('medicineInput').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const suggestions = document.querySelectorAll('#medicalInputSuggestions .suggestion-item');

  suggestions.forEach(suggestion => {
    const suggestionText = suggestion.textContent.toLowerCase();
    suggestion.style.display = suggestionText.includes(searchTerm) ? 'block' : 'none';
  });
});

document.getElementById('NameInput').addEventListener('click', function() {
  const selectedDrugClassId = localStorage.getItem('selectedDrugClassId');
  if (selectedDrugClassId) {
    fetchDrugNames(selectedDrugClassId);
  }
});

document.getElementById('NameInput').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const suggestions = document.querySelectorAll('#NameSuggestions .suggestion-item');

  suggestions.forEach(suggestion => {
    const suggestionText = suggestion.textContent.toLowerCase();
    suggestion.style.display = suggestionText.includes(searchTerm) ? 'block' : 'none';
  });
});

document.addEventListener('click', function(event) {
  const medicalInput = document.getElementById('medicineInput');
  const medicalSuggestionsContainer = document.getElementById('medicalInputSuggestions');
  const nameInput = document.getElementById('NameInput');
  const nameSuggestionsContainer = document.getElementById('NameSuggestions');

  if (!medicalInput.contains(event.target) && !medicalSuggestionsContainer.contains(event.target)) {
    medicalSuggestionsContainer.style.display = 'none';
  }

  if (!nameInput.contains(event.target) && !nameSuggestionsContainer.contains(event.target)) {
    nameSuggestionsContainer.style.display = 'none';
  }
});

document.getElementById('addtotable').addEventListener('click', function() {
  const medicineClass = document.getElementById('medicineInput').value;
  const medicineName = document.getElementById('NameInput').value;
  const dose = document.getElementById('doseInput').value;
  const interval = document.getElementById('intervalInput').value;
  const duration = document.querySelectorAll('.durationInputs');
  const durationValue = duration[0].value + "/" + duration[1].value;
  const instructions = document.getElementById('InstructionInput').value;

  if (!medicineClass || !medicineName || interval === "0") {
    alert('Please fill in the Medicine Class, Medicine Name, and select an Interval.');
    return;
  }

  const tableBody = document.querySelector('#medicineTable tbody');
  const rowCount = tableBody.rows.length + 1;

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
      <td>${rowCount}</td>
      <td>${medicineName}</td>
      <td>${medicineClass}</td>
      <td>${dose} & ${interval === "1" ? '1 time daily' : '2 times daily'}</td>
      <td>${durationValue}</td>
      <td>${instructions}</td>
      <td><button class="btn Remove" onclick="removeRow(this)">Remove</button></td>
  `;

  tableBody.appendChild(newRow);

  document.getElementById('medicineInput').value = '';
  document.getElementById('NameInput').value = '';
  document.getElementById('doseInput').value = '';
  document.getElementById('intervalInput').value = '0';
  duration[0].value = '';
  duration[1].value = '';
  document.getElementById('InstructionInput').value = '';
});

function removeRow(button) {
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

document.getElementById('donePrescribing').addEventListener('click', function() {
  const remarksInput = document.getElementById('remarksInput');
  
  if (remarksInput.style.display === "none" || remarksInput.style.display === "") {
    remarksInput.style.display = "block";
  } else {
    remarksInput.style.display = "none";
  }
});
