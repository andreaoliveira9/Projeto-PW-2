var storedTheme = localStorage.getItem("mathpath-theme");
var root = document.documentElement;

function isValidTheme(value) {
  return ["auto", "light", "dark"].indexOf(value) !== -1;
}

function systemPrefersDark() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function iconClassForTheme(value) {
  var effective =
    value === "auto" ? (systemPrefersDark() ? "dark" : "light") : value;
  if (effective === "dark") {
    return "bi-moon-stars";
  }
  if (effective === "light") {
    return "bi-sun";
  }
  return "bi-circle-half";
}

function updateToggleIcon(value) {
  var iconClass = iconClassForTheme(value);

  // Use getElementsByClassName instead of querySelectorAll
  var icons = document.getElementsByClassName("theme-toggle__icon");
  for (var i = 0; i < icons.length; i++) {
    var icon = icons[i];
    icon.classList.remove("bi-circle-half", "bi-sun", "bi-moon-stars");
    icon.classList.add(iconClass);
  }
}

function applyTheme(value, options) {
  if (!isValidTheme(value)) {
    value = "auto";
  }

  if (root.getAttribute("data-theme") !== value) {
    root.setAttribute("data-theme", value);
  }

  var radio = document.getElementById("theme-" + value);
  if (radio && !radio.checked) {
    radio.checked = true;
  }

  updateToggleIcon(value);

  if (!options || !options.skipStorage) {
    try {
      localStorage.setItem("mathpath-theme", value);
    } catch (error) {
      // Ignore
    }
  }
}

function setupThemeListeners() {
  var autoRadio = document.getElementById("theme-auto");
  var lightRadio = document.getElementById("theme-light");
  var darkRadio = document.getElementById("theme-dark");

  if (autoRadio)
    autoRadio.onclick = function () {
      applyTheme("auto");
    };
  if (lightRadio)
    lightRadio.onclick = function () {
      applyTheme("light");
    };
  if (darkRadio)
    darkRadio.onclick = function () {
      applyTheme("dark");
    };
}

// Initial Setup
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem("mathpath-theme");
  } catch (error) {}

  if (isValidTheme(stored)) {
    applyTheme(stored, { skipStorage: true });
  } else {
    applyTheme(root.getAttribute("data-theme") || "auto", {
      skipStorage: true,
    });
  }

  // Defer listener setup to ensure DOM is ready (though scripts are defer/end of body usually)
  // We can hook into window.onload or just run if elements exist.
  // If elements are in header and script is at end of body, they exist.
  setupThemeListeners();

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var handleMediaChange = function () {
      var current = root.getAttribute("data-theme") || "auto";
      if (current === "auto") {
        updateToggleIcon("auto");
      }
    };
    // Modern and legacy listener support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
    }
  }
})();
