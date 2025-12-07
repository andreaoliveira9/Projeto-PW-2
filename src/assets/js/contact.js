// Inicializar EmailJS com a Public Key
(function () {
  emailjs.init("MWFq8f7-C_8OX4m1Q");
})();

function validateName(name) {
  if (name.length < 3) {
    return "O nome deve ter pelo menos 3 caracteres.";
  }

  if (name.length > 50) {
    return "O nome não pode ter mais de 50 caracteres.";
  }

  return "";
}

function validateEmail(email) {
  if (email === "") {
    return "Por favor, insere o teu email.";
  }

  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return "Por favor, insere um email válido.";
  }

  return "";
}

function validateSubject(subject) {
  if (subject === "") {
    return "Por favor, seleciona um assunto.";
  }

  return "";
}

function validateMessage(message) {
  if (message.length < 10) {
    return "A mensagem deve ter pelo menos 10 caracteres.";
  }

  if (message.length > 500) {
    return "A mensagem não pode ter mais de 500 caracteres.";
  }

  return "";
}

function showFieldError(fieldId, errorMessage) {
  let field = document.getElementById(fieldId);

  field.classList.remove("is-valid");
  field.classList.add("is-invalid");

  let feedbackDiv = field.parentNode.querySelector(".invalid-feedback");

  if (!feedbackDiv) {
    feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("invalid-feedback");
    field.parentNode.appendChild(feedbackDiv);
  }

  feedbackDiv.textContent = errorMessage;
  feedbackDiv.style.display = "block";
}

function showFieldSuccess(fieldId) {
  let field = document.getElementById(fieldId);

  field.classList.remove("is-invalid");
  field.classList.add("is-valid");

  let feedbackDiv = field.parentNode.querySelector(".invalid-feedback");

  if (feedbackDiv) {
    feedbackDiv.textContent = "";
    feedbackDiv.style.display = "none";
  }
}

function validateField(fieldId, validatorFunction, value) {
  let errorMessage = validatorFunction(value);

  if (errorMessage !== "") {
    showFieldError(fieldId, errorMessage);
    return false;
  } else {
    showFieldSuccess(fieldId);
    return true;
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  let form = document.getElementById("contact-form");
  let submitButton = form.querySelector('button[type="submit"]');
  let originalButtonText = submitButton.innerHTML;

  let nameField = document.getElementById("name-field");
  let emailField = document.getElementById("email-field");
  let subjectField = document.getElementById("subject-field");
  let messageField = document.getElementById("message-field");

  let nameValue = nameField.value.trim();
  let emailValue = emailField.value.trim();
  let subjectValue = subjectField.value;
  let messageValue = messageField.value.trim();

  let isNameValid = validateField("name-field", validateName, nameValue);
  let isEmailValid = validateField("email-field", validateEmail, emailValue);
  let isSubjectValid = validateField(
    "subject-field",
    validateSubject,
    subjectValue
  );
  let isMessageValid = validateField(
    "message-field",
    validateMessage,
    messageValue
  );

  if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
    // Definir estado de loading
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> A enviar...';

    // Parâmetros para o template do EmailJS
    let templateParams = {
      name: nameValue,
      email: emailValue,
      subject: subjectValue,
      message: messageValue,
    };

    emailjs
      .send("service_llmgfmk", "template_l7u0kig", templateParams)
      .then(function (response) {
        let formData = {
          ...templateParams,
          timestamp: new Date().toISOString(),
        };
        saveContactMessage(formData);

        showSuccessModal();
        form.reset();
        clearAllValidation();
      })
      .catch(function (error) {
        alert(
          "Ocorreu um erro ao enviar a mensagem. Por favor, tenta novamente mais tarde.\nDetalhes: " +
            JSON.stringify(error)
        );
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
  }
}

function saveContactMessage(formData) {
  let messages = localStorage.getItem("mathpath-contact-messages");

  let messagesList = [];

  if (messages) {
    messagesList = JSON.parse(messages);
  }

  messagesList.push(formData);

  localStorage.setItem(
    "mathpath-contact-messages",
    JSON.stringify(messagesList)
  );
}

function showSuccessModal() {
  let modal = new bootstrap.Modal(document.getElementById("success-modal"));
  modal.show();
}

function setupRealTimeValidation() {
  let nameField = document.getElementById("name-field");
  let emailField = document.getElementById("email-field");
  let subjectField = document.getElementById("subject-field");
  let messageField = document.getElementById("message-field");

  nameField.addEventListener("input", function () {
    let value = this.value.trim();
    validateField("name-field", validateName, value);
  });

  emailField.addEventListener("input", function () {
    let value = this.value.trim();
    validateField("email-field", validateEmail, value);
  });

  subjectField.addEventListener("change", function () {
    let value = this.value;
    validateField("subject-field", validateSubject, value);
  });

  messageField.addEventListener("input", function () {
    let value = this.value.trim();
    validateField("message-field", validateMessage, value);
    updateCharacterCount();
  });
}

function clearAllValidation() {
  let fields = ["name-field", "email-field", "subject-field", "message-field"];

  for (let i = 0; i < fields.length; i++) {
    let field = document.getElementById(fields[i]);

    if (field) {
      field.classList.remove("is-valid");
      field.classList.remove("is-invalid");

      let feedbackDiv = field.parentNode.querySelector(".invalid-feedback");
      if (feedbackDiv) {
        feedbackDiv.textContent = "";
        feedbackDiv.style.display = "none";
      }
    }
  }
}

function updateCharacterCount() {
  let messageField = document.getElementById("message-field");
  let currentLength = messageField.value.length;
  let maxLength = 500;

  let countDiv = document.getElementById("char-count");

  if (!countDiv) {
    countDiv = document.createElement("div");
    countDiv.id = "char-count";
    countDiv.classList.add("form-text");
    messageField.parentNode.appendChild(countDiv);
  }

  countDiv.textContent = currentLength + " / " + maxLength + " caracteres";

  if (currentLength > maxLength) {
    countDiv.classList.add("text-danger");
  } else {
    countDiv.classList.remove("text-danger");
  }
}

window.addEventListener("load", function () {
  let form = document.getElementById("contact-form");
  form.addEventListener("submit", handleFormSubmit);

  form.addEventListener("reset", function () {
    setTimeout(function () {
      clearAllValidation();
    }, 0);
  });

  setupRealTimeValidation();
  updateCharacterCount();
});
