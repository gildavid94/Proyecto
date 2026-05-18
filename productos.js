// 1. Intentar cargar los productos desde el LocalStorage. Si no hay nada, usar el catálogo por defecto.
let productos = JSON.parse(localStorage.getItem("gamebyte_catalogo"));

if (!productos) {
  productos = {
    nintendo: [
      {
        id: "ns-01",
        nombre: "Cyberpunk 2077",
        genero: "Aventura · RPG · Nintendo",
        precioTexto: "$219.900 COP",
        precioValor: 219900,
        imagen: "images/CyberPunknintendo.webp",
        stock: 10,
        tag: "none"
      },
      {
        id: "ns-02",
        nombre: "The Legend of Zelda: Tears of the Kingdom",
        genero: "Aventura · Acción · Nintendo",
        precioTexto: "$289.900 COP",
        precioValor: 289900,
        imagen:"/images/zeldaswitch.jpg", 
        stock: 5,
        tag: "none"
      },
      {
        id: "ns-03",
        nombre: "Super Mario Bros. Wonder",
        genero: "Plataformas · Familiar · Nintendo",
        precioTexto: "$249.900 COP",
        precioValor: 249900,
        imagen:"/images/marioswitch.jpg",
        stock: 3, 
        tag: "new"
      }
    ],
    pc: [
      {
        id: "pc-01",
        nombre: "Torre RTX 4060 Ti",
        genero: "Ryzen 7 · 16GB RAM · SSD 1TB",
        precioTexto: "$4.200.000 COP",
        precioValor: 4200000,
        imagen: "images/rtx4060.webp",
        stock: 3,
        tag: "none"
      },
      {
        id: "pc-02",
        nombre: "PC Ultra Gaming",
        genero: "RTX 4080 · 32GB RAM · Intel i9",
        precioTexto: "$8.500.000 COP",
        precioValor: 8500000,
        imagen: "images/rtx4080.jpg",
        stock: 20,
        tag: "none"
      },
      {
        id: "pc-03",
        nombre: "Laptop Gamer ASUS ROG",
        genero: "RTX 4070 · Ryzen 9 · 16' QHD",
        precioTexto: "$6.199.900 COP",
        precioValor: 6199900,
        imagen:"/images/asusrog.webp" ,
        stock: 4,
        tag: "none"
      }
    ],
    accesorios: [
      {
        id: "acc-01",
        nombre: "Teclado Mecánico RGB",
        genero: "Switches Red · Anti-ghosting",
        precioTexto: "$280.000 COP",
        precioValor: 280000,
        imagen: "images/rgbmecanico.jpg",
        stock: 10,
        tag: "none"
      },
      {
        id: "acc-02",
        nombre: "Mouse Gamer Logitech G502 X",
        genero: "25K DPI · Ergonómico · RGB",
        precioTexto: "$320.000 COP",
        precioValor: 320000,
        imagen: "/images/mouseg502.jpg",
        stock: 15,
        tag: "none"
      },
      {
        id: "acc-03",
        nombre: "Auriculares HyperX Cloud III",
        genero: "Audio Espacial · Mic Shure · PC/Consola",
        precioTexto: "$450.000 COP",
        precioValor: 450000,
        imagen: "/images/audifonohyperx.jpg",
        stock: 10,
        tag: "none"
      }
    ],
    ps5: [
      {
        id: "ps5-01",
        nombre: "Marvel's Spider-Man 2",
        genero: "Acción · Aventura · Insomniac Games",
        precioTexto: "$299.000 COP",
        precioValor: 299000,
        imagen: "images/spider2.png",
        stock: 8,
        tag: "none"
      },
      {
        id: "ps5-02",
        nombre: "Elden Ring: Shadow of the Erdtree",
        genero: "RPG · Acción · FromSoftware",
        precioTexto: "$349.900 COP",
        precioValor: 349900,
        imagen: "/images/eldenringps5.jpg",
        stock: 12,
        tag: "new"
      },
      {
        id: "ps5-03",
        nombre: "GTA VI (Pre-orden)",
        genero: "Mundo Abierto · Acción · Rockstar Games",
        precioTexto: "$399.900 COP",
        precioValor: 399900,
        imagen: "/images/gta6.jpg",
        stock: 50,
        tag: "pre" 
      }
    ],
    xbox: [
      {
        id: "xbox-01",
        nombre: "Forza Horizon 6",
        genero: "Carreras · Mundo Abierto · Playground Games",
        precioTexto: "$239.900 COP",
        precioValor: 239900,
        imagen: "images/Forza_Horizon_6_XSX.png",
        stock: 12,
        tag: "none"
      },
      {
        id: "xbox-02",
        nombre: "Halo Infinite",
        genero: "Shooter · Sci-Fi · 343 Industries",
        precioTexto: "$180.000 COP",
        precioValor: 180000,
        imagen:"/images/haloxbox.jpg" ,
        stock: 3, 
        tag: "none"
      },
      {
        id: "xbox-03",
        nombre: "Fable",
        genero: "RPG · Fantasía · Playground Games",
        precioTexto: "$299.900 COP",
        precioValor: 299000,
        imagen: "/images/fable.jpg",
        stock: 15,
        tag: "pre"
      }
    ]
  };
  // Guardar la base inicial por primera vez
  localStorage.setItem("gamebyte_catalogo", JSON.stringify(productos));
}

