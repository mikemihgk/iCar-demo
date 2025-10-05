const modelOptions = {
  Audi: ["A3","A4","A6","Q2","Q3","Q5"],
  BMW: ["1 Series","3 Series","5 Series","X1","X3"],
  Mercedes: ["A-Class","C-Class","E-Class","GLA","GLC"],
  Smart: ["Fortwo","Forfour","Roadster","Fortwo Cabrio","EQ Fortwo","EQ Forfour"],
  Toyota: ["Yaris","Corolla","Aygo","C-HR"],
  Peugeot: ["208","308","3008","2008"]
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
                     <button class="delete-btn">❌</button>`;

    // Επιλογή οχήματος
    div.querySelector("span").addEventListener("click", () => loadVehicle(key));
    // Διαγραφή οχήματος
    div.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      delete vehicles[key];
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
      loadVehicles();
    });

    vehicleList.appendChild(div);
  });

  // Επισήμανση πρώτου οχήματος
  const first = vehicleList.querySelector(".vehicle-item span");
  if (first) loadVehicle(first.parentElement.dataset.key);
}

// Φόρτωση service για όχημα
function loadVehicle(key) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles") || "{}");
  const v = vehicles[key];
  if (!v) return;

  document.getElementById("brand").value = v.brand;
  brandSelect.dispatchEvent(new Event("change"));
  document.getElementById("model").value = v.model;
  document.getElementById("year").value = v.year;

  document.querySelectorAll(".vehicle-item").forEach(el => el.classList.remove("active"));
  vehicleList.querySelector(`[data-key="${key}"]`).classList.add("active");

  document.querySelectorAll(".checkbox-item").forEach((item,i) => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']");
    if (v.services[i]) {
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

loadVehicles();