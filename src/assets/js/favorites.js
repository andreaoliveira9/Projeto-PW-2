function getFavoritesKey() {
  let session = localStorage.getItem("mathpath-session");

  if (!session) {
    return null;
  }

  let sessionData = JSON.parse(session);
  return "mathpath-favorites-" + sessionData.id;
}

function getFavorites() {
  let key = getFavoritesKey();

  if (!key) {
    return [];
  }

  let favorites = localStorage.getItem(key);

  if (favorites) {
    return JSON.parse(favorites);
  }

  return [];
}

function saveFavorites(favorites) {
  let key = getFavoritesKey();

  if (!key) {
    return false;
  }

  localStorage.setItem(key, JSON.stringify(favorites));
  return true;
}

function addToFavorites(resource) {
  let session = localStorage.getItem("mathpath-session");

  if (!session) {
    alert("Por favor, faz login para adicionar favoritos.");
    window.location.href = "login.html";
    return false;
  }

  let favorites = getFavorites();

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].id === resource.id) {
      return false;
    }
  }

  favorites.push(resource);
  saveFavorites(favorites);

  return true;
}

function removeFromFavorites(resourceId) {
  let favorites = getFavorites();
  let newFavorites = [];

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].id !== resourceId) {
      newFavorites.push(favorites[i]);
    }
  }

  saveFavorites(newFavorites);
  return true;
}

function isFavorite(resourceId) {
  let favorites = getFavorites();

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].id === resourceId) {
      return true;
    }
  }

  return false;
}

function toggleFavorite(resource, button) {
  if (isFavorite(resource.id)) {
    removeFromFavorites(resource.id);
    updateFavoriteButton(button, false);
    return false;
  } else {
    let added = addToFavorites(resource);
    if (added) {
      updateFavoriteButton(button, true);
      return true;
    }
    return false;
  }
}

function updateFavoriteButton(button, isFav) {
  let icon = button.querySelector("i");

  if (isFav) {
    icon.classList.remove("bi-heart");
    icon.classList.add("bi-heart-fill");
    button.classList.add("active");
    button.setAttribute("title", "Remover dos favoritos");
  } else {
    icon.classList.remove("bi-heart-fill");
    icon.classList.add("bi-heart");
    button.classList.remove("active");
    button.setAttribute("title", "Adicionar aos favoritos");
  }
}
