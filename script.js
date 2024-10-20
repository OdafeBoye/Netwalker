document.getElementById('hamburgerIcon').addEventListener('click', function() {
  const sideMenu = document.querySelector('.Sidemenu');
  sideMenu.classList.toggle('active');
});

// Close the side menu when clicking outside of it
document.addEventListener('click', function(event) {
  const sideMenu = document.querySelector('.Sidemenu');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  
  // Check if the click is outside the side menu and the hamburger icon
  if (!sideMenu.contains(event.target) && !hamburgerIcon.contains(event.target)) {
      sideMenu.classList.remove('active');
  }
});

const medicineInput = document.getElementById('medicineInput');
const NameInput = document.getElementById('NameInput');
const doseInput = document.getElementById('doseInput');
const intervalInput = document.getElementById('intervalInput');
const InstructionInput = document.getElementById('InstructionInput');
const medicalInputSuggestions = document.getElementById('medicalInputSuggestions');
const NameSuggestions = document.getElementById('NameSuggestions');
const addButton = document.querySelector('.btn.add');


// Variables
let selectedMedicalClassId = null;
let selectedMedicineId = null;
const storedMedicines = [];


// Fetch and populate medical classes
async function fetchMedicalClasses() {
  try {
      const response = await fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class');
      if (!response.ok) throw new Error('Retry Connection');
      const data = await response.json();
      populateSuggestions(data, medicalInputSuggestions);
  } catch (error) {
      console.error('Error fetching medical classes:', error);
  }
}

// Fetch all medicines
async function fetchAllMedicines() {
  try {
      const response = await fetch('https://cliniqueplushealthcare.com.ng/prescriptions/all_medicine');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
  } catch (error) {
      console.error('Error fetching all medicines:', error);
      return [];
  }
}

// Filter medicines by category
function filterMedicinesByCategory(medicines, categoryId) {
  return medicines.filter(medicine => medicine.medicine_category_id === categoryId);
}

// Fetch and filter medicines based on selected medical class
async function fetchMedicines() {
  if (!selectedMedicalClassId) return;
  const allMedicines = await fetchAllMedicines();
  const filteredMedicines = filterMedicinesByCategory(allMedicines, selectedMedicalClassId);
  populateSuggestions(filteredMedicines, NameSuggestions);
}

// Populate suggestions
function populateSuggestions(data, suggestionBox) {
  suggestionBox.innerHTML = data.map(item => `
      <div><h4>${item.medicine_name || item.name}</h4></div>
  `).join('');

  suggestionBox.querySelectorAll('div').forEach((suggestionItem, index) => {
      suggestionItem.addEventListener('click', () => {
          if (suggestionBox === medicalInputSuggestions) {
              medicineInput.value = data[index].name;
              selectedMedicalClassId = data[index].id;
              fetchMedicines();
          } else {
              NameInput.value = data[index].medicine_name;
              selectedMedicineId = data[index].medicine_id;
          }
          suggestionBox.style.display = 'none';
      });
  });
}

// Show suggestion box
function showSuggestions(input, suggestionBox) {
  input.addEventListener('click', () => suggestionBox.style.display = 'block');
  document.addEventListener('click', event => {
      if (!input.contains(event.target) && !suggestionBox.contains(event.target)) {
          suggestionBox.style.display = 'none';
      }
  });
}

// Store medicine data and insert into table
function storeMedicineData() {
  const durationInputs = document.querySelectorAll('.durationInputs');
  const medicineData = {
      medicineClass: medicineInput.value,
      medicineName: NameInput.value,
      dose: doseInput.value,
      interval: intervalInput.value,
      duration: `${durationInputs[0].value}/${durationInputs[1].value}`,
      instructions: InstructionInput.value
  };

  storedMedicines.push(medicineData);
  insertMedicineToTable(medicineData);
  clearInputs();
}

// Insert medicine data into the table
function insertMedicineToTable(data) {
  const tableBody = document.querySelector('.table tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
      <td>${tableBody.children.length + 1}</td>
      <td>${data.medicineName} <div class="arthemeter">${data.medicineClass}</div></td>
      <td>${data.medicineClass}</td>
      <td>${data.dose} - ${data.interval}</td>
      <td>${data.duration}</td>
      <td>${data.instructions}</td>
      <td><button class="btn remove"><span>remove</span></button></td>
  `;

  tableBody.appendChild(row);

  // Add event listener to the remove button to remove only that specific row
  row.querySelector('.remove').addEventListener('click', () => {
      tableBody.removeChild(row); // Remove the row from the table
      updateRowNumbers(); // Update row numbers after removal
  });
}

// Update row numbers in the table after removal
function updateRowNumbers() {
  const tableBody = document.querySelector('.table tbody');
  Array.from(tableBody.children).forEach((row, index) => {
      row.firstElementChild.textContent = index + 1; // Update the first cell with the new row number
  });
}

// Clear input fields
function clearInputs() {
  medicineInput.value = '';
  NameInput.value = '';
  doseInput.value = '';
  intervalInput.value = '0';
  document.querySelectorAll('.durationInputs').forEach(input => input.value = '');
  InstructionInput.value = '';
}

// Event listeners
addButton.addEventListener('click', storeMedicineData);
fetchMedicalClasses();
showSuggestions(medicineInput, medicalInputSuggestions);
showSuggestions(NameInput, NameSuggestions);

// Display remarks input on done prescribing
document.getElementById('donePrescribing').addEventListener('click', () => {
  document.getElementById('remarksInput').style.display = 'block';
});
