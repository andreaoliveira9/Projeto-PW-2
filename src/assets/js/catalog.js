async function loadData(file) {
  let response = await fetch(file);
  let data = await response.json();
  return data;
}

function generateResourceRow(resource, year, categoryIndex) {
  if (resource.id == null) {
    resource.id =
      year +
      "-" +
      categoryIndex +
      "-" +
      resource.title.replace(/\s+/g, "-").toLowerCase();
  }

  let previewUrl = "";
  let previewModal = "";
  if (resource.type === "Vídeo") {
    previewUrl = resource.url;
    previewModal = "#videoPreviewModal";
  } else {
    previewUrl = resource.worksheetUrl;
    previewModal = "#pdfPreviewModal";
  }

  let html = "";
  html += "<tr>";
  html += "<th scope='row'>" + resource.title + "</th>";
  html += "<td>" + resource.type + "</td>";
  html += "<td>";
  html +=
    "<button type='button' class='btn btn-outline-primary btn-sm preview-btn' onclick='openPreview(this)' data-bs-toggle='modal' data-bs-target='" +
    previewModal +
    "' data-url='" +
    previewUrl +
    "' data-title='" +
    resource.title +
    "'>Preview</button>";
  html += "</td>";
  html += "<td>";
  html +=
    "<a class='fw-semibold' href='" +
    resource.url +
    "' target='_blank' rel='noopener'>Abrir recurso</a>";
  html += "</td>";
  html += "<td>";
  html +=
    "<button class='btn btn-sm btn-outline-danger favorite-btn' onclick='toggleFavoriteResource(this)' data-resource-id='" +
    resource.id +
    "' data-title='" +
    resource.title +
    "' data-type='" +
    resource.type +
    "' data-url='" +
    resource.url +
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
  let itemId = year + "-" + (index + 1);
  let html = "";
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
  if (accordionContainer == null) {
    return;
  }

  let html = "";
  for (let i = 0; i < categories.length; i++) {
    html += generateAccordionItem(categories[i], i, year);
  }
  accordionContainer.innerHTML = html;
}

async function loadYearResources(year) {
  let data = await loadData("assets/data/recursos-" + year + ".json");
  renderCategories(data, year);
}

async function loadAllResources() {
  await loadYearResources(10);
  await loadYearResources(11);
  await loadYearResources(12);
  updateAllFavoriteButtons();
}

function updateAllFavoriteButtons() {
  let buttons = document.getElementsByClassName("favorite-btn");
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    let resourceId = button.getAttribute("data-resource-id");
    if (isFavorite(resourceId) == true) {
      let icon = button.children[0];
      if (icon != null) {
        icon.classList.remove("bi-heart");
        icon.classList.add("bi-heart-fill");
      }
      button.classList.add("active");
      button.setAttribute("title", "Remover dos favoritos");
    }
  }
}

