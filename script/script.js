// Configuración de idiomas para enlaces solamente
const translations = {
  es: {
    // Textos que se cambiarán dinámicamente
    loadingText: "Cargando...",
    // Enlaces
    linksData: [
      {
        icon: "fas fa-briefcase",
        title: "Portafolio",
        description: "Explora nuestros mejores trabajos",
        url: "https://portafolioartify.netlify.app/",
      },
      {
        icon: "fas fa-palette",
        title: "Forma parte de nuestra comunidad",
        description: "Conecta con creativos apasionados, inspírate con nuevos proyectos y sé parte del crecimiento del arte digital junto a Artify Studios.",
        url: "https://discord.gg/U8vkHZRyqS",
      },
      {
        icon: "fas fa-download",
        title: "Masterclass VIP",
        description: "Aprende técnicas avanzadas de diseño y arte digital directamente de profesionales de la industria, en un espacio pensado para potenciar tu talento.",
        url: "https://www.patreon.com/c/artifystudiosinc",
      },
      {
        icon: "fas fa-star",
        title: "Apoya a Artify Studios",
        description: "Tu apoyo económico permite continuar creando contenido de calidad y formar a nuevas generaciones de artistas digitales.",
        url: "https://ko-fi.com/artifystudios",
      },
    ],
  },
  en: {
    loadingText: "Loading...",
    linksData: [
      {
        icon: "fas fa-briefcase",
        title: "Portfolio",
        description: "Explore our best work",
        url: "https://portafolioartify.netlify.app/",
      },
      {
        icon: "fas fa-palette",
        title: "Be part of our community",
        description: "Connect with passionate creatives, get inspired by new projects, and be part of the growth of digital art with Artify Studios.",
        url: "https://discord.gg/U8vkHZRyqS",
      },
      {
        icon: "fas fa-download",
        title: "VIP Masterclass",
        description: "Learn advanced design and digital art techniques directly from industry professionals, in a space designed to enhance your talent.",
        url: "https://www.patreon.com/c/artifystudiosinc",
      },
      {
        icon: "fas fa-star",
        title: "Support Artify Studios",
        description: "Your financial support helps us continue creating high-quality content and training new generations of digital artists.",
        url: "#testimonios",
      },
    ],
  },
}

// Variables globales
let currentLanguage = "es"
let isVideoPlaying = false
let isSponsorMuted = true
let clickCount = 0


// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Variables para compartir
let currentShareLink = null

function initializeApp() {
  // Mostrar loading screen
  showLoadingScreen()

  // Inicializar componentes
  setTimeout(() => {
    initializeLanguageSelector()
    initializeVideoPlayer()
    initializeSponsorVideo()
    initializeProfileImage()
    renderLinks()
    initializeShareModal() // Agregar esta línea
    initializeAnimations()
    addClickEffects()
    hideLoadingScreen()
  }, 1000)
}

// Loading Screen
function showLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")
  loadingScreen.style.display = "flex"
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")
  loadingScreen.classList.add("hidden")
  setTimeout(() => {
    loadingScreen.style.display = "none"
  }, 500)
}

// Selector de idioma
function initializeLanguageSelector() {
  const languageBtn = document.getElementById("languageBtn")
  const currentLangSpan = document.getElementById("currentLang")

  languageBtn.addEventListener("click", function () {
    currentLanguage = currentLanguage === "es" ? "en" : "es"
    currentLangSpan.textContent = currentLanguage.toUpperCase()
    updateLanguage()

    // Efecto visual
    this.style.transform = "scale(0.95)"
    setTimeout(() => {
      this.style.transform = ""
    }, 150)
  })
}

function updateLanguage() {
  // Actualizar elementos con data-attributes
  const elements = document.querySelectorAll("[data-es][data-en]")
  elements.forEach((element) => {
    const text = element.getAttribute(`data-${currentLanguage}`)
    if (text) {
      element.textContent = text
    }
  })

  // Actualizar loading text
  const loadingText = document.querySelector(".loading-screen p")
  if (loadingText) {
    loadingText.textContent = translations[currentLanguage].loadingText
  }

  // Re-renderizar solo enlaces
  renderLinks()

  // Actualizar idioma del HTML
  document.documentElement.lang = currentLanguage
}

