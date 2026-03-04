/* ================= MOBILE MENU ================= */

function toggleMenu(){
  const menu = document.getElementById("navMenu");
  if(menu){
    menu.classList.toggle("active");
  }
}

/* Close menu on link click (Mobile UX upgrade) */
document.addEventListener("click", function(e){
  const menu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");

  if(menu && menu.classList.contains("active")){
    if(!menu.contains(e.target) && !hamburger.contains(e.target)){
      menu.classList.remove("active");
    }
  }
});


/* ================= GOOGLE SHEET ADMISSION ================= */

document.addEventListener("DOMContentLoaded", function(){

  const form = document.getElementById("admissionForm");
  if(!form) return;

  const messageBox = document.getElementById("formMessage");

  const API = "https://sheetdb.io/api/v1/58f61be4dda40?sheet=Admissions";

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    if(submitBtn){
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";
    }

    const data = {
      Name: document.getElementById("name")?.value.trim() || "",
      Phone: document.getElementById("phone")?.value.trim() || "",
      Email: document.getElementById("email")?.value.trim() || "",
      Course: document.getElementById("course")?.value || "",
      Qualification: document.getElementById("qualification")?.value || "",
      Message: document.getElementById("message")?.value || "",
      Date: new Date().toLocaleString()
    };

    fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({data:[data]})
    })
    .then(res=>{
      if(!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then(()=>{
      if(messageBox){
        messageBox.innerHTML = "✅ Application Submitted Successfully!";
        messageBox.style.color = "green";
      }
      form.reset();
    })
    .catch(()=>{
      if(messageBox){
        messageBox.innerHTML = "❌ Error submitting form. Please try again.";
        messageBox.style.color = "red";
      }
    })
    .finally(()=>{
      if(submitBtn){
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Application";
      }
    });

  });

});