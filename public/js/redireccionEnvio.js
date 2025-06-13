document.addEventListener('DOMContentLoaded', function() {
    const botonEnvio = document.getElementById('Btn');

    if (botonEnvio) { 
        botonEnvio.addEventListener('click', function() {
            
            window.location.href = 'envio.html'; 
            
        });
    }
});