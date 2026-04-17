/* 1. DEFINE LAS HERRAMIENTAS PRIMERO */
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
};

const track = document.getElementById("track");
      const dotsEl = document.getElementById("dots");
      const slides = track.querySelectorAll(".game-slide");
      let current = 0;

      slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "dot" + (i === 0 ? " active" : "");
        d.onclick = () => goTo(i);
        dotsEl.appendChild(d);
      });

      function goTo(n) {
        current = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsEl
          .querySelectorAll(".dot")
          .forEach((d, i) => d.classList.toggle("active", i === current));
      }

      document.getElementById("prev").onclick = () => goTo(current - 1);
      document.getElementById("next").onclick = () => goTo(current + 1);

      let autoplay = setInterval(() => goTo(current + 1), 4000);
      track.addEventListener("mouseenter", () => clearInterval(autoplay));
      track.addEventListener("mouseleave", () => {
        autoplay = setInterval(() => goTo(current + 1), 4000);
      });