function getParentAccordionItem(element) {
  let current = element.parentNode;
  while (current != null) {
    if (
      current.classList != null &&
      current.classList.contains("accordion-item") == true
    ) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function toggleFavoriteResource(button) {
  let resourceId = button.getAttribute("data-resource-id");
  let title = button.getAttribute("data-title");
  let type = button.getAttribute("data-type");
  let url = button.getAttribute("data-url");

  let category = "";
  let item = getParentAccordionItem(button);
  if (item != null) {
    let header = item.getElementsByClassName("accordion-button")[0];
    if (header != null) {
      category = header.innerText.trim();
    }
  }

  let resource = {
    id: resourceId,
    title: title,
    type: type,
    url: url,
    category: category,
  };

  toggleFavorite(resource, button);
}

function applyFilters() {
  let searchQuery = document.getElementById("search-input").value.toLowerCase();
  let filterValue = document.getElementById("type-filter").value;

  let tables = document.getElementsByClassName("catalog-table");
  let visibleCount = 0;

  for (let t = 0; t < tables.length; t++) {
    let tbodies = tables[t].getElementsByTagName("tbody");
    if (tbodies.length > 0) {
      let formRows = tbodies[0].getElementsByTagName("tr");
      for (let r = 0; r < formRows.length; r++) {
        let row = formRows[r];
        let th = row.getElementsByTagName("th")[0];
        let tds = row.getElementsByTagName("td");
        let typeTd = tds[0];

        if (th != null && typeTd != null) {
          let title = th.innerText.toLowerCase();
          let type = typeTd.innerText;
          let matchesSearch = title.indexOf(searchQuery) != -1;
          let matchesType = filterValue === "todos" || type === filterValue;

          if (matchesSearch == true && matchesType == true) {
            row.style.display = "";
            visibleCount++;
          } else {
            row.style.display = "none";
          }
        }
      }
    }
  }

  let yearIds = ["recursos-10", "recursos-11", "recursos-12"];
  for (let i = 0; i < yearIds.length; i++) {
    let section = document.getElementById(yearIds[i]);
    if (section != null) {
      let visibleItems = false;
      let items = section.getElementsByClassName("accordion-item");
      for (let k = 0; k < items.length; k++) {
        let tbodies = items[k].getElementsByTagName("tbody");
        if (tbodies.length > 0) {
          let rows = tbodies[0].getElementsByTagName("tr");
          for (let r = 0; r < rows.length; r++) {
            if (rows[r].style.display != "none") {
              visibleItems = true;
              break;
            }
          }
        }
        if (visibleItems == true) {
          break;
        }
      }
      if (visibleItems == true) {
        section.style.display = "";
      } else {
        section.style.display = "none";
      }
    }
  }

  let countElement = document.getElementById("count-number");
  if (countElement != null) {
    countElement.innerText = visibleCount;
  }
}

function resetFilters() {
  let searchInput = document.getElementById("search-input");
  let typeFilter = document.getElementById("type-filter");
  if (searchInput != null) {
    searchInput.value = "";
  }
  if (typeFilter != null) {
    typeFilter.value = "todos";
  }
  applyFilters();
}

function openPreview(button) {
  let url = button.getAttribute("data-url");
  let title = button.getAttribute("data-title");
  let target = button.getAttribute("data-bs-target");

  let targetId = target.substring(1);
  let modal = document.getElementById(targetId);

  if (target === "#videoPreviewModal") {
    if (url.indexOf("youtube.com") != -1 || url.indexOf("youtu.be") != -1) {
      if (url.indexOf("embed") === -1) {
        let videoId = "";
        if (url.indexOf("v=") != -1) {
          videoId = url.split("v=")[1].split("&")[0];
        } else if (url.indexOf("youtu.be/") != -1) {
          videoId = url.split("youtu.be/")[1];
        }
        if (videoId != "") {
          url = "https://www.youtube.com/embed/" + videoId;
        }
      }
    }
    let modalTitle = modal.getElementsByClassName("modal-title")[0];
    let iframe = modal.getElementsByTagName("iframe")[0];
    if (modalTitle != null) {
      modalTitle.innerText = title;
    }
    if (iframe != null) {
      iframe.src = url;
    }
  } else if (target === "#pdfPreviewModal") {
    let modalTitle = modal.getElementsByClassName("modal-title")[0];
    let iframe = modal.getElementsByTagName("iframe")[0];
    if (modalTitle != null) {
      modalTitle.innerText = title;
    }
    if (iframe != null) {
      iframe.src = url + "#toolbar=0&navpanes=0&scrollbar=0";
    }
  }
}

function clearModalIframe(modalId) {
  let modal = document.getElementById(modalId);
  if (modal != null) {
    let iframe = modal.getElementsByTagName("iframe")[0];
    if (iframe != null) {
      iframe.src = "";
    }
  }
}

var oldOnLoadCatalog = window.onload;
window.onload = function () {
  if (oldOnLoadCatalog != null) {
    oldOnLoadCatalog();
  }
  loadAllResources().then(function () {
    let countElement = document.getElementById("count-number");
    if (countElement != null) {
      countElement.innerText = document.getElementsByTagName("tr").length;
    }
  });
};
