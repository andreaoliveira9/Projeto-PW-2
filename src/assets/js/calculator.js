let currentValue = "0";
let previousValue = "";
let operation = "";
let history = [];
let displayExpression = "0";

function updateDisplay() {
  document.getElementById("display").value = displayExpression;
}

function appendNumber(number) {
  if (currentValue === "0" || currentValue === "Erro") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  if (operation === "" && previousValue === "") {
    displayExpression = currentValue;
  } else if (operation !== "" && previousValue !== "") {
    displayExpression = previousValue + " " + operation + " " + currentValue;
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
  displayExpression = previousValue + " " + operation + " ";
  updateDisplay();
}

function calculate() {
  if (previousValue === "" || operation === "") {
    return;
  }

  let num1 = parseFloat(previousValue);
  let num2 = parseFloat(currentValue);
  let result = 0;
  let expression = previousValue + " " + operation + " " + currentValue;

  if (operation === "+") {
    result = num1 + num2;
  } else if (operation === "-") {
    result = num1 - num2;
  } else if (operation === "*") {
    result = num1 * num2;
  } else if (operation === "/") {
    if (num2 === 0) {
      currentValue = "Erro";
      displayExpression = "Erro";
      updateDisplay();
      addToHistory(expression, "Erro: Divisão por zero");
      previousValue = "";
      operation = "";
      return;
    }
    result = num1 / num2;
  }

  result = Math.round(result * 100000000) / 100000000;
  addToHistory(expression, result);

  currentValue = result.toString();
  previousValue = "";
  operation = "";
  displayExpression = currentValue;
  updateDisplay();
}

function clearDisplay() {
  currentValue = "0";
  previousValue = "";
  operation = "";
  displayExpression = "0";
  updateDisplay();
}

function deleteLast() {
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = "0";
  }

  if (operation === "" && previousValue === "") {
    displayExpression = currentValue;
  } else if (operation !== "" && previousValue !== "") {
    displayExpression = previousValue + " " + operation + " " + currentValue;
  }

  updateDisplay();
}

function calculateSquareRoot() {
  let num = parseFloat(currentValue);
  if (num < 0) {
    currentValue = "Erro";
    displayExpression = "Erro";
    updateDisplay();
    addToHistory("√" + num, "Erro: Raiz de número negativo");
    return;
  }
  let result = Math.sqrt(num);
  result = Math.round(result * 100000000) / 100000000;

  let fullExpression = "";
  if (previousValue !== "" && operation !== "") {
    fullExpression = previousValue + " " + operation + " √" + num;
    addToHistory(
      fullExpression,
      "= " + previousValue + " " + operation + " " + result
    );
  } else {
    addToHistory("√" + num, result);
  }

  currentValue = result.toString();

  if (operation !== "" && previousValue !== "") {
    displayExpression = previousValue + " " + operation + " " + currentValue;
  } else {
    displayExpression = currentValue;
  }

  updateDisplay();
}

function calculatePower() {
  let num = parseFloat(currentValue);
  let result = num * num;
  result = Math.round(result * 100000000) / 100000000;

  let fullExpression = "";
  if (previousValue !== "" && operation !== "") {
    fullExpression = previousValue + " " + operation + " " + num + "²";
    addToHistory(
      fullExpression,
      "= " + previousValue + " " + operation + " " + result
    );
  } else {
    addToHistory(num + "²", result);
  }

  currentValue = result.toString();

  if (operation !== "" && previousValue !== "") {
    displayExpression = previousValue + " " + operation + " " + currentValue;
  } else {
    displayExpression = currentValue;
  }

  updateDisplay();
}

function calculatePercentage() {
  let num = parseFloat(currentValue);
  let result = num / 100;
  result = Math.round(result * 100000000) / 100000000;

  let fullExpression = "";
  if (previousValue !== "" && operation !== "") {
    fullExpression = previousValue + " " + operation + " " + num + "%";
    addToHistory(
      fullExpression,
      "= " + previousValue + " " + operation + " " + result
    );
  } else {
    addToHistory(num + "%", result);
  }

  currentValue = result.toString();

  if (operation !== "" && previousValue !== "") {
    displayExpression = previousValue + " " + operation + " " + currentValue;
  } else {
    displayExpression = currentValue;
  }

  updateDisplay();
}

function toggleSign() {
  let num = parseFloat(currentValue);
  currentValue = (num * -1).toString();

  if (operation === "" && previousValue === "") {
    displayExpression = currentValue;
  } else if (operation !== "" && previousValue !== "") {
    displayExpression = previousValue + " " + operation + " " + currentValue;
  }

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
  if (savedHistory != null) {
    history = JSON.parse(savedHistory);
    displayHistory();
  }
}

loadHistory();
updateDisplay();
