function checkAuthentication() {
  let session = localStorage.getItem("mathpath-session");

  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  return JSON.parse(session);
}

function updateProfileSummary(userData) {
  let profileName = document.getElementById("profile-name");
  if (profileName) {
    profileName.textContent = userData.name;
  }

  let profileYearCourse = document.getElementById("profile-year-course");
  if (profileYearCourse) {
    profileYearCourse.textContent =
      userData.year + ".º Ano · " + userData.course;
  }

  let profileSchool = document.getElementById("profile-school");
  if (profileSchool) {
    profileSchool.textContent = userData.school;
  }

  let profileEmail = document.getElementById("profile-email");
  if (profileEmail) {
    profileEmail.textContent = userData.email;
  }
}

function updateAccountData(userData) {
  let accountName = document.getElementById("account-name");
  if (accountName) {
    accountName.textContent = userData.name;
  }

  let accountYear = document.getElementById("account-year");
  if (accountYear) {
    accountYear.textContent = userData.year + ".º Ano";
  }

  let accountEmail = document.getElementById("account-email");
  if (accountEmail) {
    accountEmail.textContent = userData.email;
  }

  let accountSchool = document.getElementById("account-school");
  if (accountSchool) {
    accountSchool.textContent = userData.school;
  }

  let accountCourse = document.getElementById("account-course");
  if (accountCourse) {
    accountCourse.textContent = userData.course;
  }
}

function updateLastAccess() {
  let session = localStorage.getItem("mathpath-session");

  if (!session) {
    return;
  }

  let sessionData = JSON.parse(session);

  if (sessionData.loginTime) {
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
      lastAccessText = "Há " + diffMins + " minuto" + (diffMins > 1 ? "s" : "");
    } else if (diffHours < 24) {
      lastAccessText = "Há " + diffHours + " hora" + (diffHours > 1 ? "s" : "");
    } else {
      lastAccessText = "Há " + diffDays + " dia" + (diffDays > 1 ? "s" : "");
    }

    let lastAccessElement = document.getElementById("profile-last-access");
    if (lastAccessElement) {
      lastAccessElement.textContent = lastAccessText;
    }
  }
}

function updateGoalAndPlan(userData) {
  let profileGoal = document.getElementById("profile-goal");
  if (profileGoal && userData.goal) {
    profileGoal.textContent = userData.goal;
  }

  let profilePlan = document.getElementById("profile-plan");
  if (profilePlan && userData.activePlan) {
    profilePlan.textContent = userData.activePlan;
  }
}

function updateSkills(userData) {
  let skillsContainer = document.getElementById("account-skills");

  if (!skillsContainer || !userData.skills) {
    return;
  }

  skillsContainer.innerHTML = "";

  for (let i = 0; i < userData.skills.length; i++) {
    let skill = userData.skills[i];

    let colDiv = document.createElement("div");
    colDiv.classList.add("col-md-4");

    let badge = document.createElement("span");
    badge.classList.add("badge", "w-100", "text-bg-primary");
    badge.textContent = skill;

    colDiv.appendChild(badge);
    skillsContainer.appendChild(colDiv);
  }
}

function openFavoriteUrl(url) {
  window.open(url, "_blank");
}

function removeFavoriteFromList(resourceId, event) {
  if (event) event.stopPropagation();
  removeFromFavorites(resourceId);
  displayFavorites();
}

function displayFavorites() {
  let favoritesContainer = document.getElementById("favorites-list");

  if (!favoritesContainer) {
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
    // Inline onclick for row and button
    html +=
      '<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-start favorite-row" style="cursor: pointer;" onclick="openFavoriteUrl(\'' +
      fav.url +
      "')\">";
    html += "<div class='flex-grow-1'>";
    html += '<h6 class="mb-1">' + fav.title + "</h6>";
    html += '<small class="text-muted">' + fav.type;
    if (fav.category) {
      html += " · " + fav.category;
    }
    html += "</small>";
    html += "</div>";
    html += '<div class="d-flex align-items-center">';
    html +=
      '<button class="btn btn-sm btn-outline-danger remove-favorite" onclick="removeFavoriteFromList(\'' +
      fav.id +
      '\', event)" title="Remover dos favoritos">';
    html += '<i class="bi bi-trash"></i>';
    html += "</button>";
    html += "</div>";
    html += "</div>";
  }

  favoritesContainer.innerHTML = html;
}

function loadStudyPlan(userEmail) {
  let planBody = document.getElementById("study-plan-body");
  if (!planBody) return;

  fetch("assets/data/users.json")
    .then((response) => response.json())
    .then((users) => {
      let currentUser = users.find((user) => user.email === userEmail);

      if (currentUser && currentUser.studyPlan) {
        let html = "";
        currentUser.studyPlan.forEach((item) => {
          html += `
            <tr>
              <th scope="row">${item.day}</th>
              <td>${item.theme}</td>
              <td>${item.objective}</td>
              <td>${item.time}</td>
            </tr>
          `;
        });
        planBody.innerHTML = html;
      } else {
        planBody.innerHTML =
          '<tr><td colspan="4" class="text-center p-3 text-muted">Plano de estudo não encontrado.</td></tr>';
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar o plano de estudo:", error);
      planBody.innerHTML =
        '<tr><td colspan="4" class="text-center p-3 text-danger">Erro ao carregar o plano de estudo.</td></tr>';
    });
}

function initializeAccountPage() {
  let userData = checkAuthentication();

  if (!userData) {
    return;
  }

  updateProfileSummary(userData);
  updateAccountData(userData);
  updateLastAccess();
  updateGoalAndPlan(userData);
  updateSkills(userData);
  displayFavorites();
  loadStudyPlan(userData.email);
}

var oldOnLoadAccount = window.onload;
window.onload = function () {
  if (oldOnLoadAccount) {
    oldOnLoadAccount();
  }
  initializeAccountPage();
};
