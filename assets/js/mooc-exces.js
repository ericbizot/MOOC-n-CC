// ============================================
// MOOC EXCÈS - Fonctions JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ACCORDÉONS
    // ============================================
    
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Fermer tous les accordéons
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Ouvrir l'accordéon cliqué si il était fermé
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
    
    // ============================================
    // QUIZ INTERACTIFS
    // ============================================
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Ne rien faire si déjà répondu
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
                return;
            }
            
            const isCorrect = this.dataset.correct === 'true';
            const questionContainer = this.closest('.quiz-container');
            
            if (isCorrect) {
                this.classList.add('correct');
                this.innerHTML += ' ✓ Correct !';
                
                // Désactiver les autres options
                questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
                    if (opt !== this) {
                        opt.style.opacity = '0.5';
                        opt.style.cursor = 'not-allowed';
                    }
                });
            } else {
                this.classList.add('incorrect');
                this.innerHTML += ' ✗ Incorrect';
                
                // Montrer la bonne réponse après 1 seconde
                setTimeout(() => {
                    const correctOption = questionContainer.querySelector('[data-correct="true"]');
                    if (correctOption) {
                        correctOption.classList.add('correct');
                        correctOption.innerHTML += ' ✓ Bonne réponse';
                    }
                }, 1000);
            }
        });
    });
    
    // ============================================
    // BARRE DE PROGRESSION
    // ============================================
    
    function updateProgress() {
        const progressBar = document.querySelector('.progress-fill');
        if (!progressBar) return;
        
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        
        progressBar.style.width = scrolled + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ============================================
    // TOGGLE DARK/LIGHT MODE (optionnel)
    // ============================================
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            
            // Sauvegarder la préférence
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
        
        // Charger la préférence
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    }
    
    // ============================================
    // TRACKING DE COMPLÉTION (Local Storage)
    // ============================================
    
    function markSeanceCompleted(seanceNumber) {
        let completed = JSON.parse(localStorage.getItem('mooc-exces-progress')) || [];
        if (!completed.includes(seanceNumber)) {
            completed.push(seanceNumber);
            localStorage.setItem('mooc-exces-progress', JSON.stringify(completed));
        }
    }
    
    function getCompletedSeances() {
        return JSON.parse(localStorage.getItem('mooc-exces-progress')) || [];
    }
    
    // Marquer comme complétée au scroll jusqu'à 80%
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const seanceNumber = document.body.dataset.seance;
        
        if (scrollPercent > 80 && seanceNumber) {
            markSeanceCompleted(parseInt(seanceNumber));
        }
    });
    
    // ============================================
    // LIGHTBOX POUR IMAGES
    // ============================================
    
    const images = document.querySelectorAll('.corpus-image, .activity-image');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${this.src}" alt="${this.alt}">
                    <p class="lightbox-caption">${this.alt}</p>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Fermer la lightbox
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.remove();
                }
            });
            
            // Fermer avec Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                }
            });
        });
    });
    
    // ============================================
    // ANIMATIONS AU SCROLL
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les sections
    document.querySelectorAll('.deco-section, .accordion-item').forEach(section => {
        observer.observe(section);
    });
    
    // ============================================
    // PRINT FUNCTIONS
    // ============================================
    
    const printButtons = document.querySelectorAll('.print-button');
    printButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.print();
        });
    });
    
    // ============================================
    // COPIE DE LIENS
    // ============================================
    
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                btn.textContent = '✓ Lien copié !';
                setTimeout(() => {
                    btn.textContent = '🔗 Partager';
                }, 2000);
            });
        });
    });
    
    console.log('🎭 MOOC Excès chargé avec succès');
});

// ============================================
// STYLES LIGHTBOX (CSS-in-JS pour simplifier)
// ============================================

const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border: 3px solid var(--or-deco);
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 3rem;
        color: var(--or-deco);
        cursor: pointer;
        transition: transform 0.3s;
    }
    
    .lightbox-close:hover {
        transform: rotate(90deg);
    }
    
    .lightbox-caption {
        color: var(--creme);
        margin-top: 1rem;
        font-style: italic;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

document.head.appendChild(lightboxStyles);
