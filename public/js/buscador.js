// Evitar errores si no estamos en la página de productos
if (!document.querySelector('.watch-grid')) return;

document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        // Optional: Close menu when clicking a link
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });
    }

    // Filtering functionality
    const searchInput = document.querySelector('#search-input');
    const priceFilter = document.querySelector('#price-filter');
    const priceValue = document.querySelector('#price-value');
    const colorFilters = document.querySelectorAll('.filter-section input.checkbox');
    const watchCards = document.querySelectorAll('.watch-card');
    const watchGrid = document.querySelector('.watch-grid');

    const filtrar = () => {
        // Valor inicial del precio: usar 500000 si priceFilter.value no está disponible
        const maxPrice = priceFilter.value ? parseInt(priceFilter.value) : 250000;
        const texto = searchInput.value.toLowerCase().trim();
        const selectedColors = Array.from(colorFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let hayResultados = false;

        watchCards.forEach(card => {
            const nombre = card.querySelector('h3').textContent.toLowerCase();
            const precio = parseInt(card.dataset.price);
            const color = card.dataset.color;

            const pasaBusqueda = texto ? nombre.includes(texto) : true;
            const pasaPrecio = precio <= maxPrice;
            const pasaColor = selectedColors.length === 0 || selectedColors.includes(color);

            if (pasaBusqueda && pasaPrecio && pasaColor) {
                card.style.display = 'block';
                hayResultados = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Mostrar mensaje solo si no hay resultados
        const noResultsDiv = watchGrid.querySelector('.no-results');
        if (!hayResultados) {
            if (!noResultsDiv) {
                const div = document.createElement('div');
                div.className = 'no-results';
                div.innerHTML = '<p>No se encontraron relojes...</p>';
                watchGrid.appendChild(div);
            }
        } else if (noResultsDiv) {
            noResultsDiv.remove();
        }

        // Actualizar el valor del filtro de precio
        priceValue.textContent = `Hasta $${maxPrice.toLocaleString('en-US')}`;
    };

    // Inicializar el filtro de precio
    priceFilter.value = 250000; // Valor por defecto
    priceValue.textContent = `Hasta $${(250000).toLocaleString('en-US')}`;

    // Eventos
    searchInput.addEventListener('input', filtrar);
    priceFilter.addEventListener('input', filtrar);
    colorFilters.forEach(checkbox => {
        checkbox.addEventListener('change', filtrar);
    });

    // Ejecutar filtrado inicial
    filtrar();
});