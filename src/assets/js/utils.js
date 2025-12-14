async function loadData(file) {
  let response = await fetch(file);
  let data = await response.json();
  return data;
}

function setTextById(id, text) {
  let element = document.getElementById(id);
  if (element != null) {
    element.innerText = text;
  }
}
