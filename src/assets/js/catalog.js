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
      "<button type='button' class='btn btn-outline-primary btn-sm preview-btn' onclick='openPreview(this)' data-bs-toggle='modal' data-bs-target='#videoPreviewModal' data-url='" +
      resource.url +
      "' data-title='" +
      resource.title +
      "'>Preview</button>";
  } else {
    html +=
      "<button type='button' class='btn btn-outline-primary btn-sm preview-btn' onclick='openPreview(this)' data-bs-toggle='modal' data-bs-target='#pdfPreviewModal' data-url='" +
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
  updateAllFavoriteButtons();
}

function updateAllFavoriteButtons() {
  let buttons = document.getElementsByClassName("favorite-btn");
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    let resourceId = button.getAttribute("data-resource-id");
    if (isFavorite(resourceId)) {
      let icon = button.children[0]; // Assuming icon is first child
      if (icon) {
        icon.classList.remove("bi-heart");
        icon.classList.add("bi-heart-fill");
      }
      button.classList.add("active");
      button.setAttribute("title", "Remover dos favoritos");
    }
  }
}

function toggleFavoriteResource(button) {
  let resourceId = button.getAttribute("data-resource-id");
  let row = button.closest("tr");
  let td = button.parentNode;
  let tr = td.parentNode;

  let accordionItem;
  if (tr.closest) {
    accordionItem = tr.closest(".accordion-item");
  } else {
    accordionItem = tr.parentNode.parentNode.parentNode.parentNode.parentNode;
  }

  let title = button.getAttribute("data-title");
  let type = button.getAttribute("data-type");
  let url = button.getAttribute("data-url");

  let category = "";
  if (button.closest) {
    let item = button.closest(".accordion-item");
    if (item) {
      let header;
      if (item.querySelector) {
        header = item.querySelector(".accordion-button");
      } else {
        header = item.getElementsByClassName("accordion-button")[0];
      }
      if (header) category = header.textContent.trim();
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
  let searchInput = document.getElementById("search-input");
  let typeFilter = document.getElementById("type-filter");

  let searchQuery = searchInput.value.toLowerCase();
  let filterValue = typeFilter.value;

  let tables = document.getElementsByClassName("catalog-table");
  let visibleCount = 0;

  for (let t = 0; t < tables.length; t++) {
    let rows = tables[t].getElementsByTagName("tr");
    let tbodies = tables[t].getElementsByTagName("tbody");
    if (tbodies.length > 0) {
      let formRows = tbodies[0].getElementsByTagName("tr");
      for (let r = 0; r < formRows.length; r++) {
        let row = formRows[r];
        let th = row.getElementsByTagName("th")[0];
        let tds = row.getElementsByTagName("td");
        let typeTd = tds[0];

        if (th && typeTd) {
          let title = th.textContent.toLowerCase();
          let type = typeTd.textContent;

          let matchesSearch = title.indexOf(searchQuery) !== -1;
          let matchesType = filterValue === "todos" || type === filterValue;

          if (matchesSearch && matchesType) {
            row.style.display = "";
            visibleCount++;
          } else {
            row.style.display = "none";
          }
        }
      }
    }
  }

  let accordionItems = document.getElementsByClassName("accordion-item");
  for (let i = 0; i < accordionItems.length; i++) {
    let item = accordionItems[i];
    for (let j = 0; j < rows.length; j++) {
      if (
        rows[j].parentNode.tagName === "TBODY" &&
        rows[j].style.display !== "none"
      ) {
        visible = true;
        break;
      }
    }

    if (visible) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }

  let yearIds = ["recursos-10", "recursos-11", "recursos-12"];
  for (let id of yearIds) {
    let section = document.getElementById(id);
    if (section) {
      let visibleParams = false;
      let items = section.getElementsByClassName("accordion-item");
      for (let k = 0; k < items.length; k++) {
        if (items[k].style.display !== "none") {
          visibleParams = true;
          break;
        }
      }
      if (visibleParams) {
        section.style.display = "";
      } else {
        section.style.display = "none";
      }
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

function openPreview(button) {
  var url = button.getAttribute("data-url");
  var title = button.getAttribute("data-title");
  var target = button.getAttribute("data-bs-target");

  var targetId = target.substring(1);
  var modal = document.getElementById(targetId);

  if (target === "#videoPreviewModal") {
    if (url.indexOf("youtube.com") !== -1 || url.indexOf("youtu.be") !== -1) {
      if (url.indexOf("embed") === -1) {
        var videoId = "";
        if (url.indexOf("v=") !== -1) {
          videoId = url.split("v=")[1].split("&")[0];
        } else if (url.indexOf("youtu.be/") !== -1) {
          videoId = url.split("youtu.be/")[1];
        }
        if (videoId) {
          url = "https://www.youtube.com/embed/" + videoId;
        }
      }
    }
    var modalTitle = modal.getElementsByClassName("modal-title")[0];
    var iframe = modal.getElementsByTagName("iframe")[0];
    if (modalTitle) modalTitle.textContent = title;
    if (iframe) iframe.src = url;
  } else if (target === "#pdfPreviewModal") {
    var modalTitle = modal.getElementsByClassName("modal-title")[0];
    var iframe = modal.getElementsByTagName("iframe")[0];
    if (modalTitle) modalTitle.textContent = title;
    if (iframe) iframe.src = url + "#toolbar=0&navpanes=0&scrollbar=0";
  }
}

function stopVideo(modal) {
  var iframe = modal.getElementsByTagName("iframe")[0];
  if (iframe) {
    iframe.src = "";
  }
}

function clearModalIframe(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) stopVideo(modal);
}

var oldOnLoadCatalog = window.onload;
window.onload = function () {
  if (oldOnLoadCatalog) oldOnLoadCatalog();

  loadAllResources().then(function () {
    updateResultsCount(document.getElementsByTagName("tr").length);
  });
};
