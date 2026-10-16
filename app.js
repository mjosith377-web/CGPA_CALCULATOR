import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc,
  query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const isConfigured = firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY_HERE" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";
if (!isConfigured) $("setupNotice").classList.remove("hidden");

let auth, db, currentUser;
let properties = [], tenants = [], rents = [];
const money = amount => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(amount || 0));
const safe = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function message(id, text, error=false) { const el=$(id); el.textContent=text; el.classList.toggle("error",error); }
function collectionFor(name){ return collection(db,name); }
async function listOwned(name, sortField) {
  const constraints = [where("ownerUid","==",currentUser.uid)];
  if (sortField) constraints.push(orderBy(sortField,"desc"));
  const snap = await getDocs(query(collectionFor(name), ...constraints));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
async function addOwned(name, data) {
  await addDoc(collectionFor(name), {...data, ownerUid:currentUser.uid, createdAt:serverTimestamp()});
}
async function removeOwned(name,id) {
  // Firestore rules also enforce ownership; this check is a helpful UI guard, not the security boundary.
  const rows = name==="properties" ? properties : name==="tenants" ? tenants : rents;
  const row=rows.find(x=>x.id===id);
  if (!row || row.ownerUid!==currentUser.uid) throw new Error("You can only delete your own records.");
  await deleteDoc(doc(db,name,id));
}
function empty(text){return `<div class="empty">${safe(text)}</div>`}
function renderProperties(){
  $("propertiesList").innerHTML = properties.length ? properties.map(p=>`<article class="record"><div><h4>${safe(p.name)}</h4><p>${safe(p.address)} · ${money(p.monthlyRent)}/month</p></div><div class="record-right"><span class="pill">${safe(p.status)}</span><button class="delete" data-delete="properties" data-id="${safe(p.id)}">Delete</button></div></article>`).join("") : empty("No properties yet. Add your first property above.");
  $("tenantProperty").innerHTML='<option value="">Choose property (optional)</option>'+properties.map(p=>`<option value="${safe(p.id)}">${safe(p.name)}</option>`).join("");
}
function renderTenants(){
  $("tenantsList").innerHTML = tenants.length ? tenants.map(t=>{const p=properties.find(x=>x.id===t.propertyId);return `<article class="record"><div><h4>${safe(t.name)}</h4><p>${safe(t.phone||"No phone")} · ${safe(t.email||"No email")}${p?" · "+safe(p.name):""}</p></div><div class="record-right"><button class="delete" data-delete="tenants" data-id="${safe(t.id)}">Delete</button></div></article>`}).join("") : empty("No tenants yet. Add a tenant above.");
  $("rentTenant").innerHTML='<option value="">Choose tenant</option>'+tenants.map(t=>`<option value="${safe(t.id)}">${safe(t.name)}</option>`).join("");
}
function renderRents(){
  $("rentList").innerHTML = rents.length ? rents.map(r=>{const t=tenants.find(x=>x.id===r.tenantId);return `<article class="record"><div><h4>${money(r.amount)} · ${safe(t?.name||"Tenant record")}</h4><p>${safe(r.date)}${r.note?" · "+safe(r.note):""}</p></div><div class="record-right"><button class="delete" data-delete="rentRecords" data-id="${safe(r.id)}">Delete</button></div></article>`}).join("") : empty("No rent payments recorded yet.");
}
function renderStats(){
  $("propertyCount").textContent=properties.length;
  $("occupiedCount").textContent=properties.filter(p=>p.status==="Occupied").length;
  $("vacantCount").textContent=properties.filter(p=>p.status==="Vacant").length;
  const now=new Date(), month=String(now.getMonth()+1).padStart(2,"0"), prefix=`${now.getFullYear()}-${month}`;
  $("rentThisMonth").textContent=money(rents.filter(r=>String(r.date||"").startsWith(prefix)).reduce((sum,r)=>sum+Number(r.amount||0),0));
}
async function refresh(){
  try{
    [properties,tenants,rents]=await Promise.all([
      listOwned("properties","createdAt"),listOwned("tenants","createdAt"),listOwned("rentRecords","createdAt")
    ]);
    renderProperties();renderTenants();renderRents();renderStats();
    message("appMessage","");
  }catch(e){message("appMessage",e.message||"Could not load data. Check Firestore setup and security rules.",true)}
}
function showApp(user){
  currentUser=user;
  $("authPanel").classList.toggle("hidden",!!user);
  $("appPanel").classList.toggle("hidden",!user);
  $("signOutBtn").classList.toggle("hidden",!user);
  if(user){$("signedInAs").textContent=user.email||"Signed in";refresh();}
}
if(isConfigured){
  try{
    const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
    onAuthStateChanged(auth,showApp);
  }catch(e){message("authMessage",e.message,true)}
}
$("authForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!isConfigured){message("authMessage","First add your Firebase web configuration in firebase-config.js.",true);return}
  try{await signInWithEmailAndPassword(auth,$("email").value.trim(),$("password").value);message("authMessage","")}
  catch(err){message("authMessage",err.message,true)}
});
$("registerBtn").addEventListener("click",async()=>{
  if(!isConfigured){message("authMessage","First add your Firebase web configuration in firebase-config.js.",true);return}
  try{await createUserWithEmailAndPassword(auth,$("email").value.trim(),$("password").value);message("authMessage","Account created.")}
  catch(err){message("authMessage",err.message,true)}
});
$("signOutBtn").addEventListener("click",()=>signOut(auth));
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===btn));
  ["properties","tenants","rent"].forEach(name=>$(name+"Section").classList.toggle("hidden",name!==btn.dataset.tab));
}));
$("propertyForm").addEventListener("submit",async e=>{
  e.preventDefault();try{await addOwned("properties",{name:$("propertyName").value.trim(),address:$("propertyAddress").value.trim(),monthlyRent:Number($("propertyRent").value),status:$("propertyStatus").value});e.target.reset();await refresh();message("appMessage","Property added.");}catch(err){message("appMessage",err.message,true)}
});
$("tenantForm").addEventListener("submit",async e=>{
  e.preventDefault();try{await addOwned("tenants",{name:$("tenantName").value.trim(),phone:$("tenantPhone").value.trim(),email:$("tenantEmail").value.trim(),propertyId:$("tenantProperty").value});e.target.reset();await refresh();message("appMessage","Tenant added.");}catch(err){message("appMessage",err.message,true)}
});
$("rentForm").addEventListener("submit",async e=>{
  e.preventDefault();try{await addOwned("rentRecords",{tenantId:$("rentTenant").value,amount:Number($("rentAmount").value),date:$("rentDate").value,note:$("rentNote").value.trim()});e.target.reset();$("rentDate").value=new Date().toISOString().slice(0,10);await refresh();message("appMessage","Payment recorded.");}catch(err){message("appMessage",err.message,true)}
});
document.addEventListener("click",async e=>{
  const btn=e.target.closest("[data-delete]");if(!btn)return;
  if(!confirm("Delete this record? This cannot be undone."))return;
  try{await removeOwned(btn.dataset.delete,btn.dataset.id);await refresh();message("appMessage","Record deleted.");}catch(err){message("appMessage",err.message,true)}
});
$("rentDate").value=new Date().toISOString().slice(0,10);
