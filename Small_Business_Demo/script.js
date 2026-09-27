document.addEventListener('DOMContentLoaded', () => {
  let transition = document.getElementById('page-transition');
  if (!transition) {
    transition = document.createElement('div');
    transition.id = 'page-transition';
    transition.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(transition, document.body.firstChild);
  }

  const resetPageTransition = () => {
    transition.classList.remove('show');
  };

  const showPageTransition = () => {
    transition.classList.add('show');
  };

  resetPageTransition();
  window.addEventListener('pageshow', resetPageTransition);
  window.addEventListener('popstate', resetPageTransition);

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    revealEls.forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${index * 80}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || link.target === '_blank') {
      return;
    }

    event.preventDefault();
    showPageTransition();

    setTimeout(() => {
      window.location.href = href;
    }, 360);
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = document.getElementById('form-status');
      const button = contactForm.querySelector('button[type="submit"]');

      if (status) {
        status.textContent = 'Thanks! Your message has been captured and we will reach out soon.';
        status.hidden = false;
      }

      if (button) {
        button.textContent = 'Message sent';
        button.disabled = true;
      }
    });
  }
});
