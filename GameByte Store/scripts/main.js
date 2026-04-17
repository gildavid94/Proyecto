// Contador del carrito. Cuando el usuario haga clic en el botón de agregar al carrito, se incrementará el contador//

// === PASO 1: SELECCIÓN DE ELEMENTOS ===
// Usamos querySelector para el badge porque es único
const cartBadge = document.querySelector('.cart-badge');
// Usamos querySelectorAll para capturar todos los botones de carrito que creamos
const addButtons = document.querySelectorAll('.ns-btn-cart');

// === PASO 2: VARIABLE DE ESTADO ===
// Esta variable vive en la memoria del navegador mientras la página esté abierta
let contadorCarrito = 0;

// === PASO 3: LÓGICA DE ACTUALIZACIÓN ===
function agregarAlCarrito() {
    // Incrementamos el valor
    contadorCarrito++;
    
    // Modificamos el DOM para mostrar el nuevo número
    cartBadge.textContent = contadorCarrito;
    
    // UX: Un pequeño feedback visual para que el usuario sepa que algo pasó
    animarBadge();
}

function animarBadge() {
    cartBadge.style.transform = "scale(1.3)";
    cartBadge.style.transition = "transform 0.2s ease";
    
    // Después de 200ms (0.2s), vuelve a su tamaño normal
    setTimeout(() => {
        cartBadge.style.transform = "scale(1)";
    }, 200);
}

// === PASO 4: ASIGNAR EL "OÍDO" (EVENT LISTENER) ===
// Como addButtons es una lista de elementos, tenemos que recorrerla
addButtons.forEach((boton) => {
    boton.addEventListener('click', () => {
        // Cada vez que se haga click en un botón, llamamos a la función
        agregarAlCarrito();
    });
});
