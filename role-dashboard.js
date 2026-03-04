document.addEventListener("DOMContentLoaded", function(){

const API = "https://sheetdb.io/api/v1/58f61be4dda40";

const role = localStorage.getItem("role");
const userID = localStorage.getItem("userID");

let attendanceChartInstance = null;

/* ================= ROLE CHECK ================= */

if(!role || !userID){
    window.location.href = "login.html";
    return;
}

const roleInfo = document.getElementById("roleInfo");
if(roleInfo){
    roleInfo.innerHTML =
    "<strong>Logged in as:</strong> " + role.toUpperCase();
}

/* ================= INITIAL LOAD ================= */

loadProgress();
loadFees();
loadNotices();

/* ================= LOAD PROGRESS ================= */

function loadProgress(){

fetch(API + "?sheet=Progress")
.then(res=>{
    if(!res.ok) throw new Error("Network Error");
    return res.json();
})
.then(data=>{

let filtered = [];

if(role === "admin"){
    filtered = data;
}
else{
    filtered = data.filter(p => p.ID === userID);
}

renderProgress(filtered);

})
.catch(()=>{
    document.getElementById("progressArea").innerHTML =
    "<div class='empty-box'>Error loading progress data.</div>";
});
}

function renderProgress(data){

const progressArea = document.getElementById("progressArea");

if(!data || data.length === 0){
    progressArea.innerHTML =
    "<div class='empty-box'>No Progress Data</div>";
    return;
}

let html = "<table><tr>";
Object.keys(data[0]).forEach(k=> html += "<th>"+k+"</th>");
html += "</tr>";

data.forEach(row=>{
html += "<tr>";
Object.values(row).forEach(v=> html += "<td>"+(v||"")+"</td>");
html += "</tr>";
});

html += "</table>";

progressArea.innerHTML = html;

/* ===== Attendance Chart (Student/Parent Only) ===== */

if((role === "student" || role === "parent") && data[0].Attendance){

const attendance = parseFloat(data[0].Attendance) || 0;

if(attendanceChartInstance){
    attendanceChartInstance.destroy();
}

attendanceChartInstance = new Chart(
document.getElementById("attendanceChart"),{
type:'bar',
data:{
labels:["Attendance %"],
datasets:[{
label:"Attendance",
data:[attendance]
}]
},
options:{
responsive:true,
plugins:{
legend:{display:false}
},
scales:{
y:{
beginAtZero:true,
max:100
}
}
}
});

}

}

/* ================= LOAD FEES ================= */

function loadFees(){

fetch(API + "?sheet=Fees")
.then(res=>{
    if(!res.ok) throw new Error("Network Error");
    return res.json();
})
.then(data=>{

let filtered = role === "admin"
? data
: data.filter(f => f.StudentID === userID);

const feeArea = document.getElementById("feeArea");

if(!filtered || filtered.length === 0){
    feeArea.innerHTML =
    "<div class='empty-box'>No Fee Data</div>";
    return;
}

let html = "<table><tr><th>Name</th><th>Total</th><th>Paid</th><th>Due</th></tr>";

filtered.forEach(row=>{
const due = (parseFloat(row.TotalFee||0) - parseFloat(row.Paid||0));

html += `
<tr>
<td>${row.Name||""}</td>
<td>${row.TotalFee||0}</td>
<td>${row.Paid||0}</td>
<td>${due}</td>
</tr>`;
});

html += "</table>";

feeArea.innerHTML = html;

})
.catch(()=>{
    document.getElementById("feeArea").innerHTML =
    "<div class='empty-box'>Error loading fee data.</div>";
});
}

/* ================= LOAD NOTICES ================= */

function loadNotices(){

fetch(API + "?sheet=Notices")
.then(res=>{
    if(!res.ok) throw new Error("Network Error");
    return res.json();
})
.then(data=>{

const noticeArea = document.getElementById("noticeArea");

if(!data || data.length === 0){
    noticeArea.innerHTML =
    "<div class='empty-box'>No Notices Available</div>";
    return;
}

let html = "";

data.forEach(n=>{
html += `
<p>
<strong>${n.Title||""}</strong><br>
${n.Message||""}<br>
<small>${n.Date||""}</small>
</p>
<hr>`;
});

noticeArea.innerHTML = html;

})
.catch(()=>{
    document.getElementById("noticeArea").innerHTML =
    "<div class='empty-box'>Error loading notices.</div>";
});
}

/* ================= LOGOUT ================= */

window.logout = function(){
localStorage.clear();
window.location.href = "login.html";
};

});