// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const contactForm = document.getElementById('contactForm');
    
    // === NAVEGAÇÃO E MENU ===
    
    // Função para controlar o menu hambúrguer
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }
    
    // Event listener para o menu hambúrguer
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Fechar menu ao clicar em um link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // === SCROLL EFFECTS ===
    
    // Controlar aparência da navbar no scroll
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Highlight do link ativo baseado na seção visível
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height;
            const sectionTop = rect.top;
            
            // Considera uma seção ativa se estiver visível na viewport
            if (sectionTop <= window.innerHeight / 2 && sectionTop + sectionHeight > window.innerHeight / 2) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Remove classe active de todos os links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Adiciona classe active ao link atual
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Animação de fade-in para elementos
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .about-text');
        
        elements.forEach(element => {
            if (!element.classList.contains('fade-in')) {
                element.classList.add('fade-in');
            }
            
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }
    
    // Event listener otimizado para scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Throttle scroll events para melhor performance
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            handleNavbarScroll();
            updateActiveNavLink();
            handleScrollAnimations();
        }, 10);
    });
    
    // === SISTEMA DE ABAS DAS HABILIDADES ===
    
    function switchTab(targetTab) {
        // Remove classe active de todos os botões e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Adiciona classe active ao botão clicado
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Mostra o conteúdo correspondente
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
    
    // Event listeners para os botões das abas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // === FORMULÁRIO DE CONTATO ===
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Obtém os dados do formulário
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validação básica
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Simula envio do formulário
        showNotification('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
        contactForm.reset();
        
        // Em um projeto real, aqui você faria a requisição para seu backend
        // fetch('/send-email', { method: 'POST', body: formData })
    }
    
    // Validação de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Adiciona estilos inline para a notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Adiciona estilos para o botão de fechar
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Event listener para fechar manualmente
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Adiciona animações CSS para as notificações
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // Event listener para o formulário
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // === SMOOTH SCROLL PARA LINKS INTERNOS ===
    
    // Melhora o scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80; // Altura do navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // === EFEITOS VISUAIS ADICIONAIS ===
    
    // Parallax sutil para o hero
    function handleParallax() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }
    
    // Adiciona parallax apenas em telas maiores
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleParallax);
    }
    
    // === INICIALIZAÇÃO ===
    
    // Executa animações iniciais
    setTimeout(() => {
        handleScrollAnimations();
        updateActiveNavLink();
    }, 100);
    
    // Prevent flash of unstyled content
    document.body.style.opacity = '1';
    
    // === UTILITÁRIOS ===
    
    // Função para debounce (otimização de performance)
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
    
    // Otimiza eventos de resize
    const debouncedResize = debounce(() => {
        // Recarrega animações após resize
        handleScrollAnimations();
        updateActiveNavLink();
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // === ANALYTICS E TRACKING (OPCIONAL) ===
    
    // Função para rastrear interações (pode ser conectada ao Google Analytics)
    function trackEvent(category, action, label = '') {
        // Em produção, você poderia usar:
        // gtag('event', action, {
        //     event_category: category,
        //     event_label: label
        // });
        console.log(`Event: ${category} - ${action} - ${label}`);
    }
    
    // Rastreia cliques nos botões principais
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            trackEvent('Button', 'Click', e.target.textContent.trim());
        });
    });
    
    // Rastreia mudanças de aba
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            trackEvent('Tab', 'Switch', e.target.textContent.trim());
        });
    });
    
    console.log('Portfolio Gabriel Soares carregado com sucesso! 🚀');
});