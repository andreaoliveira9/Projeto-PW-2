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

function handleUserIconClick() {
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

  let desktopUserMenus = document.getElementsByClassName("user-menu");
  if (desktopUserMenus.length > 0) {
    let button = desktopUserMenus[0].getElementsByTagName("button")[0];
    if (button != null) {
      let icon = button.getElementsByClassName("user-menu__icon")[0];
      let nameSpan = button.getElementsByClassName("user-menu__name")[0];

      icon.classList.remove("bi-box-arrow-in-right", "bi-person-circle");
      button.setAttribute("data-bs-toggle", session ? "dropdown" : "");

      if (session != null) {
        nameSpan.innerText = session.name.split(" ")[0];
        nameSpan.style.display = "inline";
        icon.classList.add("bi-person-circle");
        icon.classList.remove("bi-box-arrow-in-right");
        button.setAttribute("data-bs-toggle", "dropdown");
      } else {
        icon.classList.add("bi-box-arrow-in-right");
        nameSpan.style.display = "none";
        icon.classList.remove("bi-person-circle");
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
      icon.classList.remove("bi-box-arrow-in-right", "bi-person-circle");
      if (session != null) {
        icon.classList.add("bi-person-circle");
        icon.classList.remove("bi-box-arrow-in-right");
      } else {
        icon.classList.add("bi-box-arrow-in-right");
        icon.classList.remove("bi-person-circle");
      }
    }
  }
}

var oldOnLoadAuth = window.onload;
window.onload = function () {
  if (oldOnLoadAuth != null) {
    oldOnLoadAuth();
  }
  updateHeader();
};
