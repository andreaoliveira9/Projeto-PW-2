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
      "<button type='button' class='btn btn-outline-primary btn-sm' data-bs-toggle='modal' data-bs-target='#videoPreviewModal'>Preview</button>";
  } else {
    html +=
      "<button type='button' class='btn btn-outline-primary btn-sm' data-bs-toggle='modal' data-bs-target='#pdfPreviewModal'>Preview</button>";
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
    console.log(
      "Erro: Container do accordion não encontrado para o ano " + year
    );
    return;
  }

  let html = "";

  for (let i = 0; i < categories.length; i++) {
    html += generateAccordionItem(categories[i], i, year);
  }

  accordionContainer.innerHTML = html;
  setupFavoriteButtons();
  console.log("Recursos do " + year + ".º ano carregados com sucesso!");
}

async function loadYearResources(year) {
  let file = "assets/data/recursos-" + year + ".json";

  try {
    let data = await loadData(file);
    renderCategories(data, year);
  } catch (error) {
    console.log("Erro ao carregar recursos do " + year + ".º ano:", error);
  }
}

async function loadYearResources(year) {
  let file = "assets/data/recursos-" + year + ".json";

  try {
    let data = await loadData(file);
    renderCategories(data, year);
  } catch (error) {
    console.log("Erro ao carregar recursos do " + year + ".º ano:", error);
  }
}

async function loadAllResources() {
  await loadYearResources("10");
  await loadYearResources("11");
  await loadYearResources("12");
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
      let title = row.querySelector("th").textContent;
      let type = row.querySelectorAll("td")[0].textContent;
      let url = row.querySelector("a").getAttribute("href");

      let resource = {
        id: resourceId,
        title: title,
        type: type,
        url: url,
      };

      toggleFavorite(resource, this);
    });
  }
}

window.addEventListener("load", function () {
  console.log("Iniciando carregamento de recursos...");
  loadAllResources();
});
