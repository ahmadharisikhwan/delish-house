/**
 * Delish House - Platform UMKM Kuliner Berbasis AI
 * Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Sticky & Scroll Effect
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Hamburger Menu Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close mobile menu when a nav link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 3. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Modal Pendaftaran UMKM Handling
  const registerModal = document.getElementById('registerModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const btnNavRegister = document.getElementById('btnNavRegister');
  const btnHeroRegister = document.getElementById('btnHeroRegister');
  const btnSolutionStart = document.getElementById('btnSolutionStart');
  const btnCtaRegister = document.getElementById('btnCtaRegister');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (registerModal) registerModal.classList.add('active');
  };

  const closeModal = () => {
    if (registerModal) registerModal.classList.remove('active');
  };

  if (btnNavRegister) btnNavRegister.addEventListener('click', openModal);
  if (btnHeroRegister) btnHeroRegister.addEventListener('click', openModal);
  if (btnSolutionStart) btnSolutionStart.addEventListener('click', openModal);
  if (btnCtaRegister) btnCtaRegister.addEventListener('click', openModal);

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        closeModal();
      }
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && registerModal && registerModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 5. Form Submission & Toast Notification
  const partnerForm = document.getElementById('partnerRegisterForm');
  const toast = document.getElementById('toastNotification');

  const showToast = (message) => {
    if (!toast) return;
    if (message) {
      const toastMsg = toast.querySelector('.toast-msg');
      if (toastMsg) toastMsg.textContent = message;
    }
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const vendorName = document.getElementById('vendorName')?.value || 'Mitra';
      closeModal();
      partnerForm.reset();
      showToast(`Terima kasih! Pendaftaran usaha "${vendorName}" berhasil kami terima.`);
    });
  }

  // 6. Interactive Demo Buttons
  const btnSolutionSample = document.getElementById('btnSolutionSample');
  const btnCtaExplore = document.getElementById('btnCtaExplore');

  if (btnSolutionSample) {
    btnSolutionSample.addEventListener('click', () => {
      const featureSection = document.getElementById('fitur');
      if (featureSection) {
        featureSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (btnCtaExplore) {
    btnCtaExplore.addEventListener('click', () => {
      const problemSection = document.getElementById('solusi');
      if (problemSection) {
        problemSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 7. Stat Counter Animation on Scroll
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let hasAnimatedStats = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 1800; // ms
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(timer);
          if (target === 10000) {
            stat.textContent = '10.000+';
          } else {
            stat.textContent = `${target}+`;
          }
        } else {
          const displayVal = Math.floor(current);
          if (target >= 1000) {
            stat.textContent = `${displayVal.toLocaleString('id-ID')}+`;
          } else {
            stat.textContent = `${displayVal}+`;
          }
        }
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('statistik');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }
});
