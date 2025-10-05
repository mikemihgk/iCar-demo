// ==============================
// iCar JS - Full version
// ==============================

// Προσθήκη μοναδικού prefix για GitHub Pages
(function() {
  const repoName = window.location.pathname.split('/')[1]; // παίρνει το όνομα repository
  const prefix = `${repoName}:`; 

  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  const originalRemoveItem = localStorage.removeItem;

  localStorage.setItem = function(key, value) {
    originalSetItem.call(localStorage, prefix + key, value);
  };
  localStorage.getItem = function(key) {
    return originalGetItem.call(localStorage, prefix + key);
  };
  localStorage.removeItem = function(key) {
    originalRemoveItem.call(localStorage, prefix + key);
  };
})();

// ------------------------------
// Μοντέλα ανά μάρκα
// ------------------------------
const modelOptions = {
  Audi: ["A3", "A4", "A6", "Q2", "Q3", "Q5"],
  BMW: ["1 Series", "3 Series", "5 Series", "X1", "X3"],
  Mercedes: ["A-Class", "C-Class", "E-Class", "GLA", "GLC"],
  Smart: ["Fortwo", "Forfour", "Roadster"],
  Toyota: ["Yaris", "Corolla", "Aygo", "C-HR"],
  Peugeot: ["208", "308", "3008", "2008"]
};

// ------------------------------
// Service Items
// ------------------------------
const serviceItems = [
  "Αλλαγή λαδιών", "Φίλτρο λαδιού", "Φίλτρο αέρα", "Φίλτρο καμπίνας", 
  "Φίλτρο βενζίνης", "Υγρά φρένων", "Τακάκια", "Δίσκοι φρένων",
  "Ελαστικά", "Πίεση αέρα ελαστικών", "Αλλαγή ελαστικών",
  "Μπαταρία", "Υαλοκαθαριστήρες", "Ψυκτικό υγρό", "Ιμάντας χρονισμού",
  "Φώτα", "Στάθμη λαδιού", "Κλιματισμός", "Σύστημα διεύθυνσης",
  "Αμορτισέρ", "Εξάτμιση", "Ανάρτηση", "Διαρροές λαδιού", "Σύστημα πέδησης"
];

// ------------------------------
// Φόρτωση μοντέλων ανά μάρκα
// ------------------------------
document.getElementById("brand").addEventListener("change", function() {
  const models = modelOptions[this.value] || [];
  const modelSelect = document.getElementById("model");
  modelSelect.innerHTML = "<option value=''>--Επιλέξτε Μοντέλο--</option>";
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    modelSelect.appendChild(opt);
  });
});

// ------------------------------
// Φόρτωση service checklist
// ------------------------------
const serviceList = document.getElementById("serviceList");
serviceItems.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "checkbox-item";
  div.innerHTML = `
    <label><input type="checkbox"> ${item}</label>
    <input type="text" placeholder="Ημερομηνία/Σχόλιο">
  `;
  serviceList.appendChild(div);
});

// Χρωματισμός πρασίνου όταν τσεκάρεται
serviceList.addEventListener("change", e => {
  if (e.target.type === "checkbox") {
    const parent = e.target.closest(".checkbox-item");
    parent.classList.toggle("checked", e.target.checked);
    saveCurrentService();
  }
});

// ------------------------------
// Αποθήκευση οχήματος
// ------------------------------
document.getElementById("saveVehicle").addEventListener("click", () => {
  const brand = document.getElementById("brand").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  if (!brand || !model || !year) return alert("Συμπληρώστε όλα τα πεδία!");

  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
  // Αν υπάρχει ήδη, αντικατάσταση
  const existingIndex = vehicles.findIndex(v => v.brand === brand && v.model === model && v.year === year);
  if (existingIndex !== -1) vehicles.splice(existingIndex, 1);

  vehicles.push({ brand, model, year, services: getCurrentServiceData() });
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  loadVehicles();
});

// ------------------------------
// Λήψη τρεχουσών υπηρεσιών
// ------------------------------
function getCurrentServiceData() {
  const data = [];
  document.querySelectorAll(".checkbox-item").forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']").value;
    const name = item.querySelector("label").innerText.trim();
    data.push({ name, checked: checkbox.checked, note });
  });
  return data;
}

// Αποθήκευση κατάστασης service για το ενεργό όχημα
function saveCurrentService() {
  const activeDiv = document.querySelector(".vehicle-item.active");
  if (!activeDiv) return;
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
  const v = vehicles.find(v => v.brand + v.model + v.year === activeDiv.dataset.name);
  if (v) {
    v.services = getCurrentServiceData();
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }
}

// ------------------------------
// Φόρτωση αποθηκευμένων οχημάτων
// ------------------------------
function loadVehicles() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
  const list = document.getElementById("vehicleList");
  list.innerHTML = "";
  vehicles.forEach(v => {
    const div = document.createElement("div");
    div.className = "vehicle-item";
    div.dataset.name = v.brand + v.model + v.year;
    div.textContent = `${v.brand} ${v.model} (${v.year})`;
    div.style.cursor = "pointer";
    div.onclick = () => {
      document.querySelectorAll(".vehicle-item").forEach(i => i.classList.remove("active"));
      div.classList.add("active");
      loadServiceData(v.services);
    };
    list.appendChild(div);
  });
}

// ------------------------------
// Φόρτωση υπηρεσιών για επιλεγμένο όχημα
// ------------------------------
function loadServiceData(services) {
  const items = document.querySelectorAll(".checkbox-item");
  items.forEach((item, i) => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']");
    if (services[i]) {
      checkbox.checked = services[i].checked;
      note.value = services[i].note;
      item.classList.toggle("checked", checkbox.checked);
    } else {
      checkbox.checked = false;
      note.value = "";
      item.classList.remove("checked");
    }
  });
}

// ------------------------------
// Αρχική φόρτωση οχημάτων
// ------------------------------
loadVehicles();