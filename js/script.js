// ============================================
// VARIABLES GLOBALES
// ============================================

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const header = document.getElementById("header");

// Números de WhatsApp
const whatsappNumbers = {
  primary: "573176750772",
  secondary: "573502838010",
};

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ============================================
// BUSCADOR MEJORADO CON SUGERENCIAS
// ============================================

const searchSuggestions = document.getElementById("searchSuggestions");
const popularSearches = document.getElementById("popularSearches");
const noResults = document.getElementById("noResults");

// Datos de sugerencias
const suggestions = [
  {
    text: "Sábana Texturizada Relieve Geométrico",
    category: "Texturizada",
    keywords: ["texturizada", "relieve", "geometrico", "textura"],
  },
  {
    text: "Sábana Suave Premium",
    category: "Lisa",
    keywords: ["lisa", "suave", "premium", "clasica"],
  },
  {
    text: "Sábana Estampada Diseños Exclusivos",
    category: "Estampada",
    keywords: ["estampada", "diseño", "exclusivo", "divertida"],
  },
  {
    text: "Color Azul",
    category: "Color",
    keywords: ["azul", "azul oscuro", "azul suave"],
  },
  {
    text: "Color Gris",
    category: "Color",
    keywords: ["gris", "gris oscuro", "gris perla"],
  },
  {
    text: "Color Rosa",
    category: "Color",
    keywords: ["rosa", "rosado", "rosa suave"],
  },
  {
    text: "Color Negro",
    category: "Color",
    keywords: ["negro", "negro suave"],
  },
  {
    text: "Color Blanco",
    category: "Color",
    keywords: ["blanco", "blanco suave"],
  },
  {
    text: "Diseño Donas",
    category: "Estampada",
    keywords: ["donas", "dulces"],
  },
  {
    text: "Diseño Huellitas",
    category: "Estampada",
    keywords: ["huellitas", "mascotas", "perro", "gato"],
  },
  {
    text: "Diseño Barbie",
    category: "Estampada",
    keywords: ["barbie", "muñeca"],
  },
  {
    text: "Diseño Corazones",
    category: "Estampada",
    keywords: ["corazones", "amor"],
  },
  {
    text: "Diseño Stitch",
    category: "Estampada",
    keywords: ["stitch", "disney"],
  },
];

// Placeholder dinámico
const placeholders = [
  "Buscar sábanas...",
  "Ej: texturizada, lisa, estampada",
  "Ej: gris, rosa, azul",
  "Ej: donas, huellitas, stitch",
  "Buscar por color o diseño...",
];

let placeholderIndex = 0;

const changePlaceholder = () => {
  searchInput.placeholder = placeholders[placeholderIndex];
  placeholderIndex = (placeholderIndex + 1) % placeholders.length;
};

// Cambiar placeholder cada 3 segundos
setInterval(changePlaceholder, 3000);

// Mostrar búsquedas populares al hacer focus
searchInput.addEventListener("focus", () => {
  if (searchInput.value.trim() === "") {
    popularSearches.classList.add("active");
    searchSuggestions.classList.remove("active");
  }
});

// Ocultar búsquedas populares al perder focus (con delay para permitir clicks)
searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    popularSearches.classList.remove("active");
    searchSuggestions.classList.remove("active");
  }, 200);
});

// Búsqueda con sugerencias en tiempo real
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();

  // Ocultar búsquedas populares si hay texto
  if (searchTerm !== "") {
    popularSearches.classList.remove("active");
  } else {
    popularSearches.classList.add("active");
    searchSuggestions.classList.remove("active");
    noResults.style.display = "none";
  }

  // Filtrar productos
  let visibleCount = 0;

  productCards.forEach((card) => {
    const productName = card.getAttribute("data-name").toLowerCase();
    const category = card.getAttribute("data-category").toLowerCase();

    if (productName.includes(searchTerm) || category.includes(searchTerm)) {
      card.classList.remove("hidden");
      card.style.animation = "fadeInUp 0.5s ease";
      visibleCount++;
    } else {
      card.classList.add("hidden");
    }
  });

  // Mostrar sugerencias
  if (searchTerm !== "") {
    const matchedSuggestions = suggestions.filter(
      (s) =>
        s.keywords.some((k) => k.includes(searchTerm)) ||
        s.text.toLowerCase().includes(searchTerm),
    );

    if (matchedSuggestions.length > 0) {
      displaySuggestions(matchedSuggestions);
    } else {
      searchSuggestions.classList.remove("active");
    }
  }

  // Mostrar mensaje de "sin resultados"
  if (searchTerm !== "" && visibleCount === 0) {
    noResults.style.display = "block";
    document.getElementById("searchTerm").textContent = searchTerm;
  } else {
    noResults.style.display = "none";
  }
});

