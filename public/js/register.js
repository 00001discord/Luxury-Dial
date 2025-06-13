const formRegister = document.querySelector(".form-register");
const inputUser = document.querySelector(".form-register input[type='text']");
const inputEmail = document.querySelector(".form-register input[type = 'email']");
const inputPass = document.querySelector(".form-register input[type = 'password']");
const alertaError =document.querySelector(".alerta-error");
const alertaExito = document.querySelector(".alerta-exito");

const userNameRegex = /^[a-zA-Z0-9\_\-]{4,16}$/;
export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const passwordRegex = /^.{4,12}$/;

export const estadoValidacionCampos ={
    userName: false,
    userEmail: false,
    userPassword: false,
};

document.addEventListener("DOMContentLoaded", () =>{
    formRegister.addEventListener("submit", e =>{
        e.preventDefault();
        enviarFormulario(formRegister,alertaError,alertaExito)
    });

    inputUser.addEventListener("input", () =>{
        validarCampo(userNameRegex, inputUser,"El usuario tiene que ser de 4 a 16 digitos y solo puede contener, letras y guion bajo.")
    })

    inputEmail.addEventListener("input", () =>{
        validarCampo(emailRegex, inputEmail, "El email solo puede contener letras, números, puntos, guiones y guion bajo")
    })

    inputPass.addEventListener("input", () =>{
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 digitos")
    })

})

export function validarCampo(regularExpresion, campo, mensaje){
    const validarCampo = regularExpresion.test(campo.value);
    if(validarCampo){
        eliminarAlerta(campo.parentElement.parentElement)
        estadoValidacionCampos[campo.name] = true;
        campo.parentElement.classList.remove("error");
        return;
    }
    estadoValidacionCampos[campo.name] = false;
    mostrarAlerta(campo.parentElement.parentElement,mensaje)
    campo.parentElement.classList.add("error");
}

function mostrarAlerta(referencia,mensaje){
    eliminarAlerta(referencia)
    const alertaDiv = document.createElement("div");
    alertaDiv.classList.add("alerta")
    alertaDiv.textContent = mensaje;
    referencia.appendChild(alertaDiv)
}
function eliminarAlerta(referencia){
    const alerta = referencia.querySelector(".alerta");
    
    if(alerta){
        alerta.remove()
    }
    
}

export async function enviarFormulario(form) {
    if (estadoValidacionCampos.userName && estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
        const formData = new FormData(form);
        const data = {
            usuario: formData.get('userName'),
            email: formData.get('userEmail'),
            contraseña: formData.get('userPassword'),
        };

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alertaExito.style.display = "block";
                alertaError.style.display = "none";
                form.reset();
                Object.keys(estadoValidacionCampos).forEach(key => {
                    estadoValidacionCampos[key] = false;
                });
            } else {
                alertaError.textContent = result.mensaje || result.error || 'Error al registrar el usuario';
                alertaError.style.display = "block";
                alertaExito.style.display = "none";
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alertaError.textContent = 'Error al conectar con el servidor';
            alertaError.style.display = "block";
            alertaExito.style.display = "none";
        }
        return;
    }
}
