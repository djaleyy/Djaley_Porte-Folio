document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. TECHNICAL SKILLS TABS FILTERING
    // --------------------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const techCards = document.querySelectorAll('.tech-card');

    if (tabButtons.length > 0 && techCards.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active tab styling
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetCategory = btn.getAttribute('data-target');

                // Filter cards with fade transition
                techCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (targetCategory === 'all' || cardCategory === targetCategory) {
                        card.classList.remove('hidden');
                        // Small timeout to trigger CSS transition smoothly
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        // Wait for transition before hiding completely
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // --------------------------------------------------------------------------
    // 2. PROGRESS BAR ANIMATION ON SCROLL
    // --------------------------------------------------------------------------
    const progressFills = document.querySelectorAll('.tech-progress-fill');

    if (progressFills.length > 0) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const targetLevel = fill.getAttribute('data-level');
                    if (targetLevel) {
                        fill.style.width = targetLevel;
                    }
                    // Animate once
                    observer.unobserve(fill);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully scrolls in
        });

        progressFills.forEach(fill => {
            progressObserver.observe(fill);
        });
    }

    // --------------------------------------------------------------------------
    // 3. STATISTICAL COUNTER ANIMATIONS
    // --------------------------------------------------------------------------
    const counters = document.querySelectorAll('.stat-counter');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetVal = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 1500; // milliseconds
                    const startTime = performance.now();

                    const animateCount = (currentTime) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        // Ease out quad function
                        const easeProgress = progress * (2 - progress);
                        const currentVal = Math.floor(easeProgress * targetVal);
                        
                        counter.textContent = currentVal;

                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            counter.textContent = targetVal; // Ensure exact final value
                        }
                    };

                    requestAnimationFrame(animateCount);
                    observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});