// Función para mostrar sugerencias
const displaySuggestions = (matchedSuggestions) => {
  searchSuggestions.innerHTML = "";

  matchedSuggestions.slice(0, 5).forEach((suggestion) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.innerHTML = `
            <i class="fas fa-search"></i>
            <span class="suggestion-text">${suggestion.text}</span>
            <span class="suggestion-category">${suggestion.category}</span>
        `;

    suggestionItem.addEventListener("click", () => {
      searchInput.value = suggestion.keywords[0];
      searchInput.dispatchEvent(new Event("input"));
      searchSuggestions.classList.remove("active");
    });

    searchSuggestions.appendChild(suggestionItem);
  });

  searchSuggestions.classList.add("active");
};

// Búsquedas populares - clicks en tags
document.querySelectorAll(".popular-tag").forEach((tag) => {
  tag.addEventListener("click", () => {
    const searchValue = tag.getAttribute("data-search");
    searchInput.value = searchValue;
    searchInput.dispatchEvent(new Event("input"));
    popularSearches.classList.remove("active");

    // Scroll al catálogo
    document.getElementById("catalog").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Cerrar sugerencias al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) {
    searchSuggestions.classList.remove("active");
    popularSearches.classList.remove("active");
  }
});

// Navegación con teclado en sugerencias
searchInput.addEventListener("keydown", (e) => {
  const suggestionItems =
    searchSuggestions.querySelectorAll(".suggestion-item");
  const currentActive = searchSuggestions.querySelector(
    ".suggestion-item.active",
  );
  let index = Array.from(suggestionItems).indexOf(currentActive);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    index = (index + 1) % suggestionItems.length;
    suggestionItems.forEach((item) => item.classList.remove("active"));
    suggestionItems[index]?.classList.add("active");
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    index = index <= 0 ? suggestionItems.length - 1 : index - 1;
    suggestionItems.forEach((item) => item.classList.remove("active"));
    suggestionItems[index]?.classList.add("active");
  } else if (e.key === "Enter" && currentActive) {
    e.preventDefault();
    currentActive.click();
  }
});

// ============================================
// FILTROS DE CATEGORÍA
// ============================================

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remover clase active de todos los botones
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Agregar clase active al botón clickeado
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    productCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filterValue === "all") {
        card.classList.remove("hidden");
        card.style.animation = "fadeInUp 0.5s ease";
      } else if (category === filterValue) {
        card.classList.remove("hidden");
        card.style.animation = "fadeInUp 0.5s ease";
      } else {
        card.classList.add("hidden");
      }
    });

    // Limpiar búsqueda cuando se filtra
    searchInput.value = "";
  });
});

// ============================================
// SELECTOR DE COLORES/DISEÑOS
// ============================================

productCards.forEach((card) => {
  const colorOptions = card.querySelectorAll(".color-option, .design-option");
  const productImages = card.querySelectorAll(".product-image");
  const selectedColorName = card.querySelector(".selected-color-name");

  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remover clase active de todas las opciones
      colorOptions.forEach((opt) => opt.classList.remove("active"));

      // Agregar clase active a la opción clickeada
      option.classList.add("active");

      // Obtener el color/diseño seleccionado
      const selectedColor = option.getAttribute("data-color");

      // Cambiar imagen del producto
      productImages.forEach((img) => {
        if (img.getAttribute("data-color") === selectedColor) {
          img.classList.add("active");
        } else {
          img.classList.remove("active");
        }
      });

      // Actualizar nombre del color/diseño seleccionado
      if (selectedColorName) {
        const colorName = option.getAttribute("title") || option.textContent;
        selectedColorName.textContent = colorName;
      }
    });
  });
});

// ============================================
// BOTONES DE WHATSAPP POR PRODUCTO
// ============================================

const whatsappButtons = document.querySelectorAll(".btn-whatsapp");

whatsappButtons.forEach((button) => {
  const card = button.closest(".product-card");
  const sizeSelect = card.querySelector(".size-select");

  // Inicialmente deshabilitar el botón
  button.disabled = true;

  // Habilitar el botón solo si se selecciona una medida válida
  sizeSelect.addEventListener("change", (e) => {
    if (sizeSelect.value) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  });

  button.addEventListener("click", () => {
    const selectedSize = sizeSelect.value;
    if (!selectedSize) {
      // No permitir acción si no hay medida válida
      alert("Por favor selecciona una medida antes de continuar.");
      return;
    }

    const productName = button.getAttribute("data-product");
    // Obtener color/diseño seleccionado
    const activeColorOption = card.querySelector(
      ".color-option.active, .design-option.active",
    );
    const selectedColorName = activeColorOption
      ? activeColorOption.getAttribute("title")
      : "";

    // Construir mensaje de WhatsApp
    let message = `Hola! Me interesa la *${productName}*`;

    if (selectedColorName) {
      message += ` en ${selectedColorName}`;
    }

    message += ` talla *${selectedSize}*. ¿Podrían darme más información y el precio?`;

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Abrir WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumbers.primary}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  });
});

// ============================================
// ANIMACIONES AL HACER SCROLL
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observar elementos para animaciones
const animatedElements = document.querySelectorAll(
  ".feature-card, .type-card, .product-card, .size-col, .value-item",
);

animatedElements.forEach((element) => {
  element.classList.add("fade-in");
  observer.observe(element);
});

