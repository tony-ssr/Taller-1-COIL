// Mapa Comparativo Interactivo - Modelos Psicosocial y Gestión de Casos
// Desarrollado para el Taller 1 COIL

// Configuración global
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    fadeInThreshold: 0.1,
    parallaxSpeed: 0.5
};

// Estado de la aplicación
const AppState = {
    currentSection: 'case-study',
    isAnimating: false,
    scrollPosition: 0,
    activeModel: null
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startAnimations();
    setupIntersectionObserver();
    createFloatingElements();
});

// Función principal de inicialización
function initializeApp() {
    console.log('🌸 Inicializando Mapa Comparativo My Melody');
    
    // Configurar navegación inicial
    updateActiveNavButton('case-study');
    
    // Aplicar animaciones de entrada
    setTimeout(() => {
        document.querySelector('.main-header').classList.add('animate-fade-in');
    }, 300);
    
    // Configurar tooltips
    initializeTooltips();
    
    // Configurar efectos de parallax
    setupParallax();
}

// Configuración de event listeners
function setupEventListeners() {
    // Navegación hamburguesa
    const navToggle = document.getElementById('navToggle');
    const navButtons = document.getElementById('navButtons');
    
    if (navToggle && navButtons) {
        navToggle.addEventListener('click', function() {
            toggleMobileNav();
        });
        
        // Cerrar menú al hacer click en un botón de navegación
        navButtons.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-btn') || e.target.closest('.nav-btn')) {
                closeMobileNav();
            }
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navButtons.contains(e.target)) {
                closeMobileNav();
            }
        });
    }
    
    // Navegación entre secciones
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(button => {
        button.addEventListener('click', handleNavigation);
    });
    
    // Scroll suave
    document.addEventListener('scroll', handleScroll);
    
    // Interacciones con modelos
    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach(card => {
        card.addEventListener('mouseenter', handleModelHover);
        card.addEventListener('mouseleave', handleModelLeave);
        card.addEventListener('click', handleModelClick);
    });
    
    // Elementos interactivos
    const interactiveElements = document.querySelectorAll('.interactive-element');
    interactiveElements.forEach(element => {
        element.addEventListener('click', handleInteractiveClick);
    });
    
    // Resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Manejo de navegación
function handleNavigation(event) {
    event.preventDefault();
    
    if (AppState.isAnimating) return;
    
    const targetId = event.target.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    
    if (!targetSection) return;
    
    AppState.isAnimating = true;
    AppState.currentSection = targetId;
    
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('.model-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    targetSection.classList.add('active');
    
    // Actualizar botón activo
    updateActiveNavButton(targetId);
    
    // Scroll suave a la sección
    smoothScrollTo(targetSection, () => {
        AppState.isAnimating = false;
        triggerSectionAnimation(targetSection);
    });
}

// Actualizar botón de navegación activo
function updateActiveNavButton(targetId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
        }
    });
}

// Scroll suave personalizado
function smoothScrollTo(target, callback) {
    const targetPosition = target.offsetTop - CONFIG.scrollOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = CONFIG.animationDuration;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(animation);
}

// Función de easing
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// Manejo del scroll
function handleScroll() {
    AppState.scrollPosition = window.pageYOffset;
    
    // Actualizar parallax
    updateParallax();
    
    // Actualizar navegación basada en scroll
    updateNavigationOnScroll();
    
    // Activar animaciones de elementos visibles
    checkVisibleElements();
}

// Actualizar navegación basada en posición de scroll
function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.scrollOffset;
        const sectionHeight = section.clientHeight;
        
        if (AppState.scrollPosition >= sectionTop && 
            AppState.scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    if (currentSection && currentSection !== AppState.currentSection) {
        AppState.currentSection = currentSection;
        updateActiveNavButton(currentSection);
    }
}

// Configurar Intersection Observer para animaciones
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: CONFIG.fadeInThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                triggerElementAnimation(element);
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatableElements = document.querySelectorAll(
        '.model-card, .flow-step, .activity-item, .characteristic-item, ' +
        '.similarity-item, .difference-item, .timeline-item, .benefit-item'
    );
    
    animatableElements.forEach(element => {
        observer.observe(element);
    });
}

