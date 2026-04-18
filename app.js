/* 1. CONFIGURACIÓN INICIAL */
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
};

// Elementos del DOM
const track = document.getElementById("track");
const dotsEl = document.getElementById("dots");
const slides = track.querySelectorAll(".game-slide");
let current = 0;

/* 2. LÓGICA DEL CARRUSEL */
slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
});

function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === current));
}

document.getElementById("prev").onclick = () => goTo(current - 1);
document.getElementById("next").onclick = () => goTo(current + 1);

let autoplay = setInterval(() => goTo(current + 1), 4000);
track.addEventListener("mouseenter", () => clearInterval(autoplay));
track.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => goTo(current + 1), 4000);
});

/* 3. FILTRADO DE CATEGORÍAS */
document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".product-section");

    navButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const href = btn.getAttribute("href");
            if (!href.startsWith("#")) return; // Ignorar si no es un link interno

            e.preventDefault();
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const targetId = href.substring(1);

            sections.forEach((section) => {
                if (targetId === "all") {
                    section.classList.remove("section-hidden");
                } else if (section.id === targetId) {
                    section.classList.remove("section-hidden");
                } else {
                    section.classList.add("section-hidden");
                }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});

/* 4. CARRITO Y MODAL */
window.toggleCart = function() {
    const cart = document.getElementById('cart-sidebar');
    cart.classList.toggle('active');
};

window.abrirCheckout = function() {
    const modal = document.getElementById('checkout-modal');
    const cart = document.getElementById('cart-sidebar');

    if (cart) cart.classList.remove('active'); // Cierra carrito

    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('modal-hidden');
    }
};

/* 4. CARRITO Y MODAL (Actualizado) */

// Función para limpiar el formulario y volver al estado inicial
/* Lógica de Reset Refinada */
window.resetearCheckout = function() {
    const guestForm = document.getElementById('guest-form');
    const postOptions = document.getElementById('post-purchase-options');
    const btnOtraCompra = document.getElementById('btn-otra-compra');
    
    if (guestForm) {
        guestForm.reset(); // Limpia los inputs
        guestForm.style.display = 'block'; // Muestra el form de nuevo
    }
    
    if (postOptions) {
        postOptions.classList.add('modal-hidden'); // Oculta mensaje de éxito
    }

    if (btnOtraCompra) {
        btnOtraCompra.classList.add(''); // Oculta el botón de "otra compra"
    }
};

window.cerrarModal = function() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('modal-hidden');
        window.resetearCheckout(); // Deja todo listo para la próxima vez
    }
};
// Dentro del DOMContentLoaded, actualizamos el onsubmit
document.addEventListener("DOMContentLoaded", () => {
    const guestForm = document.getElementById('guest-form');
    const postOptions = document.getElementById('post-purchase-options');

    if (guestForm) {
        guestForm.onsubmit = (e) => {
            e.preventDefault();
            
            // Simulación de procesamiento de datos
            console.log("Compra procesada con éxito");

            // Ocultar formulario y mostrar éxito
            guestForm.style.display = 'none';
            if (postOptions) postOptions.classList.remove('modal-hidden');
            if (btnOtraCompra) {
        btnOtraCompra.classList.add('modal-hidden'); // Lo ocultamos de nuevo
    }
        };
    }
});

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") cerrarModal();
});


/* --- LÓGICA DINÁMICA DEL CARRITO --- */

let carrito = []; // Nuestra lista de compras

window.agregarAlCarrito = function(nombre, precio, imagen) {
    // 1. Crear el objeto del producto
    const producto = {
        id: Date.now(), // ID único basado en el tiempo
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };

    // 2. Empujar al arreglo
    carrito.push(producto);

    // 3. Actualizar la interfaz
    renderizarCarrito();
    actualizarContador();
    
    // Opcional: Abrir el carrito automáticamente al agregar
    const cartSidebar = document.getElementById('cart-sidebar');
    if(!cartSidebar.classList.contains('active')) toggleCart();
};

window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderizarCarrito();
    actualizarContador();
};

function actualizarContador() {
    const badge = document.querySelector('.cart-badge');
    if(badge) badge.innerText = carrito.length;
}

function renderizarCarrito() {
    const contenedor = document.getElementById('cart-items-container');
    const totalElemento = document.getElementById('cart-total-amount');
    
    // Limpiar contenedor
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
        totalElemento.innerText = formatoMoneda(0);
        return;
    }

    let totalAcumulado = 0;

    carrito.forEach(item => {
        totalAcumulado += item.precio;
        
        const div = document.createElement('div');
        div.className = 'cart-item'; // Asegúrate de darle estilo en CSS
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; border-radius: 4px;">
            <div class="item-info">
                <p>${item.nombre}</p>
                <span>${formatoMoneda(item.precio)}</span>
            </div>
            <button onclick="eliminarDelCarrito(${item.id})" class="remove-btn">×</button>
        `;
        contenedor.appendChild(div);
    });

    totalElemento.innerText = formatoMoneda(totalAcumulado);
}


/* --- FUNCIONES DEL CARRITO --- */

window.vaciarCarrito = function() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        carrito = [];
        renderizarCarrito();
        actualizarContador();
    }
};

// Modificamos la función de agregar para que se oculte solo
window.agregarAlCarrito = function(nombre, precio, imagen) {
    const producto = { id: Date.now(), nombre, precio, imagen };
    carrito.push(producto);

    renderizarCarrito();
    actualizarContador();
    
    // 1. Abrir el carrito para dar feedback visual
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('active');

    // 2. AUTO-OCULTAR: Se cierra solo tras 2.5 segundos
    // Limpiamos cualquier temporizador previo para que no se cierre antes de tiempo
    if (window.cartTimeout) clearTimeout(window.cartTimeout);
    
    window.cartTimeout = setTimeout(() => {
        cartSidebar.classList.remove('active');
    }, 2500); 
};