// 2. Función para dar formato de moneda en pesos colombianos
const formatoCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(valor);
};

// 3. Función para renderizar los productos en la tienda (index.html)
function renderizarProductos() {
  for (const categoria in productos) {
    const contenedor = document.querySelector(`#${categoria} .product-list`);
    
    if (contenedor) {
      contenedor.innerHTML = "";
      
      productos[categoria].forEach(producto => {
        // Lógica de stock y etiquetas especiales combinadas
        let badgeHTML = "";
        let btnDisabled = "";
        let btnText = "Comprar";

        // Evaluar etiquetas del admin (Nuevo o Preventa)
        if (producto.tag === "new") {
          badgeHTML = `<span class="badge badge-new" style="background:#00ff88; color:#000; position:absolute; top:10px; left:10px; padding:3px 8px; font-size:10px; font-weight:bold; border-radius:4px; z-index:5;">NUEVO</span>`;
        } else if (producto.tag === "pre") {
          badgeHTML = `<span class="badge badge-pre" style="background:#ffaa00; color:#000; position:absolute; top:10px; left:10px; padding:3px 8px; font-size:10px; font-weight:bold; border-radius:4px; z-index:5;">PREVENTA</span>`;
        }

        // Sobrescribir con agotado si el stock es cero
        if (producto.stock === 0) {
          badgeHTML = `<span class="badge badge-soldout" style="background:#ff4444; color:#fff; position:absolute; top:10px; left:10px; padding:3px 8px; font-size:10px; font-weight:bold; border-radius:4px; z-index:5;">AGOTADO</span>`;
          btnDisabled = "disabled";
          btnText = "Sin Stock";
        } else if (producto.stock <= 3) {
          badgeHTML = `<span class="badge badge-low" style="background:#ffea00; color:#000; position:absolute; top:10px; left:10px; padding:3px 8px; font-size:10px; font-weight:bold; border-radius:4px; z-index:5;">¡ÚLTIMAS ${producto.stock}!</span>`;
        }

        const cardHTML = `
          <div class="product-card" style="position:relative; ${producto.stock === 0 ? 'opacity:0.7;' : ''}">
            <div class="product-cover">
              ${badgeHTML}
              <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/LogoColor.png'"/>
            </div>
            <div class="product-info">
              <div class="product-meta">
                <p class="product-name">${producto.nombre}</p>
                <p class="product-genre">${producto.genero}</p>
              </div>
              <div class="product-right">
                <span class="product-price">${producto.precioTexto}</span>
                <button
                  class="buy-btn"
                  ${btnDisabled}
                  onclick="agregarAlCarrito('${producto.nombre.replace(/'/g, "\\'")}', ${producto.precioValor}, '${producto.imagen}')"
                >
                  ${btnText}
                </button>
              </div>
            </div>
          </div>
        `;
        contenedor.innerHTML += cardHTML;
      });
    }
  }
}

// Ejecutar si estamos en index.html
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", renderizarProductos);
} else {
    renderizarProductos();
}