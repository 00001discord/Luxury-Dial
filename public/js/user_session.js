document.addEventListener("DOMContentLoaded", () => {
    const navbarIcons = document.querySelector(".navbar-icons");
    const loggedUser = localStorage.getItem("loggedUser");

    // Si hay usuario en localStorage, mostrarlo y no consultar la API
    if (loggedUser) {
        navbarIcons.innerHTML = `
            <span class="user-name"><i class="fa-solid fa-user"></i> Hola, ${loggedUser}</span>
            <a href="#" id="logout"><i class="fas fa-sign-out-alt" title="Cerrar sesión"></i></a>
            <a href="carrito.html"><i class="fas fa-shopping-cart"></i><span id="cart-count">0</span></a>
            <a href="envio.html"></a>
        `;
        const logoutBtn = document.getElementById("logout");
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedUser");
            location.reload();
        });
    } else {
        // Si no hay usuario en localStorage, consultar la API
        fetch('/api/usuario')
            .then(res => res.json())
            .then(data => {
                if (data.autenticado && data.email) {
                    navbarIcons.innerHTML = `
                        <span class="user-name"><i class="fa-solid fa-user"></i> Hola, ${data.email}</span>
                        <a href="#" id="logout"><i class="fas fa-sign-out-alt" title="Cerrar sesión"></i></a>
                        <a href="carrito.html"><i class="fas fa-shopping-cart"></i><span id="cart-count">0</span></a>
                        <a href="envio.html"></a>
                    `;
                    const logoutBtn = document.getElementById("logout");
                    logoutBtn.addEventListener("click", async () => {
                        // Llama al endpoint de logout del backend
                        await fetch('/logout', { method: 'POST' });
                        location.reload();
                        location.href = "/logout";
                        //window.location.href = "http://localhost:3000/";
                    });
                }
            })
            .catch(err => console.error('Error al verificar sesión:', err));
    }
});