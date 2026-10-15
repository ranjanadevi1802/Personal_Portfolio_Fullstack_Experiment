
        const themeToggleBtn = document.getElementById('theme-toggle');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');
        if (document.documentElement.classList.contains('dark')) { lightIcon.classList.remove('hidden'); } else { darkIcon.classList.remove('hidden'); }
        themeToggleBtn.addEventListener('click', () => {
            darkIcon.classList.toggle('hidden'); lightIcon.classList.toggle('hidden');
            if (document.documentElement.classList.contains('dark')) { document.documentElement.classList.remove('dark'); localStorage.setItem('color-theme', 'light'); }
            else { document.documentElement.classList.add('dark'); localStorage.setItem('color-theme', 'dark'); }
        });
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => { if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); } });
        const revealElements = document.querySelectorAll('.reveal');
        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = parseFloat(counter.getAttribute('data-target'));
                        const isDecimal = target % 1 !== 0;
                        const duration = 2000; const stepTime = 20; const steps = duration / stepTime; const increment = target / steps;
                        let current = 0;
                        const updateCounter = setInterval(() => {
                            current += increment;
                            if (current >= target) { counter.innerText = isDecimal ? target.toFixed(3) : target; clearInterval(updateCounter); }
                            else { counter.innerText = isDecimal ? current.toFixed(3) : Math.floor(current); }
                        }, stepTime);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => revealOnScroll.observe(el));
    

// Send the form to the Express backend without reloading the page.
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmit = document.getElementById('contact-submit');
contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending...';
    contactStatus.dataset.state = 'pending';
    contactStatus.textContent = 'Submitting your message...';
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
            signal: AbortSignal.timeout(45000)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to submit your message.');
        contactStatus.dataset.state = 'success';
        contactStatus.textContent = result.message;
        contactForm.reset();
    } catch (error) {
        contactStatus.dataset.state = 'error';
        contactStatus.textContent = error.name === 'TypeError' || error.name === 'TimeoutError'
            ? 'Could not confirm your submission. Please check your connection and try again.'
            : error.message;
    } finally {
        contactSubmit.disabled = false;
        contactSubmit.textContent = 'Send message';
    }
});

