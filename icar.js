const modelOptions = {
  // Αυτοκίνητα
  Audi: ["A1","A3","A4","A6","Q2","Q3","Q5"],
  BMW: ["1 Series","3 Series","5 Series","X1","X3","X5"],
  Mercedes: ["A-Class","C-Class","E-Class","GLA","GLC"],
  Smart: ["Fortwo","Forfour","Roadster","Fortwo Cabrio","EQ Fortwo","EQ Forfour"],
  Toyota: ["Yaris","Corolla","Aygo","C-HR","RAV4","Hilux"],
  Peugeot: ["208","308","3008","2008","5008"],
  Volkswagen: ["Polo","Golf","Passat","Tiguan","Touareg"],
  Ford: ["Fiesta","Focus","Kuga","Mondeo","Mustang"],
  Honda: ["Civic","Jazz","CR-V","HR-V"],
  Hyundai: ["i10","i20","i30","Tucson","Santa Fe"],
  Kia: ["Picanto","Rio","Sportage","Stonic","Sorento"],
  Nissan: ["Micra","Qashqai","X-Trail","Juke","Leaf"],
  Opel: ["Corsa","Astra","Insignia","Crossland"],
  Renault: ["Clio","Megane","Captur","Kadjar"],
  Seat: ["Ibiza","Leon","Arona","Ateca"],
  Skoda: ["Fabia","Octavia","Kodiaq","Kamiq"],

  // Μηχανές
  Yamaha: ["MT-07","MT-09","R1","XSR900"],
  HondaMoto: ["CB500F","CBR500R","Africa Twin","NC750X"],
  Kawasaki: ["Z650","Ninja 400","Ninja 650","Versys 650"],
  Suzuki: ["GSX-R600","SV650","V-Strom 650","GSX-S750"],
  Ducati: ["Monster 821","Panigale V2","Scrambler Icon"],
  BMWMoto: ["R1250GS","S1000RR","F900R"]
};

const serviceItems = [
  "Αλλαγή λαδιών","Φίλτρο λαδιού","Φίλτρο αέρα","Φίλτρο καμπίνας",
  "Φίλτρο βενζίνης","Υγρά φρένων","Τακάκια","Δίσκοι φρένων",
  "Ελαστικά","Πίεση αέρα ελαστικών","Αλλαγή ελαστικών","Μπαταρία",
  "Υαλοκαθαριστήρες","Ψυκτικό υγρό","Ιμάντας χρονισμού","Φώτα",
  "Στάθμη λαδιού","Κλιματισμός","Σύστημα διεύθυνσης","Αμορτισέρ",
  "Εξάτμιση","Ανάρτηση","Διαρροές λαδιού","Σύστημα πέδησης","ΚΤΕΟ","Ασφάλεια"
];

const typeSelect = document.getElementById("type");
const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const serviceList = document.getElementById("serviceList");
const vehicleList = document.getElementById("vehicleList");

// Φόρτωση μαρκών ανά τύπο
typeSelect.addEventListener("change", loadBrands);

function loadBrands() {
  const type = typeSelect.value;
  brandSelect.innerHTML = "<option value=''>--Επιλέξτε Μάρκα--</option>";
  Object.keys(modelOptions).forEach(b => {
    if (type === "car" && !["Yamaha","HondaMoto","Kawasaki","Suzuki","Ducati","BMWMoto"].includes(b)) {
      const opt = document.createElement("option"); opt.value = b; opt.textContent = b; brandSelect.appendChild(opt);
    }
    if (type === "moto" && (["Yamaha","HondaMoto","Kawasaki","Suzuki","Ducati","BMWMoto"].includes(b))) {
      const opt = document.createElement("option"); opt.value = b; opt.textContent = b; brandSelect.appendChild(opt);
    }
  });
  modelSelect.innerHTML = "<option value=''>--Επιλέξτε Μοντέλο--</option>";
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
    div.innerHTML = `<label><input type="checkbox"> ${item}</label><input type="text" placeholder="Ημερομηνία/Σχόλιο">`;
    serviceList.appendChild(div);
  });
}
loadService();

// Αποθήκευση οχήματος
document.getElementById("saveVehicle").addEventListener("click", () => {
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const year = document.getElementById("year").value.trim();
  if (!brand || !model || !year) return alert("Συμπληρώστε όλα τα πεδία!");

  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const key = `${brand} ${model} ${year}`;
  vehicles[key] = { brand, model, year, services: getCurrentServiceData() };
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  loadVehicles();
});

// Αποθήκευση service
function getCurrentServiceData() {
  const data = [];
  document.querySelectorAll(".checkbox-item").forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']").value;
    data.push({ name: item.innerText.trim(), checked: checkbox.checked, note });
  });
  return data;
}

// Χρωματισμός τσεκ box
serviceList.addEventListener("change", e => {
  if(e.target.type === "checkbox"){
    const parent = e.target.closest(".checkbox-item");
    parent.classList.toggle("checked", e.target.checked);
    saveCurrentService();
  }
});

function saveCurrentService() {
  const activeVehicle = vehicleList.querySelector(".vehicle-item.active");
  if (!activeVehicle) return;
  const key = activeVehicle.dataset.key;
  let vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  vehicles[key].services = getCurrentServiceData();
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
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
    div.textContent = `${v.brand} ${v.model} (${v.year})`;

    // Κουμπί διαγραφής
    const del = document.createElement("button");
    del.className = "delete"; del.textContent = "✕";
    del.onclick = e => { e.stopPropagation(); deleteVehicle(key); };
    div.appendChild(del);

    div.onclick = () => loadVehicle(key);
    vehicleList.appendChild(div);
  });

  const first = vehicleList.querySelector(".vehicle-item");
  if(first) { first.classList.add("active"); loadVehicle(first.dataset.key); }
}

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
    if(v.services[i]) { checkbox.checked = v.services[i].checked; note.value = v.services[i].note; item.classList.toggle("checked", checkbox.checked); }
    else { checkbox.checked=false; note.value=""; item.classList.remove("checked");