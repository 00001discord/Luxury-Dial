let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Lista de productos disponibles
const products = {
    "Reloj 1": { name: "Aqua Eternal", price: 55120, image: "imagen/azul-claro.webp" },
    "Reloj 2": { name: "Celestial Vanguard", price: 82300, image: "imagen/azul-marino.webp" },
    "Reloj 3": { name: "Marine Sovereign", price: 120450, image: "imagen/azul-oscuro.webp" },
    "Reloj 4": { name: "Turquoise Dynamic", price: 65600, image: "imagen/azul-verde.webp" },
    "Reloj 5": { name: "Azure Serene", price: 28350, image: "imagen/azul.aquamarino.webp" },
    "Reloj 6": { name: "Indigo Regal", price: 32870, image: "imagen/azul.webp" },
    "Reloj 7": { name: "Onyx Imperial", price: 40250, image: "imagen/batmanpng.webp" },
    "Reloj 8": { name: "Pearl Urban", price: 21330, image: "imagen/blanco.webp" },
    "Reloj 9": { name: "Diamond Pure", price: 233470, image: "imagen/diamantes.webp" },
    "Reloj 10": { name: "Aureum Minimal", price: 110710, image: "imagen/dorado-clasico.webp" },
    "Reloj 11": { name: "Golden Celestial", price: 250000, image: "imagen/dorado.webp" },
    "Reloj 12": { name: "Aurum Nautical", price: 165000, image: "imagen/dorado2.webp" },
    "Reloj 13": { name: "Golden Essence", price: 135000, image: "imagen/dorado3.webp" },
    "Reloj 14": { name: "Ebony Silver", price: 13500, image: "imagen/negro.webp" },
    "Reloj 15": { name: "Shadow Exclusive", price: 210860, image: "imagen/negro2.webp" },
    "Reloj 16": { name: "Platinum Vibrant", price: 120170, image: "imagen/plata.webp" },
    "Reloj 17": { name: "Obsidian Nocturne", price: 48000, image: "imagen/rojo.webp" },
    "Reloj 18": { name: "Emerald Radiant", price: 85000, image: "imagen/verde.webp" },
    "Reloj 19": { name: "Verdant Gala", price: 175000, image: "imagen/verde2.webp" },
    "Reloj 20": { name: "Jade Marine", price: 200000, image: "imagen/verde3.webp" },
};

// Función para mostrar notificación
function showNotification(message, type = 'add') {
    const notifications = document.getElementById('notifications');
    if (!notifications) return;

    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        ${message}
        ${type === 'add' ? `<button class="go-to-cart" onclick="window.location.href='carrito.html'"><i class="fas fa-shopping-cart"></i></button>` : ''}
    `;

    notifications.appendChild(notification);

    // Mostrar con animación
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.5s ease forwards';
    }, 10);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => {
            notifications.removeChild(notification);
        }, 500);
    }, 3000);
}

// Función para agregar al carrito
function agregarAlCarrito(productId) {
    const product = products[productId];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
    showNotification(`Se agregó correctamente el reloj ${product.name} al carrito`, 'add');
}

// Función para actualizar la UI del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">El carrito se encuentra vacío</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toLocaleString()} USD</p>
                    <div class="quantity-control">
                        <button class="qty-btn minus" data-action="change" data-index="${index}" data-change="-1">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" data-action="update" data-index="${index}">
                        <button class="qty-btn plus" data-action="change" data-index="${index}" data-change="1">+</button>
                    </div>
                </div>
                <button class="remove-item" data-action="remove" data-index="${index}">Eliminar</button>
            `;
            cartItems.appendChild(itemElement);
        });
    }

    updateSummary();
}

// Función para cambiar la cantidad
function changeQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
}

// Función para actualizar la cantidad manualmente
function updateQuantity(index, value) {
    const newQuantity = parseInt(value) || 1;
    cart[index].quantity = Math.max(1, newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
}

// Función para eliminar un ítem
function removeItem(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
    showNotification(`Eliminaste del carrito el reloj ${removedItem.name}`, 'remove');
}

// Función para actualizar el resumen
function updateSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    if (!subtotalEl || !shippingEl || !totalEl) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = "GRATIS"; 
    const total = subtotal;

    subtotalEl.textContent = `$${subtotal.toLocaleString()} USD`;
    shippingEl.textContent = `${shipping.toLocaleString()}`;
    totalEl.textContent = `$${total.toLocaleString()} USD`;
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Función para finalizar compra con integración a backend
// ...existing code...
async function checkout() {
    if (cart.length === 0) {
        showNotification("El carrito está vacío. ¡Agrega algunos productos primero!", 'empty');
        return;
    }
    // Validar que el envío esté completado antes de permitir la compra
    if (localStorage.getItem('envioCompletado') !== 'true') {
        showNotification("Debes completar el formulario de envío antes de finalizar la compra.", 'error');
        // Opcional: redirigir automáticamente a la página de envío
        window.location.href = 'envio.html';
        return;
    }
    try {
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart })
        });
        const data = await response.json();
        if (data.init_point) {
            // Limpiar el flag para futuras compras
            localStorage.removeItem('envioCompletado');
            window.location.href = data.init_point;
        } else {
            alert("No se pudo iniciar el pago.");
        }
    } catch (error) {
        alert("Error al procesar la orden.");
        console.error(error);
    }
}
// ...existing code...

// Activar el menú hamburguesa
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.navbar').classList.toggle('active');
        });
    }

    updateCart();
    updateCartCount();

    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.addEventListener('click', function (e) {
            const target = e.target;

            // Botón de sumar/restar cantidad
            if (target.dataset.action === 'change') {
                const index = parseInt(target.dataset.index);
                const change = parseInt(target.dataset.change);
                changeQuantity(index, change);
            }

            // Botón de eliminar
            if (target.dataset.action === 'remove') {
                const index = parseInt(target.dataset.index);
                removeItem(index);
            }
        });

        // Manejo del cambio manual en el input (cantidad escrita a mano)
        cartItems.addEventListener('change', function (e) {
            const target = e.target;
            if (target.dataset.action === 'update') {
                const index = parseInt(target.dataset.index);
                updateQuantity(index, target.value);
            }
        });
    }

    // Botón checkout
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    const BotonEnvio = document.getElementById('Btn');

    if(BotonEnvio){
       botonEnvio.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'envio.html';
        });
    }
});