// Reproductor de video principal
function initializeVideoPlayer() {
  const video = document.getElementById("mainVideo")
  const videoOverlay = document.getElementById("videoOverlay")
  const videoControls = document.getElementById("videoControls")
  const playButton = document.getElementById("playButton")
  const playPauseBtn = document.getElementById("playPauseBtn")
  const progressFill = document.getElementById("progressFill")
  const progressBar = document.getElementById("progressBar")
  const timeDisplay = document.getElementById("timeDisplay")
  const volumeBtn = document.getElementById("volumeBtn")
  const fullscreenBtn = document.getElementById("fullscreenBtn")

  if (!video) return

  // Event listeners
  playButton.addEventListener("click", togglePlay)
  playPauseBtn.addEventListener("click", togglePlay)
  video.addEventListener("click", togglePlay)
  video.addEventListener("timeupdate", updateProgress)
  video.addEventListener("loadedmetadata", updateTimeDisplay)
  video.addEventListener("ended", videoEnded)

  volumeBtn.addEventListener("click", toggleMute)
  fullscreenBtn.addEventListener("click", toggleFullscreen)
  progressBar.addEventListener("click", seekVideo)

  // Mostrar/ocultar controles
  const videoWrapper = video.closest(".video-wrapper")
  videoWrapper.addEventListener("mouseenter", () => {
    if (isVideoPlaying) {
      videoControls.style.opacity = "1"
    }
  })

  videoWrapper.addEventListener("mouseleave", () => {
    videoControls.style.opacity = "0"
  })

  function togglePlay() {
    if (video.paused) {
      video.play()
      isVideoPlaying = true
      videoOverlay.classList.add("hidden")
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      trackEvent("video", "play")
    } else {
      video.pause()
      isVideoPlaying = false
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      trackEvent("video", "pause")
    }
  }

  function updateProgress() {
    const progress = (video.currentTime / video.duration) * 100
    progressFill.style.width = progress + "%"
    updateTimeDisplay()
  }

  function updateTimeDisplay() {
    const current = formatTime(video.currentTime)
    const duration = formatTime(video.duration)
    timeDisplay.textContent = `${current} / ${duration}`
  }

  function seekVideo(e) {
    const clickX = e.offsetX
    const width = progressBar.offsetWidth
    const duration = video.duration
    video.currentTime = (clickX / width) * duration
  }

  function toggleMute() {
    if (video.muted) {
      video.muted = false
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
    } else {
      video.muted = true
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      videoWrapper.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  function videoEnded() {
    isVideoPlaying = false
    videoOverlay.classList.remove("hidden")
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
    progressFill.style.width = "0%"
    trackEvent("video", "ended")
  }
}

// Video patrocinado
function initializeSponsorVideo() {
  const sponsorVideo = document.getElementById("sponsorVideo")
  const sponsorMuteBtn = document.getElementById("sponsorMuteBtn")
  const sponsorCloseBtn = document.getElementById("sponsorCloseBtn")
  const sponsorSection = document.getElementById("sponsorSection")

  if (!sponsorVideo) return

  // Autoplay con manejo de errores
  sponsorVideo.play().catch((error) => {
    console.log("Autoplay prevented:", error)
  })

  // Botón de silencio
  sponsorMuteBtn.addEventListener("click", function () {
    if (sponsorVideo.muted) {
      sponsorVideo.muted = false
      isSponsorMuted = false
      this.innerHTML = '<i class="fas fa-volume-up"></i>'
    } else {
      sponsorVideo.muted = true
      isSponsorMuted = true
      this.innerHTML = '<i class="fas fa-volume-mute"></i>'
    }
    trackEvent("sponsor", "mute_toggle")
  })

  // Botón de cerrar
  sponsorCloseBtn.addEventListener("click", () => {
    sponsorSection.style.animation = "fadeOut 0.5s forwards"
    setTimeout(() => {
      sponsorSection.style.display = "none"
    }, 500)
    trackEvent("sponsor", "close")
  })

  // Click en video para toggle mute
  sponsorVideo.addEventListener("click", () => {
    sponsorMuteBtn.click()
  })

  trackEvent("sponsor", "impression")
}

// Imagen de perfil con easter egg
function initializeProfileImage() {
  const profileImg = document.getElementById("profileImg")

  profileImg.addEventListener("click", function () {
    clickCount++

    // Efecto de rotación
    this.style.transform = "scale(1.1) rotate(360deg)"
    setTimeout(() => {
      this.style.transform = ""
    }, 600)

    // Easter egg después de 5 clicks
    if (clickCount >= 5) {
      showEasterEgg()
      clickCount = 0
    }
  })
}

// Easter egg
function showEasterEgg() {
  const message = document.createElement("div")
  message.innerHTML = "🎨 ¡Gracias por explorar nuestro diseño! 🚀"
  message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        animation: bounceIn 0.6s ease-out;
    `

  document.body.appendChild(message)

  setTimeout(() => {
    message.style.animation = "fadeOut 0.4s ease-out forwards"
    setTimeout(() => {
      if (message.parentNode) {
        document.body.removeChild(message)
      }
    }, 400)
  }, 2000)
}

// Renderizar enlaces (solo enlaces, los cursos ya están en HTML)
// Renderizar enlaces con botón de compartir
function renderLinks() {
  const linksGrid = document.getElementById("linksGrid")
  const links = translations[currentLanguage].linksData

  linksGrid.innerHTML = ""

  links.forEach((link, index) => {
    const linkCard = document.createElement("div")
    linkCard.className = "link-card"
    linkCard.style.animationDelay = `${index * 50}ms`

    linkCard.innerHTML = `
            <div class="link-card-main">
                <div class="link-icon">
                    <i class="${link.icon}"></i>
                </div>
                <div class="link-content">
                    <h3>${link.title}</h3>
                    <p>${link.description}</p>
                </div>
                <div class="link-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
            <div class="link-card-actions">
                <button class="link-share-btn" onclick="openShareModal('${link.title}', '${link.description}', '${link.url}', '${link.icon}')" title="Compartir">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        `

    // Click en la parte principal para ir al enlace
    const mainArea = linkCard.querySelector(".link-card-main")
    mainArea.addEventListener("click", () => {
      // Efecto de click
      linkCard.style.transform = "scale(0.98)"
      setTimeout(() => {
        linkCard.style.transform = ""
      }, 150)

      // Abrir enlace
      setTimeout(() => {
        if (link.url.startsWith("http")) {
          window.open(link.url, "_blank")
        } else {
          window.location.href = link.url
        }
      }, 200)

      trackEvent("link", link.title)
    })

    linksGrid.appendChild(linkCard)
  })
}

// Abrir modal de compartir
function openShareModal(title, description, url, icon) {
  currentShareLink = { title, description, url, icon }

  const modal = document.getElementById("shareModal")
  const linkInfo = document.getElementById("shareLinkInfo")

  // Crear URL completa si es relativa
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`

  linkInfo.innerHTML = `
    <div class="share-link-icon">
      <i class="${icon}"></i>
    </div>
    <div class="share-link-details">
      <h4>${title}</h4>
      <p>${description}</p>
    </div>
  `

  modal.classList.add("active")
  trackEvent("share", "modal_open")
}

// Cerrar modal de compartir
function closeShareModal() {
  const modal = document.getElementById("shareModal")
  modal.classList.remove("active")
  currentShareLink = null
}

// Compartir en redes sociales
function shareOn(platform) {
  if (!currentShareLink) return

  const { title, description, url } = currentShareLink
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`
  const text = `${title} - ${description}`

  let shareUrl = ""

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(text)}`
      break
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`
      break
    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
      break
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + fullUrl)}`
      break
    case "telegram":
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`
      break
    case "copy":
      copyToClipboard(fullUrl)
      return
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400")
    trackEvent("share", platform)
  }
}

// Copiar al portapapeles
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showNotification(currentLanguage === "es" ? "¡Enlace copiado!" : "Link copied!", "success")
      })
      .catch(() => {
        fallbackCopyToClipboard(text)
      })
  } else {
    fallbackCopyToClipboard(text)
  }
  trackEvent("share", "copy")
}

// Fallback para copiar al portapapeles
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  textArea.style.top = "-999999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    showNotification(currentLanguage === "es" ? "¡Enlace copiado!" : "Link copied!", "success")
  } catch (err) {
    showNotification(currentLanguage === "es" ? "Error al copiar" : "Copy failed", "error")
  }

  document.body.removeChild(textArea)
}

// Mostrar notificación
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
    <span>${message}</span>
  `

  document.body.appendChild(notification)

  // Mostrar notificación
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Ocultar después de 3 segundos
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Inicializar modal de compartir
function initializeShareModal() {
  const modal = document.getElementById("shareModal")
  const closeBtn = document.getElementById("shareModalClose")

  // Cerrar con botón X
  closeBtn.addEventListener("click", closeShareModal)

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeShareModal()
    }
  })

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeShareModal()
    }
  })
}