// Activar animación de elemento
function triggerElementAnimation(element) {
    const animationType = element.dataset.animation || 'fade-in';
    
    switch (animationType) {
        case 'slide-left':
            element.classList.add('animate-slide-in-left');
            break;
        case 'slide-right':
            element.classList.add('animate-slide-in-right');
            break;
        case 'bounce':
            element.classList.add('animate-bounce-in');
            break;
        default:
            element.classList.add('animate-fade-in');
    }
}

// Activar animaciones de sección
function triggerSectionAnimation(section) {
    const elements = section.querySelectorAll('.animate-on-scroll');
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            triggerElementAnimation(element);
        }, index * 100);
    });
}

// Manejo de hover en modelos
function handleModelHover(event) {
    const modelCard = event.currentTarget;
    const modelType = modelCard.dataset.model;
    
    modelCard.classList.add('hover-active');
    
    // Efecto de brillo
    createGlowEffect(modelCard);
    
    // Mostrar información adicional
    showModelTooltip(modelCard, modelType);
}

function handleModelLeave(event) {
    const modelCard = event.currentTarget;
    
    modelCard.classList.remove('hover-active');
    
    // Remover efectos
    removeGlowEffect(modelCard);
    hideModelTooltip();
}

// Manejo de click en modelos
function handleModelClick(event) {
    const modelCard = event.currentTarget;
    const modelType = modelCard.dataset.model;
    
    if (AppState.activeModel === modelType) {
        // Desactivar modelo activo
        AppState.activeModel = null;
        modelCard.classList.remove('active');
        hideModelDetails();
    } else {
        // Activar nuevo modelo
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('active');
        });
        
        AppState.activeModel = modelType;
        modelCard.classList.add('active');
        showModelDetails(modelType);
    }
}

// Mostrar detalles del modelo
function showModelDetails(modelType) {
    const detailsContainer = document.getElementById(`${modelType}-details`);
    
    if (detailsContainer) {
        detailsContainer.style.display = 'block';
        setTimeout(() => {
            detailsContainer.classList.add('animate-fade-in');
        }, 50);
    }
}

// Ocultar detalles del modelo
function hideModelDetails() {
    const detailsContainers = document.querySelectorAll('.model-details');
    
    detailsContainers.forEach(container => {
        container.classList.remove('animate-fade-in');
        setTimeout(() => {
            container.style.display = 'none';
        }, CONFIG.animationDuration);
    });
}

// Crear efecto de brillo
function createGlowEffect(element) {
    element.style.boxShadow = '0 0 30px rgba(239, 175, 216, 0.6)';
    element.style.transform = 'translateY(-5px) scale(1.02)';
}

// Remover efecto de brillo
function removeGlowEffect(element) {
    element.style.boxShadow = '';
    element.style.transform = '';
}

// Sistema de tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousemove', updateTooltipPosition);
    });
}

function showTooltip(event) {
    const element = event.currentTarget;
    const tooltipText = element.dataset.tooltip;
    
    if (!tooltipText) return;
    
    const tooltip = createTooltipElement(tooltipText);
    document.body.appendChild(tooltip);
    
    updateTooltipPosition(event, tooltip);
    
    setTimeout(() => {
        tooltip.classList.add('visible');
    }, 10);
}

function hideTooltip() {
    const existingTooltip = document.querySelector('.custom-tooltip');
    if (existingTooltip) {
        existingTooltip.classList.remove('visible');
        setTimeout(() => {
            existingTooltip.remove();
        }, 200);
    }
}

function updateTooltipPosition(event, tooltip = null) {
    const activeTooltip = tooltip || document.querySelector('.custom-tooltip');
    if (!activeTooltip) return;
    
    const x = event.clientX + 10;
    const y = event.clientY - 10;
    
    activeTooltip.style.left = x + 'px';
    activeTooltip.style.top = y + 'px';
}