// ============================================
// SMOOTH SCROLL PARA ENLACES
// ============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ============================================
// PREVENIR CLIC DERECHO EN IMÁGENES (OPCIONAL)
// ============================================

// Descomenta esto si quieres proteger las imágenes
/*
document.querySelectorAll('.product-image, .type-image img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
});
*/

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  });

  // Observar todas las imágenes con data-src (si decides usar lazy loading)
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ============================================
// CAMBIO DINÁMICO DE PRECIO (OPCIONAL)
// ============================================

// Si quieres cambiar precios según la medida, descomenta esto:
/*
document.querySelectorAll('.size-select').forEach(select => {
    select.addEventListener('change', (e) => {
        const card = e.target.closest('.product-card');
        const priceElement = card.querySelector('.product-price');
        
        const prices = {
            'Sencilla 100x190': '$45.000',
            'Semidoble 120x190': '$50.000',
            'Doble 140x190': '$55.000',
            'Queen 160x190': '$60.000'
        };
        
        const selectedSize = e.target.value;
        if (prices[selectedSize]) {
            priceElement.textContent = prices[selectedSize];
        }
    });
});
*/

// ============================================
// CONTADOR DE VISITAS (OPCIONAL)
// ============================================

// Simple contador en localStorage
const updateVisitCounter = () => {
  let visits = localStorage.getItem("entresuenos-visits") || 0;
  visits = parseInt(visits) + 1;
  localStorage.setItem("entresuenos-visits", visits);
  console.log(`Visitas al catálogo: ${visits}`);
};

// Actualizar contador al cargar
updateVisitCounter();

// ============================================
// DETECCIÓN DE DISPOSITIVO
// ============================================

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  document.body.classList.add("mobile-device");
  console.log("Dispositivo móvil detectado");
} else {
  document.body.classList.add("desktop-device");
  console.log("Dispositivo desktop detectado");
}

// ============================================
// EFECTO PARALLAX EN HERO (OPCIONAL)
// ============================================

window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// ============================================
// PRELOADER (OPCIONAL)
// ============================================

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  console.log("Catálogo Entre Sueños cargado correctamente ✨");
});

// ============================================
// COPIAR NÚMERO DE WHATSAPP AL HACER CLIC (OPCIONAL)
// ============================================

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Número copiado al portapapeles");
    });
  }
};

// ============================================
// NOTIFICACIÓN DE PRODUCTO AGREGADO (OPCIONAL)
// ============================================

const showNotification = (message) => {
  // Crear notificación temporal
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: #25D366;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// ============================================
// VALIDACIÓN DE IMÁGENES
// ============================================

document.querySelectorAll(".product-image").forEach((img) => {
  img.addEventListener("error", function () {
    this.src = "assets/images/placeholder.png"; // Imagen placeholder si falla
    console.warn("Error al cargar imagen:", this.src);
  });
});

// ============================================
// EVENTOS DE GOOGLE ANALYTICS (OPCIONAL)
// ============================================

// Si tienes Google Analytics configurado:
/*
const trackEvent = (category, action, label) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
};

// Trackear clics en productos
whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.getAttribute('data-product');
        trackEvent('Producto', 'Click WhatsApp', productName);
    });
});
*/

// ============================================
// MENSAJE DE CONSOLA
// ============================================

console.log(
  "%c🌙 Entre Sueños - Catálogo Digital 💜",
  "color: #9B7EBD; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cHechas para abrigar tus sueños ✨",
  "color: #6BC4E0; font-size: 14px;",
);
console.log(
  "%cDesarrollado con 💙 por Webloom",
  "color: #666; font-size: 12px;",
);

// ============================================
// FUNCIÓN DE INICIALIZACIÓN
// ============================================

const initCatalog = () => {
  console.log("Inicializando catálogo...");

  // Verificar que todos los elementos existen
  const elements = {
    searchInput: document.getElementById("searchInput"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    productCards: document.querySelectorAll(".product-card"),
    whatsappButtons: document.querySelectorAll(".btn-whatsapp"),
  };

  let allElementsPresent = true;

  for (const [key, value] of Object.entries(elements)) {
    if (!value || (value.length !== undefined && value.length === 0)) {
      console.warn(`⚠️ Elemento no encontrado: ${key}`);
      allElementsPresent = false;
    }
  }

  if (allElementsPresent) {
    console.log("✅ Todos los elementos del catálogo están presentes");
  } else {
    console.error("❌ Algunos elementos del catálogo no se encontraron");
  }
};

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalog);
} else {
  initCatalog();
}

// ============================================
// EASTER EGG (OPCIONAL - DIVERSIÓN)
// ============================================

let clickCount = 0;
document.querySelector(".logo")?.addEventListener("click", () => {
  clickCount++;
  if (clickCount === 5) {
    console.log("🎉 Has descubierto el Easter Egg de Entre Sueños!");
    showNotification("¡Descubriste el secreto! 🌙💜");
    clickCount = 0;
  }
});

// ============================================
// FIN DEL SCRIPT
// ============================================
