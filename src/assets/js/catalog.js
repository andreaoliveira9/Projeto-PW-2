function createResourceRow(resource, year, categoryIndex) {
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

  let template = document.getElementById("template-resource-row");
  let clone = template.content.cloneNode(true);

  // Get the first child (the tr) from the DocumentFragment
  let row = clone.children[0];
  row.getElementsByClassName("resource-title")[0].innerText = resource.title;
  row.getElementsByClassName("resource-type")[0].innerText = resource.type;

  let previewBtn = row.getElementsByClassName("preview-btn")[0];
  previewBtn.setAttribute("data-bs-target", previewModal);
  previewBtn.setAttribute("data-url", previewUrl);
  previewBtn.setAttribute("data-title", resource.title);

  let resourceLink = row.getElementsByClassName("resource-link")[0];
  resourceLink.setAttribute("href", resource.url);

  let favoriteBtn = row.getElementsByClassName("favorite-btn")[0];
  favoriteBtn.setAttribute("data-resource-id", resource.id);
  favoriteBtn.setAttribute("data-title", resource.title);
  favoriteBtn.setAttribute("data-type", resource.type);
  favoriteBtn.setAttribute("data-url", resource.url);

  return clone;
}

function createResourceTable(resources, year, categoryIndex) {
  let template = document.getElementById("template-resource-table");
  let clone = template.content.cloneNode(true);

  // Get the first child (the table-responsive div) from the DocumentFragment
  let tableDiv = clone.children[0];
  let tbody = tableDiv.getElementsByTagName("tbody")[0];
  for (let i = 0; i < resources.length; i++) {
    let rowClone = createResourceRow(resources[i], year, categoryIndex);
    tbody.appendChild(rowClone);
  }

  return clone;
}

function createAccordionItem(category, index, year) {
  let itemId = year + "-" + (index + 1);

  let template = document.getElementById("template-accordion-item");
  let clone = template.content.cloneNode(true);

  // Get the first child (the accordion-item div) from the DocumentFragment
  let item = clone.children[0];
  let header = item.getElementsByClassName("accordion-header")[0];
  header.setAttribute("id", "heading-" + itemId);

  let button = item.getElementsByClassName("accordion-button")[0];
  button.setAttribute("data-bs-target", "#collapse-" + itemId);
  button.setAttribute("aria-controls", "collapse-" + itemId);
  button.innerText = category.category;

  let collapse = item.getElementsByClassName("accordion-collapse")[0];
  collapse.setAttribute("id", "collapse-" + itemId);
  collapse.setAttribute("data-bs-parent", "#accordion-" + year);

  let description = item.getElementsByClassName("category-description")[0];
  description.innerText = category.description;

  let body = item.getElementsByClassName("accordion-body")[0];
  let tableClone = createResourceTable(category.resources, year, index);
  body.appendChild(tableClone);

  return clone;
}

function renderCategories(categories, year) {
  let accordionContainer = document.getElementById("accordion-" + year);
  if (accordionContainer == null) {
    return;
  }

  accordionContainer.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    let itemClone = createAccordionItem(categories[i], i, year);
    accordionContainer.appendChild(itemClone);
  }
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

  let countElement = document.getElementById("count-number");
  if (countElement != null) {
    countElement.innerText = document.getElementsByTagName("tr").length;
  }
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
      let visibleInSection = false;
      let items = section.getElementsByClassName("accordion-item");
      for (let k = 0; k < items.length; k++) {
        let visibleInItem = false;
        let tbodies = items[k].getElementsByTagName("tbody");
        if (tbodies.length > 0) {
          let rows = tbodies[0].getElementsByTagName("tr");
          for (let r = 0; r < rows.length; r++) {
            if (rows[r].style.display != "none") {
              visibleInItem = true;
              visibleInSection = true;
              break;
            }
          }
        }
        if (visibleInItem == true) {
          items[k].style.display = "";
        } else {
          items[k].style.display = "none";
        }
      }
      if (visibleInSection == true) {
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

  // Restore all rows visibility
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = "";
  }

  // Restore all accordion items visibility
  let items = document.getElementsByClassName("accordion-item");
  for (let i = 0; i < items.length; i++) {
    items[i].style.display = "";
  }

  // Restore all sections visibility
  let yearIds = ["recursos-10", "recursos-11", "recursos-12"];
  for (let i = 0; i < yearIds.length; i++) {
    let section = document.getElementById(yearIds[i]);
    if (section != null) {
      section.style.display = "";
    }
  }

  // Update count
  let tbodyRows = 0;
  let tbodies = document.getElementsByTagName("tbody");
  for (let i = 0; i < tbodies.length; i++) {
    tbodyRows = tbodyRows + tbodies[i].getElementsByTagName("tr").length;
  }
  let countElement = document.getElementById("count-number");
  if (countElement != null) {
    countElement.innerText = tbodyRows;
  }
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

loadAllResources();
