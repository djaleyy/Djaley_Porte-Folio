document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateCursor() {
        posX += (mouseX - posX) / 8;
        posY += (mouseY - posY) / 8;
        
        follower.style.left = posX + 'px';
        follower.style.top = posY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for cursor
    const links = document.querySelectorAll('a, button, .project-card, .skill-category');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.opacity = '0.3';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursor.style.opacity = '1';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // Form Submission (Web3Forms)
    const contactForm = document.getElementById('contact-form');
    const result = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = "Envoi en cours...";
            btn.disabled = true;
            result.style.display = "block";
            result.className = "form-result";
            result.innerHTML = "";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "✓ Message envoyé avec succès !";
                    result.classList.add("success");
                    contactForm.reset();
                } else {
                    console.log(response);
                    result.innerHTML = "✗ Erreur: " + json.message;
                    result.classList.add("error");
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "✗ Une erreur est survenue.";
                result.classList.add("error");
            })
            .then(function() {
                btn.innerText = originalText;
                btn.disabled = false;
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
        });
    }

    // Hero Background Parallax
    window.addEventListener('scroll', () => {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            let offset = window.pageYOffset;
            heroBg.style.backgroundPositionY = offset * 0.5 + 'px';
        }
    });

    // =====================
    // Gallery Lightbox
    // =====================
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lbImg = document.getElementById('lb-img');
        const lbCounter = document.getElementById('lb-counter');
        const lbClose = document.getElementById('lb-close');
        const lbPrev = document.getElementById('lb-prev');
        const lbNext = document.getElementById('lb-next');
        const galleryItems = document.querySelectorAll('.masonry-item');
        let currentIndex = 0;

        const galleryImages = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt
        }));

        function openLightbox(index) {
            currentIndex = index;
            lbImg.src = galleryImages[currentIndex].src;
            lbImg.alt = galleryImages[currentIndex].alt;
            lbCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            // If the parent modal is still open, keep body hidden
            if (!document.getElementById('modal-concert-photo').classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lbImg.style.animation = 'none';
            lbImg.offsetHeight;
            lbImg.style.animation = '';
            lbImg.src = galleryImages[currentIndex].src;
            lbCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lbImg.style.animation = 'none';
            lbImg.offsetHeight;
            lbImg.style.animation = '';
            lbImg.src = galleryImages[currentIndex].src;
            lbCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        }

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(parseInt(item.dataset.index));
            });
        });

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', showPrev);
        lbNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }
});

// =====================
// Global Modal Logic
// =====================
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Auto-play videos inside the opened modal, UNLESS it's a feed modal
        if (!modal.classList.contains('feed-modal')) {
            const videos = modal.querySelectorAll('video');
            videos.forEach(v => {
                v.play().catch(e => console.log("L'autoplay a été bloqué :", e));
            });
        }
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Pause any playing videos and reset time
        const videos = modal.querySelectorAll('video');
        videos.forEach(v => {
            v.pause();
            v.currentTime = 0;
        });
        
        document.body.style.overflow = '';
    }
}

// Close modal on click outside content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-modal')) {
        window.closeModal(e.target.id);
    }
});

// =====================
// Video Feed Observer
// =====================
document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.querySelector('.video-feed-container');
    if (feedContainer) {
        const feedOptions = {
            root: feedContainer,
            rootMargin: '0px',
            threshold: 0.6 // Trigger when 60% visible
        };

        const feedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (!video) return;
                
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log("Autoplay bloqué :", e));
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, feedOptions);

        document.querySelectorAll('.video-feed-item').forEach(item => {
            feedObserver.observe(item);
        });
    }
});
