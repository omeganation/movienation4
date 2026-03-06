const ADMIN_PASSWORD = "tuyizere123@";

function checkAdmin() {
  const pass = prompt("Enter Admin Password:");

  if (pass !== ADMIN_PASSWORD) {
    alert("Access Denied");
    window.location.href = "/";
  }
}

checkAdmin();