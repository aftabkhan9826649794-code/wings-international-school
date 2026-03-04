<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WINGS ERP Dashboard</title>

<link rel="stylesheet" href="css/style.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
.dashboard-container{
  max-width:1000px;
  margin:40px auto;
  background:white;
  padding:30px;
  border-radius:10px;
  box-shadow:0 5px 20px rgba(0,0,0,0.08);
}
.dashboard-container h2{
  color:#003087;
}
.section{
  margin-top:30px;
}
table{
  width:100%;
  border-collapse:collapse;
  margin-top:10px;
}
table, th, td{
  border:1px solid #ddd;
}
th{
  background:#003087;
  color:white;
}
th, td{
  padding:8px;
}
.logout-btn{
  margin-top:20px;
  background:#ffd700;
  border:none;
  padding:10px 20px;
  font-weight:bold;
  cursor:pointer;
}
</style>

</head>
<body>

<div class="dashboard-container">

<h2>WINGS Role Dashboard</h2>
<p id="roleInfo"></p>

<div class="section">
<h3>Progress</h3>
<div id="progressArea"></div>
<canvas id="attendanceChart"></canvas>
</div>

<div class="section">
<h3>Fee Status</h3>
<div id="feeArea"></div>
</div>

<div class="section">
<h3>Notice Board</h3>
<div id="noticeArea"></div>
</div>

<button onclick="logout()" class="logout-btn">Logout</button>

</div>

<script src="js/dashboard.js"></script>
</body>
</html>