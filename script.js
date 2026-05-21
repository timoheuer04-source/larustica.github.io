document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const sections = document.querySelectorAll('.hero-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const openReserveBtns = document.querySelectorAll('.open-reserve-btn');
  const reserveOverlay = document.getElementById('reservation-overlay');
  const closeReserveBtn = document.querySelector('.close-overlay-btn');
  const backdrop = document.querySelector('.overlay-backdrop');


  // --- NATIVE SCROLL SNAPPING & TRANSITIONS ---

  // Navigation Links Click Handler
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Explore Links inside Content Cards Handler
  document.querySelectorAll('.explore-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      // Only intercept anchor links, let external page links navigate normally
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Intersection Observer to highlight active links & run card slide-ins
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -10% 0px', // slightly inset to trigger cleanly at center
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Add active class to animate section card in
        entry.target.classList.add('active');

        // Update navigation link highlights
        navLinks.forEach((link) => {
          const sectionName = link.getAttribute('data-section');
          if (sectionName === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update URL hash silently
        history.replaceState(null, null, `#${id}`);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Initial Load Hash Handling
  const initialHash = window.location.hash;
  if (initialHash) {
    const targetSection = document.querySelector(initialHash);
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'auto' });
        targetSection.classList.add('active');
      }, 100);
    }
  } else {
    if (sections.length > 0) {
      sections[0].classList.add('active');
    }
  }

  // --- RESERVATION & OPENING HOURS MODAL FLOW ---

  function openOverlay(e) {
    if (e) e.preventDefault();
    reserveOverlay.classList.add('open');
  }

  function closeOverlay() {
    reserveOverlay.classList.remove('open');
  }

  openReserveBtns.forEach((btn) => {
    btn.addEventListener('click', openOverlay);
  });

  closeReserveBtn.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);

  // Keyboard accessibility (Escape key to close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reserveOverlay.classList.contains('open')) {
      closeOverlay();
    }
  });
});
