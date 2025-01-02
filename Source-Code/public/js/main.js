// Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {

    // Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                const response = await fetch('/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert(data.error || 'Something went wrong');
                }
            } catch (error) {
                alert('Failed to send message');
            }
        });
    }

  
});

// Smooth scroll and section animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    // IntersectionObserver for section visibility animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();  // Prevent default anchor link behavior

            const target = document.querySelector(this.getAttribute('href'));  // Get target of the link
            if (target) {
                // Scroll to target with smooth behavior
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'  // Align to the start of the section
                });
            }
        });
    });

    // Smooth scroll for Home link (scroll to top of the page)
    const homeLink = document.querySelector('.menu a[href="/"]');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();  // Prevent page reload
            window.scrollTo({
                top: 0,
                behavior: 'smooth'  // Smooth scroll to top
            });
        });
    }
});

// Event listener for smooth scrolling
document.querySelectorAll('.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor link behavior

        // Get the target element's id from the href attribute
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        // If the target element exists, scroll to it
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 50, // Optional offset to adjust for fixed navbar
                behavior: 'smooth' // Smooth scrolling
            });
        }
    });
});

// Function to update the current year in the footer
document.addEventListener('DOMContentLoaded', function () {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    } else {
        console.warn('Element with ID "currentYear" not found');
    }
});

// Add event listener to the store link
document.querySelector('.store-link').addEventListener('click', function (event) {
    event.preventDefault();  // Prevent the default link click behavior (page reload)

    // Navigate to the store page
    window.location.href = '/store';

    // After the page is loaded, apply smooth scroll using JavaScript
    window.onload = function () {
        // Scroll to the top (or any specific element on the store page)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
});
