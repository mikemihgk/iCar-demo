const modelsByBrand={
"Smart":["Fortwo","Forfour"],
"Audi":["A1","A3","A4","A6","Q2","Q3","Q5"],
"BMW":["1 Series","3 Series","X1","X3","X5"],
"Mercedes":["A-Class","C-Class","E-Class","GLA","GLE"],
"Toyota":["Yaris","Corolla","RAV4","Hilux"],
"Volkswagen":["Polo","Golf","Passat","Tiguan"],
"Ford":["Fiesta","Focus","Kuga","Mondeo"],
"Honda":["Civic","Jazz","CR-V"],
"Hyundai":["i10","i20","i30","Tucson"],
"Kia":["Picanto","Rio","Sportage"],
"Nissan":["Micra","Qashqai","X-Trail"],
"Opel":["Corsa","Astra","Insignia"],
"Peugeot":["208","308","3008"],
"Renault":["Clio","Megane","Captur"],
"Seat":["Ibiza","Leon","Arona"],
"Skoda":["Fabia","Octavia","Kodiaq"]
};

function updateModels(){
  const brand=document.getElementById("brand").value;
  const m=document.getElementById("model");
  m.innerHTML="";
  if(modelsByBrand[brand]) modelsByBrand[brand].forEach(x=>{
    const o=document.createElement("option");o.textContent=x;m.appendChild(o);
  });
}

const serviceItems=[
"Αλλαγή λαδιών κινητήρα","Φίλτρο λαδιού","Φίλτρο αέρα","Μπουζί","Ψυκτικό υγρό","Υγρά φρένων",
"Φρένα (δίσκοι/τακάκια)","Υαλοκαθαριστήρες","Μπαταρία","Φώτα εμπρός/πίσω","Αλλαγή ελαστικών","Έλεγχος πίεσης ελαστικών","Ευθυγράμμιση","Αλλαγή φίλτρου καμπίνας","ΚΤΕΟ","Ασφάλεια","Έλεγχος ιμάντα χρονισμού","Καθαρισμός ψυγείου","Έλεγχος συστήματος διεύθυνσης"
];

function loadChecklist(){
  const ul=document.getElementById("checklist");
  ul.innerHTML="";
  serviceItems.forEach((item,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<input type="checkbox" id="chk${i}" onchange="toggleCheck(${i})">
    <span>${item}</span>
    <input class="note" type="text" id="note${i}" placeholder="Ημερομηνία ή σημείωση">`;
    ul.appendChild(li);
  });
}
loadChecklist();

function toggleCheck(i){
  const li=document.getElementById("chk"+i).closest("li");
  li.classList.toggle("checked");
}

function saveVehicle(){
  const brand=document.getElementById("brand").value;
  const model=document.getElementById("model").value;
  const year=document.getElementById("year").value;
  const engine=document.getElementById("engine").value;
  if(!brand||!model){alert("Συμπλήρωσε μάρκα και μοντέλο!");return;}
  const vehicles=JSON.parse(localStorage.getItem("vehicles")||"{}");
  if(!vehicles[brand+" "+model]) vehicles[brand+" "+model]={brand,model,year,engine,service:{}};
  localStorage.setItem("vehicles",JSON.stringify(vehicles));
  displayVehicles();
}

function saveAll(){
  const brand=document.getElementById("brand").value;
  const model=document.getElementById("model").value;
  const key=brand+" "+model;
  const vehicles=JSON.parse(localStorage.getItem("vehicles")||"{}");
  if(!vehicles[key]){alert("Αποθήκευσε πρώτα το όχημα!");return;}
  vehicles[key].service={};
  serviceItems.forEach((item,i)=>{
    const checked=document.getElementById("chk"+i).checked;
    const note=document.getElementById("note"+i).value;
    vehicles[key].service[item]={checked,note};
  });
  localStorage.setItem("vehicles",JSON.stringify(vehicles));
  alert("✅ Όλα αποθηκεύτηκαν!");
  displayVehicles();
}

function displayVehicles(){
  const div=document.getElementById("savedVehicles");
  div.innerHTML="";
  const vehicles=JSON.parse(localStorage.getItem("vehicles")||"{}");
  Object.keys(vehicles).forEach(key=>{
    const v=vehicles[key];
    const btn=document.createElement("button");
    btn.textContent=key;
    btn.onclick=
