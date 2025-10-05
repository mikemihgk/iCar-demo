// --- Κύρια δεδομένα ---
const modelOptions = {
  Audi: ["A3","A4","A6","Q2","Q3","Q5"],
  BMW: ["1 Series","3 Series","5 Series","X1","X3"],
  Mercedes: ["A-Class","C-Class","E-Class","GLA","GLC"],
  Smart: ["Fortwo","Forfour","Roadster"],
  Toyota: ["Yaris","Corolla","Aygo","C-HR"],
  Peugeot: ["208","308","3008","2008"]
};

const serviceItems = [
  "Αλλαγή λαδιών", "Φίλτρο λαδιού", "Φίλτρο αέρα", "Φίλτρο καμπίνας",
  "Φίλτρο βενζίνης", "Υγρά φρένων", "Τακάκια", "Δίσκοι φρένων",
  "Ελαστικά", "Πίεση αέρα ελαστικών", "Αλλαγή ελαστικών",
  "Μπαταρία", "Υαλοκαθαριστήρες", "Ψυκτικό υγρό", "Ιμάντας χρονισμού",
  "Φώτα", "Στάθμη λαδιού", "Κλιματισμός", "Σύστημα διεύθυνσης",
  "Αμορτισέρ", "Εξάτμιση", "Ανάρτηση", "Διαρροές λαδιού", "Σύστημα πέδησης"
];

// --- Φόρτωση μοντέλων ---
document.getElementById("brand").addEventListener("change", function() {
  const models = modelOptions[this.value] || [];
  const modelSelect = document.getElementById("model");
  modelSelect.innerHTML = "<option value=''>--Επιλέξτε Μοντέλο--</option>";
  models.forEach(m=>{
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    modelSelect.appendChild(opt);
  });
});

// --- Δημιουργία Service List ---
const serviceList = document.getElementById("serviceList");
function createServiceList() {
  serviceList.innerHTML = "";
  serviceItems.forEach(item=>{
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML = `<label><input type="checkbox"> ${item}</label>
                     <input type="text" placeholder="Ημερομηνία/Σχόλιο">`;
    serviceList.appendChild(div);
  });
}
createServiceList();

// --- Αποθήκευση Οχήματος ---
document.getElementById("saveVehicle").addEventListener("click", ()=>{
  const brand = document.getElementById("brand").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  if(!brand || !model || !year) return alert("Συμπληρώστε όλα τα πεδία!");
  
  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const key = brand + "_" + model + "_" + year;

  // Δημιουργία ή ενημέρωση
  vehicles[key] = {
    brand, model, year,
    services: getCurrentServiceData()
  };
  
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  loadVehicles();
});

// --- Λήψη δεδομένων service ---
function getCurrentServiceData() {
  const data = [];
  document.querySelectorAll(".checkbox-item").forEach(item=>{
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']").value;
    data.push({checked: checkbox.checked, note});
  });
  return data;
}

// --- Φόρτωση Οχημάτων ---
function loadVehicles() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const list = document.getElementById("vehicleList");
  list.innerHTML = "";
  Object.keys(vehicles).forEach(key=>{
    const v = vehicles[key];
    const div = document.createElement("div");
    div.className = "vehicle-item";
    div.dataset.key = key;
    div.textContent = `${v.brand} ${v.model} (${v.year})`;
    div.style.cursor = "pointer";
    div.onclick = ()=>{ loadVehicle(key); };
    list.appendChild(div);
  });
}

// --- Φόρτωση Service ενός οχήματος ---
function loadVehicle(key) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const v = vehicles[key];
  if(!v) return;

  document.getElementById("brand").value = v.brand;
  document.getElementById("model").value = v.model;
  document.getElementById("year").value = v.year;

  createServiceList();
  const items = document.querySelectorAll(".checkbox-item");
  v.services.forEach((s,i)=>{
    const checkbox = items[i].querySelector("input[type='checkbox']");
    const note = items[i].querySelector("input[type='text']");
    checkbox.checked = s.checked;
    note.value = s.note;
    items[i].classList.toggle("checked", s.checked);
  });

  // ενεργοποίηση κουμπιού
  document.querySelectorAll(".vehicle-item").forEach(el=>el.classList.remove("active"));
  document.querySelector(`.vehicle-item[data-key="${key}"]`).classList.add("active");
}

// --- Χρώμα πρασίνου στα τσεκ ---
serviceList.addEventListener("change", e=>{
  if(e.target.type === "checkbox"){
    const parent = e.target.closest(".checkbox-item");
    parent.classList.toggle("checked", e.target.checked);
    saveActiveService();
  }
});

function saveActiveService() {
  const active = document.querySelector(".vehicle-item.active");
  if(!active) return;
  const key = active.dataset.key;
  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  vehicles[key].services = getCurrentServiceData();
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
}

// --- Αρχικοποίηση ---
loadVehicles();