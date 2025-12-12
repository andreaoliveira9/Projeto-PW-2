async function loadData(file) {
  let response = await fetch(file);
  let data = await response.json();
  return data;
}

function checkAuthentication() {
  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(session);
}

function setTextById(id, text) {
  let element = document.getElementById(id);
  if (element != null) {
    element.innerText = text;
  }
}

function updateProfileSummary(userData) {
  setTextById("profile-name", userData.name);
  setTextById(
    "profile-year-course",
    userData.year + ".º Ano · " + userData.course
  );
  setTextById("profile-school", userData.school);
  setTextById("profile-email", userData.email);
}

function updateAccountData(userData) {
  setTextById("account-name", userData.name);
  setTextById("account-year", userData.year + ".º Ano");
  setTextById("account-email", userData.email);
  setTextById("account-school", userData.school);
  setTextById("account-course", userData.course);
}

function updateLastAccess() {
  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    return;
  }

  let sessionData = JSON.parse(session);
  if (sessionData.loginTime == null) {
    return;
  }

  let loginDate = new Date(sessionData.loginTime);
  let now = new Date();
  let diffMs = now - loginDate;
  let diffMins = Math.floor(diffMs / 60000);
  let diffHours = Math.floor(diffMs / 3600000);
  let diffDays = Math.floor(diffMs / 86400000);

  let lastAccessText = "";
  if (diffMins < 1) {
    lastAccessText = "Agora mesmo";
  } else if (diffMins < 60) {
    let plural = "";
    if (diffMins > 1) {
      plural = "s";
    }
    lastAccessText = "Há " + diffMins + " minuto" + plural;
  } else if (diffHours < 24) {
    let plural = "";
    if (diffHours > 1) {
      plural = "s";
    }
    lastAccessText = "Há " + diffHours + " hora" + plural;
  } else {
    let plural = "";
    if (diffDays > 1) {
      plural = "s";
    }
    lastAccessText = "Há " + diffDays + " dia" + plural;
  }

  setTextById("profile-last-access", lastAccessText);
}

function updateGoalAndPlan(userData) {
  if (userData.goal != null) {
    setTextById("profile-goal", userData.goal);
  }
  if (userData.activePlan != null) {
    setTextById("profile-plan", userData.activePlan);
  }
}

function updateSkills(userData) {
  let skillsContainer = document.getElementById("account-skills");
  if (skillsContainer == null || userData.skills == null) {
    return;
  }

  let html = "";
  for (let i = 0; i < userData.skills.length; i++) {
    html +=
      '<div class="col-md-4"><span class="badge w-100 text-bg-primary">' +
      userData.skills[i] +
      "</span></div>";
  }
  skillsContainer.innerHTML = html;
}

function openFavoriteUrl(url) {
  window.open(url, "_blank");
}

function removeFavoriteFromList(resourceId) {
  removeFromFavorites(resourceId);
  displayFavorites();
}

function displayFavorites() {
  let favoritesContainer = document.getElementById("favorites-list");
  if (favoritesContainer == null) {
    return;
  }

  let favorites = getFavorites();
  if (favorites.length === 0) {
    favoritesContainer.innerHTML =
      '<p class="text-muted text-center p-4 mb-0">Ainda não tens recursos favoritos. <a href="catalog.html">Explora o catálogo</a> para adicionar!</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < favorites.length; i++) {
    let fav = favorites[i];
    html +=
      '<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-start favorite-row" style="cursor: pointer;" onclick="openFavoriteUrl(\'' +
      fav.url +
      "')\">";
    html += "<div class='flex-grow-1'>";
    html += '<h6 class="mb-1">' + fav.title + "</h6>";
    html += '<small class="text-muted">' + fav.type;
    if (fav.category != null) {
      html += " · " + fav.category;
    }
    html += "</small>";
    html += "</div>";
    html += '<div class="d-flex align-items-center">';
    html +=
      '<button class="btn btn-sm btn-outline-danger remove-favorite" onclick="removeFavoriteFromList(\'' +
      fav.id +
      '\')" title="Remover dos favoritos">';
    html += '<i class="bi bi-trash"></i>';
    html += "</button>";
    html += "</div>";
    html += "</div>";
  }

  favoritesContainer.innerHTML = html;
}

async function renderStudyPlan() {
  let planBody = document.getElementById("study-plan-body");
  if (planBody == null) {
    return;
  }

  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    planBody.innerHTML =
      '<tr><td colspan="4" class="text-center p-3 text-muted">Por favor, faz login para veres o teu plano de estudo.</td></tr>';
    return;
  }

  let userData = JSON.parse(session);
  let userEmail = userData.email;

  let users = await loadData("assets/data/users.json");
  let currentUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === userEmail) {
      currentUser = users[i];
      break;
    }
  }

  if (currentUser != null && currentUser.studyPlan != null) {
    let html = "";
    for (let i = 0; i < currentUser.studyPlan.length; i++) {
      let item = currentUser.studyPlan[i];
      html += "<tr>";
      html += '<th scope="row">' + item.day + "</th>";
      html += "<td>" + item.theme + "</td>";
      html += "<td>" + item.objective + "</td>";
      html += "<td>" + item.time + " min</td>";
      html += "</tr>";
    }
    planBody.innerHTML = html;
  } else {
    planBody.innerHTML =
      '<tr><td colspan="4" class="text-center p-3 text-muted">Plano de estudo não encontrado.</td></tr>';
  }
}

function initializeAccountPage() {
  let userData = checkAuthentication();
  if (userData == null) {
    return;
  }

  updateProfileSummary(userData);
  updateAccountData(userData);
  updateLastAccess();
  updateGoalAndPlan(userData);
  updateSkills(userData);
  displayFavorites();
  renderStudyPlan();
}

var oldOnLoadAccount = window.onload;
window.onload = function () {
  if (oldOnLoadAccount != null) {
    oldOnLoadAccount();
  }
  initializeAccountPage();
};
