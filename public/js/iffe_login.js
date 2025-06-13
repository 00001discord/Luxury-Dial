(function (){
const formLogin = document.querySelector(".form-login");
const inputUser = document.querySelector(".form-login input[type='text']");
const inputEmail = document.querySelector(".form-login input[type = 'email']");
const inputPass = document.querySelector(".form-login input[type = 'password']");
const inputTel = document.querySelector(".form-login input[type = 'tel']");
const alertaError =document.querySelector(".form-login .alerta-error");
const alertaExito = document.querySelector(".form-login .alerta-exito");

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordRegex = /^.{4,12}$/;

const estadoValidacionCampos ={

    userEmail: false,
    userPassword: false,

};

document.addEventListener("DOMContentLoaded", () =>{
    formLogin.addEventListener("submit", e =>{
        e.preventDefault();
        enviarFormulario()
    });


    inputEmail.addEventListener("input", () =>{
        validarCampo(emailRegex, inputEmail, "El email solo puede contener letras, números, puntos, guiones y guion bajo")
    })

    inputPass.addEventListener("input", () =>{
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 digitos")
    })

})

function validarCampo(regularExpresion, campo, mensaje){
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

function enviarFormulario(){
    if(estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword){
            alertaExito.style.display = "block";
            alertaError.style.display = "none";
            formLogin.reset();

        return;
    }
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
}

})();