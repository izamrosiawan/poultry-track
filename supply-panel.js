(function () {
  'use strict';

  const byId = id => document.getElementById(id);
  const LOW_STOCK = 10;
  const dateFormat = new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});
  const kgFormat = value => Number(value).toLocaleString('id-ID', {maximumFractionDigits: 2}) + ' Kg';

  function ready() {
    return typeof state !== 'undefined' && state && Array.isArray(state.supplies) && byId('supplyStockCard');
  }

  function suppliedTotals() {
    const today = PoultryCore.localDateKey();
    return state.supplies.filter(s => s.date <= today).reduce((sum, s) => {
      sum.ekor += Number(s.ekor || 0);
      sum.kg += Number(s.kg || 0);
      return sum;
    }, {ekor: 0, kg: 0});
  }

  function paintStock() {
    const stock = PoultryCore.inventory(state);
    const supplied = suppliedTotals();
    const level = stock.ekor <= 0 ? 'Habis' : stock.ekor <= LOW_STOCK ? 'Menipis' : 'Aman';
    const percent = supplied.ekor > 0 ? Math.max(0, Math.min(100, Math.round(stock.ekor / supplied.ekor * 100))) : 0;
    byId('supplyStockEkor').textContent = stock.ekor.toLocaleString('id-ID') + ' Ekor';
    byId('supplyStockKg').textContent = kgFormat(stock.kg);
    const badge = byId('supplyStockBadge');
    badge.className = level === 'Aman' ? 'badge-status-green' : 'badge-status-red';
    badge.innerHTML = '<span class="status-dot"></span>' + level;
    const meter = byId('supplyStockMeter');
    meter.dataset.level = level === 'Aman' ? 'ok' : 'low';
    meter.firstElementChild.style.width = percent + '%';
    const note = supplied.ekor > 0
      ? stock.ekor.toLocaleString('id-ID') + ' dari ' + supplied.ekor.toLocaleString('id-ID') + ' ekor pasokan masih tersedia (' + percent + '%).'
      : 'Belum ada pasokan tercatat.';
    byId('supplyStockNote').textContent = note;
    meter.setAttribute('aria-label', 'Sisa stok ' + percent + '%');
  }

  function paintPreview() {
    const card = byId('supplyPreviewCard');
    const ekor = parseNumber(byId('supplyEkor').value);
    const kg = parseNumber(byId('supplyKg').value);
    const price = parseCurrency(byId('supplyPrice').value);
    const payment = byId('supplyPayment') ? byId('supplyPayment').value : 'Lunas Tunai Meja';
    const tempo = /tempo|belum/i.test(payment);
    const pay = byId('supplyPreviewPay');
    pay.className = tempo ? 'badge-status-red' : 'badge-status-green';
    pay.textContent = tempo ? 'Tempo' : 'Lunas tunai';

    const valid = Number.isInteger(ekor) && ekor > 0 && Number.isFinite(kg) && kg > 0 && Number.isSafeInteger(price) && price > 0;
    card.dataset.empty = String(!valid);
    if (!valid) return;

    const total = Math.round(kg * price);
    const stock = PoultryCore.inventory(state);
    byId('supplyPreviewTotal').textContent = formatRupiah(total);
    byId('supplyPreviewPerHead').textContent = formatRupiah(total / ekor);
    byId('supplyPreviewAvg').textContent = (kg / ekor).toLocaleString('id-ID', {maximumFractionDigits: 2}) + ' kg / ekor';
    byId('supplyPreviewStock').textContent = (stock.ekor + ekor).toLocaleString('id-ID') + ' ekor / ' + kgFormat(stock.kg + kg);
    byId('supplyPreviewCash').textContent = tempo ? 'Tidak mengurangi kas (utang pemasok)' : 'Kas laci berkurang ' + formatRupiah(total);

    const delta = byId('supplyPreviewDelta');
    const last = state.supplies[0];
    if (last && Number(last.pricePerKg) > 0) {
      const diff = price - Number(last.pricePerKg);
      delta.textContent = diff === 0
        ? 'Sama (' + formatRupiah(last.pricePerKg) + '/kg)'
        : formatRupiah(Math.abs(diff)) + '/kg ' + (diff < 0 ? 'lebih murah' : 'lebih mahal');
      delta.dataset.tone = diff === 0 ? 'neutral' : diff < 0 ? 'good' : 'bad';
    } else {
      delta.textContent = 'Belum ada pembanding';
      delta.dataset.tone = 'neutral';
    }
  }

  function formatDate(value) {
    const date = new Date(value + 'T00:00:00Z');
    return Number.isNaN(date.getTime()) ? String(value) : dateFormat.format(date);
  }

  function paintRecent() {
    const list = byId('supplyRecentList');
    const rows = state.supplies.slice(0, 3);
    if (!rows.length) {
      list.innerHTML = '<li class="recent-empty">Belum ada catatan pasokan.</li>';
      return;
    }
    const maxKg = Math.max(...rows.map(s => Number(s.kg || 0)), 1);
    list.innerHTML = rows.map(s => {
      const paid = /lunas/i.test(s.paymentStatus) && !/tempo|belum/i.test(s.paymentStatus);
      const width = Math.max(4, Math.round(Number(s.kg || 0) / maxKg * 100));
      return '<li class="recent-item">' +
        '<div class="recent-head"><strong>' + escapeHtml(formatDate(s.date)) + '</strong>' +
        '<span class="' + (paid ? 'badge-status-green' : 'badge-status-red') + '">' + escapeHtml(s.paymentStatus) + '</span></div>' +
        '<p class="recent-sub">' + Number(s.ekor || 0).toLocaleString('id-ID') + ' ekor / ' + kgFormat(s.kg || 0) + ' / @' + formatRupiah(s.pricePerKg) + ' per kg</p>' +
        '<div class="recent-bar" aria-hidden="true"><i style="width:' + width + '%"></i></div>' +
        '<div class="recent-foot"><strong class="font-numeric">' + formatRupiah(s.totalModal) + '</strong>' +
        '<button type="button" class="recent-copy" data-copy-supply="' + escapeHtml(s.id) + '">Salin ke form</button></div>' +
        '</li>';
    }).join('');
  }

  let scheduled = false;
  function paintAll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (!ready()) return;
      paintStock();
      paintRecent();
      paintPreview();
    });
  }

  function copySupply(id) {
    const supply = state.supplies.find(s => s.id === id);
    if (!supply) return;
    const fill = (fieldId, value) => {
      const field = byId(fieldId);
      field.value = value;
      field.dispatchEvent(new Event('input', {bubbles: true}));
    };
    fill('supplyEkor', String(supply.ekor));
    fill('supplyKg', String(supply.kg));
    fill('supplyPrice', String(supply.pricePerKg));
    const payment = byId('supplyPayment');
    if (payment && Array.from(payment.options).some(option => option.value === supply.paymentStatus)) {
      payment.value = supply.paymentStatus;
      payment.dispatchEvent(new Event('change', {bubbles: true}));
    }
    const form = document.querySelector('.supply-form-card');
    form.classList.remove('pt-flash');
    void form.offsetWidth;
    form.classList.add('pt-flash');
    form.addEventListener('animationend', () => form.classList.remove('pt-flash'), {once: true});
    if (window.innerWidth < 1024) form.scrollIntoView({behavior: 'smooth', block: 'center'});
    showToast('Data pasokan disalin ke formulir. Periksa lalu simpan.');
    paintAll();
  }

  function init() {
    ['supplyEkor', 'supplyKg', 'supplyPrice', 'supplyPayment'].forEach(id => {
      const field = byId(id);
      if (!field) return;
      field.addEventListener('input', paintAll);
      field.addEventListener('change', paintAll);
    });
    document.addEventListener('click', event => {
      const copy = event.target.closest('[data-copy-supply]');
      if (copy) { copySupply(copy.dataset.copySupply); return; }
      if (event.target.closest('#supplyPreviewPay')) {
        const payment = byId('supplyPayment');
        const options = Array.from(payment.options);
        payment.selectedIndex = (payment.selectedIndex + 1) % options.length;
        payment.dispatchEvent(new Event('change', {bubbles: true}));
        return;
      }
      if (event.target.closest('#btnSupplyAll')) {
        const history = document.querySelector('.history-details');
        history.open = true;
        history.scrollIntoView({behavior: 'smooth', block: 'start'});
        return;
      }
      if (event.target.closest('#pasokan .stepper-btn, #pasokan .weight-add, #pasokan .qsp-btn, #btnResetSupply, #btnSubmitSupply')) {
        setTimeout(paintAll, 0);
      }
    });
    const watch = (id, options) => {
      const node = byId(id);
      if (node) new MutationObserver(paintAll).observe(node, options);
    };
    watch('suppliesListContainer', {childList: true});
    watch('stockRemaining', {childList: true, characterData: true, subtree: true});
    watch('pasokan', {attributes: true, attributeFilter: ['class']});
    paintAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
