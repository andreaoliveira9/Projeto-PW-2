(function () {
  var storedTheme = localStorage.getItem("mathpath-theme");
  var root = document.documentElement;

  if (storedTheme != null) {
    applyTheme(storedTheme, { skipStorage: true });
  } else {
    applyTheme("auto", { skipStorage: true });
  }

  function isValidTheme(value) {
    if (value === "auto" || value === "light" || value === "dark") {
      return true;
    }
    return false;
  }

  function systemPrefersDark() {
    if (
      window.matchMedia != null &&
      window.matchMedia("(prefers-color-scheme: dark)").matches == true
    ) {
      return true;
    }
    return false;
  }

  function iconClassForTheme(value) {
    var effective = value;
    if (value === "auto") {
      if (systemPrefersDark() == true) {
        effective = "dark";
      } else {
        effective = "light";
      }
    }

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

    var icons = document.getElementsByClassName("theme-toggle__icon");
    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      icon.classList.remove("bi-circle-half", "bi-sun", "bi-moon-stars");
      icon.classList.add(iconClass);
    }
  }

  function applyTheme(value, options) {
    if (isValidTheme(value) == false) {
      value = "auto";
    }

    if (root.getAttribute("data-theme") !== value) {
      root.setAttribute("data-theme", value);
    }

    var radio = document.getElementById("theme-" + value);
    if (radio != null && radio.checked == false) {
      radio.checked = true;
    }

    updateToggleIcon(value);

    if (options == null || options.skipStorage == false) {
      localStorage.setItem("mathpath-theme", value);
    }
  }

  window.applyTheme = applyTheme;

  if (window.matchMedia != null) {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var handleMediaChange = function () {
      var current = root.getAttribute("data-theme");
      if (current == null) {
        current = "auto";
      }
      if (current === "auto") {
        updateToggleIcon("auto");
      }
    };
    mediaQuery.onchange = handleMediaChange;
  }
})();
