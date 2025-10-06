// ---------- LOGIN SYSTEM ----------
const loginContainer = document.getElementById("loginContainer");
const appContainer = document.getElementById("appContainer");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const currentUserSpan = document.getElementById("currentUser");

let currentUser = localStorage.getItem("currentUser") || null;

// ---------- VEHICLES & SERVICE SYSTEM ----------
const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const serviceList = document.getElementById("serviceList");
const vehicleList = document.getElementById("vehicleList");

const modelOptions = {
  Audi: ["A3","A4","A6","Q2","Q3","Q5"],
  BMW: ["1 Series","3 Series","5 Series","X1","X3"],
  Mercedes: ["A-Class","C-Class","E-Class","GLA","GLC"],
  Smart: ["Fortwo","Forfour","Roadster","Fortwo Cabrio","EQ Fortwo","EQ Forfour"],
  Toyota: ["Yaris","Corolla","Aygo","C-HR"],
  Peugeot: ["208","308","3008","2008"],
  Kawasaki: ["Ninja 400","Z650","Versys 650"],
  Yamaha: ["MT-07","R1","XSR700"]
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

// Προσθήκη νέων πεδίων
const extraFields = [
  {label:"Τύπος λαδιού κινητήρα", id:"oilType"},
  {label:"Τύπος ελαστικών", id:"tireType"},
  {label:"Τύπος λαμπών", id:"lampType"}
];

function updateUIForUser() {
  if(currentUser){
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    currentUserSpan.textContent = currentUser;
    loadService();  // φορτώνουμε service μετά το login
    loadExtraFields(); // extra πεδία
    loadVehicles();
  } else {
    loginContainer.style.display = "block";
    appContainer.style.display = "none";
  }
}

// ---------- LOGIN EVENTS ----------
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  if(!email || !password){ alert("Συμπληρώστε email και κωδικό!"); return; }

  let users = JSON.parse(localStorage.getItem("users")||"{}");
  if(!users[email]) users[email] = { password };
  else if(users[email].password !== password){ alert("Λάθος κωδικός!"); return; }

  localStorage.setItem("users", JSON.stringify(users));
  currentUser = email;
  localStorage.setItem("currentUser", currentUser);
  updateUIForUser();
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUIForUser();
});

// ---------- LOAD MODELS ----------
brandSelect.addEventListener("change", () => {
  const models = modelOptions[brandSelect.value] || [];
  modelSelect.innerHTML = "<option value=''>--Επιλέξτε Μοντέλο--</option>";
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m; opt.textContent = m;
    modelSelect.appendChild(opt);
  });
});

// ---------- LOAD SERVICE ----------
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

// ---------- LOAD EXTRA FIELDS ----------
function loadExtraFields(){
  extraFields.forEach(f=>{
    if(!document.getElementById(f.id)){
      const input = document.createElement("input");
      input.id = f.id;
      input.placeholder = f.label;
      input.style.margin = "5px 0"; input.style.width="90%";
      const container = document.getElementById("appContainer");
      container.insertBefore(input, container.querySelector("#saveVehicle"));
    }
  });
}

// ---------- SAVE VEHICLE ----------
document.getElementById("saveVehicle").addEventListener("click", () => {
  if(!currentUser) return alert("Κάντε login πρώτα!");
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const year = document.getElementById("year").value.trim();
  if(!brand || !model || !year) return alert("Συμπληρώστε όλα τα πεδία!");

  let vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser}`) || "{}");
  const key = `${brand} ${model} ${year}`;
  vehicles[key] = { 
    brand, model, year, 
    services: getCurrentServiceData(),
    oilType: document.getElementById("oilType").value || "",
    tireType: document.getElementById("tireType").value || "",
    lampType: document.getElementById("lampType").value || ""
  };
  localStorage.setItem(`vehicles_${currentUser}`, JSON.stringify(vehicles));
  loadVehicles();
});

// ---------- GET SERVICE DATA ----------
function getCurrentServiceData(){
  const data = [];
  document.querySelectorAll(".checkbox-item").forEach(item=>{
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']").value;
    data.push({ name: item.innerText.trim(), checked: checkbox.checked, note });
  });
  return data;
}

// ---------- LOAD VEHICLES ----------
function loadVehicles(){
  if(!currentUser) return;
  const vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser}`)||"{}");
  vehicleList.innerHTML = "";
  Object.keys(vehicles).forEach(key=>{
    const v = vehicles[key];
    const div = document.createElement("div");
    div.className = "vehicle-item";
    div.dataset.key = key;
    div.textContent = `${v.brand} ${v.model} (${v.year})`;
    
    // delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = e=>{
      e.stopPropagation();
      if(confirm("Διαγραφή οχήματος;")){
        delete vehicles[key];
        localStorage.setItem(`vehicles_${currentUser}`, JSON.stringify(vehicles));
        loadVehicles();
      }
    };
    div.appendChild(delBtn);
    div.onclick = () => loadVehicle(key);
    vehicleList.appendChild(div);
  });

  const first = vehicleList.querySelector(".vehicle-item");
  if(first){ first.classList.add("active"); loadVehicle(first.dataset.key); }
}

// ---------- LOAD VEHICLE ----------
function loadVehicle(key){
  const vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser}`)||"{}");
  const v = vehicles[key]; if(!v) return;

  document.getElementById("brand").value = v.brand;
  brandSelect.dispatchEvent(new Event("change"));
  document.getElementById("model").value = v.model;
  document.getElementById("year").value = v.year;

  // extra fields
  document.getElementById("oilType").value = v.oilType || "";
  document.getElementById("tireType").value = v.tireType || "";
  document.getElementById("lampType").value = v.lampType || "";

  document.querySelectorAll(".vehicle-item").forEach(el=>el.classList.remove("active"));
  vehicleList.querySelector(`[data-key="${key}"]`).classList.add("active");

  document.querySelectorAll(".checkbox-item").forEach((item,i)=>{
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']");
    if(v.services[i]){
      checkbox.checked = v.services[i].checked;
      note.value = v.services[i].note;
      item.classList.toggle("checked", checkbox.checked);
    } else {
      checkbox.checked = false; note.value="";
      item.classList.remove("checked");
    }
  });
}

// ---------- SERVICE CHECKBOX EVENTS ----------
serviceList.addEventListener("change", e=>{
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
  let vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser}`)||"{}");
  vehicles[key].services = getCurrentServiceData();
  localStorage.setItem(`vehicles_${currentUser}`, JSON.stringify(vehicles));
}

updateUIForUser();