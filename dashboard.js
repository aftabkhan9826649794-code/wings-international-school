const API="https://sheetdb.io/api/v1/58f61be4dda40";

let role=localStorage.getItem("role");
let userID=localStorage.getItem("userID");

if(!role || !userID){
window.location.href="login.html";
}

document.getElementById("roleInfo").innerHTML="<b>Role:</b> "+role.toUpperCase();

/* ---------- PROGRESS ---------- */

function loadProgress(){

fetch(API+"?sheet=Progress")
.then(res=>res.json())
.then(data=>{

let filtered=[];

if(role==="admin"){
filtered=data;
}
else if(role==="student" || role==="parent"){
filtered=data.filter(p=>p.ID===userID);
}
else if(role==="teacher"){
fetch(API+"?sheet=Teachers")
.then(res=>res.json())
.then(teachers=>{
let teacher=teachers.find(t=>t.ID===userID);
if(teacher){
filtered=data.filter(p=>p.Class===teacher.Class);
renderProgress(filtered);
}
});
return;
}

renderProgress(filtered);

});
}

function renderProgress(data){

if(!data || data.length===0){
document.getElementById("progressArea").innerHTML="No Data Found";
return;
}

let html="<table><tr>";
Object.keys(data[0]).forEach(k=>html+="<th>"+k+"</th>");
html+="</tr>";

data.forEach(row=>{
html+="<tr>";
Object.values(row).forEach(v=>html+="<td>"+v+"</td>");
html+="</tr>";
});

html+="</table>";
document.getElementById("progressArea").innerHTML=html;

if((role==="student" || role==="parent") && data.length>0){
let attendance=parseFloat(data[0].Attendance)||0;
new Chart(document.getElementById("attendanceChart"),{
type:'bar',
data:{
labels:["Attendance %"],
datasets:[{
label:"Attendance",
data:[attendance]
}]
}
});
}
}

/* ---------- FEES ---------- */

function loadFees(){

fetch(API+"?sheet=Fees")
.then(res=>res.json())
.then(data=>{

let filtered=[];

if(role==="admin"){
filtered=data;
}
else if(role==="student" || role==="parent"){
filtered=data.filter(f=>f.StudentID===userID);
}
else if(role==="teacher"){
fetch(API+"?sheet=Teachers")
.then(res=>res.json())
.then(teachers=>{
let teacher=teachers.find(t=>t.ID===userID);
if(teacher){
filtered=data.filter(f=>f.Class===teacher.Class);
renderFees(filtered);
}
});
return;
}

renderFees(filtered);

});
}

function renderFees(data){

if(!data || data.length===0){
document.getElementById("feeArea").innerHTML="No Fee Data";
return;
}

let html="<table><tr><th>Name</th><th>Total</th><th>Paid</th><th>Due</th></tr>";

data.forEach(row=>{
let due=(parseFloat(row.TotalFee||0)-parseFloat(row.Paid||0));
html+="<tr><td>"+row.Name+"</td><td>"+row.TotalFee+"</td><td>"+row.Paid+"</td><td>"+due+"</td></tr>";
});

html+="</table>";
document.getElementById("feeArea").innerHTML=html;
}

/* ---------- NOTICES ---------- */

function loadNotices(){

fetch(API+"?sheet=Notices")
.then(res=>res.json())
.then(data=>{

if(!data || data.length===0){
document.getElementById("noticeArea").innerHTML="No Notices";
return;
}

let html="";

if(role==="admin"){
data.forEach(n=>{
html+="<p><b>"+n.Title+"</b> ("+n.Class+")<br>"+n.Message+"<br><i>"+n.Date+"</i></p><hr>";
});
document.getElementById("noticeArea").innerHTML=html;
}
else{

fetch(API+"?sheet=Students")
.then(res=>res.json())
.then(students=>{

let student=students.find(s=>s.ID===userID);
let studentClass=student?student.Class:null;

data.filter(n=>n.Class===studentClass)
.forEach(n=>{
html+="<p><b>"+n.Title+"</b><br>"+n.Message+"<br><i>"+n.Date+"</i></p><hr>";
});

document.getElementById("noticeArea").innerHTML=html;

});

}

});
}

/* ---------- LOGOUT ---------- */

function logout(){
localStorage.clear();
window.location.href="login.html";
}

/* Load All */
loadProgress();
loadFees();
loadNotices();