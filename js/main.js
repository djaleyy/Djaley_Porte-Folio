document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor (Desktop Only for Performance & Sizing)
    const cursor = document.getElementById('cursor');
    const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    if (cursor && !isMobileDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover states
        const hoverTargets = document.querySelectorAll('a, button, .work-card, .service-card, .masonry-item, .burger');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            target.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    } else if (cursor && isMobileDevice) {
        cursor.style.display = 'none';
    }

    // Scroll Effects (Navbar & Reveal)
    const navbar = document.getElementById('navbar');
    const revealElements = document.querySelectorAll('.reveal');

    const handleScroll = () => {
        // Navbar Scrolled Class
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Subtly reveal elements on scroll
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            if (rect.top <= viewHeight * 0.85) {
                el.classList.add('appear');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial run

    // Mobile Menu Toggle
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mmLinks = document.querySelectorAll('.mm-link');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Minimal burger line switch (handled via JS or CSS transitions)
            const spans = burger.querySelectorAll('span');
            if (burger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.transform = 'rotate(-45deg) translate(1px, -2px)';
                document.body.style.overflow = 'hidden'; // Avoid background scroll
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
                document.body.style.overflow = ''; // Restore background scroll
            }
        });

        mmLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                const spans = burger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
                document.body.style.overflow = ''; // Restore background scroll
            });
        });
    }

    // Form Submission (Web3Forms)
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    if (contactForm && formResult) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            const submitBtn = document.getElementById('submit-btn');

            if (submitBtn) {
                submitBtn.innerText = "Envoi en cours...";
                submitBtn.disabled = true;
            }

            formResult.style.display = "block";
            formResult.className = "form-result";
            formResult.innerText = "";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status === 200) {
                    formResult.innerText = "✓ Message envoyé avec succès.";
                    formResult.classList.add("success");
                    contactForm.reset();
                } else {
                    formResult.innerText = "✗ Erreur: " + jsonResponse.message;
                    formResult.classList.add("error");
                }
            })
            .catch(() => {
                formResult.innerText = "✗ Une erreur est survenue.";
                formResult.classList.add("error");
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.innerText = "Envoyer le message";
                    submitBtn.disabled = false;
                }
                setTimeout(() => {
                    formResult.style.display = "none";
                }, 6000);
            });
        });
    }

    // Modal Control Logic
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Auto-play videos inside
            if (!modal.classList.contains('feed-modal')) {
                const videos = modal.querySelectorAll('video');
                videos.forEach(v => {
                    v.play().catch(err => console.log("Autoplay blocked:", err));
                });
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = '';

            const videos = modal.querySelectorAll('video');
            videos.forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
        }
    };

    // Close Modal on Backdrop Click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('custom-modal')) {
            window.closeModal(e.target.id);
        }
    });

    // Vertical Video Feed Observer inside Modal
    const feedContainer = document.querySelector('.video-feed-container');
    if (feedContainer) {
        const observerOptions = {
            root: feedContainer,
            threshold: 0.6
        };

        const feedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (!video) return;

                if (entry.isIntersecting) {
                    video.play().catch(e => console.log("Video playback error:", e));
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, observerOptions);

        document.querySelectorAll('.video-feed-item').forEach(item => {
            feedObserver.observe(item);
        });
    }

    // Masonry & Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    const lbClose = document.getElementById('lb-close');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');

    let activeGalleryImages = [];
    let currentLbIndex = 0;

    const updateLightbox = () => {
        if (lbImg && lbCounter && activeGalleryImages.length > 0) {
            lbImg.src = activeGalleryImages[currentLbIndex].src;
            lbImg.alt = activeGalleryImages[currentLbIndex].alt;
            lbCounter.innerText = `${currentLbIndex + 1} / ${activeGalleryImages.length}`;
        }
    };

    // Attach click listeners to all masonry grids dynamically
    document.querySelectorAll('.masonry-grid').forEach(grid => {
        const items = grid.querySelectorAll('.masonry-item');
        const gridImages = Array.from(items).map(item => {
            const img = item.querySelector('img');
            return { src: img.src, alt: img.alt };
        });

        items.forEach((item, index) => {
            // Ensure we set data-index correctly relative to this grid
            item.setAttribute('data-index', index);
            item.addEventListener('click', () => {
                activeGalleryImages = gridImages;
                currentLbIndex = index;
                updateLightbox();
                if (lightbox) lightbox.classList.add('active');
            });
        });
    });

    if (lbClose) {
        lbClose.addEventListener('click', () => {
            if (lightbox) lightbox.classList.remove('active');
        });
    }

    if (lbPrev) {
        lbPrev.addEventListener('click', () => {
            if (activeGalleryImages.length > 0) {
                currentLbIndex = (currentLbIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
                updateLightbox();
            }
        });
    }

    if (lbNext) {
        lbNext.addEventListener('click', () => {
            if (activeGalleryImages.length > 0) {
                currentLbIndex = (currentLbIndex + 1) % activeGalleryImages.length;
                updateLightbox();
            }
        });
    }

    // Touch Swipe Gestures for Lightbox
    if (lightbox) {
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleLightboxSwipe();
        }, { passive: true });

        const handleLightboxSwipe = () => {
            if (activeGalleryImages.length === 0) return;
            const swipeDistance = touchEndX - touchStartX;
            const threshold = 50; // px

            if (swipeDistance < -threshold) {
                // Swipe Left -> Next Image
                currentLbIndex = (currentLbIndex + 1) % activeGalleryImages.length;
                updateLightbox();
            } else if (swipeDistance > threshold) {
                // Swipe Right -> Prev Image
                currentLbIndex = (currentLbIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
                updateLightbox();
            }
        };
    }

    // Touch/Click Toggle for Video Play/Pause (Resolves autoplay issues and enables control on mobile)
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(err => console.log("Video playback blocked:", err));
            } else {
                video.pause();
            }
        });
    });

    // Language Switcher Logic
    const langBtns = document.querySelectorAll('.lang-btn');

    const updateActiveButton = (lang) => {
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang-btn') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    const setLanguage = (lang) => {
        if (lang === 'en') {
            document.documentElement.classList.add('lang-en');
        } else {
            document.documentElement.classList.remove('lang-en');
        }
        localStorage.setItem('portfolio-lang', lang);
        updateActiveButton(lang);
    };

    // Initialize switcher state on load
    const currentLang = localStorage.getItem('portfolio-lang') || 'fr';
    setLanguage(currentLang);

    // Bind click events
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang-btn');
            setLanguage(selectedLang);
        });
    });
});

