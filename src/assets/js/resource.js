async function loadAllResources() {
  let resources = [];

  try {
    let data10 = await fetch("assets/data/recursos-10.json");
    let json10 = await data10.json();

    for (let i = 0; i < json10.length; i++) {
      for (let j = 0; j < json10[i].resources.length; j++) {
        let resource = json10[i].resources[j];
        resource.category = json10[i].category;
        resources.push(resource);
      }
    }

    let data11 = await fetch("assets/data/recursos-11.json");
    let json11 = await data11.json();

    for (let i = 0; i < json11.length; i++) {
      for (let j = 0; j < json11[i].resources.length; j++) {
        let resource = json11[i].resources[j];
        resource.category = json11[i].category;
        resources.push(resource);
      }
    }

    let data12 = await fetch("assets/data/recursos-12.json");
    let json12 = await data12.json();

    for (let i = 0; i < json12.length; i++) {
      for (let j = 0; j < json12[i].resources.length; j++) {
        let resource = json12[i].resources[j];
        resource.category = json12[i].category;
        resources.push(resource);
      }
    }
  } catch (error) {
    console.log("Erro ao carregar recursos:", error);
  }

  return resources;
}

function getResourceIdFromUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get("id");

  if (id) {
    return parseInt(id);
  }

  return null;
}

function findResourceById(resources, id) {
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].id === id) {
      return resources[i];
    }
  }

  return null;
}

function updatePageTitle(resource) {
  let titleElement = document.querySelector(".resource-title");
  if (titleElement) {
    titleElement.textContent = resource.title;
  }

  let subtitleElement = document.querySelector(".resource-subtitle");
  if (subtitleElement) {
    subtitleElement.textContent =
      resource.type + " · " + resource.year + ".º Ano · " + resource.category;
  }

  document.title = "MathPath - " + resource.title;
}

function updateIframes(resource) {
  if (resource.type === "Vídeo") {
    window.location.href = resource.url;
    return;
  }

  let worksheetIframe = document.querySelector("#resource-worksheet iframe");
  if (worksheetIframe && resource.worksheetUrl) {
    worksheetIframe.src = resource.worksheetUrl + "#toolbar=0&view=FitH";
  }

  let solutionsIframe = document.querySelector("#resource-solutions iframe");
  if (solutionsIframe && resource.solutionsUrl) {
    solutionsIframe.src = resource.solutionsUrl + "#toolbar=0&view=FitH";

    solutionsIframe.addEventListener("load", function () {
      console.log("Soluções carregadas com sucesso");
    });
  } else if (solutionsIframe && !resource.solutionsUrl) {
    let solutionsTab = document.querySelector("#resource-tab-solutions");
    if (solutionsTab) {
      solutionsTab.style.display = "none";
    }
  }
}

function showErrorMessage() {
  let main = document.querySelector("main");
  if (main) {
    main.innerHTML =
      '<section class="py-5"><div class="container text-center"><h1>Recurso não encontrado</h1><p class="text-muted">O recurso que procuras não existe ou foi removido.</p><a href="catalog.html" class="btn btn-primary">Voltar ao catálogo</a></div></section>';
  }
}

async function initializeResourcePage() {
  let resourceId = getResourceIdFromUrl();

  if (!resourceId) {
    showErrorMessage();
    return;
  }

  let resources = await loadAllResources();
  let resource = findResourceById(resources, resourceId);

  if (!resource) {
    showErrorMessage();
    return;
  }

  updatePageTitle(resource);
  updateIframes(resource);
}

window.addEventListener("load", function () {
  initializeResourcePage();
});
