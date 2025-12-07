async function loadData(file) {
  let response = await fetch(file);
  let data = await response.json();
  return data;
}

function generateResourceRow(resource, year, categoryIndex) {
  if (!resource.id) {
    resource.id =
      year +
      "-" +
      categoryIndex +
      "-" +
      resource.title.replace(/\s+/g, "-").toLowerCase();
  }

  let html = "";
  html += "<tr>";
  html += "<th scope='row'>" + resource.title + "</th>";
  html += "<td>" + resource.type + "</td>";
  html += "<td>";

  if (resource.type === "Vídeo") {
    html +=
      "<button type='button' class='btn btn-outline-primary btn-sm preview-btn' data-bs-toggle='modal' data-bs-target='#videoPreviewModal' data-url='" +
      resource.url +
      "' data-title='" +
      resource.title +
      "'>Preview</button>";
  } else {
    html +=
      "<button type='button' class='btn btn-outline-primary btn-sm preview-btn' data-bs-toggle='modal' data-bs-target='#pdfPreviewModal' data-url='" +
      resource.worksheetUrl +
      "' data-title='" +
      resource.title +
      "'>Preview</button>";
  }

  html += "</td>";
  html += "<td>";
  html +=
    "<a class='fw-semibold' href='" +
    resource.url +
    "' target='_blank' rel='noopener'>Abrir recurso</a>";
  html += "</td>";
  html += "<td>";
  html +=
    "<button class='btn btn-sm btn-outline-danger favorite-btn' data-resource-id='" +
    resource.id +
    "' title='Adicionar aos favoritos'>";
  html += "<i class='bi bi-heart'></i>";
  html += "</button>";
  html += "</td>";
  html += "</tr>";

  return html;
}

function generateResourceTable(resources, year, categoryIndex) {
  let html = "";
  html += "<div class='table-responsive catalog-table'>";
  html += "<table class='table align-middle mb-0'>";
  html += "<thead>";
  html += "<tr>";
  html += "<th scope='col'>Tópico</th>";
  html += "<th scope='col'>Tipo</th>";
  html += "<th scope='col'>Pré-visualizar</th>";
  html += "<th></th>";
  html += "</tr>";
  html += "</thead>";
  html += "<tbody>";

  for (let i = 0; i < resources.length; i++) {
    html += generateResourceRow(resources[i], year, categoryIndex);
  }

  html += "</tbody>";
  html += "</table>";
  html += "</div>";

  return html;
}

function generateAccordionItem(category, index, year) {
  let html = "";
  let itemId = year + "-" + (index + 1);

  html += "<div class='accordion-item'>";
  html += "<h3 class='accordion-header' id='heading-" + itemId + "'>";
  html +=
    "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse-" +
    itemId +
    "' aria-expanded='false' aria-controls='collapse-" +
    itemId +
    "'>";
  html += category.category;
  html += "</button>";
  html += "</h3>";
  html +=
    "<div id='collapse-" +
    itemId +
    "' class='accordion-collapse collapse' data-bs-parent='#accordion-" +
    year +
    "'>";
  html += "<div class='accordion-body'>";
  html +=
    "<p class='text-muted small fw-semibold mb-3'>" +
    category.description +
    "</p>";
  html += generateResourceTable(category.resources, year, index);
  html += "</div>";
  html += "</div>";
  html += "</div>";

  return html;
}

function renderCategories(categories, year) {
  let accordionContainer = document.getElementById("accordion-" + year);

  if (!accordionContainer) {
    console.error("Container do accordion não encontrado para o ano " + year);
    return;
  }

  let html = "";

  for (let i = 0; i < categories.length; i++) {
    html += generateAccordionItem(categories[i], i, year);
  }

  accordionContainer.innerHTML = html;
}

async function loadYearResources(year) {
  let file = "assets/data/recursos-" + year + ".json";

  try {
    let data = await loadData(file);
    renderCategories(data, year);
  } catch (error) {
    console.error("Erro ao carregar recursos do " + year + ".º ano:", error);
  }
}

async function loadAllResources() {
  await loadYearResources("10");
  await loadYearResources("11");
  await loadYearResources("12");
  setupFavoriteButtons();
}

