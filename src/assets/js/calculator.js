let currentValue = "0";
let previousValue = "";
let operation = "";
let history = [];

function updateDisplay() {
  document.getElementById("display").value = currentValue;
}

function appendNumber(number) {
  if (currentValue === "0" || currentValue === "Erro") {
    currentValue = number;
  } else {
    currentValue += number;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (currentValue === "Erro") {
    return;
  }
  if (previousValue !== "") {
    calculate();
  }
  operation = op;
  previousValue = currentValue;
  currentValue = "0";
}

function calculate() {
  if (previousValue === "" || operation === "") {
    return;
  }

  let num1 = parseFloat(previousValue);
  let num2 = parseFloat(currentValue);
  let result = 0;
  let expression = previousValue + " " + operation + " " + currentValue;

  switch (operation) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      if (num2 === 0) {
        currentValue = "Erro";
        updateDisplay();
        addToHistory(expression, "Erro: Divisão por zero");
        previousValue = "";
        operation = "";
        return;
      }
      result = num1 / num2;
      break;
  }

  result = Math.round(result * 100000000) / 100000000;
  addToHistory(expression, result);

  currentValue = result.toString();
  previousValue = "";
  operation = "";
  updateDisplay();
}

function clearDisplay() {
  currentValue = "0";
  previousValue = "";
  operation = "";
  updateDisplay();
}

function deleteLast() {
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = "0";
  }
  updateDisplay();
}

function calculateSquareRoot() {
  let num = parseFloat(currentValue);
  if (num < 0) {
    currentValue = "Erro";
    updateDisplay();
    addToHistory("√" + num, "Erro: Raiz de número negativo");
    return;
  }
  let result = Math.sqrt(num);
  result = Math.round(result * 100000000) / 100000000;
  addToHistory("√" + num, result);
  currentValue = result.toString();
  updateDisplay();
}

function calculatePower() {
  let num = parseFloat(currentValue);
  let result = num * num;
  result = Math.round(result * 100000000) / 100000000;
  addToHistory(num + "²", result);
  currentValue = result.toString();
  updateDisplay();
}

function calculatePercentage() {
  let num = parseFloat(currentValue);
  let result = num / 100;
  result = Math.round(result * 100000000) / 100000000;
  addToHistory(num + "%", result);
  currentValue = result.toString();
  updateDisplay();
}

function toggleSign() {
  let num = parseFloat(currentValue);
  currentValue = (num * -1).toString();
  updateDisplay();
}

function addToHistory(expression, result) {
  let historyItem = {
    expression: expression,
    result: result,
    timestamp: new Date().toLocaleTimeString("pt-PT"),
  };
  history.push(historyItem);
  saveHistory();
  displayHistory();
}

function displayHistory() {
  let historyDiv = document.getElementById("history");
  if (history.length === 0) {
    historyDiv.innerHTML =
      '<p class="text-muted text-center mb-0">Nenhum cálculo ainda</p>';
    return;
  }

  let html = "";
  for (let i = history.length - 1; i >= 0; i--) {
    let item = history[i];
    html += '<div class="history-item p-2 mb-2 border-bottom">';
    html += '<div class="d-flex justify-content-between align-items-center">';
    html += "<div>";
    html += '<small class="text-muted">' + item.timestamp + "</small>";
    html +=
      "<div>" +
      item.expression +
      " = <strong>" +
      item.result +
      "</strong></div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
  }
  historyDiv.innerHTML = html;
}

function clearHistory() {
  history = [];
  saveHistory();
  displayHistory();
}

function saveHistory() {
  localStorage.setItem("mathpath-calculator-history", JSON.stringify(history));
}

function loadHistory() {
  let savedHistory = localStorage.getItem("mathpath-calculator-history");
  if (savedHistory) {
    history = JSON.parse(savedHistory);
    displayHistory();
  }
}

var oldOnLoadCalculator = window.onload;
window.onload = function () {
  if (oldOnLoadCalculator) {
    oldOnLoadCalculator();
  }
  loadHistory();
  updateDisplay();
};
