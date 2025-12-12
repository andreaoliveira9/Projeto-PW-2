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
    console.error("Erro ao carregar recursos:", error);
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
  let titleElement = document.getElementById("resource-title-text");
  if (titleElement) {
    titleElement.textContent = resource.title;
  }

  let subtitleElement = document.getElementById("resource-subtitle-text");
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

  let worksheetIframe = document.getElementById("worksheet-iframe");
  if (worksheetIframe && resource.worksheetUrl) {
    worksheetIframe.src = resource.worksheetUrl + "#toolbar=0&view=FitH";
  }

  let solutionsIframe = document.getElementById("solutions-iframe");
  if (solutionsIframe && resource.solutionsUrl) {
    solutionsIframe.src = resource.solutionsUrl + "#toolbar=0&view=FitH";

    solutionsIframe.onload = function () {
      console.debug("Soluções carregadas");
    };
  } else if (solutionsIframe && !resource.solutionsUrl) {
    let solutionsTab = document.getElementById("resource-tab-solutions");
    if (solutionsTab) {
      solutionsTab.style.display = "none";
    }
  }
}

function showErrorMessage() {
  let main = document.getElementById("main");
  if (main) {
    main.innerHTML =
      '<section class="py-5"><div class="container text-center"><h1>Recurso não encontrado</h1><p class="text-muted">O recurso que procuras não existe ou foi removido.</p><a href="catalog.html" class="btn btn-primary">Voltar ao catálogo</a></div></section>';
  }
}

function getChatKey(resourceId) {
  return "mathpath-chat-" + resourceId;
}

function getMessages(resourceId) {
  let key = getChatKey(resourceId);
  let stored = localStorage.getItem(key);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
}

function saveMessage(resourceId, message) {
  let messages = getMessages(resourceId);
  messages.push(message);

  let key = getChatKey(resourceId);
  localStorage.setItem(key, JSON.stringify(messages));
}

function formatTimeAgo(timestamp) {
  let now = Date.now();
  let diff = now - timestamp;

  let minutes = Math.floor(diff / 60000);
  let hours = Math.floor(diff / 3600000);
  let days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return "agora mesmo";
  } else if (minutes < 60) {
    return "há " + minutes + " min";
  } else if (hours < 24) {
    return "há " + hours + " hora" + (hours > 1 ? "s" : "");
  } else {
    return "há " + days + " dia" + (days > 1 ? "s" : "");
  }
}

function displayMessages(resourceId) {
  let chatThread = document.getElementById("chat-thread");
  if (!chatThread) {
    return;
  }

  let messages = getMessages(resourceId);

  if (messages.length === 0) {
    chatThread.innerHTML =
      '<p class="text-muted text-center p-4 mb-0">Ainda não há mensagens. Sê o primeiro a comentar!</p>';
    return;
  }

  let html = "";

  for (let i = 0; i < messages.length; i++) {
    let msg = messages[i];
    html += '<article class="chat-message">';
    html += '<header class="chat-meta">';
    html += '<span class="chat-author">' + msg.author + "</span>";
    html +=
      '<time class="chat-time">' + formatTimeAgo(msg.timestamp) + "</time>";
    html += "</header>";
    html += '<p class="chat-text mb-2">' + msg.text + "</p>";
    html += "</article>";
  }

  chatThread.innerHTML = html;
  chatThread.scrollTop = chatThread.scrollHeight;
}

function handleMessageSubmit(event) {
  event.preventDefault();

  let resourceId = getResourceIdFromUrl();
  if (!resourceId) return;

  let input = document.getElementById("chat-message-input");
  if (!input) {
    return;
  }

  let text = input.value.trim();
  if (!text) {
    return;
  }

  let session = localStorage.getItem("mathpath-session");
  let author = "Anónimo";

  if (session) {
    try {
      let userData = JSON.parse(session);
      author = userData.name.split(" ")[0];
    } catch (error) {
      author = "Anónimo";
    }
  }

  let message = {
    id: Date.now(),
    author: author,
    text: text,
    timestamp: Date.now(),
  };

  saveMessage(resourceId, message);
  displayMessages(resourceId);

  input.value = "";
}

function setupChat(resourceId) {
  // Chat form binding is now inline in HTML
  displayMessages(resourceId);
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
  setupChat(resourceId);
}

var oldOnLoadResource = window.onload;
window.onload = function () {
  if (oldOnLoadResource) oldOnLoadResource();
  initializeResourcePage();
};
