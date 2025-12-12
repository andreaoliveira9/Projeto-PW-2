function getSession() {
  let session = localStorage.getItem("mathpath-session");
  if (session != null) {
    return JSON.parse(session);
  }
  return null;
}

function isLoggedIn() {
  if (getSession() != null) {
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem("mathpath-session");
  window.location.href = "index.html";
}

function redirectToLogin() {
  if (isLoggedIn() == false) {
    window.location.href = "login.html";
  }
}

function updateHeader() {
  let session = getSession();

  let mobileNameElements = document.getElementsByClassName(
    "mobile-profile-name"
  );
  if (mobileNameElements.length > 0) {
    if (session != null) {
      mobileNameElements[0].innerText = session.name.split(" ")[0];
    } else {
      mobileNameElements[0].innerText = "Entrar";
    }
  }

  let desktopUserIcons = document.getElementsByClassName("user-menu__icon");
  if (desktopUserIcons.length > 0) {
    let icon = desktopUserIcons[0];
    let button = icon.parentNode;

    if (session != null) {
      icon.classList.remove("bi-box-arrow-in-right");
      icon.classList.add("bi-person-circle");
      if (button != null) {
        button.setAttribute("data-bs-toggle", "dropdown");
      }
    } else {
      icon.classList.remove("bi-person-circle");
      icon.classList.add("bi-box-arrow-in-right");
      if (button != null) {
        button.setAttribute("data-bs-toggle", "");
      }
    }
  }

  let mobileProfileInfos = document.getElementsByClassName(
    "mobile-profile-info"
  );
  if (mobileProfileInfos.length > 0) {
    let icons = mobileProfileInfos[0].getElementsByTagName("i");
    if (icons.length > 0) {
      let icon = icons[0];
      if (session != null) {
        icon.classList.remove("bi-box-arrow-in-right");
        icon.classList.add("bi-person-circle");
      } else {
        icon.classList.remove("bi-person-circle");
        icon.classList.add("bi-box-arrow-in-right");
      }
    }
  }
}

function getUserName() {
  let session = getSession();
  if (session != null) {
    return session.name;
  }
  return "Visitante";
}

function getUserFirstName() {
  let session = getSession();
  if (session != null) {
    return session.name.split(" ")[0];
  }
  return "Visitante";
}

var oldOnLoadAuth = window.onload;
window.onload = function () {
  if (oldOnLoadAuth != null) {
    oldOnLoadAuth();
  }
  updateHeader();
};