function createTooltipElement(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 200px;
        word-wrap: break-word;
    `;
    
    return tooltip;
}

// Mostrar tooltip de modelo
function showModelTooltip(modelCard, modelType) {
    const tooltipData = {
        'psychosocial': 'Modelo centrado en la persona y su entorno social',
        'case-management': 'Modelo sistemático de coordinación de servicios'
    };
    
    const tooltipText = tooltipData[modelType];
    if (tooltipText) {
        modelCard.dataset.tooltip = tooltipText;
    }
}

function hideModelTooltip() {
    hideTooltip();
}

// Configurar efectos de parallax
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach(element => {
        element.style.transform = 'translateZ(0)';
    });
}

// Actualizar parallax
function updateParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || CONFIG.parallaxSpeed;
        const yPos = -(AppState.scrollPosition * speed);
        element.style.transform = `translateY(${yPos}px) translateZ(0)`;
    });
}

// Crear elementos flotantes decorativos
function createFloatingElements() {
    const container = document.querySelector('.floating-container');
    if (!container) return;
    
    const shapes = ['🌸', '🎀', '💖', '✨', '🌺'];
    const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-soft)', 'var(--color-warm)'];
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Posición aleatoria
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 20 + 15;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        element.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            font-size: ${size}px;
            opacity: 0.3;
            animation: float ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.appendChild(element);
    }
}

// Manejo de elementos interactivos
function handleInteractiveClick(event) {
    const element = event.currentTarget;
    const action = element.dataset.action;
    
    switch (action) {
        case 'expand':
            toggleElementExpansion(element);
            break;
        case 'highlight':
            highlightRelatedElements(element);
            break;
        case 'compare':
            showComparisonModal(element);
            break;
        default:
            addClickEffect(element);
    }
}

// Alternar expansión de elemento
function toggleElementExpansion(element) {
    const isExpanded = element.classList.contains('expanded');
    
    if (isExpanded) {
        element.classList.remove('expanded');
    } else {
        // Colapsar otros elementos expandidos
        document.querySelectorAll('.expanded').forEach(el => {
            el.classList.remove('expanded');
        });
        
        element.classList.add('expanded');
    }
}

// Resaltar elementos relacionados
function highlightRelatedElements(element) {
    const category = element.dataset.category;
    const relatedElements = document.querySelectorAll(`[data-category="${category}"]`);
    
    // Remover highlights existentes
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
    
    // Agregar nuevos highlights
    relatedElements.forEach(el => {
        el.classList.add('highlighted');
    });
    
    // Remover highlights después de 3 segundos
    setTimeout(() => {
        relatedElements.forEach(el => {
            el.classList.remove('highlighted');
        });
    }, 3000);
}

// Efecto de click
function addClickEffect(element) {
    element.classList.add('clicked');
    
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 300);
}

// Navegación por teclado
function handleKeyboardNavigation(event) {
    const { key } = event;
    
    switch (key) {
        case 'ArrowDown':
        case 'PageDown':
            if (event.ctrlKey) {
                event.preventDefault();
                navigateToNextSection();
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            if (event.ctrlKey) {
                event.preventDefault();
                navigateToPreviousSection();
            }
            break;
        case 'Home':
            if (event.ctrlKey) {
                event.preventDefault();
                navigateToSection('case-study');
            }
            break;
        case 'Escape':
            hideAllModals();
            break;
    }
}

// Navegar a siguiente sección
function navigateToNextSection() {
    const sections = ['case-study', 'psychosocial-model', 'case-management-model', 'comparison', 'integration'];
    const currentIndex = sections.indexOf(AppState.currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    
    navigateToSection(sections[nextIndex]);
}

// Navegar a sección anterior
function navigateToPreviousSection() {
    const sections = ['case-study', 'psychosocial-model', 'case-management-model', 'comparison', 'integration'];
    const currentIndex = sections.indexOf(AppState.currentSection);
    const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    
    navigateToSection(sections[prevIndex]);
}

// Navegar a sección específica
function navigateToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        AppState.currentSection = sectionId;
        updateActiveNavButton(sectionId);
        smoothScrollTo(targetSection);
    }
}

// Ocultar todos los modales
function hideAllModals() {
    const modals = document.querySelectorAll('.modal, .expanded');
    modals.forEach(modal => {
        modal.classList.remove('visible', 'expanded');
    });
}

// Manejo de redimensionamiento
function handleResize() {
    // Recalcular posiciones de elementos flotantes
    updateFloatingElements();
    
    // Actualizar tooltips
    hideTooltip();
    
    // Recalcular animaciones de scroll
    checkVisibleElements();
}

// Actualizar elementos flotantes
function updateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach(element => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        element.style.left = x + '%';
        element.style.top = y + '%';
    });
}

// Verificar elementos visibles
function checkVisibleElements() {
    const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            triggerElementAnimation(element);
            element.classList.add('animated');
        }
    });
}

// Verificar si elemento está en viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
        rect.top >= 0 &&
        rect.top <= windowHeight * (1 - CONFIG.fadeInThreshold)
    );
}

// Función de debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Iniciar animaciones de fondo
function startAnimations() {
    // Animación de partículas de fondo
    createBackgroundParticles();
    
    // Animación de gradiente
    animateBackgroundGradient();
}

// Crear partículas de fondo
function createBackgroundParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Crear partículas individuales
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

// Crear partícula individual
function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, var(--color-primary), transparent);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: 0.3;
        animation: particleFloat ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
}

// Animar gradiente de fondo
function animateBackgroundGradient() {
    const body = document.body;
    let hue = 0;
    
    function updateGradient() {
        hue = (hue + 0.5) % 360;
        const color1 = `hsl(${hue + 320}, 45%, 95%)`;
        const color2 = `hsl(${hue + 340}, 40%, 92%)`;
        
        body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        
        requestAnimationFrame(updateGradient);
    }
    
    updateGradient();
}

// Exportar funciones para uso global
// Funciones para navegación móvil
function toggleMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navButtons = document.getElementById('navButtons');
    
    if (navToggle && navButtons) {
        navToggle.classList.toggle('active');
        navButtons.classList.toggle('show');
        
        // Agregar aria-expanded para accesibilidad
        const isExpanded = navButtons.classList.contains('show');
        navToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevenir scroll del body cuando el menú está abierto
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navButtons = document.getElementById('navButtons');
    
    if (navToggle && navButtons) {
        navToggle.classList.remove('active');
        navButtons.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

function openMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navButtons = document.getElementById('navButtons');
    
    if (navToggle && navButtons) {
        navToggle.classList.add('active');
        navButtons.classList.add('show');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
}

// Manejar cambios de tamaño de ventana
function handleNavResize() {
    const navButtons = document.getElementById('navButtons');
    const navToggle = document.getElementById('navToggle');
    
    if (window.innerWidth > 768) {
        // En pantallas grandes, mostrar siempre la navegación
        if (navButtons) {
            navButtons.classList.remove('show');
            navButtons.style.display = 'flex';
        }
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    } else {
        // En pantallas pequeñas, ocultar por defecto
        if (navButtons && !navButtons.classList.contains('show')) {
            navButtons.style.display = 'none';
        }
    }
}

// Agregar listener para cambios de tamaño
window.addEventListener('resize', debounce(handleNavResize, 250));

window.MyMelodyMap = {
    navigateToSection,
    showModelDetails,
    hideModelDetails,
    triggerElementAnimation,
    toggleMobileNav,
    closeMobileNav,
    openMobileNav,
    AppState
};

// Agregar estilos CSS adicionales dinámicamente
const additionalStyles = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(5deg); }
        50% { transform: translateY(-5px) rotate(-5deg); }
        75% { transform: translateY(-15px) rotate(3deg); }
    }
    
    @keyframes particleFloat {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
        75% { transform: translateY(-30px) translateX(15px); opacity: 0.7; }
    }
    
    .custom-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .highlighted {
        background: linear-gradient(135deg, var(--color-accent), var(--color-warm)) !important;
        color: white !important;
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(227, 106, 165, 0.4);
        transition: all 0.3s ease;
    }
    
    .clicked {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
    
    .expanded {
        transform: scale(1.1);
        z-index: 10;
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('🌸 Mapa Comparativo My Melody inicializado correctamente');