document.addEventListener("DOMContentLoaded", function(){

/* ================= ROLE PROTECTION ================= */

const role = localStorage.getItem("role");
if(role !== "admin"){
    window.location.href = "login.html";
    return;
}

const API = "https://sheetdb.io/api/v1/58f61be4dda40";

/* ================= SECTION SWITCH ================= */

document.querySelectorAll(".sidebar a[data-section]").forEach(link=>{
    link.addEventListener("click", function(e){
        e.preventDefault();

        const id = this.getAttribute("data-section");

        document.querySelectorAll(".section").forEach(sec=>{
            sec.classList.remove("active");
        });

        const target = document.getElementById(id);
        if(target) target.classList.add("active");
    });
});

/* ================= LOGOUT ================= */

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
    logoutBtn.addEventListener("click", function(e){
        e.preventDefault();
        localStorage.clear();
        window.location.href = "login.html";
    });
}

/* ================= GENERIC SHEET LOADER ================= */

function loadSheet(sheetName, tableId){

    fetch(API + "?sheet=" + sheetName)
    .then(res=>{
        if(!res.ok) throw new Error("Network error");
        return res.json();
    })
    .then(data=>{
        const table = document.getElementById(tableId);
        if(!table) return;

        if(!data || data.length === 0){
            table.innerHTML = "<tr><td>No Data Found</td></tr>";
            return;
        }

        let html = "<tr>";
        Object.keys(data[0]).forEach(key=>{
            html += `<th>${key}</th>`;
        });
        html += "</tr>";

        data.reverse(); // newest first

        data.forEach(row=>{
            html += "<tr>";
            Object.values(row).forEach(val=>{
                html += `<td>${val || ""}</td>`;
            });
            html += "</tr>";
        });

        table.innerHTML = html;
    })
    .catch(()=>{
        const table = document.getElementById(tableId);
        if(table){
            table.innerHTML = "<tr><td>Error Loading Data</td></tr>";
        }
    });
}

/* ================= DASHBOARD SUMMARY ================= */

fetch(API + "?sheet=Students")
.then(res=>res.json())
.then(data=>{
    const summary = document.getElementById("summary");
    if(summary){
        summary.innerHTML = `
        <h3>Total Students: ${data ? data.length : 0}</h3>
        `;
    }
})
.catch(()=>{
    const summary = document.getElementById("summary");
    if(summary){
        summary.innerHTML = "Error Loading Dashboard";
    }
});

/* ================= LOAD ALL SHEETS ================= */

loadSheet("Admissions","admissionTable");
loadSheet("Students","studentTable");
loadSheet("Progress","progressTable");
loadSheet("Teachers_Attendance","teacherTable");

/* ================= FINANCE ================= */

fetch(API + "?sheet=Income_Expense")
.then(res=>res.json())
.then(data=>{

    const table = document.getElementById("financeTable");
    const balanceBox = document.getElementById("balance");

    if(!table) return;

    if(!data || data.length === 0){
        table.innerHTML = "<tr><td>No Finance Data</td></tr>";
        return;
    }

    let income = 0;
    let expense = 0;
    let html = "<tr>";

    Object.keys(data[0]).forEach(key=>{
        html += `<th>${key}</th>`;
    });
    html += "</tr>";

    data.forEach(row=>{
        html += "<tr>";
        Object.values(row).forEach(val=>{
            html += `<td>${val || ""}</td>`;
        });
        html += "</tr>";

        if(row.Type === "Income") income += parseFloat(row.Amount || 0);
        if(row.Type === "Expense") expense += parseFloat(row.Amount || 0);
    });

    table.innerHTML = html;

    if(balanceBox){
        balanceBox.innerText = "Current Balance: ₹" + (income - expense);
    }

})
.catch(()=>{
    const table = document.getElementById("financeTable");
    if(table){
        table.innerHTML = "<tr><td>Error Loading Finance</td></tr>";
    }
});

/* ================= MESSAGE SYSTEM ================= */

const sendBtn = document.getElementById("sendBtn");

if(sendBtn){
    sendBtn.addEventListener("click", function(){

        const type = document.getElementById("msgType").value;
        const text = document.getElementById("msgText").value;

        if(!text){
            alert("Enter message");
            return;
        }

        fetch(API + "?sheet=Messages",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                data:[{
                    Type:type,
                    Message:text,
                    Date:new Date().toLocaleString()
                }]
            })
        })
        .then(()=> alert("Message Saved"))
        .catch(()=> alert("Error Saving Message"));

        window.open("https://wa.me/917869232331?text=" + encodeURIComponent(text));
    });
}

/* ================= SPEECH GENERATOR ================= */

const speechBtn = document.getElementById("speechBtn");

if(speechBtn){
    speechBtn.addEventListener("click", function(){

        const topic = document.getElementById("speechTopic").value;

        if(!topic){
            alert("Enter topic");
            return;
        }

        document.getElementById("msgText").value =
        `Respected teachers and dear friends, today I would like to speak about ${topic}. 
This topic plays an important role in our life. 
If we understand it properly, we can improve ourselves and our society. 
Thank you.`;
    });
}

/* ================= CONVERTER (DEMO) ================= */

const convertBtn = document.getElementById("convertBtn");

if(convertBtn){
    convertBtn.addEventListener("click", function(){

        const input = document.getElementById("convertInput").value;

        if(!input){
            alert("Enter text");
            return;
        }

        document.getElementById("convertOutput").value =
        "⚠ Demo Mode Translation:\n\n" + input;
    });
}

});