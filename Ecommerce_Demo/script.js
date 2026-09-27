document.addEventListener('DOMContentLoaded', () => {
  const pageTransition = document.getElementById('page-transition');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const searchPanel = document.getElementById('search-panel');
  const searchOverlay = document.getElementById('search-overlay');
  const searchToggle = document.getElementById('search-toggle');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const cartStorageKey = 'north-and-pine-cart';

  const catalogProducts = [
    { name: 'Solace Lamp', price: 89, description: 'Warm ambient lighting for evenings that feel calm, layered, and intentional.' },
    { name: 'Dayglass Watch', price: 149, description: 'Minimal daily tracking with a polished profile that feels refined and easy.' },
    { name: 'Morning Bottle', price: 64, description: 'Double-walled hydration for commuting, meetings, and mindful daily rituals.' },
    { name: 'Drift Pack', price: 129, description: 'Clean-lined carry storage with quiet texture and a functional, refined finish.' },
    { name: 'Hearth Tray', price: 118, description: 'Stoneware serving tray designed for slower mornings and beautifully styled tables.' },
    { name: 'Bloom Candle', price: 42, description: 'Clean-burning fragrance with a soft mineral scent for brighter, calmer evenings.' },
    { name: 'North Journal', price: 76, description: 'Thoughtful planning paper for ideas, notes, and the rituals that keep your day moving.' },
    { name: 'Harbor Tote', price: 95, description: 'Roomy, structured carryall for workdays, weekends, and everyday movement.' },
    { name: 'Linen Throw', price: 68, description: 'Soft woven warmth for a sofa, reading chair, or the end of a long day.' },
    { name: 'Arc Chair', price: 210, description: 'Comfort-forward seating with sculptural lines for reading nooks and corners.' },
    { name: 'Soleil Vase', price: 54, description: 'Textured ceramic styling piece that adds warmth, shape, and softness to shelves.' },
    { name: 'Cove Mug', price: 28, description: 'Hand-finished ceramic mug designed for slower starts and deeper coffee rituals.' }
  ];

  const defaultCart = [
    { name: 'Solace Lamp', price: 89, qty: 1 },
    { name: 'Morning Bottle', price: 64, qty: 1 }
  ];

  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(cartStorageKey) || 'null');
      if (Array.isArray(saved) && saved.length) {
        return saved;
      }
    } catch (error) {
      console.warn('Unable to load cart from localStorage', error);
    }

    return defaultCart;
  };

  let cart = loadCart();

  const persistCart = () => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  };

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const getCatalogList = () => catalogProducts;

  const updateCartBadge = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = String(totalQty);
  };

  const syncCartState = () => {
    persistCart();
    updateCartBadge();
    if (document.getElementById('cart-review-items')) {
      renderCartReview();
    }
    if (document.getElementById('checkout-summary-items')) {
      renderCheckoutSummary();
    }
  };

  const renderCart = () => {
    if (!cartItems || !subtotalEl || !totalEl) return;

    if (!cart.length) {
      cartItems.innerHTML = '<li class="cart-empty">Your cart is empty. Add a few favorites to get started.</li>';
      subtotalEl.textContent = formatCurrency(0);
      totalEl.textContent = formatCurrency(0);
      updateCartBadge();
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartItems.innerHTML = cart.map((item) => {
      const thumbClass = {
        'Solace Lamp': 'thumb-one',
        'Dayglass Watch': 'thumb-two',
        'Morning Bottle': 'thumb-three',
        'Drift Pack': 'thumb-four'
      }[item.name] || 'thumb-one';

      return `
        <li class="cart-item">
          <span class="cart-thumb ${thumbClass}"></span>
          <div class="cart-item-details">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">${formatCurrency(item.price)} each</span>
          </div>
          <div class="cart-item-controls">
            <div class="qty-control" aria-label="Quantity controls for ${item.name}">
              <button class="qty-btn" type="button" data-name="${item.name}" data-change="-1" aria-label="Decrease quantity for ${item.name}">−</button>
              <span class="qty-badge">${item.qty}</span>
              <button class="qty-btn" type="button" data-name="${item.name}" data-change="1" aria-label="Increase quantity for ${item.name}">+</button>
            </div>
            <button class="cart-item-remove" type="button" data-name="${item.name}" aria-label="Remove ${item.name}">×</button>
          </div>
        </li>
      `;
    }).join('');

    subtotalEl.textContent = formatCurrency(subtotal);
    totalEl.textContent = formatCurrency(subtotal);
    updateCartBadge();
    persistCart();

    cartItems.querySelectorAll('.qty-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const itemName = button.dataset.name;
        const change = Number(button.dataset.change || 0);
        const index = cart.findIndex((item) => item.name === itemName);
        if (index === -1) return;

        const nextQty = cart[index].qty + change;
        if (nextQty <= 0) {
          cart.splice(index, 1);
        } else {
          cart[index].qty = nextQty;
        }

        renderCart();
        syncCartState();
      });
    });

    cartItems.querySelectorAll('.cart-item-remove').forEach((button) => {
      button.addEventListener('click', () => {
        const itemName = button.dataset.name;
        const index = cart.findIndex((item) => item.name === itemName);
        if (index === -1) return;

        cart.splice(index, 1);
        renderCart();
        syncCartState();
      });
    });
  };

  const openCart = () => {
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
    if (cartOverlay) {
      cartOverlay.hidden = false;
      requestAnimationFrame(() => cartOverlay.classList.add('visible'));
    }
  };

  const closeCart = () => {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
    if (cartOverlay) {
      cartOverlay.classList.remove('visible');
      setTimeout(() => {
        cartOverlay.hidden = true;
      }, 180);
    }
  };

  const addProductToCart = (name, price) => {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();
    openCart();
    persistCart();
  };

  const renderSearchResultsFromCatalog = () => {
    if (!searchResults || !searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const matches = getCatalogList().filter((item) => {
      const searchable = `${item.name} ${item.description}`.toLowerCase();
      return !query || searchable.includes(query);
    });

    if (!matches.length) {
      searchResults.innerHTML = '<li class="search-empty">No products match your search.</li>';
      return;
    }

    searchResults.innerHTML = matches.map((item) => `
      <li>
        <button class="search-result" type="button" data-name="${item.name}" data-price="${item.price}">
          <span class="search-meta">
            <strong>${item.name}</strong>
            <span>${item.description}</span>
          </span>
          <strong>${formatCurrency(item.price)}</strong>
        </button>
      </li>
    `).join('');

    searchResults.querySelectorAll('.search-result').forEach((button) => {
      button.addEventListener('click', () => {
        addProductToCart(button.dataset.name, Number(button.dataset.price));
        closeSearch();
      });
    });
  };

  const renderCartReview = () => {
    const reviewList = document.getElementById('cart-review-items');
    const subtotalEl = document.getElementById('cart-review-subtotal');
    const totalEl = document.getElementById('cart-review-total');
    const discountEl = document.getElementById('promo-discount');
    const promoInput = document.getElementById('promo-code');
    const promoNote = document.getElementById('promo-note');

    if (!reviewList) return;

    if (!cart.length) {
      reviewList.innerHTML = '<li class="cart-empty">Your cart is empty. Start shopping to add favorites.</li>';
      if (subtotalEl) subtotalEl.textContent = formatCurrency(0);
      if (totalEl) totalEl.textContent = formatCurrency(0);
      if (discountEl) discountEl.textContent = '-$0.00';
      if (promoNote) promoNote.textContent = 'Add an item to continue.';
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promoCode = (promoInput ? promoInput.value.trim().toUpperCase() : '');
    const discountAmount = promoCode === 'SAVE10' ? subtotal * 0.1 : 0;
    const total = subtotal - discountAmount;

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (discountEl) discountEl.textContent = `-${formatCurrency(discountAmount)}`;
    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (promoNote) {
      promoNote.textContent = promoCode === 'SAVE10' ? 'Promo applied: SAVE10' : 'Use code SAVE10 for 10% off.';
    }

    reviewList.innerHTML = cart.map((item) => {
      const thumbClass = {
        'Solace Lamp': 'thumb-one',
        'Dayglass Watch': 'thumb-two',
        'Morning Bottle': 'thumb-three',
        'Drift Pack': 'thumb-four'
      }[item.name] || 'thumb-one';

      return `
        <li class="cart-review-item">
          <span class="cart-thumb ${thumbClass}"></span>
          <div class="cart-review-copy">
            <strong>${item.name}</strong>
            <span>${formatCurrency(item.price)} each</span>
          </div>
          <div class="cart-review-actions">
            <div class="qty-control" aria-label="Quantity controls for ${item.name}">
              <button class="qty-btn" type="button" data-name="${item.name}" data-change="-1">−</button>
              <span class="qty-badge">${item.qty}</span>
              <button class="qty-btn" type="button" data-name="${item.name}" data-change="1">+</button>
            </div>
            <button class="cart-item-remove review-remove" type="button" data-name="${item.name}" aria-label="Remove ${item.name}">Remove</button>
          </div>
        </li>
      `;
    }).join('');

    reviewList.querySelectorAll('.qty-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const itemName = button.dataset.name;
        const change = Number(button.dataset.change || 0);
        const index = cart.findIndex((item) => item.name === itemName);
        if (index === -1) return;

        const nextQty = cart[index].qty + change;
        if (nextQty <= 0) {
          cart.splice(index, 1);
        } else {
          cart[index].qty = nextQty;
        }

        persistCart();
        renderCart();
        renderCartReview();
      });
    });

    reviewList.querySelectorAll('.review-remove').forEach((button) => {
      button.addEventListener('click', () => {
        const itemName = button.dataset.name;
        const index = cart.findIndex((item) => item.name === itemName);
        if (index === -1) return;

        cart.splice(index, 1);
        persistCart();
        renderCart();
        renderCartReview();
      });
    });
  };

  const renderCheckoutSummary = () => {
    const summaryItems = document.getElementById('checkout-summary-items');
    const summarySubtotal = document.getElementById('checkout-subtotal');
    const summaryTotal = document.getElementById('checkout-total');
    const summaryDiscount = document.getElementById('checkout-discount');

    if (!summaryItems) return;

    if (!cart.length) {
      summaryItems.innerHTML = '<li class="cart-empty">No items in your cart.</li>';
      if (summarySubtotal) summarySubtotal.textContent = formatCurrency(0);
      if (summaryDiscount) summaryDiscount.textContent = '-$0.00';
      if (summaryTotal) summaryTotal.textContent = formatCurrency(0);
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promoCode = (document.getElementById('promo-code') || document.getElementById('checkout-promo-code'))?.value.trim().toUpperCase() || '';
    const discountAmount = promoCode === 'SAVE10' ? subtotal * 0.1 : 0;
    const total = subtotal - discountAmount;

    summaryItems.innerHTML = cart.map((item) => `
      <li class="summary-item-row">
        <span>${item.name} x ${item.qty}</span>
        <strong>${formatCurrency(item.price * item.qty)}</strong>
      </li>
    `).join('');

    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(subtotal);
    if (summaryDiscount) summaryDiscount.textContent = `-${formatCurrency(discountAmount)}`;
    if (summaryTotal) summaryTotal.textContent = formatCurrency(total);
  };

  const bindViewCartButtons = () => {
    document.querySelectorAll('.view-cart-btn').forEach((button) => {
      if (button.dataset.bound === 'true') return;

      button.addEventListener('click', () => {
        if (window.location.pathname.endsWith('cart.html')) return;
        window.location.assign('cart.html');
      });

      button.dataset.bound = 'true';
    });
  };

  const attachCartReviewHandlers = () => {
    const promoForm = document.getElementById('promo-form');
    const promoInput = document.getElementById('promo-code');
    const checkoutButton = document.getElementById('checkout-btn');

    if (promoForm && promoInput) {
      promoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        renderCartReview();
        renderCheckoutSummary();
      });
    }

    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
      });
    }
  };

  const attachCheckoutHandlers = () => {
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderButton = document.getElementById('place-order');

    if (checkoutForm && placeOrderButton) {
      placeOrderButton.addEventListener('click', () => {
        if (!checkoutForm.reportValidity()) return;

        localStorage.setItem(cartStorageKey, JSON.stringify([]));
        cart = [];
        renderCart();
        placeOrderButton.textContent = 'Order placed';
        placeOrderButton.disabled = true;

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });
    }
  };

  const openSearch = () => {
    if (searchPanel) {
      searchPanel.classList.add('open');
      searchPanel.setAttribute('aria-hidden', 'false');
    }
    if (searchOverlay) {
      searchOverlay.hidden = false;
      requestAnimationFrame(() => searchOverlay.classList.add('visible'));
    }
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }

    renderSearchResultsFromCatalog();
  };

  const closeSearch = () => {
    if (searchPanel) {
      searchPanel.classList.remove('open');
      searchPanel.setAttribute('aria-hidden', 'true');
    }
    if (searchOverlay) {
      searchOverlay.classList.remove('visible');
      setTimeout(() => {
        searchOverlay.hidden = true;
      }, 180);
    }
    if (searchInput) {
      searchInput.value = '';
      renderSearchResultsFromCatalog();
    }
  };

  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      const isOpen = cartDrawer && cartDrawer.classList.contains('open');
      if (isOpen) {
        closeCart();
      } else {
        openCart();
      }
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      const isOpen = searchPanel && searchPanel.classList.contains('open');
      if (isOpen) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', closeSearch);
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', renderSearchResultsFromCatalog);
    renderSearchResultsFromCatalog();
  }

  bindViewCartButtons();

  if (document.getElementById('cart-review-items')) {
    renderCartReview();
    attachCartReviewHandlers();
  }

  if (document.getElementById('checkout-form')) {
    renderCheckoutSummary();
    attachCheckoutHandlers();
  }

  const resetPageTransition = () => {
    if (pageTransition) {
      pageTransition.classList.remove('show');
    }
  };

  resetPageTransition();
  window.addEventListener('pageshow', resetPageTransition);

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add('visible'));
  } else {
    reveals.forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${index * 70}ms`);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    reveals.forEach((el) => observer.observe(el));
  }

  if (pageTransition) {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return;
      }

      event.preventDefault();
      pageTransition.classList.add('show');
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  }

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      addProductToCart(name, price);
      button.textContent = 'Added';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = 'Add to cart';
        button.disabled = false;
      }, 600);
    });
  });

  renderCart();
});
