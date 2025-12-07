(function () {
  var storageKey = "mathpath-theme";
  var validThemes = ["auto", "light", "dark"];
  var root = document.documentElement;

  function isValid(value) {
    return validThemes.indexOf(value) !== -1;
  }

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function iconClassForTheme(value) {
    var effective = value === "auto" ? (systemPrefersDark() ? "dark" : "light") : value;
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
    var icons = document.querySelectorAll(".theme-toggle__icon");
    icons.forEach(function (icon) {
      icon.classList.remove("bi-circle-half", "bi-sun", "bi-moon-stars");
      icon.classList.add(iconClass);
    });
  }

  function applyTheme(value, options) {
    if (!isValid(value)) {
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
        localStorage.setItem(storageKey, value);
      } catch (error) {
        // Ignore write errors (e.g., private mode)
      }
    }
  }

  var radios = document.querySelectorAll('input[name="site-theme"]');
  if (!radios.length) {
    return;
  }

  radios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (!radio.checked) {
        return;
      }
      var selected = radio.id.replace("theme-", "");
      applyTheme(selected);
    });
  });

  var stored = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch (error) {
    stored = null;
  }

  if (isValid(stored)) {
    applyTheme(stored, { skipStorage: true });
  } else {
    applyTheme(root.getAttribute("data-theme") || "auto", {
      skipStorage: true,
    });
  }

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var handleMediaChange = function () {
      var current = root.getAttribute("data-theme") || "auto";
      if (current === "auto") {
        updateToggleIcon("auto");
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleMediaChange);
    }
  }
})();
