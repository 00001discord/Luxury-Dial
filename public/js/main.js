document.addEventListener("DOMContentLoaded", function () {
    // Botón checkout
    const checkoutBtn = document.getElementById("checkout");
    const watchGrid = document.getElementById('watch-grid');
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            checkout();
        });
    }
    if (watchGrid) {
        watchGrid.addEventListener('click', function (e) {
            const card = e.target.closest('.watch-card');
            if (!card) return;

            // Si el click fue en el botón, agregar al carrito
            if (e.target.classList.contains('agregarAlCarrito')) {
                e.stopPropagation();
                const nombre = e.target.dataset.productName;
                agregarAlCarrito(nombre);
                return;
            }

            // Si el click fue en la tarjeta (pero no en el botón), ir al detalle
            const id = card.dataset.id;
            if (id) {
                goToProductPage(id);
            }
        });
    }

    // Botón eliminar
    document.querySelectorAll(".remove-product").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;
            removeProduct(id);
        });
    });

    // Botón aumentar cantidad
    document.querySelectorAll(".increase-quantity").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;
            increaseQuantity(id);
        });
    });

    // Botón disminuir cantidad
    document.querySelectorAll(".decrease-quantity").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;
            decreaseQuantity(id);
        });
    });
});


// Escuchar clicks para agregar al carrito
document.querySelectorAll('.agregarAlCarrito').forEach(btn => {
    btn.addEventListener('click', event => {
        event.stopPropagation();
        const nombre = btn.dataset.productName;
        agregarAlCarrito(nombre);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginButton");
    if (loginBtn) {
        loginBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Evita que redireccione si no querés que lo haga aún
            toggleLogin(); // Ejecuta tu función
        });
    }
});