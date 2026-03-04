```html
<script>

const API = "https://sheetdb.io/api/v1/58f61be4dda40";

/* Section Switch */
function showSection(id){
    document.querySelectorAll('.section').forEach(sec=>sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

/* Safe Sheet Loader */
function loadSheet(sheetName, tableId){
    fetch(API + "?sheet=" + sheetName)
    .then(res => {
        if(!res.ok) throw new Error("Network error");
        return res.json();
    })
    .then(data => {

        const table = document.getElementById(tableId);

        if(!data || data.length === 0){
            table.innerHTML = "<tr><td>No Data Found</td></tr>";
            return;
        }

        let html = "<tr>";
        Object.keys(data[0]).forEach(key=>{
            html += "<th>" + key + "</th>";
        });
        html += "</tr>";

        data.forEach(row=>{
            html += "<tr>";
            Object.values(row).forEach(val=>{
                html += "<td>" + (val || "") + "</td>";
            });
            html += "</tr>";
        });

        table.innerHTML = html;

    })
    .catch(err=>{
        document.getElementById(tableId).innerHTML =
        "<tr><td>Error Loading Data</td></tr>";
        console.error("Sheet Load Error:", err);
    });
}

/* Dashboard */
fetch(API + "?sheet=Students")
.then(res=>res.json())
.then(data=>{
    document.getElementById("summary").innerHTML =
    "<p>Total Students: <b>"+ (data ? data.length : 0) +"</b></p>";
})
.catch(()=>{
    document.getElementById("summary").innerHTML =
    "<p>Error loading dashboard</p>";
});

/* Load Sheets */
loadSheet("Students","studentTable");
loadSheet("Progress","progressTable");
loadSheet("Teachers_Attendance","teacherTable");

/* Finance */
fetch(API + "?sheet=Income_Expense")
.then(res=>res.json())
.then(data=>{
    const table = document.getElementById("financeTable");

    if(!data || data.length === 0){
        table.innerHTML = "<tr><td>No Finance Data</td></tr>";
        return;
    }

    let income=0, expense=0;
    let html="<tr>";

    Object.keys(data[0]).forEach(key=>{
        html += "<th>"+key+"</th>";
    });
    html+="</tr>";

    data.forEach(row=>{
        html+="<tr>";
        Object.values(row).forEach(val=>{
            html+="<td>"+(val || "")+"</td>";
        });
        html+="</tr>";

        if(row.Type === "Income") income += parseFloat(row.Amount || 0);
        if(row.Type === "Expense") expense += parseFloat(row.Amount || 0);
    });

    table.innerHTML = html;

    document.getElementById("balance").innerText =
    "Current Balance: ₹" + (income - expense);
})
.catch(()=>{
    document.getElementById("financeTable").innerHTML =
    "<tr><td>Error Loading Finance</td></tr>";
});

/* Message Save */
function sendMessage(){

    const type = document.getElementById("msgType").value;
    const text = document.getElementById("msgText").value;

    if(!text){
        alert("Please enter message");
        return;
    }

    fetch(API + "?sheet=Messages",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({
            data:[{Type:type, Message:text}]
        })
    })
    .then(()=> alert("Message Saved"))
    .catch(()=> alert("Error Saving Message"));

    window.open("https://wa.me/917869232331?text="+encodeURIComponent(text));
}

</script>
```
/* Simple Speech Generator */
function generateSpeech(){
    const topic = document.getElementById("speechTopic").value;

    if(!topic){
        alert("Enter topic first");
        return;
    }

    const speech = "Respected teachers and dear friends, today I would like to speak about " 
    + topic + 
    ". This topic is very important in our life. If we understand it properly, we can improve ourselves and our society. Thank you.";

    document.getElementById("msgText").value = speech;
}

/* Basic Converter (Demo Mode) */
function convertText(){

    const type = document.getElementById("convertType").value;
    const input = document.getElementById("convertInput").value;

    if(!input){
        alert("Enter text first");
        return;
    }

    if(type === "en-hi"){
        document.getElementById("convertOutput").value =
        "⚠ Demo Mode: Hindi conversion will work after API integration.\n\n" + input;
    }
    else{
        document.getElementById("convertOutput").value =
        "⚠ Demo Mode: English conversion will work after API integration.\n\n" + input;
    }
}