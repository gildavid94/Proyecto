// Validar que el objeto global de productos exista mediante el localStorage compartido
let productosAdmin = JSON.parse(localStorage.getItem("gamebyte_catalogo"));

// Mapeo amigable de las categorías
const nombresCategorias = {
    ps5: "PlayStation 5",
    xbox: "Xbox Series",
    nintendo: "Nintendo Switch",
    pc: "PC Gaming",
    accesorios: "Accesorios"
};
const formatearMoneda = (numero) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0 // Evita mostrar los centavos (,00) para que se vea limpio
  }).format(numero);
};

// Función para listar todos los artículos en el Panel del Administrador
function renderizarInventarioAdmin() {
    const contenedor = document.getElementById("admin-inventory-list");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    let hayProductos = false;

    for (const cat in productosAdmin) {
        productosAdmin[cat].forEach((producto, index) => {
            hayProductos = true;
            
            // Determinar texto y clase de la etiqueta especial
            let tagBadge = "";
            if (producto.tag === "new") tagBadge = '<span class="badge-status badge-new">Nuevo</span>';
            if (producto.tag === "pre") tagBadge = '<span class="badge-status badge-pre">Reserva</span>';

            const row = document.createElement("div");
            row.className = "item-admin-row";
            row.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/LogoColor.png'">
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-family: var(--font-display); font-size: 14px;">${producto.nombre}</h4>
                    <p style="margin: 4px 0; font-size: 12px; color: var(--text-secondary);">${nombresCategorias[cat]} ${tagBadge}</p>
                    <span style="color: var(--accent); font-weight: bold; font-size: 14px;">${producto.precioTexto}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px; background: #000; padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                    <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-family: var(--font-display);">Stock:</span>
                    
                    <button type="button" onclick="disminuirStock('${cat}', ${index})" class="stock-btn" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 14px; padding: 0 5px;">
                        <i class="fas fa-minus"></i>
                    </button>
                    
                    <strong style="font-family: var(--font-display); font-size: 14px; min-width: 20px; text-align: center; color: #fff;">${producto.stock}</strong>
                    
                    <button type="button" onclick="aumentarStock('${cat}', ${index})" class="stock-btn" style="background: none; border: none; color: #00ff66; cursor: pointer; font-size: 14px; padding: 0 5px;">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            contenedor.appendChild(row);
        });
    }

    if (!hayProductos) {
        contenedor.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">No hay productos en el catálogo.</p>';
    }
}

// Funciones globales para que el HTML reconozca el clic de los botones + y -
window.aumentarStock = function(categoria, index) {
    // 1. Incrementa el stock en el objeto de datos en memoria
    productosAdmin[categoria][index].stock++;
    
    // 2. Guarda el cambio en el LocalStorage (así impacta a index.html)
    actualizarBaseDeDatos(); 
    
    // 3. Vuelve a renderizar la lista en pantalla para ver el número actualizado en vivo
    renderizarInventarioAdmin(); 
};

window.disminuirStock = function(categoria, index) {
    // 1. Valida que no baje de cero
    if (productosAdmin[categoria][index].stock > 0) {
        productosAdmin[categoria][index].stock--;
        
        // 2. Guarda en LocalStorage
        actualizarBaseDeDatos();
        
        // 3. Actualiza la vista del administrador
        renderizarInventarioAdmin();
    } else {
        alert("El stock ya está en 0, no puede disminuir más.");
    }
};



// Función auxiliar indispensable por si no la tienes declarada de forma global
function actualizarBaseDeDatos() {
    localStorage.setItem("gamebyte_catalogo", JSON.stringify(productosAdmin));
}

// Función para cambiar las existencias de un artículo
window.cambiarStock = function(categoria, index) {
    const nuevoStock = prompt("Introduce las nuevas unidades en inventario:", productosAdmin[categoria][index].stock);
    if (nuevoStock === null || nuevoStock.trim() === "" || isNaN(nuevoStock)) return;

    productosAdmin[categoria][index].stock = parseInt(nuevoStock);
    actualizarBaseDeDatos();
};

// Función para dar de baja un producto
window.eliminarProducto = function(categoria, index) {
    if (confirm(`¿Seguro que deseas eliminar "${productosAdmin[categoria][index].nombre}" del catálogo?`)) {
        productosAdmin[categoria].splice(index, 1);
        actualizarBaseDeDatos();
    }
};

// Configuración del gráfico de ventas
const ctx = document.getElementById('ventasChart').getContext('2d');

new Chart(ctx, {
  type: 'line', // Tipo de gráfico: línea continua
  data: {
    labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'], // Meses
    datasets: [{
      label: 'Ventas ($)',
      data: [2100000, 3400000, 2900000, 4100000, 3800000, 4850000], // Valores de ventas
      borderColor: '#067380', // Color de la línea (Coral)
      backgroundColor: 'rgba(165, 94, 234, 0.1)',
      pointBackgroundColor: '#ffffff', // Relleno translúcido debajo de la línea
      borderWidth: 3,
      tension: 0.4, // Curvatura de la línea para que sea más suave
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false // Ocultamos la leyenda superior para un look más limpio
      }
    },
    scales: {
      x: {
        grid: { color: '#29292e' }, // Cuadrícula sutil oscura
        ticks: { color: '#a4a4a4' }
      },
      y: {
        grid: { color: '#29292e' },
        ticks: { color: '#a4a4a4' }
      }
    }
  }
});

// Guardar en LocalStorage y refrescar paneles
function actualizarBaseDeDatos() {
    localStorage.setItem("gamebyte_catalogo", JSON.stringify(productosAdmin));
    renderizarInventarioAdmin();
}

// Escuchar el formulario para añadir nuevos juegos/hardware
document.getElementById("admin-product-form").onsubmit = function(e) {
    e.preventDefault();

    const nombre = document.getElementById("p-name").value;
    const tag = document.getElementById("p-p-tag") ? document.getElementById("p-p-tag").value : document.getElementById("p-tag").value;
    const categoria = document.getElementById("p-category").value;
    const precioNum = parseFloat(document.getElementById("p-price").value);
    const urlImagen = document.getElementById("img1").value;

    // Generar un ID único simple
    const nuevoId = `${categoria}-${Date.now()}`;

    // Construir estructura del nuevo ítem
    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        genero: tag === "new" ? "Nuevo Lanzamiento" : tag === "pre" ? "Preventa Especial" : "Hardware / Juego",
        precioTexto: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precioNum),
        precioValor: precioNum,
        imagen: urlImagen,
        stock: 5, // Un stock por defecto inicial
        tag: tag
    };

    // Empujar en la categoría correspondiente
    productosAdmin[categoria].push(nuevoProducto);
    actualizarBaseDeDatos();

    // Resetear formulario
    this.reset();
    alert("¡Producto publicado exitosamente en la tienda!");
};

// Inicializar al cargar la página de administración
document.addEventListener("DOMContentLoaded", renderizarInventarioAdmin);