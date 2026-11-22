(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = id => document.getElementById(id);

  const TAB_ORDER = ['kasir', 'antrean', 'buku-bon', 'pasokan', 'rekap-kas', 'dashboard'];
  const COUNT_IDS = [
    'subtotalDisplay', 'cashierStockCount', 'cashierStockWeight', 'stockRemaining', 'stockWeight',
    'queueCount', 'queueTotalEkor', 'queueWaiting', 'headerTotalDebt', 'headerDebtorCount',
    'dashTotalOmzet', 'dashTotalTrx', 'dashTotalProfit', 'dashMargin', 'dashTotalKg',
    'dashTotalChickens', 'dashShrinkage', 'dashTotalDebt', 'dashDebtorCount',
    'monthRevenue', 'monthProfit', 'monthTransactions', 'monthVolume',
    'rekapKasBersihLaci', 'rekapCashSales', 'rekapCashCicilan', 'rekapModalPasokan',
    'reportCashIn', 'rekapKgSold', 'rekapEkorSold', 'rekapBonKeluar', 'reportRecordCount',
    'custBalanceAmount', 'supplyStockEkor', 'supplyStockKg', 'supplyPreviewTotal'
  ];
  const BUMP_IDS = new Set(['subtotalDisplay', 'headerTotalDebt', 'rekapKasBersihLaci']);
  const FAST_IDS = new Set(['subtotalDisplay', 'supplyPreviewTotal']);
  const REVEAL_SELECTOR = '.surface-card, .dash-kpi-card, .report-filter, .filter-pills-row, .dash-header-bar, .drawer-highlight-card, .cashier-progress';
  const NUMBER_PATTERN = /-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/;

  function restart(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    element.addEventListener('animationend', () => element.classList.remove(className), {once: true});
  }

  function initScrollEffects() {
    const bar = document.createElement('div');
    bar.className = 'pt-scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const header = $('.app-header');
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, {passive: true});
    window.addEventListener('resize', update);
    update();
  }

  function initRipple() {
    const selector = '.btn-primary-action, .queue-next, .btn-card-pay, .btn-card-wa, .preset-pill, .stepper-btn, .tara-button, .pay-select-btn, .segment-btn, .bnav-item';
    document.addEventListener('pointerdown', event => {
      if (reduceMotion.matches || event.button > 0) return;
      const host = event.target.closest(selector);
      if (!host || host.disabled || host.getAttribute('aria-disabled') === 'true') return;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.style.overflow = 'hidden';
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'pt-ripple run';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
      host.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), {once: true});
    }, {passive: true});
  }

  function parseDisplay(text) {
    const match = NUMBER_PATTERN.exec(text);
    if (!match) return null;
    const raw = match[0];
    return {
      value: parseFloat(raw.replace(/\./g, '').replace(',', '.')),
      decimals: raw.includes(',') ? raw.split(',')[1].length : 0,
      before: text.slice(0, match.index),
      after: text.slice(match.index + raw.length)
    };
  }

  function initCountUp() {
    const store = new WeakMap();
    let observer;
    const write = (element, text) => {
      element.textContent = text;
      observer.takeRecords();
    };
    const run = element => {
      const target = element.textContent;
      const parsed = parseDisplay(target);
      const entry = store.get(element) || {last: null, shown: null, frame: 0};
      store.set(element, entry);
      cancelAnimationFrame(entry.frame);
      if (!parsed) { entry.last = entry.shown = null; return; }
      const from = entry.shown != null ? entry.shown : (entry.last != null ? entry.last : 0);
      entry.last = parsed.value;
      if (reduceMotion.matches || !element.offsetParent || from === parsed.value) { entry.shown = parsed.value; return; }
      const duration = FAST_IDS.has(element.id) ? 320 : 640;
      const start = performance.now();
      const format = value => value.toLocaleString('id-ID', {minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals});
      const tick = now => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = from + (parsed.value - from) * eased;
        entry.shown = current;
        if (progress < 1) {
          write(element, parsed.before + format(current) + parsed.after);
          entry.frame = requestAnimationFrame(tick);
        } else {
          entry.shown = parsed.value;
          write(element, target);
          if (BUMP_IDS.has(element.id)) restart(element, 'pt-bump');
        }
      };
      entry.frame = requestAnimationFrame(tick);
    };
    observer = new MutationObserver(records => {
      const touched = new Set();
      records.forEach(record => {
        const element = record.target.nodeType === 3 ? record.target.parentElement : record.target;
        if (element && COUNT_IDS.includes(element.id)) touched.add(element);
      });
      touched.forEach(run);
    });
    COUNT_IDS.forEach(id => {
      const element = byId(id);
      if (!element) return;
      const parsed = parseDisplay(element.textContent);
      store.set(element, {last: parsed ? parsed.value : null, shown: parsed ? parsed.value : null, frame: 0});
      observer.observe(element, {childList: true, characterData: true, subtree: true});
    });
    window.PTCountUp = {
      replay(root) {
        COUNT_IDS.forEach(id => {
          const element = byId(id);
          if (!element || !(root === document || root.contains(element))) return;
          const entry = store.get(element);
          if (entry) { entry.last = entry.shown = null; }
          run(element);
        });
      }
    };
  }

  function initTabReveal() {
    const title = byId('pageTitle');
    let booted = false;
    $$('.tab-pane').forEach(pane => {
      let wasActive = pane.classList.contains('active');
      new MutationObserver(() => {
        const isActive = pane.classList.contains('active');
        const entered = isActive && !wasActive;
        wasActive = isActive;
        if (!entered || !booted) return;
        if (title) restart(title, 'pt-title');
        if (!reduceMotion.matches) {
          $$(REVEAL_SELECTOR, pane).filter(node => node.offsetParent).slice(0, 10).forEach((node, index) => {
            node.style.setProperty('--pt-i', index);
            node.classList.remove('pt-reveal');
            void node.offsetWidth;
            node.classList.add('pt-reveal');
            node.addEventListener('animationend', () => node.classList.remove('pt-reveal'), {once: true});
          });
        }
        window.PTCountUp.replay(pane);
        if (pane.id === 'buku-bon') window.PTCountUp.replay(byId('bonHeroMetrics') || pane);
        if (pane.id === 'dashboard') growDashboard(pane);
      }).observe(pane, {attributes: true, attributeFilter: ['class']});
    });
    requestAnimationFrame(() => { booted = true; });
  }

  function growDashboard(pane) {
    if (reduceMotion.matches) return;
    $$('.chart-bar', pane).forEach((bar, index) => bar.style.setProperty('--pt-i', index));
    pane.classList.add('pt-grow');
    setTimeout(() => pane.classList.remove('pt-grow'), 1400);
  }

  function initStepFlow() {
    const one = byId('stepOneBtn');
    const two = byId('stepTwoBtn');
    if (!one || !two) return;
    const sync = () => {
      const done = two.classList.contains('active');
      if (one.classList.contains('is-done') !== done) one.classList.toggle('is-done', done);
    };
    const observer = new MutationObserver(sync);
    observer.observe(two, {attributes: true, attributeFilter: ['class']});
    sync();
  }

  function initKasirLive() {
    const ekor = byId('inputEkor');
    const kg = byId('inputKg');
    const price = byId('inputPrice');
    const note = $('.quantity-card .stepper-center p');
    if (!ekor || !kg || !note) return;
    note.classList.add('pt-avg');
    const defaultText = note.textContent;
    const update = () => {
      const heads = Number(ekor.value);
      const weight = typeof parseNumber === 'function' ? Number(parseNumber(kg.value)) : NaN;
      if (!(heads > 0) || !(weight > 0) || !Number.isFinite(weight)) {
        note.textContent = defaultText;
        note.removeAttribute('data-level');
        return;
      }
      const average = weight / heads;
      const level = average < 1.2 ? 'low' : average > 2.8 ? 'high' : 'ok';
      const text = 'Rata-rata ' + average.toLocaleString('id-ID', {maximumFractionDigits: 2}) + ' kg / ekor' +
        (level === 'ok' ? '' : ' - cek bobot atau jumlah');
      if (note.textContent !== text) note.textContent = text;
      note.dataset.level = level;
    };
    ['input', 'change'].forEach(name => {
      ekor.addEventListener(name, update);
      kg.addEventListener(name, update);
    });
    document.addEventListener('click', event => {
      if (event.target.closest('.stepper-btn, .qw-btn, #btnTara, #btnResetTrx')) setTimeout(update, 0);
    });
    update();

    const nudge = (input, event, steps, format) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      const current = format.read(input.value);
      const base = Number.isFinite(current) ? current : 0;
      const size = event.shiftKey ? steps.large : event.altKey ? steps.small : steps.normal;
      const next = Math.max(0, base + (event.key === 'ArrowUp' ? size : -size));
      input.value = format.write(next);
      input.dispatchEvent(new Event('input', {bubbles: true}));
    };
    kg.addEventListener('keydown', event => nudge(kg, event, {small: 0.01, normal: 0.1, large: 1}, {
      read: value => Number(parseNumber(value)),
      write: value => (Math.round(value * 100) / 100).toFixed(2).replace('.', ',')
    }));
    if (price) price.addEventListener('keydown', event => nudge(price, event, {small: 100, normal: 500, large: 5000}, {
      read: value => Number(parseCurrency(value)),
      write: value => Math.round(value).toLocaleString('id-ID')
    }));
  }

  function initStepperHold() {
    let startTimer = 0;
    let repeatTimer = 0;
    let held = false;
    const stop = () => { clearTimeout(startTimer); clearInterval(repeatTimer); };
    document.addEventListener('pointerdown', event => {
      const button = event.target.closest('.stepper-btn');
      if (!button || button.disabled || event.button > 0) return;
      held = false;
      stop();
      startTimer = setTimeout(() => {
        held = true;
        repeatTimer = setInterval(() => button.click(), 110);
      }, 420);
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(name => document.addEventListener(name, stop, true));
    document.addEventListener('click', event => {
      if (event.isTrusted && held && event.target.closest('.stepper-btn')) {
        event.stopImmediatePropagation();
        event.preventDefault();
        held = false;
      }
    }, true);
  }

  function initShortcuts() {
    TAB_ORDER.forEach((tab, index) => {
      const button = $('.bnav-item[data-tab="' + tab + '"]');
      if (button) button.title = button.textContent.trim().replace(/\s+/g, ' ') + ' (Alt+' + (index + 1) + ')';
    });
    document.addEventListener('keydown', event => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      const open = $('dialog[open], .modal-backdrop.open');
      if (event.altKey && !event.ctrlKey && !event.metaKey && /^Digit[1-6]$/.test(event.code) && !open) {
        event.preventDefault();
        const button = $('.bnav-item[data-tab="' + TAB_ORDER[Number(event.code.slice(5)) - 1] + '"]');
        if (button) button.click();
        return;
      }
      if (event.key === '/' && !typing && !open && byId('buku-bon').classList.contains('active')) {
        event.preventDefault();
        byId('searchBon').focus();
        return;
      }
      if (event.key === 'Enter' && (event.target.id === 'inputEkor' || event.target.id === 'inputKg') && !byId('cashierStepOne').hidden) {
        event.preventDefault();
        byId('btnNextStep').click();
        return;
      }
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !byId('cashierStepTwo').hidden && byId('kasir').classList.contains('active') && !open) {
        event.preventDefault();
        byId('btnSubmitTrx').click();
      }
    });
  }

  function initQueueEnhance() {
    const container = byId('queueListContainer');
    if (!container) return;
    const stages = ['Antri', 'Dipotong', 'Siap', 'Diambil'];
    const statusIndex = {waiting: 0, processing: 1, ready: 2, done: 3};
    let changedId = null;
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-queue-next]');
      if (button) changedId = button.dataset.queueNext;
    }, true);
    const enhance = () => {
      const justChanged = changedId;
      changedId = null;
      $$('.queue-card', container).forEach((card, index) => {
        const button = $('.queue-next', card);
        if (!button || $('.pt-track', card)) return;
        const status = ['waiting', 'processing', 'ready', 'done'].find(name => button.classList.contains(name)) || 'waiting';
        const current = statusIndex[status];
        const track = document.createElement('div');
        track.className = 'pt-track';
        track.setAttribute('role', 'img');
        track.setAttribute('aria-label', 'Tahap pesanan: ' + stages[current]);
        track.innerHTML = stages.map((_, i) => '<span class="' + (i < current ? 'on' : i === current ? 'now' : '') + '"></span>').join('');
        const label = document.createElement('div');
        label.className = 'pt-track-label';
        label.setAttribute('aria-hidden', 'true');
        label.innerHTML = stages.map((name, i) => i === current ? '<b>' + name + '</b>' : '<span>' + name + '</span>').join('');
        const footer = $('.queue-footer', card);
        card.insertBefore(track, footer);
        card.insertBefore(label, footer);
        if (justChanged) {
          if (button.dataset.queueNext === justChanged) restart(card, 'pt-flash');
        } else if (!reduceMotion.matches) {
          card.style.setProperty('--pt-i', index);
          restart(card, 'pt-reveal');
        }
      });
    };
    new MutationObserver(enhance).observe(container, {childList: true});
    enhance();
  }

  function initBonEnhance() {
    const container = byId('bonListContainer');
    const search = byId('searchBon');
    if (!container) return;
    const mark = (element, query) => {
      const text = element.textContent;
      const at = text.toLowerCase().indexOf(query.toLowerCase());
      if (at < 0) return;
      const hit = document.createElement('mark');
      hit.className = 'pt-mark';
      hit.textContent = text.slice(at, at + query.length);
      element.textContent = '';
      element.append(text.slice(0, at), hit, text.slice(at + query.length));
    };
    const enhance = () => {
      const query = search ? search.value.trim() : '';
      $$('tr', container).forEach(row => {
        if (row.dataset.ptDone) return;
        row.dataset.ptDone = '1';
        const sub = $('.debtor-sub', row);
        const share = sub ? /([\d.,]+)\s*%/.exec(sub.textContent) : null;
        if (sub && share) {
          const percent = Math.max(0, Math.min(100, parseFloat(share[1].replace(/\./g, '').replace(',', '.')) || 0));
          const meter = document.createElement('span');
          meter.className = 'pt-meter';
          meter.dataset.hot = String(percent >= 80);
          meter.setAttribute('aria-hidden', 'true');
          const fill = document.createElement('i');
          fill.style.width = '0%';
          meter.appendChild(fill);
          sub.after(meter);
          requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = percent + '%'; }));
        }
        if (query) $$('.debtor-name', row).forEach(name => mark(name, query));
      });
    };
    new MutationObserver(enhance).observe(container, {childList: true});
    enhance();
  }

  function initToast() {
    const toast = byId('toast');
    if (!toast) return;
    const sync = () => {
      toast.classList.remove('pt-live');
      if (toast.hidden) return;
      void toast.offsetWidth;
      toast.classList.add('pt-live');
    };
    new MutationObserver(sync).observe(toast, {childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['hidden']});
  }

  function boot() {
    initScrollEffects();
    initRipple();
    initCountUp();
    initTabReveal();
    initStepFlow();
    initStepperHold();
    initShortcuts();
    initQueueEnhance();
    initBonEnhance();
    initToast();
    document.addEventListener('DOMContentLoaded', () => {
      initKasirLive();
      requestAnimationFrame(() => document.body.classList.add('pt-ready'));
    });
    if (document.readyState !== 'loading') {
      initKasirLive();
      document.body.classList.add('pt-ready');
    }
  }

  boot();
})();
