const modelOptions = {
  Audi: ["A3","A4","A6","Q2","Q3","Q5"],
  BMW: ["1 Series","3 Series","5 Series","X1","X3"],
  Mercedes: ["A-Class","C-Class","E-Class","GLA","GLC"],
  Smart: ["Fortwo","Forfour","Roadster","Fortwo Cabrio","EQ Fortwo","EQ Forfour"],
  Toyota: ["Yaris","Corolla","Aygo","C-HR"],
  Peugeot: ["208","308","3008","2008"],
  Honda: ["Civic","Jazz","CBR"],
  Yamaha: ["MT-07","R6","XMAX"],
  Kawasaki: ["Ninja 400","Z650","Versys 650"]
};

const serviceItems = [
  "Αλλαγή λαδιών","Φίλτρο λαδιού","Φίλτρο αέρα","Φίλτρο καμπίνας",
  "Υγρά φρένων","Τακάκια","Δίσκοι φρένων","Ελαστικά",
  "Πίεση αέρα ελαστικών","Αλλαγή ελαστικών","Μπαταρία",
  "Υαλοκαθαριστήρες","Ψυκτικό υγρό","Ιμάντας χρονισμού",
  "Φώτα","Στάθμη λαδιού","Κλιματισμός","Σύστημα διεύθυνσης",
  "Αμορτισέρ","Εξάτμιση","Ανάρτηση","Διαρροές λαδιού",
  "Σύστημα πέδησης","ΚΤΕΟ","Ασφάλεια"
];

const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const serviceList = document.getElementById("serviceList");
const vehicleList = document.getElementById("vehicleList");

// --- Login ---
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if(username && password){
    document.querySelector(".login-container").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
    loadVehicles();
    loadService();
  } else {
    alert("Συμπληρώστε όνομα χρήστη και κωδικό!");
  }
});

// --- Load models ---
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

// --- Load service ---
function loadService() {
  serviceList.innerHTML = "";
  serviceItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML