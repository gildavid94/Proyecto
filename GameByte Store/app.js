/* 1. DEFINE LAS HERRAMIENTAS PRIMERO */
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
};

/* 2. LOS DATOS */
const productos = [
  { nombre: "Zelda", categoria: "nintendo", tipo: "juego", precio: 219900, img: "images/Zelda.webp" },
  { nombre: "CyberPunk", categoria: "nintendo", tipo: "juego", precio: 219900, img: "images/CyberPunknintendo.webp" },
  { nombre: "Halo", categoria: "xbox", tipo: "juego", precio: 149900, img: "images/Halo.webp" },
  { nombre: "PS5 Slim", categoria: "ps5", tipo: "consola", precio: 2500000, img: "images/ps5.webp" },
  { nombre: "Mouse Gamer", categoria: "pc", tipo: "accesorio", precio: 80000, img: "images/LogoColor.png" }
];

let tipoActual = "todos";

function filtrarTipo(tipo) {
  tipoActual = tipo;
  render();
}

/* 3. LA FUNCIÓN QUE DIBUJA */
function render() {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const filtrados = productos.filter(p => tipoActual === "todos" || p.tipo === tipoActual);

  filtrados.forEach(p => {
    contenedor.innerHTML += `
      <div class="ns-card">
        <div class="ns-cover">
          <img src="${p.img}" alt="${p.nombre}" onerror="this.src='images/LogoColor.png'">
        </div>
        <div class="ns-info">
          <div class="ns-meta">
            <p class="ns-name">${p.nombre}</p>
            <p class="ns-genre">${p.tipo.toUpperCase()} | ${p.categoria.toUpperCase()}</p>
          </div>
          <div class="ns-right">
            <span class="ns-price">${formatoMoneda(p.precio)}</span>
            <button class="ns-btn">Comprar</button>
          </div>
        </div>
      </div>`;
  });

   const track = document.getElementById("track");
      const dotsEl = document.getElementById("dots");
      const slides = track.querySelectorAll(".game-slide");
      let current = 0;

      function goTo(n) {
        current = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        }

      document.getElementById("prev").onclick = () => goTo(current - 1);
      document.getElementById("next").onclick = () => goTo(current + 1);

      let autoplay = setInterval(() => goTo(current + 1), 4000);
      track.addEventListener("mouseenter", () => clearInterval(autoplay));
      track.addEventListener("mouseleave", () => {
        autoplay = setInterval(() => goTo(current + 1), 4000);
      });
}

/* --- SISTEMA DE AUTENTICACIÓN Y ROLES --- */
let esModoRegistro = false;

// 1. Inicializar Admin por defecto si la "base de datos" está vacía
/* --- BUSCA ESTO EN TU app.js Y REEMPLÁZALO --- */

// 1. Inicializar base de datos de usuarios
function inicializarUsuarios() {
    if (!localStorage.getItem('usuarios')) {
        const adminInicial = [
            { 
                email: "admin@gamebyte.com", 
                pass: "admin123", 
                rol: "admin", 
                nombre: "Admin GameByte" 
            }
        ];
        localStorage.setItem('usuarios', JSON.stringify(adminInicial));
        console.log("Admin creado correctamente en LocalStorage");
    }
}

// Ejecutar la inicialización
inicializarUsuarios();

function cerrarSesion() {
    // Eliminamos solo al usuario activo, pero dejamos la lista de usuarios intacta
    localStorage.removeItem('usuarioActivo');
    alert("Sesión cerrada. ¡Vuelve pronto, Gamer!");
    location.reload(); // Refresca para mostrar el botón de Login otra vez
}

function toggleLogin() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.toggle('active');
  } else {
    console.error("No se encontró el elemento login-modal");
  }
}

// Cambiar entre Login y Registro
function switchAuthMode() {
    esModoRegistro = !esModoRegistro;
    const title = document.getElementById('auth-title');
    const nomGroup = document.getElementById('group-nombre');
    const btnSubmit = document.getElementById('auth-submit');
    const switchText = document.getElementById('auth-switch-text');
    const switchLink = document.getElementById('auth-switch-link');

    if (esModoRegistro) {
        title.innerHTML = "Crear <span>Cuenta</span>";
        nomGroup.style.display = "block";
        btnSubmit.innerText = "Registrarse";
        switchText.innerText = "¿Ya tienes cuenta?";
        switchLink.innerText = "Inicia sesión";
    } else {
        title.innerHTML = "Iniciar <span>Sesión</span>";
        nomGroup.style.display = "none";
        btnSubmit.innerText = "Ingresar";
        switchText.innerText = "¿No tienes cuenta?";
        switchLink.innerText = "Regístrate aquí";
    }
}

function procesarAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    
    // Obtenemos los usuarios de la base de datos local
    const usuariosRaw = localStorage.getItem('usuarios');
    const usuarios = JSON.parse(usuariosRaw);

    if (esModoRegistro) {
        // ... (tu lógica de registro)
    } else {
        // LÓGICA DE LOGIN
        console.log("Intentando entrar con:", email);
        
        const user = usuarios.find(u => u.email === email && u.pass === pass);
        
        if (user) {
            localStorage.setItem('usuarioActivo', JSON.stringify(user));
            alert("¡Éxito! Bienvenido " + user.nombre);
            location.reload(); // Recarga para activar el botón de admin
        } else {
            alert("Error: Correo o contraseña incorrectos. Revisa que el correo sea admin@gamebyte.com");
        }
    }
}

// Mostrar nombre del usuario en el header si está logueado
function comprobarSesion() {
    const user = JSON.parse(localStorage.getItem('usuarioActivo'));
    const headerActions = document.getElementById('header-actions');
    
    if (!headerActions) return;

    headerActions.innerHTML = ""; // Limpieza total

    if (user) {
        // --- SI HAY USUARIO ---
        if (user.rol === 'admin') {
            const btnAdmin = document.createElement('button');
            btnAdmin.className = 'ns-btn';
            btnAdmin.style.marginRight = '10px';
            btnAdmin.innerHTML = '<i class="fa-solid fa-gear"></i>';
            btnAdmin.onclick = toggleAdmin;
            headerActions.appendChild(btnAdmin);
        }

        const userName = document.createElement('span');
        userName.className = 'nav-btn';
        userName.style.color = 'var(--accent)';
        userName.innerText = user.nombre.split(' ')[0].toUpperCase();
        headerActions.appendChild(userName);

        const btnLogout = document.createElement('button');
        btnLogout.className = 'ns-btn';
        btnLogout.style.marginLeft = '15px';
        btnLogout.style.border = '1px solid #ff4b2b';
        btnLogout.style.color = '#ff4b2b';
        btnLogout.style.background = 'transparent';
        btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
        btnLogout.onclick = cerrarSesion;
        headerActions.appendChild(btnLogout);
    } else {
        // --- SI NO HAY USUARIO (BOTÓN LOGIN) ---
        const btnLogin = document.createElement('button'); // Usamos button para evitar problemas de enlace
        btnLogin.className = "btn-login";
        btnLogin.style.background = "transparent";
        btnLogin.style.border = "none";
        btnLogin.style.cursor = "pointer";
        btnLogin.innerText = "Login";
        btnLogin.onclick = () => toggleLogin(); // Llamada directa
        headerActions.appendChild(btnLogin);
    }

    // Carrito siempre al final
    const btnCart = document.createElement('a');
    btnCart.href = "#carrito";
    btnCart.className = "btn-cart";
    btnCart.style.marginLeft = "15px";
    btnCart.innerHTML = '<i class="fa-solid fa-cart-shopping"></i><span class="cart-badge">0</span>';
    headerActions.appendChild(btnCart);
}

// Asegúrate de llamar a la función al final del archivo
comprobarSesion();

// Abrir/Cerrar panel admin
function toggleAdmin() {
    document.getElementById('admin-modal').classList.toggle('active');
    if(document.getElementById('admin-modal').classList.contains('active')) {
        renderTablaAdmin();
    }
}

// Dibujar la tabla de productos para el Admin
function renderTablaAdmin() {
    const tabla = document.getElementById('tabla-admin-productos');
    tabla.innerHTML = `
        <tr style="border-bottom: 1px solid var(--accent); color: var(--accent); font-family: var(--font-display); font-size: 10px;">
            <th style="padding: 10px; text-align: left;">NOMBRE</th>
            <th style="padding: 10px; text-align: left;">PRECIO</th>
            <th style="padding: 10px; text-align: center;">ACCIONES</th>
        </tr>
    `;

    productos.forEach((p, index) => {
        tabla.innerHTML += `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 10px; font-size: 12px;">${p.nombre}</td>
                <td style="padding: 10px; font-size: 12px;">${formatoMoneda(p.precio)}</td>
                <td style="padding: 10px; text-align: center;">
                    <button class="ns-btn" style="padding: 4px 8px; background: orange;" onclick="alert('Editar ${p.nombre}')">✏️</button>
                    <button class="ns-btn" style="padding: 4px 8px; background: red;" onclick="alert('Eliminar ${p.nombre}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// Modificar la función de comprobarSesion para mostrar el botón de Admin
(function comprobarSesion() {
    const user = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (user) {
        const headerActions = document.querySelector('.header-actions');
        
        // Si es admin, le agregamos el botón de herramientas
        if (user.rol === 'admin') {
            const btnAdmin = document.createElement('button');
            btnAdmin.className = 'ns-btn';
            btnAdmin.style.marginRight = '10px';
            btnAdmin.innerHTML = '<i class="fa-solid fa-gear"></i>';
            btnAdmin.onclick = toggleAdmin;
            headerActions.prepend(btnAdmin);
        }
        
        const btnLogin = document.querySelector('.btn-login');
        if (btnLogin) btnLogin.innerText = user.nombre.split(' ')[0];
    }
})();

// 4. EJECUTAR AL CARGAR
render();