function getSession() {
  let session = localStorage.getItem("mathpath-session");

  if (session) {
    return JSON.parse(session);
  }

  return null;
}

function isLoggedIn() {
  let session = getSession();
  return session !== null;
}

function logout() {
  localStorage.removeItem("mathpath-session");
  window.location.href = "index.html";
}

function handleProfileClick() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

function updateHeader() {
  let session = getSession();
  // Using getElementsByClassName as fallback for elements that might not have IDs yet,
  // or add IDs in HTML. Since I am editing HTML, I will add IDs.
  // But to be safe and avoid breaking if HTML isn't perfect immediately:

  // Mobile Profile Name
  let mobileNameElements = document.getElementsByClassName(
    "mobile-profile-name"
  );
  if (mobileNameElements.length > 0) {
    if (session) {
      mobileNameElements[0].textContent = session.name.split(" ")[0];
    } else {
      mobileNameElements[0].textContent = "Entrar";
    }
  }

  // Desktop User Icon
  let desktopUserIcons = document.getElementsByClassName("user-menu__icon");
  if (desktopUserIcons.length > 0) {
    let icon = desktopUserIcons[0];
    let button = icon.closest("button"); // Get the button element

    if (session) {
      icon.classList.remove("bi-box-arrow-in-right");
      icon.classList.add("bi-person-circle");

      if (button) {
        button.setAttribute("data-bs-toggle", "dropdown");
        button.onclick = null;
      }
    } else {
      icon.classList.remove("bi-person-circle");
      icon.classList.add("bi-box-arrow-in-right");

      if (button) {
        button.removeAttribute("data-bs-toggle");
        button.onclick = function () {
          window.location.href = "login.html";
        };
      }
    }
  }

  // Mobile Profile Icon
  // .mobile-profile-info i
  let mobileProfileInfos = document.getElementsByClassName(
    "mobile-profile-info"
  );
  if (mobileProfileInfos.length > 0) {
    let icons = mobileProfileInfos[0].getElementsByTagName("i");
    if (icons.length > 0) {
      let icon = icons[0];
      if (session) {
        icon.classList.remove("bi-box-arrow-in-right");
        icon.classList.add("bi-person-circle");
      } else {
        icon.classList.remove("bi-person-circle");
        icon.classList.add("bi-box-arrow-in-right");
      }
    }
  }

  // Event listeners for profile links and logout buttons are now handled by inline onclick in HTML.
  // No need to attach them here.
}

function getUserName() {
  let session = getSession();

  if (session) {
    return session.name;
  }

  return "Visitante";
}

function getUserFirstName() {
  let session = getSession();

  if (session) {
    let nameParts = session.name.split(" ");
    return nameParts[0];
  }

  return "Visitante";
}

var oldOnLoadAuth = window.onload;
window.onload = function () {
  if (oldOnLoadAuth) oldOnLoadAuth();
  updateHeader();
};
