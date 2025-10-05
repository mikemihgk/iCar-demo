// Array για οχήματα (χρησιμοποιεί localStorage)
let vehicles = [];

// Φόρτωση οχημάτων από localStorage κατά την εκκίνηση
function loadVehicles() {
    vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicleList = document.getElementById('vehicle-list');
    if (!vehicleList) {
        console.error('Δεν βρέθηκε element με id="vehicle-list".');
        return;
    }
    
    vehicleList.innerHTML = ''; // Καθαρισμός λίστας
    
    vehicles.forEach((vehicle, index) => {
        const li = document.createElement('li');
        li.className = 'vehicle-item';
        li.innerHTML = `
            <strong>${vehicle.brand} ${vehicle.model} (${vehicle.year})</strong>
            <p>Σημεία Ελέγχου: ${vehicle.checkpoints && vehicle.checkpoints.length > 0 ? vehicle.checkpoints.join(', ') : 'Κανένα'}</p>
            <p>Ημερομηνία Προσθήκης: ${new Date(vehicle.createdAt).toLocaleDateString('el-GR')}</p>
            <div class="btn-group">
                <button onclick="selectVehicle(${index})" class="select-btn">Επιλογή</button>
                <button onclick="editVehicle(${index})" class="edit-btn">Επεξεργασία</button>
                <button onclick="deleteVehicle(${index})" class="delete-btn">Διαγραφή</button>
            </div>
        `;
        vehicleList.appendChild(li);
    });
    
    // Ενημέρωση μετρητή
    const countElement = document.getElementById('vehicle-count');
    if (countElement) {
        countElement.textContent = `Συνολικά Οχήματα: ${vehicles.length}`;
    }
}

// Προσθήκη νέου οχήματος
function addVehicle() {
    const brandInput = document.getElementById('brand');
    const modelInput = document.getElementById('model');
    const yearInput = document.getElementById('year');
    
    const brand = brandInput.value.trim();
    const model = modelInput.value.trim();
    const year = yearInput.value.trim();
    
    if (!brand || !model || !year) {
        alert('Παρακαλώ συμπληρώστε όλα τα πεδία (Μάρκα, Μοντέλο, Χρονολογία)!');
        return;
    }
    
    // Έλεγχος διπλότυπου (προαιρετικό)
    const exists = vehicles.some(v => v.brand.toLowerCase() === brand.toLowerCase() && 
                                     v.model.toLowerCase() === model.toLowerCase() && 
                                     v.year === year);
    if (exists) {
        alert('Αυτό το όχημα υπάρχει ήδη! Χρησιμοποιήστε Επεξεργασία.');
        return;
    }
    
    const newVehicle = {
        brand: brand,
        model: model,
        year: year,
        checkpoints: [], // Αρχικά κενό για αλλαγές/ελέγχους
        createdAt: new Date().toISOString()
    };
    
    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    
    // Καθαρισμός inputs
    brandInput.value = '';
    modelInput.value = '';
    yearInput.value = '';
    
    loadVehicles();
    alert('Όχημα προστέθηκε επιτυχώς!');
}

// Επιλογή οχήματος (άνοιγμα modal με λεπτομέρειες)
function selectVehicle(index) {
    const vehicle = vehicles[index];
    if (!vehicle) return;
    
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('vehicle-details');
    
    modalTitle.textContent = `Επιλεγμένο Όχημα: ${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
    modalBody.innerHTML = `
        <p><strong>Σημεία Ελέγχου:</strong> ${vehicle.checkpoints && vehicle.checkpoints.length > 0 ? vehicle.checkpoints.join('<br>') : 'Κανένα'}</p>
        <p><strong>Ημερομηνία Προσθήκης:</strong> ${new Date(vehicle.createdAt).toLocaleDateString('el-GR')}</p>
    `;
    modal.style.display = 'flex';
}

// Κλείσιμο modal
function closeDetails() {
    document.getElementById('vehicle-details').style.display = 'none';
}

// Επεξεργασία οχήματος (προσθήκη/αλλαγή σημείων ελέγχου)
function editVehicle(index) {
    const vehicle = vehicles[index];
    if (!vehicle) return;
    
    const currentCheckpoints = vehicle.checkpoints ? vehicle.checkpoints.join(', ') : '';
    const newCheckpointsStr = prompt(
        `Επεξεργασία για: ${vehicle.brand} ${vehicle.model} (${vehicle.year})\n\nΤρέχοντα Σημεία Ελέγχου:\n${currentCheckpoints}\n\nΠροσθέστε/Αλλάξτε (χωρισμένα με κόμμα, π.χ. "Φρένα, Λάστιχα"):` ,
        currentCheckpoints
    );
    
    if (newCheckpointsStr !== null) {
        if (newCheckpointsStr.trim() === '') {
            vehicle.checkpoints = [];
        } else {
            vehicle.checkpoints = newCheckpointsStr.split(',').map(cp => cp.trim()).filter(cp => cp);
        }
        vehicles[index] = vehicle;
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        loadVehicles();
        alert('Ενημερώθηκε επιτυχώς!');
    }
}

// Διαγραφή οχήματος
function deleteVehicle(index) {
    if (confirm(`Σίγουρα θέλετε να διαγράψετε το όχημα "${vehicles[index].brand} ${vehicles[index].model} (${vehicles[index].year})";`)) {
        vehicles.splice(index, 1);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        loadVehicles();
        alert('Διαγράφηκε επιτυχώς!');
    }
}

// Εξαγωγή δεδομένων σε JSON
function exportData() {
    if (vehicles.length === 0) {
        alert('Δεν υπάρχουν δεδομένα για εξαγωγή!');
        return;
    }
    const dataStr = JSON.stringify(vehicles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'icar-vehicles-backup.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Εισαγωγή δεδομένων από JSON
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedVehicles = JSON.parse(e.target.result);
            if (!Array.isArray(importedVehicles)) {
                throw new Error('Μη έγκυρο JSON!');
            }
            vehicles = importedVehicles;
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            loadVehicles();
            document.getElementById('import-file').value = ''; // Καθαρισμός input
            alert('Δεδομένα εισήχθησαν επιτυχώς!');
        } catch (err) {
            alert('Σφάλμα εισαγωγής: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadVehicles(); // Φόρτωση κατά την εκκίνηση
    
    // Σύνδεση κουμπιού "Προσθήκη"
    const addBtn = document.getElementById('add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addVehicle);
    }
    
    // Enter key στα inputs
    ['brand', 'model', 'year'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addVehicle();
                }
            });
        }
    });
    
    // Κλείσιμο modal με ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDetails();
        }
    });
});

// Κλείσιμο modal με κλικ έξω (προαιρετικό)
window.onclick = function(event) {
    const modal = document.getElementById('vehicle-details');
    if (event.target === modal) {
        closeDetails();
    }
}