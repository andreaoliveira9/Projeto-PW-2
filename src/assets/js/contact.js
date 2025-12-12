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

  let feedbackDiv =
    field.parentNode.getElementsByClassName("invalid-feedback")[0];
  if (!feedbackDiv) {
    field.parentNode.innerHTML += '<div class="invalid-feedback"></div>';
    field = document.getElementById(fieldId);
    feedbackDiv =
      field.parentNode.getElementsByClassName("invalid-feedback")[0];
    field.focus();
    let val = field.value;
    field.value = "";
    field.value = val;
  }

  feedbackDiv.innerText = errorMessage;
  feedbackDiv.style.display = "block";
}

function showFieldSuccess(fieldId) {
  let field = document.getElementById(fieldId);
  field.classList.remove("is-invalid");
  field.classList.add("is-valid");

  let feedbackDiv =
    field.parentNode.getElementsByClassName("invalid-feedback")[0];
  if (feedbackDiv) {
    feedbackDiv.innerText = "";
    feedbackDiv.style.display = "none";
  }
}

function validateField(fieldId, errorMessage) {
  if (errorMessage !== "") {
    showFieldError(fieldId, errorMessage);
    return false;
  } else {
    showFieldSuccess(fieldId);
    return true;
  }
}

function onInputName(input) {
  validateField("name-field", validateName(input.value.trim()));
}

function onInputEmail(input) {
  validateField("email-field", validateEmail(input.value.trim()));
}

function onChangeSubject(input) {
  validateField("subject-field", validateSubject(input.value));
}

function onInputMessage(input) {
  validateField("message-field", validateMessage(input.value.trim()));
  updateCharacterCount();
}

function handleFormSubmit() {
  let form = document.getElementById("contact-form");
  let submitButton = document.getElementById("contact-submit-btn");
  if (!submitButton) {
    let btns = form.getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].type === "submit") {
        submitButton = btns[i];
        break;
      }
    }
  }

  let originalButtonText = submitButton.innerHTML;

  let nameValue = document.getElementById("name-field").value.trim();
  let emailValue = document.getElementById("email-field").value.trim();
  let subjectValue = document.getElementById("subject-field").value;
  let messageValue = document.getElementById("message-field").value.trim();

  let isNameValid = validateField("name-field", validateName(nameValue));
  let isEmailValid = validateField("email-field", validateEmail(emailValue));
  let isSubjectValid = validateField(
    "subject-field",
    validateSubject(subjectValue)
  );
  let isMessageValid = validateField(
    "message-field",
    validateMessage(messageValue)
  );

  if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
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
          name: nameValue,
          email: emailValue,
          subject: subjectValue,
          message: messageValue,
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
  let modalElement = document.getElementById("success-modal");
  if (typeof bootstrap !== "undefined" && modalElement) {
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

function clearAllValidation() {
  let fields = ["name-field", "email-field", "subject-field", "message-field"];
  for (let i = 0; i < fields.length; i++) {
    let field = document.getElementById(fields[i]);
    if (field) {
      field.classList.remove("is-valid");
      field.classList.remove("is-invalid");
      let feedbackDiv =
        field.parentNode.getElementsByClassName("invalid-feedback")[0];
      if (feedbackDiv) {
        feedbackDiv.innerText = "";
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
    messageField.parentNode.innerHTML +=
      '<div id="char-count" class="form-text"></div>';
    messageField = document.getElementById("message-field");
    countDiv = document.getElementById("char-count");
    messageField.focus();
    let val = messageField.value;
    messageField.value = "";
    messageField.value = val;
  }

  countDiv.innerText = currentLength + " / " + maxLength + " caracteres";
  if (currentLength > maxLength) {
    countDiv.classList.add("text-danger");
  } else {
    countDiv.classList.remove("text-danger");
  }
}

function onFormReset() {
  setTimeout(function () {
    clearAllValidation();
  }, 0);
}

var oldOnLoadContact = window.onload;
window.onload = function () {
  if (oldOnLoadContact) {
    oldOnLoadContact();
  }
  updateCharacterCount();
};