function setupFavoriteButtons() {
  let favoriteButtons = document.querySelectorAll(".favorite-btn");

  for (let i = 0; i < favoriteButtons.length; i++) {
    let button = favoriteButtons[i];
    let resourceId = button.getAttribute("data-resource-id");

    if (isFavorite(resourceId)) {
      updateFavoriteButton(button, true);
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();

      let resourceId = this.getAttribute("data-resource-id");
      let row = this.closest("tr");
      let accordionItem = this.closest(".accordion-item");
      let categoryHeader = accordionItem.querySelector(".accordion-button");

      let title = row.querySelector("th").textContent;
      let type = row.querySelectorAll("td")[0].textContent;
      let url = row.querySelector("a").getAttribute("href");
      let category = categoryHeader ? categoryHeader.textContent.trim() : "";

      let resource = {
        id: resourceId,
        title: title,
        type: type,
        url: url,
        category: category,
      };

      toggleFavorite(resource, this);
    });
  }
}

function applyFilters() {
  let searchQuery = document.getElementById("search-input").value.toLowerCase();
  let typeFilter = document.getElementById("type-filter").value;

  let allRows = document.querySelectorAll(".catalog-table tbody tr");
  let visibleCount = 0;

  for (let i = 0; i < allRows.length; i++) {
    let row = allRows[i];
    let title = row.querySelector("th").textContent.toLowerCase();
    let type = row.querySelectorAll("td")[0].textContent;

    let matchesSearch = title.includes(searchQuery);
    let matchesType = typeFilter === "todos" || type === typeFilter;

    if (matchesSearch && matchesType) {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  }

  let accordionItems = document.querySelectorAll(".accordion-item");
  for (let i = 0; i < accordionItems.length; i++) {
    let item = accordionItems[i];
    let visibleRowsInItem = item.querySelectorAll(
      ".catalog-table tbody tr:not([style*='display: none'])"
    );

    if (visibleRowsInItem.length === 0) {
      item.style.display = "none";
    } else {
      item.style.display = "";
    }
  }

  let yearSections = document.querySelectorAll("[id^='recursos-']");
  for (let i = 0; i < yearSections.length; i++) {
    let section = yearSections[i];
    let visibleItems = section.querySelectorAll(
      ".accordion-item:not([style*='display: none'])"
    );

    if (visibleItems.length === 0) {
      section.style.display = "none";
    } else {
      section.style.display = "";
    }
  }

  updateResultsCount(visibleCount);
}

function updateResultsCount(count) {
  let countElement = document.getElementById("count-number");
  if (countElement) {
    countElement.textContent = count;
  }
}

function setupSearchAndFilters() {
  let searchInput = document.getElementById("search-input");
  let typeFilter = document.getElementById("type-filter");
  let resetButton = document.getElementById("reset-filters");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyFilters();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", function () {
      applyFilters();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      resetFilters();
    });
  }

  let allRows = document.querySelectorAll(".catalog-table tbody tr");
  updateResultsCount(allRows.length);
}

function resetFilters() {
  let searchInput = document.getElementById("search-input");
  let typeFilter = document.getElementById("type-filter");

  if (searchInput) {
    searchInput.value = "";
  }

  if (typeFilter) {
    typeFilter.value = "todos";
  }

  applyFilters();
}

window.addEventListener("load", function () {
  loadAllResources().then(function () {
    setupSearchAndFilters();
  });
});

let videoModal = document.getElementById("videoPreviewModal");
if (videoModal) {
  videoModal.addEventListener("show.bs.modal", function (event) {
    let button = event.relatedTarget;
    let url = button.getAttribute("data-url");
    let title = button.getAttribute("data-title");

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (!url.includes("embed")) {
        let videoId = "";
        if (url.includes("v=")) {
          videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
          videoId = url.split("youtu.be/")[1];
        }
        if (videoId) {
          url = "https://www.youtube.com/embed/" + videoId;
        }
      }
    }

    let modalTitle = videoModal.querySelector(".modal-title");
    let iframe = videoModal.querySelector("iframe");

    if (modalTitle) modalTitle.textContent = title;
    if (iframe) iframe.src = url;
  });

  videoModal.addEventListener("hidden.bs.modal", function () {
    let iframe = videoModal.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
    }
  });
}

let pdfModal = document.getElementById("pdfPreviewModal");
if (pdfModal) {
  pdfModal.addEventListener("show.bs.modal", function (event) {
    let button = event.relatedTarget;
    let url = button.getAttribute("data-url");
    let title = button.getAttribute("data-title");

    let modalTitle = pdfModal.querySelector(".modal-title");
    let iframe = pdfModal.querySelector("iframe");

    if (modalTitle) modalTitle.textContent = title;
    if (iframe) iframe.src = url + "#toolbar=0&navpanes=0&scrollbar=0";
  });

  pdfModal.addEventListener("hidden.bs.modal", function () {
    let iframe = pdfModal.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
    }
  });
}
