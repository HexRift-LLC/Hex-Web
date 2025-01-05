// Add this JavaScript
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});
  document.addEventListener('DOMContentLoaded', () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-menu a');

      function updateActiveSection() {
          const scrollPosition = window.scrollY;

          sections.forEach(section => {
              const sectionTop = section.offsetTop - 100;
              const sectionHeight = section.offsetHeight;
              const sectionId = section.getAttribute('id');

              if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                  navLinks.forEach(link => {
                      link.classList.remove('active');
                  });
                  document.querySelector(`.nav-menu a[href*="${sectionId}"]`).classList.add('active');
              }
          });
      }

      window.addEventListener('scroll', updateActiveSection);
      updateActiveSection();

      navLinks.forEach(link => {
          link.addEventListener('click', e => {
              const sectionId = link.getAttribute('href').split('#')[1];
              if (sectionId) {
                  e.preventDefault();
                  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
              }
          });
      });
  });