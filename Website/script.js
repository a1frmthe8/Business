// Small interactive helpers for the portfolio website.
document.addEventListener('DOMContentLoaded', function () {
  const pageTransition = document.getElementById('page-transition');
  const resetPageTransition = () => {
    if (pageTransition) {
      pageTransition.classList.remove('show');
      document.body.classList.remove('is-transitioning');
    }
  };

  resetPageTransition();
  window.addEventListener('pageshow', resetPageTransition);

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      const open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open');
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = Array.from(document.querySelectorAll('.reveal'));

  if (prefersReduced) {
    reveals.forEach((r) => r.classList.add('visible'));
  } else {
    reveals.forEach((r, i) => {
      r.style.setProperty('--reveal-delay', `${i * 80}ms`);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach((el) => observer.observe(el));
  }

  if (pageTransition) {
    document.addEventListener('click', function (event) {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;

      event.preventDefault();
      document.body.classList.add('is-transitioning');
      pageTransition.classList.remove('show');
      void pageTransition.offsetWidth;
      pageTransition.classList.add('show');

      setTimeout(() => {
        window.location.href = href;
      }, 430);
    });
  }

  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach((container) => {
    const buttons = Array.from(container.querySelectorAll('.accordion-button'));
    buttons.forEach((btnEl, idx) => {
      const panelId = btnEl.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      btnEl.addEventListener('click', () => {
        const expanded = btnEl.getAttribute('aria-expanded') === 'true';
        btnEl.setAttribute('aria-expanded', String(!expanded));
        if (panel) {
          panel.hidden = expanded;
        }
      });

      btnEl.addEventListener('keydown', (event) => {
        const key = event.key;
        let newIndex = null;

        if (key === 'ArrowDown') newIndex = (idx + 1) % buttons.length;
        if (key === 'ArrowUp') newIndex = (idx - 1 + buttons.length) % buttons.length;
        if (key === 'Home') newIndex = 0;
        if (key === 'End') newIndex = buttons.length - 1;

        if (newIndex !== null) {
          event.preventDefault();
          buttons[newIndex].focus();
        }
      });
    });
  });

  const currencyRates = {
    GBP: 1,
    USD: 1.27,
    EUR: 1.17,
    AUD: 1.87,
    CAD: 1.72,
    CHF: 1.1,
    SEK: 12.3,
    NOK: 12.1,
    DKK: 8.7,
    PLN: 4.9,
    CZK: 28.8,
    HUF: 420,
    JPY: 189,
    CNY: 8.4,
    HKD: 9.9,
    TWD: 36.5,
    KRW: 1650,
    SGD: 1.77,
    MYR: 5.65,
    THB: 42.8,
    IDR: 18800,
    PHP: 69,
    VND: 30400,
    INR: 104,
    PKR: 330,
    BDT: 129,
    LKR: 375,
    NPR: 152,
    AED: 4.66,
    SAR: 4.77,
    EGP: 47,
    MAD: 12.2,
    TND: 3.4,
    NGN: 980,
    ZAR: 22.5,
    NZD: 1.96,
    MXN: 22.1,
    BRL: 6.2,
    ARS: 1150,
    CLP: 980,
    COP: 4200,
    PEN: 4.2,
    UYU: 49,
    BOB: 8.8,
    PYG: 8900,
    CRC: 630,
    GHS: 14,
    KES: 164,
    UGX: 4500,
    ETB: 116,
    RSD: 120,
    RON: 5.1,
    BGN: 2.3,
    HRK: 7.8,
    ISK: 160,
    TRY: 38,
    ILS: 4.2,
    RWF: 1450,
    KZT: 555,
    UAH: 43,
    RUB: 98,
    BYN: 3.6,
    GEL: 3,
    AMD: 500,
    AZN: 2.1,
    KGS: 100,
    UZS: 12500,
    MNT: 3800,
    MVR: 18,
    NIO: 43,
    GTQ: 9.6,
    HNL: 29,
    BZD: 2.54,
    BMD: 1.27,
    BSD: 1.27,
    XCD: 3.4,
    CUP: 33,
    DOP: 75,
    JMD: 188,
    BWP: 14,
    ZMW: 29,
    XOF: 655,
    XAF: 655,
    GNF: 10350,
    GMD: 74,
    CDF: 2800,
    OMR: 0.48,
    QAR: 4.76,
    BHD: 0.47,
    KWD: 0.39,
    YER: 317,
    IQD: 1500,
    IRR: 52000,
    AFN: 88,
    BTN: 96,
    ALL: 112,
    MKD: 62,
    BAM: 1.95,
    MRO: 430,
    SDG: 680,
    TZS: 2900,
    AOA: 930,
    MWK: 1780,
    ZWL: 390,
    BND: 1.8,
    GYD: 220,
    LRD: 200,
    SRD: 33,
    TTD: 7.4,
    TJS: 11.5,
    TMT: 3.5,
    JOD: 0.71,
    DZD: 149,
    MUR: 49,
    SCR: 15,
    MGA: 4800,
    SOS: 550,
    SLL: 23000,
    LSL: 19,
    SZL: 19,
    NAD: 19,
    MZN: 66,
    DJF: 190,
    ERN: 16,
    SSP: 1220,
    LYD: 5.2,
    MRU: 41,
    RWF: 1450,
    ETB: 116,
    CVE: 110,
    STN: 24,
    ANG: 2.06,
    SYP: 13,
    SLE: 25,
    BIF: 2800,
    HTG: 138,
    PAB: 1.27,
    CUC: 1.27,
    XPF: 120,
    KHR: 4300,
    LAK: 22000,
    MMK: 2100,
    VES: 35,
    DKK: 8.7,
    NOK: 12.1,
    SEK: 12.3,
    LBP: 1.1
  };

  const countryCurrencyMap = {
    AD: 'EUR', AE: 'AED', AF: 'AFN', AG: 'XCD', AI: 'XCD', AL: 'ALL', AM: 'AMD', AO: 'AOA', AR: 'ARS', AS: 'USD', AT: 'EUR', AU: 'AUD', AW: 'AWG', AZ: 'AZN', BA: 'BAM', BB: 'BBD', BD: 'BDT', BE: 'EUR', BF: 'XOF', BG: 'BGN', BH: 'BHD', BI: 'BIF', BJ: 'XOF', BL: 'EUR', BM: 'BMD', BN: 'BND', BO: 'BOB', BR: 'BRL', BS: 'BSD', BT: 'BTN', BW: 'BWP', BY: 'BYN', BZ: 'BZD', CA: 'CAD', CD: 'CDF', CF: 'XAF', CG: 'XAF', CH: 'CHF', CI: 'XOF', CL: 'CLP', CM: 'XAF', CN: 'CNY', CO: 'COP', CR: 'CRC', CU: 'CUP', CV: 'CVE', CW: 'ANG', CY: 'EUR', CZ: 'CZK', DE: 'EUR', DJ: 'DJF', DK: 'DKK', DM: 'XCD', DO: 'DOP', DZ: 'DZD', EC: 'USD', EE: 'EUR', EG: 'EGP', ER: 'ERN', ES: 'EUR', ET: 'ETB', FI: 'EUR', FR: 'EUR', GA: 'XAF', GB: 'GBP', GD: 'XCD', GE: 'GEL', GF: 'EUR', GH: 'GHS', GI: 'GIP', GL: 'DKK', GM: 'GMD', GN: 'GNF', GP: 'EUR', GQ: 'XAF', GR: 'EUR', GT: 'GTQ', GU: 'USD', GW: 'XOF', GY: 'GYD', HK: 'HKD', HN: 'HNL', HR: 'EUR', HT: 'HTG', HU: 'HUF', ID: 'IDR', IE: 'EUR', IL: 'ILS', IN: 'INR', IQ: 'IQD', IR: 'IRR', IS: 'ISK', IT: 'EUR', JM: 'JMD', JO: 'JOD', JP: 'JPY', KE: 'KES', KG: 'KGS', KH: 'KHR', KN: 'XCD', KP: 'KPW', KR: 'KRW', KW: 'KWD', KZ: 'KZT', LA: 'LAK', LB: 'LBP', LC: 'XCD', LI: 'CHF', LK: 'LKR', LR: 'LRD', LS: 'LSL', LT: 'EUR', LU: 'EUR', LV: 'EUR', LY: 'LYD', MA: 'MAD', MC: 'EUR', MD: 'MDL', ME: 'EUR', MG: 'MGA', MK: 'MKD', ML: 'XOF', MM: 'MMK', MN: 'MNT', MR: 'MRU', MT: 'EUR', MU: 'MUR', MV: 'MVR', MW: 'MWK', MX: 'MXN', MY: 'MYR', MZ: 'MZN', NA: 'NAD', NC: 'XPF', NE: 'XOF', NG: 'NGN', NI: 'NIO', NL: 'EUR', NO: 'NOK', NP: 'NPR', NZ: 'NZD', OM: 'OMR', PA: 'PAB', PE: 'PEN', PF: 'XPF', PG: 'PGK', PH: 'PHP', PK: 'PKR', PL: 'PLN', PT: 'EUR', PY: 'PYG', QA: 'QAR', RE: 'EUR', RO: 'RON', RS: 'RSD', RU: 'RUB', RW: 'RWF', SA: 'SAR', SC: 'SCR', SD: 'SDG', SE: 'SEK', SG: 'SGD', SI: 'EUR', SK: 'EUR', SL: 'SLE', SM: 'EUR', SN: 'XOF', SO: 'SOS', SR: 'SRD', SS: 'SSP', ST: 'STN', SV: 'USD', SX: 'ANG', SY: 'SYP', SZ: 'SZL', TD: 'XAF', TG: 'XOF', TH: 'THB', TJ: 'TJS', TN: 'TND', TO: 'TOP', TR: 'TRY', TT: 'TTD', TW: 'TWD', TZ: 'TZS', UA: 'UAH', UG: 'UGX', US: 'USD', UY: 'UYU', UZ: 'UZS', VC: 'XCD', VE: 'VES', VN: 'VND', VU: 'VUV', WF: 'XPF', XK: 'EUR', YE: 'YER', ZA: 'ZAR', ZM: 'ZMW', ZW: 'ZWL', UK: 'GBP'
  };

  function detectCurrencyFromLocale(customLocale) {
    const localeLower = (customLocale || navigator.language || 'en-GB').toLowerCase();
    const localeMatch = /-([a-z]{2})$/i.exec(localeLower) || /\(([a-z]{2})\)/i.exec(localeLower) || /([a-z]{2})$/i.exec(localeLower);
    const region = (localeMatch ? localeMatch[1] : 'gb').toUpperCase();
    return countryCurrencyMap[region] || 'GBP';
  }

  function getPreferredCurrency() {
    try {
      const stored = window.localStorage.getItem('preferred-currency');
      return stored || 'automatic';
    } catch (error) {
      return 'automatic';
    }
  }

  function setPreferredCurrency(value) {
    try {
      window.localStorage.setItem('preferred-currency', value);
    } catch (error) {
      // Ignore storage errors in restricted browsers.
    }
  }

  function populateCurrencySelector() {
    const select = document.getElementById('currency-select');
    if (!select) return;

    const detectedCurrency = detectCurrencyFromLocale();
    const allCurrencies = ['automatic', ...Object.keys(currencyRates).sort()];
    select.innerHTML = allCurrencies.map((code) => {
      const label = code === 'automatic' ? `Auto (${detectedCurrency})` : code;
      return `<option value="${code}">${label}</option>`;
    }).join('');

    const saved = getPreferredCurrency();
    select.value = saved === 'automatic' ? detectedCurrency : (saved || detectedCurrency);
  }

  async function fetchExchangeRate(targetCurrency) {
    const currency = targetCurrency || 'GBP';
    const endpoints = [
      `https://open.er-api.com/v6/latest/GBP`,
      `https://api.exchangerate.host/latest?base=GBP&symbols=${currency}`
    ];

    for (const url of endpoints) {
      try {
        const response = await fetch(url, { headers: { accept: 'application/json' } });
        if (!response.ok) continue;

        const data = await response.json();

        if (data && data.result === 'success' && data.rates) {
          const rate = Number(data.rates[currency]);
          if (Number.isFinite(rate) && rate > 0) {
            return rate;
          }
        }

        if (data && data.success && data.rates) {
          const rate = Number(data.rates[currency]);
          if (Number.isFinite(rate) && rate > 0) {
            return rate;
          }
        }
      } catch (error) {
        // Ignore failed attempts and move to the next provider.
      }
    }

    return currencyRates[currency] || 1;
  }

  async function localizePackagePrices(customLocale, forcedCurrency) {
    const locale = customLocale || navigator.language || 'en-GB';
    const storedCurrency = getPreferredCurrency();
    const activeCurrency = forcedCurrency || (storedCurrency === 'automatic' ? detectCurrencyFromLocale(locale) : storedCurrency);
    const rate = await fetchExchangeRate(activeCurrency);
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: activeCurrency,
      maximumFractionDigits: 0
    });

    document.querySelectorAll('.package-price').forEach((el) => {
      const min = Number(el.dataset.gbpMin || 0);
      const max = Number(el.dataset.gbpMax || min);
      const convertedMin = min * rate;
      const convertedMax = max * rate;

      if (min === max) {
        el.textContent = `${formatter.format(convertedMin)} / Custom`;
        return;
      }

      el.textContent = `${formatter.format(convertedMin)} to ${formatter.format(convertedMax)}`;
    });

    const select = document.getElementById('currency-select');
    if (select) {
      const nextValue = storedCurrency === 'automatic' ? activeCurrency : (storedCurrency || activeCurrency);
      select.value = nextValue;
    }

    return { locale, currency: activeCurrency, rate };
  }

  const selector = document.getElementById('currency-select');
  if (selector) {
    selector.addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      setPreferredCurrency(selectedValue);
      localizePackagePrices(undefined, selectedValue === 'automatic' ? detectCurrencyFromLocale() : selectedValue);
    });
  }

  populateCurrencySelector();
  window.localizePackagePrices = localizePackagePrices;
  localizePackagePrices();

  (function prefillContactFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const pkg = params.get('package');
    if (!pkg) return;

    const pkgSelect = document.getElementById('package-select');
    const message = document.getElementById('message');
    if (pkgSelect) {
      const opt = Array.from(pkgSelect.options).find((option) => option.value.toLowerCase() === pkg.toLowerCase());
      pkgSelect.value = opt ? opt.value : 'Other';
    }

    if (message && (!message.value || message.value.trim().length === 0)) {
      const prefix = `Interested in the ${pkg} package.`;
      message.value = `${prefix}\n\nPlease share a short description of your project and timeline.`;
    }
  })();
});
