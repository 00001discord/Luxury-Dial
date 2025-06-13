import { validarCampo,emailRegex,passwordRegex,estadoValidacionCampos,enviarFormulario } from "./register.js"
const formLogin = document.querySelector(".form-login");
const inputEmail = document.querySelector(".form-login input[type = 'email']");
const inputPass = document.querySelector(".form-login input[type = 'password']");
const alertaErrorLogin =document.querySelector(".form-login .alerta-error");
const alertaExitoLogin = document.querySelector(".form-login .alerta-exito");
const cerrar = document.querySelector(".cerrar");

document.addEventListener("DOMContentLoaded", () =>{
    formLogin.addEventListener("submit", e =>{
        estadoValidacionCampos.userName = true;
        estadoValidacionCampos.userTel = true;
        e.preventDefault();
        enviarFormulario(formLogin,alertaErrorLogin,alertaExitoLogin)
    });


    inputEmail.addEventListener("input", () =>{
        validarCampo(emailRegex, inputEmail, "El email solo puede contener letras, números, puntos, guiones y guion bajo")
    })

    inputPass.addEventListener("input", () =>{
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 digitos")
    })
})
formLogin.addEventListener("submit", e => {
    e.preventDefault();

    // Simular un inicio de sesión correcto
    if (
        estadoValidacionCampos.userEmail &&
        estadoValidacionCampos.userPassword
    ) {
        const userEmailValue = inputEmail.value;

        // Guardamos el "nombre de usuario" simulado (puedes cambiar esto si tienes un backend)
        const userName = userEmailValue.split('@')[0]; // Ej: "juan123@gmail.com"
        localStorage.setItem("loggedUser", userEmailValue);

        alertaExitoLogin.style.display = "block";
        alertaErrorLogin.style.display = "none";

        setTimeout(() => {
            window.location.href = "index.html"; // Redirige al inicio
        }, 1000);
    } else {
        alertaErrorLogin.style.display = "block";
        alertaExitoLogin.style.display = "none";

        setTimeout(() => {
            alertaErrorLogin.style.display = "none";
        }, 2000);
    }
});