// Funciones auxiliares
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function buyCourse(courseId) {
  const url = courseUrls[courseId]
  if (url) {
    window.open(url, "_blank")
    trackEvent("course_purchase", courseId)
  }
}

// Animaciones
function initializeAnimations() {
  // Declare gtag and fbq as global variables
  window.gtag =
    window.gtag ||
    (() => {
      ;(window.gtag.q = window.gtag.q || []).push(arguments)
    })
  window.fbq =
    window.fbq ||
    (() => {
      ;(window.fbq.q = window.fbq.q || []).push(arguments)
    })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  const animatedElements = document.querySelectorAll(
    ".profile-section, .sponsor-video-section, .video-section, .courses-section, .links-section, .social-section",
  )
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    observer.observe(el)
  })
}

// Efectos de click
function addClickEffects() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".course-card, .link-card, .social-link, .language-btn, .sponsor-btn")

    if (target) {
      createRippleEffect(e, target)
    }
  })
}

function createRippleEffect(e, element) {
  const ripple = document.createElement("div")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `

  element.style.position = "relative"
  element.appendChild(ripple)

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }, 600)
}

// Analytics y tracking
function trackEvent(category, action) {
  console.log(`Event tracked: ${category} - ${action}`)

  // Integración con Google Analytics (si está disponible)
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: action,
    })
  }

  // Integración con Facebook Pixel (si está disponible)
  if (typeof fbq !== "undefined") {
    fbq("track", "CustomEvent", {
      category: category,
      action: action,
    })
  }
}

// Manejo de errores
window.addEventListener("error", (e) => {
  console.error("Error en la aplicación:", e.error)
  trackEvent("error", e.error.message)
})

// Optimización de rendimiento
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Lazy loading para imágenes
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Preloader y optimizaciones
window.addEventListener("load", () => {
  // Inicializar lazy loading
  initializeLazyLoading()

  // Precargar imágenes críticas
  preloadCriticalImages()

  // Optimizar rendimiento
  optimizePerformance()
})

function preloadCriticalImages() {
  const criticalImages = ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=128&h=128&fit=crop&crop=face"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

function optimizePerformance() {
  // Reducir la frecuencia de eventos de scroll
  const debouncedScroll = debounce(() => {
    // Lógica de scroll optimizada
  }, 16)

  window.addEventListener("scroll", debouncedScroll)

  // Optimizar resize events
  const debouncedResize = debounce(() => {
    // Lógica de resize optimizada
  }, 250)

  window.addEventListener("resize", debouncedResize)
}

// Service Worker para PWA (opcional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

// Soporte para modo oscuro
function initializeDarkMode() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")

  function updateTheme(e) {
    if (e.matches) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }

  prefersDark.addListener(updateTheme)
  updateTheme(prefersDark)
}

// Inicializar modo oscuro
initializeDarkMode()

// Animaciones CSS adicionales
const additionalStyles = `
    @keyframes bounceIn {
        0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`

// Agregar estilos adicionales
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
