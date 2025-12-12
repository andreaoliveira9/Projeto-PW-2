async function loadData(file) {
  let response = await fetch(file);
  let data = await response.json();
  return data;
}

async function loadAllResources() {
  let resources = [];
  let years = [10, 11, 12];
  for (let y = 0; y < years.length; y++) {
    let json = await loadData("assets/data/recursos-" + years[y] + ".json");
    for (let i = 0; i < json.length; i++) {
      for (let j = 0; j < json[i].resources.length; j++) {
        let resource = json[i].resources[j];
        resource.category = json[i].category;
        resources.push(resource);
      }
    }
  }
  return resources;
}

function getResourceIdFromUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get("id");
  if (id != null) {
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

function setTextById(id, text) {
  let element = document.getElementById(id);
  if (element != null) {
    element.innerText = text;
  }
}

function updatePageTitle(resource) {
  setTextById("resource-title-text", resource.title);
  setTextById(
    "resource-subtitle-text",
    resource.type + " · " + resource.year + ".º Ano · " + resource.category
  );
  document.title = "MathPath - " + resource.title;
}

function updateIframes(resource) {
  if (resource.type === "Vídeo") {
    window.location.href = resource.url;
    return;
  }

  let worksheetIframe = document.getElementById("worksheet-iframe");
  if (worksheetIframe != null && resource.worksheetUrl != null) {
    worksheetIframe.src = resource.worksheetUrl + "#toolbar=0&view=FitH";
  }

  let solutionsIframe = document.getElementById("solutions-iframe");
  if (solutionsIframe != null && resource.solutionsUrl != null) {
    solutionsIframe.src = resource.solutionsUrl + "#toolbar=0&view=FitH";
  } else if (solutionsIframe != null && resource.solutionsUrl == null) {
    let solutionsTab = document.getElementById("resource-tab-solutions");
    if (solutionsTab != null) {
      solutionsTab.style.display = "none";
    }
  }
}

function showErrorMessage() {
  let main = document.getElementById("main");
  if (main != null) {
    main.innerHTML =
      '<section class="py-5"><div class="container text-center"><h1>Recurso não encontrado</h1><p class="text-muted">O recurso que procuras não existe ou foi removido.</p><a href="catalog.html" class="btn btn-primary">Voltar ao catálogo</a></div></section>';
  }
}

function getChatKey(resourceId) {
  return "mathpath-chat-" + resourceId;
}

function getMessages(resourceId) {
  let stored = localStorage.getItem(getChatKey(resourceId));
  if (stored == null) {
    return [];
  }
  let parsed = JSON.parse(stored);
  if (parsed != null) {
    return parsed;
  }
  return [];
}

function saveMessage(resourceId, message) {
  let messages = getMessages(resourceId);
  messages.push(message);
  localStorage.setItem(getChatKey(resourceId), JSON.stringify(messages));
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
    let plural = "";
    if (hours > 1) {
      plural = "s";
    }
    return "há " + hours + " hora" + plural;
  } else {
    let plural = "";
    if (days > 1) {
      plural = "s";
    }
    return "há " + days + " dia" + plural;
  }
}

function displayMessages(resourceId) {
  let chatThread = document.getElementById("chat-thread");
  if (chatThread == null) {
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

function handleMessageSubmit() {
  let resourceId = getResourceIdFromUrl();
  if (resourceId == null) {
    return;
  }

  let input = document.getElementById("chat-message-input");
  if (input == null) {
    return;
  }

  let text = input.value.trim();
  if (text === "") {
    return;
  }

  let session = localStorage.getItem("mathpath-session");
  let author = "Anónimo";

  if (session != null) {
    let userData = JSON.parse(session);
    if (userData != null && userData.name != null) {
      author = userData.name.split(" ")[0];
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

async function initializeResourcePage() {
  let resourceId = getResourceIdFromUrl();
  if (resourceId == null) {
    showErrorMessage();
    return;
  }

  let resources = await loadAllResources();
  let resource = findResourceById(resources, resourceId);

  if (resource == null) {
    showErrorMessage();
    return;
  }

  updatePageTitle(resource);
  updateIframes(resource);
  displayMessages(resourceId);
}

var oldOnLoadResource = window.onload;
window.onload = function () {
  if (oldOnLoadResource != null) {
    oldOnLoadResource();
  }
  initializeResourcePage();
};
