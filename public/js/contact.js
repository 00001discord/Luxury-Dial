document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Autocompletar email con loggedUser o desde la API
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser && emailInput) {
        emailInput.value = loggedUser;
    } else {
        fetch('/api/usuario')
            .then(res => res.json())
            .then(data => {
                if (data && data.email && emailInput) {
                    emailInput.value = data.email;
                }
            })
            .catch(() => {});
    }

    function validarCampo(inputElement, validationFunction, errorMessage) {
        const isValid = validationFunction(inputElement.value.trim());
        if (!isValid) {
            mostrarError(inputElement, errorMessage);
        } else {
            removerError(inputElement);
        }
        return isValid;
    }

    function validarEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
    }

    function validarMessage(value) {
        return value !== '';
    }

    function mostrarError(inputElement, mensaje) {
        removerError(inputElement);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        inputElement.classList.add('error-input');
    }

    function removerError(inputElement) {
        const errorDiv = inputElement.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        inputElement.classList.remove('error-input');
    }

    formulario.addEventListener('submit', function (event) {
        const esEmailValido = validarCampo(emailInput, validarEmail, 'Por favor, ingresa un correo electrónico válido.');
        const esMessageValido = validarCampo(messageInput, validarMessage, 'Por favor, ingresa tu mensaje.');

        if (!(esEmailValido && esMessageValido)) {
            event.preventDefault();
            alert('Por favor, corrige los errores en el formulario.');
            return;
        }

        fetch('https://formsubmit.co/joaquindevige25@gmail.com', {
            method: 'POST',
            body: new FormData(formulario)
        })
        .then(response => {
            if (response.ok) {
                alert('¡Mensaje enviado con éxito!');
                formulario.reset();
            } else {
                alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.');
            }
        })
        .catch(() => {
            alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.');
        });
    });
});