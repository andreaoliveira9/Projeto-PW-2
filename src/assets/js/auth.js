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
  window.location.reload();
}

function updateHeader() {
  let session = getSession();

  let mobileProfileName = document.querySelector(".mobile-profile-name");
  if (mobileProfileName) {
    if (session) {
      mobileProfileName.textContent = session.name.split(" ")[0];
    } else {
      mobileProfileName.textContent = "Entrar";
    }
  }

  let desktopUserIcon = document.querySelector(".user-menu__icon");
  if (desktopUserIcon) {
    if (session) {
      desktopUserIcon.classList.remove("bi-box-arrow-in-right");
      desktopUserIcon.classList.add("bi-person-circle");
    } else {
      desktopUserIcon.classList.remove("bi-person-circle");
      desktopUserIcon.classList.add("bi-box-arrow-in-right");
    }
  }

  let mobileProfileIcon = document.querySelector(".mobile-profile-info i");
  if (mobileProfileIcon) {
    if (session) {
      mobileProfileIcon.classList.remove("bi-box-arrow-in-right");
      mobileProfileIcon.classList.add("bi-person-circle");
    } else {
      mobileProfileIcon.classList.remove("bi-person-circle");
      mobileProfileIcon.classList.add("bi-box-arrow-in-right");
    }
  }

  let mobileProfileLinks = document.querySelectorAll(
    '.mobile-profile a[href="account.html"]'
  );
  for (let i = 0; i < mobileProfileLinks.length; i++) {
    mobileProfileLinks[i].addEventListener("click", function (event) {
      if (!isLoggedIn()) {
        event.preventDefault();
        window.location.href = "login.html";
      }
    });
  }

  let desktopUserMenuButtons = document.querySelectorAll(".user-menu button");
  for (let i = 0; i < desktopUserMenuButtons.length; i++) {
    desktopUserMenuButtons[i].addEventListener("click", function (event) {
      if (!isLoggedIn()) {
        event.preventDefault();
        window.location.href = "login.html";
      }
    });
  }

  let profileLinks = document.querySelectorAll('a[href="account.html"]');
  for (let i = 0; i < profileLinks.length; i++) {
    profileLinks[i].addEventListener("click", function (event) {
      if (!isLoggedIn()) {
        event.preventDefault();
        window.location.href = "login.html";
      }
    });
  }

  let logoutButtons = document.querySelectorAll(
    'a[href="#"].text-danger, a.text-danger[href="#"]'
  );
  for (let i = 0; i < logoutButtons.length; i++) {
    logoutButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      logout();
    });
  }
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

window.addEventListener("load", function () {
  updateHeader();
});
