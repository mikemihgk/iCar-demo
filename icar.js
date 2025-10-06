// ---------- LOGIN SYSTEM ----------
const loginContainer = document.getElementById("loginContainer");
const appContainer = document.getElementById("appContainer");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const currentUserSpan = document.getElementById("currentUser");

let currentUser = localStorage.getItem("currentUser") || null;

function updateUIForUser() {
  if(currentUser){
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    currentUserSpan.textContent = currentUser;
    loadVehicles();
  } else {
    loginContainer.style.display = "block";
    appContainer.style.display = "none";
  }
}

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

updateUIForUser();

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
  Yamaha: ["R1","MT-07","MT-09"],
  Honda: ["CBR500R","CB500X","NC750X"],
  Kawasaki: ["Ninja 400","Z650","Z900"]
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

// Φόρτωση μοντέλων
brandSelect.addEventListener("change", () => {
  const models = modelOptions[brandSelect.value] || [];
  modelSelect.innerHTML = "<option value=''>--Επιλέξτε Μοντέλο--</option>";
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m; opt.textContent = m;
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
  if(!currentUser) return alert("Κάντε login πρώτα!");
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const year = document.getElementById("year").value.trim();
  const oil = document.getElementById("oilType").value.trim();
  const tires = document.getElementById("tiresType").value.trim();
  const lights = document.getElementById("lightsType").value.trim();
  if(!brand || !model || !year) return alert("Συμπληρώστε όλα τα πεδία!");

  let vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser}`) || "{}");
  const key = `${brand} ${model} ${year}`;
  vehicles[key] = { brand, model, year, oil, tires, lights, services: getCurrentServiceData() };
  localStorage.setItem(`vehicles_${currentUser}`, JSON.stringify(vehicles));
  loadVehicles();
});

// Αποθήκευση service
function getCurrentServiceData(){
  const data = [];
  document.querySelectorAll(".checkbox-item").forEach(item=>{
    const checkbox = item.querySelector("input[type='checkbox']");
    const note = item.querySelector("input[type='text']").value;
    data.push({ name: item.innerText.trim(), checked: checkbox.checked, note });
  });
  return data;
}

// Φόρτωση οχημάτων
function loadVehicles(){
  if(!currentUser) return;
  const vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser}`)||"{}");
  vehicleList.innerHTML = "";
  Object.keys(vehicles).forEach(key=>{
    const v = vehicles[key];
    const div = document.createElement("div");
    div.className = "vehicle-item";
    div.dataset.key = key;
    div.innerHTML = `<span>${v.brand} ${v.model} (${v.year})</span>`;
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "deleteBtn";
    delBtn.onclick = e=>{
      e.stopPropagation();
      if(confirm("Διαγραφή οχήματος;")){