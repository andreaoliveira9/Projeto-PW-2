function checkAuthentication() {
  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(session);
}

function formatLoginTime(isoString) {
  if (isoString == null) {
    return "—";
  }
  let date = new Date(isoString);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return day + "/" + month + "/" + year + " às " + hours + ":" + minutes;
}

function updateProfileSummary(userData) {
  setTextById("profile-name", userData.name);
  setTextById("profile-email", userData.email);
  setTextById("profile-school", userData.school);
  setTextById("profile-last-access", formatLoginTime(userData.loginTime));

  let yearCourse = document.getElementById("profile-year-course");
  if (yearCourse != null) {
    yearCourse.innerText = userData.year + ".º Ano · " + userData.course;
  }

  setTextById("profile-goal", userData.goal);
}

function updateAccountDetails(userData) {
  setTextById("account-name", userData.name);
  setTextById("account-email", userData.email);
  setTextById("account-school", userData.school);
  setTextById("account-course", userData.course);

  let yearBadge = document.getElementById("account-year");
  if (yearBadge != null) {
    yearBadge.innerText = userData.year + ".º Ano";
  }

  let planLabel = document.getElementById("profile-plan");
  if (planLabel != null && userData.activePlan != null) {
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
    html += '<div class="col-md-4">';
    html +=
      '<span class="badge w-100 text-bg-primary">' +
      userData.skills[i] +
      "</span>";
    html += "</div>";
  }
  skillsContainer.innerHTML = html;
}

function openFavoriteUrl(url) {
  window.open(url, "_blank");
}

function removeFavoriteFromList(resourceId) {
  event.stopPropagation();
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

  let template = document.getElementById("template-favorite-item");
  favoritesContainer.innerHTML = "";

  for (let i = 0; i < favorites.length; i++) {
    let fav = favorites[i];
    let clone = template.content.cloneNode(true);

    let item = clone.children[0];
    item.setAttribute("onclick", "openFavoriteUrl('" + fav.url + "')");

    item.getElementsByClassName("favorite-title")[0].innerText = fav.title;

    let metaText = fav.type;
    if (fav.category != null) {
      metaText = metaText + " · " + fav.category;
    }
    item.getElementsByClassName("favorite-meta")[0].innerText = metaText;

    let removeBtn = item.getElementsByClassName("remove-favorite")[0];
    removeBtn.setAttribute(
      "onclick",
      "removeFavoriteFromList('" + fav.id + "')"
    );

    favoritesContainer.appendChild(clone);
  }
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
  updateAccountDetails(userData);
  updateSkills(userData);
  displayFavorites();
  renderStudyPlan();
}

initializeAccountPage();
