// Μάρκες, μοντέλα, μηχανάκια
const modelOptions = {
  Audi: ["A1","A3","A4","A6","Q2","Q3","Q5"],
  BMW: ["1 Series","3 Series","5 Series","X1","X3","X5"],
  Mercedes: ["A-Class","C-Class","E-Class","GLA","GLC"],
  Smart: ["Fortwo","Forfour","Roadster","Fortwo Cabrio","EQ Fortwo","EQ Forfour"],
  Toyota: ["Yaris","Corolla","Aygo","C-HR"],
  Peugeot: ["208","308","3008","2008"],
  Honda: ["Civic","CBR500R","CB500F"],
  Kawasaki: ["Ninja 400","Z650"],
  Yamaha: ["MT-07","R1"]
};

const serviceItems = [
  "Αλλαγή λαδιών", "Φίλτρο λαδιού", "Φίλτρο αέρα", "Φίλτρο καμπίνας",
  "Φίλτρο βενζίνης", "Υγρά φρένων", "Τακάκια", "Δίσκοι φρένων",
  "Ελαστικά", "Πίεση αέρα ελαστικών", "Αλλαγή ελαστικών",
  "Μπαταρία", "Υαλοκαθαριστήρες", "Ψυκτικό υγρό", "Ιμάντας χρονισμού",
  "Φώτα", "Στάθμη λαδιού", "Κλιματισμός", "Σύστημα διεύθυνσης",
  "Αμορτισέρ", "Εξάτμιση", "Ανάρτηση", "Διαρροές λαδιού", "Σύστημα πέδησης",
  "ΚΤΕΟ", "Ασφάλεια"
];

const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const serviceList = document.getElementById("serviceList");
const vehicleList = document.getElementById("vehicleList");

// Φόρτωση μάρκας
function loadBrands() {
  Object.keys(modelOptions).forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });
}
loadBrands();

// Φόρτωση μοντέλων
brandSelect.addEventListener("change", () => {
  const models = modelOptions[brandSelect.value] || [];
  modelSelect.innerHTML = "<option value=''>--Επιλέξτε Μοντέλο--</option>";
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    modelSelect.appendChild(opt);
  });
});

// Φόρτωση service
function loadService() {
  serviceList.innerHTML = "";
  serviceItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML = `
      <label><input type="checkbox"> ${item}</label>
      <input type="text" placeholder="Ημερομηνία/Σχόλιο">
    `;
    serviceList.appendChild(div);
  });
}
loadService();

// Αποθήκευση οχήματος
document.getElementById("saveVehicle").addEventListener("click", () => {
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const year = document.getElementById("year").value.trim();
  if(!brand || !model || !year) return alert("Συμπληρώστε όλα τα πεδία!");

  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const key = `${brand} ${model} ${year}`;
  vehicles[key] = { brand, model, year, services: getCurrentServiceData() };
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  loadVehicles();
});

// Αποθήκευση τσεκ box
function getCurrentServiceData() {
  const data = [];
  document.querySelectorAll(".checkbox-item").forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']").value;
    data.push({ name: item.innerText.trim(), checked: checkbox.checked, note });
  });
  return data;
}

// Φόρτωση οχημάτων
function loadVehicles() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  vehicleList.innerHTML = "";
  Object.keys(vehicles).forEach(key => {
    const v = vehicles[key];
    const div = document.createElement("div");
    div.className = "vehicle-item";
    div.dataset.key = key;
    div.innerHTML = `<span>${v.brand} ${v.model} (${v.year})</span>
                     <button class="delete-btn" title="Διαγραφή">&times;</button>`;
    div.querySelector("span").onclick = () => loadVehicle(key);
    div.querySelector(".delete-btn").onclick = e => {
      e.stopPropagation();
      if(confirm("Θέλετε σίγουρα να διαγράψετε το όχημα;")) {
        deleteVehicle(key);
      }
    }
    vehicleList.appendChild(div);
  });
  const first = vehicleList.querySelector(".vehicle-item");
  if(first) { first.classList.add("active"); loadVehicle(first.dataset.key); }
}

// Φόρτωση service για όχημα
function loadVehicle(key) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const v = vehicles[key];
  if(!v) return;

  document.getElementById("brand").value = v.brand;
  brandSelect.dispatchEvent(new Event("change"));
  document.getElementById("model").value = v.model;
  document.getElementById("year").value = v.year;

  document.querySelectorAll(".vehicle-item").forEach(el => el.classList.remove("active"));
  vehicleList.querySelector(`[data-key="${key}"]`).classList.add("active");

  document.querySelectorAll(".checkbox-item").forEach((item,i) => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']");
    if(v.services[i]){
      checkbox.checked = v.services[i].checked;
      note.value = v.services[i].note;
      item.classList.toggle("checked", checkbox.checked);
    } else {
      checkbox.checked = false;
      note.value = "";
      item.classList.remove("checked");
    }
  });
}

// Χρωματισμός τσεκ box
serviceList.addEventListener("change", e => {
  if(e.target.type==="checkbox"){
    const parent = e.target.closest(".checkbox-item");
    parent.classList.toggle("checked", e.target.checked);
    saveCurrentService();
  }
});

function saveCurrentService(){
  const activeVehicle = vehicleList.querySelector(".vehicle-item.active");
  if(!activeVehicle) return;
  const key = activeVehicle.dataset.key;
  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  vehicles[key].services = getCurrentServiceData();
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
}

// Διαγραφή οχήματος
function deleteVehicle(key){
  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  delete vehicles[key];
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  loadVehicles();
}

loadVehicles();