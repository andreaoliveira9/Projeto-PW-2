function closePlanModal() {
  let planModal = document.getElementById("planModal");
  planModal.classList.remove("show");
  planModal.style.display = "none";
  document.body.classList.remove("modal-open");

  let backdrop = document.getElementById("modal-backdrop");
  backdrop.style.display = "none";
  backdrop.classList.remove("show");
}

function closePreferencesModal() {
  let preferencesModal = document.getElementById("preferencesModal");
  preferencesModal.classList.remove("show");
  preferencesModal.style.display = "none";
  document.body.classList.remove("modal-open");

  let backdrop = document.getElementById("modal-backdrop");
  backdrop.style.display = "none";
  backdrop.classList.remove("show");
}

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

  setTextById(
    "profile-year-course",
    userData.year + ".º Ano · " + userData.course
  );

  setTextById("profile-goal", userData.goal);

  let profilePicture = document.getElementById("profile-picture");
  if (profilePicture != null && userData.profilePicture != null) {
    profilePicture.src = userData.profilePicture;
  }
}

function updateAccountDetails(userData) {
  setTextById("account-name", userData.name);
  setTextById("account-email", userData.email);
  setTextById("account-school", userData.school);
  setTextById("account-course", userData.course);

  setTextById("account-year", userData.year + ".º Ano");

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

async function getOrInitializeUserStudyPlan() {
  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    return null;
  }
  let userData = JSON.parse(session);
  let userEmail = userData.email;

  let storedPlan = localStorage.getItem("mathpath-plan-" + userEmail);
  if (storedPlan != null) {
    return JSON.parse(storedPlan);
  }

  let users = await loadData("assets/data/users.json");
  let currentUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === userEmail) {
      currentUser = users[i];
      break;
    }
  }

  if (currentUser != null && currentUser.studyPlan != null) {
    localStorage.setItem(
      "mathpath-plan-" + userEmail,
      JSON.stringify(currentUser.studyPlan)
    );
    return currentUser.studyPlan;
  }

  return null;
}

function saveUserStudyPlan(plan) {
  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    return;
  }
  let userData = JSON.parse(session);
  let userEmail = userData.email;

  localStorage.setItem("mathpath-plan-" + userEmail, JSON.stringify(plan));
}

async function openPlanModal() {
  await loadPlanIntoModal();

  let planModal = document.getElementById("planModal");
  planModal.classList.add("show");
  planModal.style.display = "block";
  document.body.classList.add("modal-open");

  let backdrop = document.getElementById("modal-backdrop");
  backdrop.style.display = "block";
  backdrop.classList.add("show");
}

async function loadPlanIntoModal() {
  let planBody = document.getElementById("plan-modal-body");
  if (planBody == null) {
    return;
  }

  let plan = await getOrInitializeUserStudyPlan();
  if (plan == null || plan.length === 0) {
    planBody.innerHTML =
      '<tr><td colspan="5" class="text-center text-muted">Nenhum plano encontrado. Adicione linhas abaixo.</td></tr>';
    return;
  }

  let html = "";
  for (let i = 0; i < plan.length; i++) {
    html += '<tr data-index="' + i + '">';
    html +=
      '<td><input type="text" class="form-control form-control-sm" value="' +
      plan[i].day +
      '" data-field="day"></td>';
    html +=
      '<td><input type="text" class="form-control form-control-sm" value="' +
      plan[i].theme +
      '" data-field="theme"></td>';
    html +=
      '<td><input type="text" class="form-control form-control-sm" value="' +
      plan[i].objective +
      '" data-field="objective"></td>';
    html +=
      '<td><input type="number" class="form-control form-control-sm" value="' +
      plan[i].time +
      '" data-field="time" style="width: 80px;"></td>';
    html +=
      '<td><button class="btn btn-sm btn-outline-danger" onclick="deletePlanRow(' +
      i +
      ')"><i class="bi bi-trash"></i></button></td>';
    html += "</tr>";
  }
  planBody.innerHTML = html;
}

function addPlanRow() {
  let planBody = document.getElementById("plan-modal-body");
  if (planBody == null) {
    return;
  }

  if (
    planBody.children.length === 1 &&
    planBody.children[0].children.length === 1 &&
    planBody.children[0].children[0].getAttribute("colspan") === "5"
  ) {
    planBody.innerHTML = "";
  }

  let rowCount = planBody.children.length;
  let html = '<tr data-index="' + rowCount + '">';
  html +=
    '<td><input type="text" class="form-control form-control-sm" value="" data-field="day" placeholder="Ex: Segunda"></td>';
  html +=
    '<td><input type="text" class="form-control form-control-sm" value="" data-field="theme" placeholder="Ex: Funções"></td>';
  html +=
    '<td><input type="text" class="form-control form-control-sm" value="" data-field="objective" placeholder="Ex: Estudar limites"></td>';
  html +=
    '<td><input type="number" class="form-control form-control-sm" value="30" data-field="time" style="width: 80px;"></td>';
  html +=
    '<td><button class="btn btn-sm btn-outline-danger" onclick="deletePlanRow(' +
    rowCount +
    ')"><i class="bi bi-trash"></i></button></td>';
  html += "</tr>";

  planBody.innerHTML = planBody.innerHTML + html;
}

