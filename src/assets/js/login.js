async function loadUsers() {
  let response = await fetch("assets/data/users.json");
  let users = await response.json();
  return users;
}

function showAlert(message, type) {
  let alertContainer = document.getElementById("alert-container");

  let html = "";
  html +=
    '<div class="alert alert-' +
    type +
    ' alert-dismissible fade show" role="alert">';
  html += message;
  html +=
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
  html += "</div>";

  alertContainer.innerHTML = html;
}

function validateForm(username, password) {
  let isValid = true;
  let usernameInput = document.getElementById("username");
  let passwordInput = document.getElementById("password");

  if (username === "") {
    usernameInput.classList.add("is-invalid");
    isValid = false;
  } else {
    usernameInput.classList.remove("is-invalid");
    usernameInput.classList.add("is-valid");
  }

  if (password === "") {
    passwordInput.classList.add("is-invalid");
    isValid = false;
  } else {
    passwordInput.classList.remove("is-invalid");
    passwordInput.classList.add("is-valid");
  }

  return isValid;
}

async function handleLogin(event) {
  event.preventDefault();

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let rememberMe = document.getElementById("remember-me").checked;

  if (!validateForm(username, password)) {
    showAlert("Por favor, preenche todos os campos.", "danger");
    return;
  }

  let users = await loadUsers();

  let user = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      user = users[i];
      break;
    }
  }

  if (user) {
    let sessionData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      year: user.year,
      school: user.school,
      course: user.course,
      goal: user.goal,
      activePlan: user.activePlan,
      skills: user.skills,
      loginTime: new Date().toISOString(),
      rememberMe: rememberMe,
    };

    localStorage.setItem("mathpath-session", JSON.stringify(sessionData));

    showAlert("Login bem-sucedido! A redirecionar...", "success");

    setTimeout(function () {
      window.location.href = "account.html";
    }, 1500);
  } else {
    showAlert("Nome de utilizador ou palavra-passe incorretos.", "danger");

    document.getElementById("username").classList.add("is-invalid");
    document.getElementById("password").classList.add("is-invalid");
  }
}

function checkIfAlreadyLoggedIn() {
  let session = localStorage.getItem("mathpath-session");

  if (session) {
    let sessionData = JSON.parse(session);

    if (sessionData.rememberMe) {
      window.location.href = "index.html";
    }
  }
}

window.addEventListener("load", function () {
  checkIfAlreadyLoggedIn();

  let form = document.getElementById("login-form");
  form.addEventListener("submit", handleLogin);

  let usernameInput = document.getElementById("username");
  let passwordInput = document.getElementById("password");

  usernameInput.addEventListener("input", function () {
    if (this.value !== "") {
      this.classList.remove("is-invalid");
    }
  });

  passwordInput.addEventListener("input", function () {
    if (this.value !== "") {
      this.classList.remove("is-invalid");
    }
  });
});
