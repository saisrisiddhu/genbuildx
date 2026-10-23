(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Split hero headline into animated words (keeps the gradient span intact)
  document.querySelectorAll('.split').forEach((el) => {
    let i = 0;
    const wrapWords = (text, cls) => text.split(/(\s+)/).map((part) => {
      if (!part.trim()) return document.createTextNode(part);
      const w = document.createElement('span');
      w.className = 'w';
      const inner = document.createElement('span');
      if (cls) inner.className = cls;
      inner.style.setProperty('--i', i++);
      inner.textContent = part;
      w.appendChild(inner);
      return w;
    });
    const nodes = [...el.childNodes];
    el.textContent = '';
    nodes.forEach((node) => {
      const parts = node.nodeType === Node.TEXT_NODE
        ? wrapWords(node.textContent)
        : wrapWords(node.textContent, node.className);
      parts.forEach((p) => el.appendChild(p));
    });
  });

  // Nav background, scroll progress, lifecycle line
  const bar = document.getElementById('progressBar');
  const flowFill = document.getElementById('flowFill');
  const flowWrap = document.querySelector('.flow-wrap');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (flowFill && flowWrap) {
      const r = flowWrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.3)));
      flowFill.style.transform = `scaleX(${p})`;
    }
    ticking = false;
  };
  onScroll();
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenu(false); });

  // Highlight the nav link for the section in view
  const navMap = new Map([...links.querySelectorAll('a[href^="#"]:not(.btn)')].map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const a = navMap.get(entry.target.id);
        if (a && entry.isIntersecting) {
          navMap.forEach((l) => l.classList.remove('is-current'));
          a.classList.add('is-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  // Cursor spotlight + 3D tilt on cards (mouse/trackpad only)
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  // Generic accessible tab group helper
  const tabGroup = (buttons, onSelect) => {
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => onSelect(btn, i));
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
        const next = buttons[(i + dir + buttons.length) % buttons.length];
        onSelect(next, buttons.indexOf(next));
        next.focus();
      });
    });
  };

  // AI stack layers
  const layers = [...document.querySelectorAll('.layer')];
  const plates = [...document.querySelectorAll('.iso__plate')];
  const details = [...document.querySelectorAll('.detail')];
  let stackTimer;
  const selectLayer = (btn, idx) => {
    layers.forEach((l, i) => {
      const on = i === idx;
      l.classList.toggle('is-active', on);
      l.setAttribute('aria-selected', String(on));
      l.tabIndex = on ? 0 : -1;
    });
    plates.forEach((p, i) => p.classList.toggle('is-active', i === idx));
    details.forEach((d, i) => { d.hidden = i !== idx; d.classList.toggle('is-active', i === idx); });
  };
  tabGroup(layers, (btn, idx) => { clearInterval(stackTimer); selectLayer(btn, idx); });
  plates.forEach((p, i) => p.addEventListener('pointerenter', () => { clearInterval(stackTimer); selectLayer(layers[i], i); }));
  // Auto-cycle until the visitor interacts
  if (!reduceMotion && layers.length) {
    let cur = 0;
    const stackEl = document.querySelector('.stack__body');
    const start = () => {
      stackTimer = setInterval(() => { cur = (cur + 1) % layers.length; selectLayer(layers[cur], cur); }, 3200);
    };
    const so = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { start(); so.disconnect(); }
    }, { threshold: 0.4 });
    so.observe(stackEl);
    stackEl.addEventListener('pointerdown', () => clearInterval(stackTimer));
  }

  // Solution tabs
  const tabs = [...document.querySelectorAll('.tab')];
  tabGroup(tabs, (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
  });

  // Contact form: Web3Forms, with a friendly direct-email fallback for any failure
  // (monthly quota, rate limits, outages, timeouts, offline). Visitors never see technical errors.
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submit = document.getElementById('formSubmit');
  const fallback = document.getElementById('formFallback');
  const fbGmail = document.getElementById('fbGmail');
  const fbMail = document.getElementById('fbMail');
  const fbCopy = document.getElementById('fbCopy');
  const TO = 'letsconnect@genbuildx.com';
  const TIMEOUT_MS = 15000;
  let sending = false;

  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.className = `form__status${kind ? ` is-${kind}` : ''}`;
  };
  const compose = (d) => {
    const subject = `Website enquiry: ${d.interest} | ${d.name}${d.organisation ? ` (${d.organisation})` : ''}`;
    const details = [`Name: ${d.name}`, d.organisation && `Organisation: ${d.organisation}`, `Email: ${d.email}`, d.phone && `Phone: ${d.phone}`, `Area of interest: ${d.interest}`].filter(Boolean).join('\n');
    return { subject, body: `${details}\n\n${d.message}` };
  };
  const showFallback = ({ subject, body }) => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    fbGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${TO}&su=${s}&body=${b}`;
    fbMail.href = `mailto:${TO}?subject=${s}&body=${b}`;
    fbCopy.onclick = async () => {
      const text = `To: ${TO}\nSubject: ${subject}\n\n${body}`;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* ignore */ }
        ta.remove();
      }
      fbCopy.textContent = 'Copied!';
      setTimeout(() => { fbCopy.textContent = 'Copy message'; }, 2000);
    };
    fallback.hidden = false;
  };
  const fail = (msg, mail) => {
    setStatus(msg, 'err');
    showFallback(mail);
  };

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const ok = field.value.trim() !== '' && (field.type !== 'email' || /^\S+@\S+\.\S+$/.test(field.value.trim()));
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      setStatus('Please fill in your name, a valid email address and your project details.', 'err');
      form.querySelector('.is-invalid').focus();
      return;
    }
    const d = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    if (d.botcheck) return;
    const mail = compose(d);
    const key = form.dataset.key;
    fallback.hidden = true;

    if (!key || key.startsWith('__')) {
      setStatus('Please send your enquiry using one of the options below.', '');
      showFallback(mail);
      return;
    }
    if (navigator.onLine === false) {
      fail('You seem to be offline. Please check your internet connection and try again, or use one of the options below.', mail);
      return;
    }

    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    setStatus('');
    const controller = 'AbortController' in window ? new AbortController() : null;
    const timer = controller && setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: mail.subject,
          from_name: 'GenBuildX Website',
          name: d.name,
          email: d.email,
          organisation: d.organisation || '-',
          phone: d.phone || '-',
          interest: d.interest,
          message: d.message,
          botcheck: false,
        }),
        signal: controller ? controller.signal : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success !== true) throw new Error('send-failed');
      form.reset();
      setStatus('Thank you! Your enquiry has been sent. Our team will get back to you soon.', 'ok');
    } catch (err) {
      // Any failure (quota reached, rate limit, server or network error) gets the same calm message;
      // the visitor's text is kept in the form and offered through direct email instead.
      const timedOut = err && err.name === 'AbortError';
      fail(timedOut
        ? 'This is taking longer than expected. Please send your enquiry directly using one of the options below.'
        : "We couldn't send your message just now. Please send it directly using one of the options below, and we'll respond just as quickly.", mail);
    } finally {
      if (timer) clearTimeout(timer);
      sending = false;
      submit.disabled = false;
      submit.textContent = 'Send Enquiry';
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