function deletePlanRow(index) {
  let planBody = document.getElementById("plan-modal-body");
  if (planBody == null) {
    return;
  }

  let rows = planBody.children;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].getAttribute("data-index") == index) {
      rows[i].remove();
      break;
    }
  }

  if (planBody.children.length === 0) {
    planBody.innerHTML =
      '<tr><td colspan="5" class="text-center text-muted">Nenhum plano encontrado. Adicione linhas abaixo.</td></tr>';
  }
}

function savePlan() {
  let planBody = document.getElementById("plan-modal-body");
  if (planBody == null) {
    return;
  }

  let plan = [];
  let rows = planBody.children;

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    if (row.children.length < 5) {
      continue;
    }

    let dayInput = null;
    let themeInput = null;
    let objectiveInput = null;
    let timeInput = null;

    let inputs = row.getElementsByTagName("input");
    for (let j = 0; j < inputs.length; j++) {
      let fieldName = inputs[j].getAttribute("data-field");
      if (fieldName === "day") {
        dayInput = inputs[j];
      } else if (fieldName === "theme") {
        themeInput = inputs[j];
      } else if (fieldName === "objective") {
        objectiveInput = inputs[j];
      } else if (fieldName === "time") {
        timeInput = inputs[j];
      }
    }

    if (
      dayInput == null ||
      themeInput == null ||
      objectiveInput == null ||
      timeInput == null
    ) {
      continue;
    }

    let dayValue = dayInput.value.trim();
    let themeValue = themeInput.value.trim();
    let objectiveValue = objectiveInput.value.trim();
    let timeValue = parseInt(timeInput.value);

    if (dayValue === "" || themeValue === "" || objectiveValue === "") {
      continue;
    }

    plan.push({
      day: dayValue,
      theme: themeValue,
      objective: objectiveValue,
      time: timeValue,
    });
  }

  saveUserStudyPlan(plan);

  let planModal = document.getElementById("planModal");
  planModal.classList.remove("show");
  planModal.style.display = "none";
  document.body.classList.remove("modal-open");

  let backdrop = document.getElementById("modal-backdrop");
  backdrop.style.display = "none";
  backdrop.classList.remove("show");

  renderStudyPlan();

  alert("Plano guardado com sucesso!");
}

function openPreferencesModal() {
  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    return;
  }

  let userData = JSON.parse(session);

  let goalInput = document.getElementById("goalInput");
  let skillsInput = document.getElementById("skillsInput");

  if (goalInput != null) {
    goalInput.value = userData.goal || "";
  }

  if (skillsInput != null) {
    if (userData.skills != null && userData.skills.length > 0) {
      skillsInput.value = userData.skills.join(", ");
    } else {
      skillsInput.value = "";
    }
  }

  let preferencesModal = document.getElementById("preferencesModal");
  preferencesModal.classList.add("show");
  preferencesModal.style.display = "block";
  document.body.classList.add("modal-open");

  let backdrop = document.getElementById("modal-backdrop");
  backdrop.style.display = "block";
  backdrop.classList.add("show");
}

function savePreferences() {
  let goalInput = document.getElementById("goalInput");
  let skillsInput = document.getElementById("skillsInput");

  if (goalInput == null || skillsInput == null) {
    return;
  }

  let newGoal = goalInput.value.trim();
  let skillsText = skillsInput.value.trim();
  let newSkills = [];

  if (skillsText !== "") {
    let skillsArray = skillsText.split(",");
    for (let i = 0; i < skillsArray.length; i++) {
      let skill = skillsArray[i].trim();
      if (skill !== "") {
        newSkills.push(skill);
      }
    }
  }

  let session = localStorage.getItem("mathpath-session");
  if (session == null) {
    return;
  }

  let userData = JSON.parse(session);
  userData.goal = newGoal;
  userData.skills = newSkills;

  localStorage.setItem("mathpath-session", JSON.stringify(userData));

  let preferencesModal = document.getElementById("preferencesModal");
  preferencesModal.classList.remove("show");
  preferencesModal.style.display = "none";
  document.body.classList.remove("modal-open");

  let backdrop = document.getElementById("modal-backdrop");
  backdrop.style.display = "none";
  backdrop.classList.remove("show");

  updateProfileSummary(userData);
  updateAccountDetails(userData);
  updateSkills(userData);

  alert("Preferências atualizadas com sucesso!");
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

  let plan = await getOrInitializeUserStudyPlan();

  if (plan != null && plan.length > 0) {
    let html = "";
    for (let i = 0; i < plan.length; i++) {
      let item = plan[i];
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
