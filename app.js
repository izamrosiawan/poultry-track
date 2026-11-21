const STORAGE_KEY = 'POULTRYTRACK_APP_STATE_V1';

const DEFAULT_STATE = {
  activeDate: PoultryCore.localDateKey(),
  customers: [
    { id: "AL", name: "AL (Bu Aliyah - Katering/Resto)", phone: "081234567801", initialDebt: 1150000, currentDebt: 1150000, plafon: 1500000, daysLate: 0, status: "aktif", history: [] },
    { id: "War", name: "War (Warung Bu Warsiti - Lalapan)", phone: "081234567802", initialDebt: 480000, currentDebt: 480000, plafon: 800000, daysLate: 0, status: "aktif", history: [] },
    { id: "K", name: "K (Pak Kusno - Depot Bakso)", phone: "081234567803", initialDebt: 350000, currentDebt: 350000, plafon: 600000, daysLate: 0, status: "aktif", history: [] },
    { id: "J", name: "J (Bu Jamilah - Nasi Barokah)", phone: "081234567804", initialDebt: 300000, currentDebt: 300000, plafon: 500000, daysLate: 0, status: "aktif", history: [] },
    { id: "M", name: "M (Mas Munir - Penyetan Malam)", phone: "081234567805", initialDebt: 210000, currentDebt: 210000, plafon: 400000, daysLate: 0, status: "aktif", history: [] },
    { id: "S", name: "S (Bu Siti - Warung Rames)", phone: "081234567806", initialDebt: 320000, currentDebt: 320000, plafon: 600000, daysLate: 0, status: "aktif", history: [] },
    { id: "R", name: "R (Bu Rahma - Soto Lamongan)", phone: "081234567807", initialDebt: 190000, currentDebt: 190000, plafon: 400000, daysLate: 0, status: "aktif", history: [] },
    { id: "B", name: "B (Bu Budi - Katering Kotak)", phone: "081234567808", initialDebt: 200000, currentDebt: 200000, plafon: 500000, daysLate: 0, status: "aktif", history: [] },
    { id: "YA", name: "YA (Bu Yanti - Rumah Makan Padang)", phone: "081234567809", initialDebt: 300000, currentDebt: 300000, plafon: 600000, daysLate: 2, status: "tempo", history: [] },
    { id: "ATUL", name: "ATUL (Bu Atul - Warung Serba Ada)", phone: "081234567810", initialDebt: 0, currentDebt: 0, plafon: 400000, daysLate: 0, status: "lancar", history: [] },
    { id: "SPI", name: "SPI (Pak Ismail - Soto Ayam)", phone: "081234567811", initialDebt: 0, currentDebt: 0, plafon: 300000, daysLate: 0, status: "lancar", history: [] },
    { id: "Mic", name: "Mic (Bu Mieke - Langganan Tunai)", phone: "081234567812", initialDebt: 0, currentDebt: 0, plafon: 500000, daysLate: 0, status: "lancar", history: [] },
    { id: "ECR", name: "ECR (Pembeli Pasar - Eceran Meja)", phone: "-", initialDebt: 0, currentDebt: 0, plafon: 0, daysLate: 0, status: "eceran", history: [] }
  ],
    supplies: [
    { id: "SUP-151", date: "2026-09-28", supplier: "UD. CHEYLOO FARM", ekor: 17, kg: 39.0, pricePerKg: 25500, totalModal: 994500, paymentStatus: "Lunas Tunai Meja", note: "Subuh 04:30 WIB Siap potong" },
    { id: "SUP-150", date: "2026-09-27", supplier: "UD. CHEYLOO FARM", ekor: 21, kg: 51.2, pricePerKg: 25500, totalModal: 1305600, paymentStatus: "Lunas Tunai Meja", note: "Ayam segar utuh" },
    { id: "SUP-149", date: "2026-09-26", supplier: "UD. CHEYLOO FARM", ekor: 26, kg: 58.7, pricePerKg: 25500, totalModal: 1496850, paymentStatus: "Tempo 7 Hari", note: "Pasokan akhir pekan" }
  ],
  transactions: [
    { id: "TRX-101", date: "2026-09-28", time: "05:15", customerId: "AL", customerName: "AL (Bu Aliyah - Katering/Resto)", ekor: 3, kg: 6.2, part: "utuh", pricePerKg: 30500, total: 189100, type: "bon", notes: "Bon harian katering" },
    { id: "TRX-102", date: "2026-09-28", time: "05:40", customerId: "ECR", customerName: "Eceran Tunai", ekor: 1, kg: 2.1, part: "potong4", pricePerKg: 31500, total: 66150, type: "tunai", notes: "Uang pas meja kasir" },
    { id: "TRX-103", date: "2026-09-28", time: "06:10", customerId: "S", customerName: "S (Bu Siti - Warung Rames)", ekor: 2, kg: 4.4, part: "potong8", pricePerKg: 30500, total: 134200, type: "bon", notes: "Katering pesanan" }
  ]
};

let state = null;
let audioCtx = null;
let currentBonFilter = 'all';
let lastStorageValue = null;
let lastStableState = null;
let storageBlocked = false;
let unreadableBackup = '';

function playTouchSound(freq = 750, duration = 0.02) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function formatRupiah(num) {
  if (!Number.isFinite(Number(num))) return "Rp 0";
  return "Rp " + Math.round(num).toLocaleString('id-ID');
}

function parseNumber(value) {
  return PoultryCore.parseNumber(value);
}
function parseCurrency(value) {
  return PoultryCore.parseCurrency(value);
}

function saveState() {
  try {
    if (storageBlocked) throw new Error('Penyimpanan belum tersedia. Unduh cadangan sebelum melanjutkan.');
    const current = localStorage.getItem(STORAGE_KEY);
    if (current !== lastStorageValue) {
      if (!current) throw new Error('Data berubah di tab lain. Muat ulang halaman sebelum melanjutkan.');
      state = PoultryCore.normalizeState(JSON.parse(current));
      lastStorageValue = current;
      lastStableState = JSON.stringify(state);
      throw new Error('Data diperbarui di tab lain. Periksa kembali lalu ulangi tindakan ini.');
    }
    const payload = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, payload);
    lastStorageValue = payload;
    lastStableState = payload;
    return true;
  } catch (error) {
    if (lastStableState) state = JSON.parse(lastStableState);
    showStorageError(error.message || 'Data gagal disimpan. Periksa ruang penyimpanan browser.');
    refreshViews();
    return false;
  }
}

function loadState() {
  try {
    lastStorageValue = localStorage.getItem(STORAGE_KEY);
    unreadableBackup = lastStorageValue || '';
    state = PoultryCore.normalizeState(lastStorageValue ? JSON.parse(lastStorageValue) : DEFAULT_STATE);
  } catch (error) {
    storageBlocked = true;
    state = PoultryCore.normalizeState(DEFAULT_STATE);
    showStorageError('Data browser tidak dapat dibaca. Data lama tidak ditimpa. Unduh cadangan melalui Pengaturan data, lalu periksa penyimpanan browser.');
  }
  lastStableState = JSON.stringify(state);
}

function showStorageError(message) {
  const banner = document.getElementById('storageWarning');
  banner.textContent = message;
  banner.hidden = false;
}

function refreshViews() {
  renderQueue();
  renderBukuBon();
  renderSupplies();
  renderRekapKas();
  renderStock();
}

function renderStock() {
  const inventory = PoultryCore.inventory(state);
  document.getElementById('stockRemaining').textContent = inventory.ekor.toLocaleString('id-ID') + ' Ekor';
  document.getElementById('stockWeight').textContent = inventory.kg.toLocaleString('id-ID', {maximumFractionDigits: 2}) + ' Kg';
  document.querySelector('[data-tab="pasokan"] .nav-badge-dot').hidden = inventory.ekor > 10;
}

function initClock() {
  function update() {
    const now = new Date();
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
      clockEl.innerText = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    }
  }
  update();
  setInterval(update, 1000);
}

function initTabs() {
  const bnavItems = document.querySelectorAll('.bnav-item, .nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  bnavItems.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(600);
      const target = btn.dataset.tab;
      updatePageHeader(target);

      bnavItems.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === target);
        if (b.dataset.tab === target) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });

      tabPanes.forEach(p => {
        p.classList.toggle('active', p.id === target);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (target === 'antrean') renderQueue();
      if (target === 'buku-bon') renderBukuBon();
      if (target === 'pasokan') renderSupplies();
      if (target === 'rekap-kas') renderRekapKas();
      if (target === 'dashboard') renderDashboard();
      renderStock();
    });
  });
}

let selectedPaymentType = 'tunai';
let selectedCustomerType = 'eceran';

function initKasir() {
  const custTypeBtns = document.querySelectorAll('.cust-type-btn');
  const langgananGroup = document.getElementById('langgananGroup');
  const customerSelect = document.getElementById('customerSelect');
  const custBalanceBadge = document.getElementById('custBalanceBadge');
  const custBalanceAmount = document.getElementById('custBalanceAmount');
  
  const ekorInput = document.getElementById('inputEkor');
  const kgInput = document.getElementById('inputKg');
  const priceInput = document.getElementById('inputPrice');
  const subtotalDisplay = document.getElementById('subtotalDisplay');
  const formulaDisplay = document.getElementById('formulaDisplay');
  const quickWeights = document.querySelectorAll('.qw-btn');
  const quickPrices = document.querySelectorAll('.qp-btn');
  const steppers = document.querySelectorAll('.stepper-btn, .stepper-btn-mini');
  const payTypeBtns = document.querySelectorAll('.pay-type-btn');
  const btnSubmitTrx = document.getElementById('btnSubmitTrx');
  const btnResetTrx = document.getElementById('btnResetTrx');

  function populateCustomerSelect() {
    if (!customerSelect) return;
    const selected = customerSelect.value;
    customerSelect.innerHTML = '<option value="">Cari atau pilih nama pelanggan...</option>';
    state.customers.filter(c => c.id !== 'ECR').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      customerSelect.appendChild(opt);
    });
    customerSelect.value = selected;
  }
  populateCustomerSelect();

  custTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound();
      custTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCustomerType = btn.dataset.type;
      custTypeBtns.forEach(b => {
        b.setAttribute('aria-pressed', String(b === btn));
        b.setAttribute('aria-selected', String(b === btn));
      });
      setError('cashierError', '');

      if (selectedCustomerType === 'langganan') {
        if (langgananGroup) langgananGroup.style.display = 'block';
        selectPaymentType('bon');
      } else {
        if (langgananGroup) langgananGroup.style.display = 'none';
        if (custBalanceBadge) custBalanceBadge.style.display = 'none';
        selectPaymentType('tunai');
      }
      refreshPartnerInfo();
    });
  });

  if (customerSelect) {
    customerSelect.addEventListener('change', () => {
      refreshPartnerInfo();
      const cId = customerSelect.value;
      const cust = state.customers.find(c => c.id === cId);
      if (cust && cust.currentDebt > 0) {
        if (custBalanceBadge) custBalanceBadge.style.display = 'block';
        if (custBalanceAmount) custBalanceAmount.innerText = formatRupiah(cust.currentDebt);
        selectPaymentType('bon');
      } else {
        if (custBalanceBadge) custBalanceBadge.style.display = 'none';
      }
    });
  }

  steppers.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(800);
      const targetId = btn.dataset.target;
      const step = parseFloat(btn.dataset.step) || 1;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        let val = parseNumber(targetEl.value) || 0;
        val = Math.max(parseFloat(targetEl.min) || 0, val + step);
        targetEl.value = step % 1 === 0 ? val : val.toFixed(2);
        targetEl.dispatchEvent(new Event('input', {bubbles: true}));
        recalculateSubtotal();
      }
    });
  });

  quickWeights.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(900);
      quickWeights.forEach(b => b.classList.remove('active-pill'));
      btn.classList.add('active-pill');
      if (kgInput) {
        kgInput.value = Number(btn.dataset.kg).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        recalculateSubtotal();
      }
    });
  });

  quickPrices.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(900);
      quickPrices.forEach(b => b.classList.remove('active-pill'));
      btn.classList.add('active-pill');
      if (priceInput) {
        priceInput.value = btn.dataset.price;
        recalculateSubtotal();
      }
    });
  });

  [ekorInput, kgInput, priceInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', recalculateSubtotal);
    }
  });

  function recalculateSubtotal() {
    const kg = parseNumber(kgInput ? kgInput.value : 0) || 0;
    const price = parseCurrency(priceInput ? priceInput.value : 0) || 0;
    const subtotal = Math.max(0, Math.round(kg * price));
    quickPrices.forEach(b => b.classList.toggle('active-pill', Number(b.dataset.price) === price));
    quickWeights.forEach(b => b.classList.toggle('active-pill', Number(b.dataset.kg) === kg));
    if (subtotalDisplay) {
      subtotalDisplay.innerText = formatRupiah(subtotal);
    }
    if (formulaDisplay) {
      formulaDisplay.innerHTML = `${kg.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Kg &times; ${formatRupiah(price)}`;
    }
  }
  recalculateSubtotal();

  function selectPaymentType(type) {
    selectedPaymentType = type;
    payTypeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.pay === type);
      b.setAttribute('aria-pressed', String(b.dataset.pay === type));
    });
  }

  payTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(650);
      if (btn.dataset.pay === 'bon' && selectedCustomerType === 'eceran') {
        document.querySelector('.cust-type-btn[data-type="langganan"]').click();
        showCashierStep(1);
        customerSelect.focus();
        showToast('Pilih mitra untuk mencatat transaksi bon.');
      } else {
        selectPaymentType(btn.dataset.pay);
      }
    });
  });

  if (btnResetTrx) {
    btnResetTrx.addEventListener('click', () => {
      playTouchSound();
      if (ekorInput) ekorInput.value = 1;
      if (kgInput) kgInput.value = '';
      const noteInput = document.getElementById('inputNote');
      if (noteInput) noteInput.value = '';
      selectedCustomerType = 'eceran';
      if (customerSelect) customerSelect.value = '';
      document.getElementById('customCuts').value = '';
      document.getElementById('cutSize').value = 'Dada saja';
      document.getElementById('withoutSkin').checked = true;
      document.querySelector('input[name="part"][value="potong4"]').checked = true;
      showCashierStep(1);
      refreshPartnerInfo();
      setError('cashierError', '');
      selectPaymentType('tunai');
      custTypeBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.type === 'eceran');
        b.setAttribute('aria-pressed', String(b.dataset.type === 'eceran'));
        b.setAttribute('aria-selected', String(b.dataset.type === 'eceran'));
      });
      if (langgananGroup) langgananGroup.style.display = 'none';
      if (custBalanceBadge) custBalanceBadge.style.display = 'none';
      recalculateSubtotal();
    });
  }

  if (btnSubmitTrx) {
    btnSubmitTrx.addEventListener('click', () => {
      playTouchSound(1000, 0.08);

      if (!isLapakOpen()) {
        setError('cashierError', 'Lapak sedang tutup. Buka lapak melalui ikon profil sebelum menyimpan transaksi.');
        return;
      }

      const ekor = parseNumber(ekorInput ? ekorInput.value : 1);
      const kg = parseNumber(kgInput ? kgInput.value : 0);
      const price = parseCurrency(priceInput ? priceInput.value : 0);
      const total = Math.round(kg * price);

      if (!Number.isInteger(ekor) || ekor < 1 || !Number.isFinite(kg) || kg <= 0 || !Number.isSafeInteger(price) || price <= 0 || !Number.isSafeInteger(total) || total <= 0) {
        setError('cashierError', 'Masukkan berat dan harga per kilogram yang valid.');
        return;
      }

      let customerId = 'ECR';
      let customerName = 'Eceran Tunai';

      if (selectedCustomerType === 'langganan') {
        customerId = customerSelect ? customerSelect.value : '';
        if (!customerId) {
          setError('cashierError', 'Pilih mitra langganan terlebih dahulu.');
          showCashierStep(1);
          return;
        }
        const custObj = state.customers.find(c => c.id === customerId);
        if (custObj) {
          customerName = custObj.name;
          const phone = document.getElementById('partnerPhoneInput').value.trim();
          if (phone && !PoultryCore.normalizePhone(phone)) {
            setError('cashierError', 'Periksa nomor WhatsApp mitra, gunakan 08 atau +62 diikuti nomor yang valid.');
            showCashierStep(1);
            return;
          }
        }
      }

      const stock = PoultryCore.inventory(state);
      if (ekor > stock.ekor || kg > stock.kg) {
        setError('cashierError', 'Stok tercatat tidak mencukupi. Periksa atau tambahkan pasokan pada menu Stok.');
        return;
      }
      const debtor = state.customers.find(c => c.id === customerId);
      if (selectedPaymentType === 'bon' && debtor?.plafon > 0 && debtor.currentDebt + total > debtor.plafon) {
        setError('cashierError', `Transaksi melewati plafon bon. Sisa plafon ${formatRupiah(Math.max(0, debtor.plafon - debtor.currentDebt))}. Pilih tunai atau catat setoran terlebih dahulu.`);
        return;
      }

      const checkedPart = document.querySelector('input[name="part"]:checked');
      let part = checkedPart ? checkedPart.value : 'utuh';
      const customCuts = document.getElementById('customCuts').value;
      if (customCuts && (!Number.isInteger(Number(customCuts)) || Number(customCuts) < 1 || Number(customCuts) > 100)) {
        setError('cashierError', 'Jumlah potongan khusus harus bilangan bulat antara 1 dan 100.');
        return;
      }
      if (customCuts) part = 'potong' + Number(customCuts);
      const noteInput = document.getElementById('inputNote');
      const notes = [document.getElementById('cutSize').value, document.getElementById('withoutSkin').checked ? 'Tanpa kulit' : 'Dengan kulit', noteInput ? noteInput.value.trim() : ''].filter(Boolean).join(' • ');

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
      const dateStr = localDateKey(now);

      const newTrx = {
        id: newId('TRX'),
        date: dateStr,
        time: timeStr,
        customerId: customerId,
        customerName: customerName,
        ekor: ekor,
        kg: kg,
        part: part,
        pricePerKg: price,
        total: total,
        type: selectedPaymentType,
        notes: notes,
        request: document.getElementById('cutSize').value,
        withoutSkin: document.getElementById('withoutSkin').checked
      };

      state.transactions.unshift(newTrx);
      state.queue.push({ ...newTrx, transactionId: newTrx.id, status: 'waiting' });
      if (selectedCustomerType === 'langganan') {
        const customer = state.customers.find(c => c.id === customerId);
        customer.phone = document.getElementById('partnerPhoneInput').value.trim() || customer.phone;
      }

      if (selectedPaymentType === 'bon') {
        const cust = state.customers.find(c => c.id === customerId);
        if (cust) {
          if (cust.currentDebt === 0 || (!cust.dueDate && !cust.daysLate)) {
            cust.dueDate = new Date(Date.parse(dateStr) + 7 * 86400000).toISOString().slice(0, 10);
          }
          cust.currentDebt += total;
        }
      }

      if (!saveState()) return;
      refreshViews();
      populateCustomerSelect();
      renderBukuBon();
      renderRekapKas();

      showToast(`Transaksi ${formatRupiah(total)} disimpan dan masuk antrean potong.`);
      brieflyDisable(btnSubmitTrx);

      if (btnResetTrx) btnResetTrx.click();
    });
  }
}

function renderBukuBon() {
  const query = document.getElementById('searchBon').value.toLowerCase().trim();
  const debtors = state.customers.filter(c => c.id !== 'ECR');
  const active = debtors.filter(c => c.currentDebt > 0);
  const due = active.filter(c => PoultryCore.daysLate(c, state.debtAsOf) > 0);
  document.querySelector('[data-tab="buku-bon"] .nav-badge-dot').hidden = due.length === 0;
  const critical = active.filter(c => c.plafon > 0 && c.currentDebt / c.plafon >= .85);
  document.getElementById('headerTotalDebt').textContent = formatRupiah(active.reduce((a, c) => a + c.currentDebt, 0));
  document.getElementById('headerDebtorCount').textContent = active.length;
  document.getElementById('headerDueCount').textContent = due.length ? 'Wajib Tagih' : 'Terkendali';
  document.getElementById('heroDueMitra').textContent = due.length + ' Mitra';
  document.getElementById('debtorListCount').textContent = active.length + ' Aktif';
  const counts = {all: debtors.length, tempo: due.length, kritis: critical.length};
  document.querySelectorAll('#bonFilterRow [data-filter]').forEach(b => {
    b.textContent = ({all: 'Semua', tempo: 'Jatuh tempo', kritis: 'Plafon kritis'})[b.dataset.filter] + ' (' + counts[b.dataset.filter] + ')';
  });
  const filtered = debtors.filter(c => {
    if (![c.name, c.id, c.phone].some(value => String(value || '').toLowerCase().includes(query))) return false;
    return currentBonFilter === 'tempo' ? due.includes(c) : currentBonFilter === 'kritis' ? critical.includes(c) : true;
  });
  const toggle = document.getElementById('btnShowAllBon');
  const showAll = toggle.dataset.expanded === 'true' || query || currentBonFilter !== 'all';
  toggle.hidden = Boolean(query) || currentBonFilter !== 'all' || filtered.length <= 2;
  toggle.textContent = showAll ? 'Tampilkan Lebih Sedikit ↑' : `Lihat ${Math.max(0, filtered.length - 2)} Mitra Lainnya →`;
  toggle.setAttribute('aria-expanded', String(Boolean(showAll)));
  const visible = showAll ? filtered : filtered.slice(0, 2);
  const container = document.getElementById('bonListContainer');
  if (!visible.length) {
    container.innerHTML = '<div class="empty-state"><h3>Tidak ada mitra yang cocok</h3><p>Coba nama lain atau ubah filter pencarian.</p></div>';
    return;
  }
  container.innerHTML = visible.map(c => {
    const ratio = (c.plafon > 0 ? Math.round(c.currentDebt / c.plafon * 1000) / 10 : 0).toLocaleString('id-ID');
    const paid = c.currentDebt <= 0;
    const late = PoultryCore.daysLate(c, state.debtAsOf);
    const status = paid ? 'Lunas' : late > 0 ? `Lewat ${late} hari` : c.dueDate ? 'Tempo ' + new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'short', timeZone: 'UTC'}).format(new Date(c.dueDate)) : 'Bon berjalan';
    const phone = PoultryCore.normalizePhone(c.phone);
    const waText = `Halo ${c.name}, mengingatkan catatan bon lapak ayam sebesar ${formatRupiah(c.currentDebt)}.`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;
    return `<article class="debtor-item-card"><div class="debtor-item-header"><span class="debtor-avatar">${escapeHtml(c.id.slice(0, 3))}</span><div class="debtor-info"><h3 class="debtor-name" title="${escapeHtml(c.name)}">${escapeHtml(c.name)}</h3><p class="debtor-sub">Plafon: ${formatRupiah(c.plafon || 0)}</p><span class="debtor-phone">${uiIcon('phone')}${escapeHtml(c.phone && c.phone !== '-' ? c.phone : 'Belum ada nomor')}</span></div><div><p class="debtor-amount">${formatRupiah(c.currentDebt)}</p><div class="debtor-actions"><a class="btn-card-wa" ${phone ? `href="${waUrl}" target="_blank" rel="noopener noreferrer"` : 'aria-disabled="true" title="Tambahkan nomor WhatsApp yang valid melalui kasir"'}>Kirim WA →</a><button type="button" class="btn-card-pay" data-pay-customer="${escapeHtml(c.id)}" ${paid ? 'disabled' : ''}>Setor</button></div></div></div><div class="debtor-limit"><span>Pemakaian Plafon: <strong>${ratio}%</strong></span><span class="${late > 0 ? 'badge-status-red' : 'badge-status-green'}">${status}</span></div></article>`;
  }).join('');
}

function initBonFilters() {
  const filterRow = document.getElementById('bonFilterRow');
  if (!filterRow) return;
  const chips = filterRow.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      playTouchSound();
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentBonFilter = chip.dataset.filter || 'all';
      renderBukuBon();
    });
  });
}

window.openPaymentModal = function(customerId) {
  if (!isLapakOpen()) { showToast('Buka lapak melalui ikon profil sebelum menerima setoran.'); return; }
  playTouchSound(700);
  const cust = state.customers.find(c => c.id === customerId);
  if (!cust) return;

  const modal = document.getElementById('paymentModal');
  const nameEl = document.getElementById('modalCustName');
  const debtEl = document.getElementById('modalCurrentDebt');
  const amountInput = document.getElementById('modalPayAmount');
  const quickOpts = document.getElementById('modalQuickPayOptions');

  if (nameEl) nameEl.innerText = `${cust.id} - ${cust.name}`;
  if (debtEl) debtEl.innerText = formatRupiah(cust.currentDebt);
  if (amountInput) amountInput.value = '';
  if (modal) modal.dataset.customerId = customerId;

  if (quickOpts) {
    quickOpts.innerHTML = '';
    const presets = [...new Set([50000, 100000, 200000, cust.currentDebt])].filter(p => p > 0 && p <= cust.currentDebt);
    presets.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quick-pill';
      b.textContent = p === cust.currentDebt ? `Lunas (${formatRupiah(p)})` : formatRupiah(p);
      b.onclick = () => {
        playTouchSound();
        if (amountInput) amountInput.value = p;
      };
      quickOpts.appendChild(b);
    });
  }

  if (modal) {
    modal.classList.add('open');
    document.querySelector('main').inert = true;
    document.querySelector('nav').inert = true;
    document.querySelector('header').inert = true;
    modal.dataset.returnFocus = document.activeElement?.dataset.payCustomer || '';
    setError('paymentError', '');
    amountInput.focus();
  }
};

function initModal() {
  const modal = document.getElementById('paymentModal');
  const btnClose = document.getElementById('btnModalClose');
  const btnCancel = document.getElementById('btnModalCancel');
  const btnConfirm = document.getElementById('btnModalConfirm');
  const amountInput = document.getElementById('modalPayAmount');

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.querySelector('main').inert = false;
      document.querySelector('nav').inert = false;
      document.querySelector('header').inert = false;
      document.querySelector('[data-pay-customer="' + CSS.escape(modal.dataset.returnFocus || '') + '"]')?.focus();
    }
  }

  if (btnClose) btnClose.onclick = closeModal;
  if (btnCancel) btnCancel.onclick = closeModal;

  if (btnConfirm) {
    btnConfirm.onclick = () => {
      if (!isLapakOpen()) { setError('paymentError', 'Lapak sedang tutup. Buka lapak sebelum mencatat setoran.'); return; }
      playTouchSound(950);
      const cId = modal ? modal.dataset.customerId : null;
      const amount = parseCurrency(amountInput ? amountInput.value : 0);

      if (!cId || !Number.isSafeInteger(amount) || amount <= 0) {
        setError('paymentError', 'Masukkan nominal setoran yang valid.');
        return;
      }

      const cust = state.customers.find(c => c.id === cId);
      if (!cust) return;

      if (amount > cust.currentDebt) {
        setError('paymentError', `Setoran melebihi sisa bon ${formatRupiah(cust.currentDebt)}.`);
        return;
      }

      cust.currentDebt = Math.max(0, cust.currentDebt - amount);
      if (cust.currentDebt === 0) { cust.daysLate = 0; cust.dueDate = null; cust.status = 'lancar'; }

      const now = new Date();
      const newTrx = {
        id: newId('PAY'),
        date: localDateKey(now),
        time: now.toLocaleTimeString('en-GB', {timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit'}),
        customerId: cust.id,
        customerName: cust.name,
        ekor: 0,
        kg: 0,
        part: "-",
        pricePerKg: 0,
        total: amount,
        type: "cicilan_masuk",
        notes: `Setoran cicilan tunai bon di meja kasir`
      };

      state.transactions.unshift(newTrx);
      if (!saveState()) return;
      brieflyDisable(btnConfirm);
      closeModal();
      renderBukuBon();
      renderRekapKas();
      showToast(`Setoran ${formatRupiah(amount)} berhasil dicatat.`);
    };
  }
}

function initSupplies() {
  const supplyEkor = document.getElementById('supplyEkor');
  const supplyKg = document.getElementById('supplyKg');
  const supplyPrice = document.getElementById('supplyPrice');
  const supplyModalTotal = document.getElementById('supplyModalTotal');
  const btnSubmitSupply = document.getElementById('btnSubmitSupply');
  const quickSupplyPrices = document.querySelectorAll('.qsp-btn');

  function updateSupplyTotal() {
    const kg = parseNumber(supplyKg ? supplyKg.value : 0);
    const price = parseCurrency(supplyPrice ? supplyPrice.value : 0);
    if (supplyModalTotal) {
      supplyModalTotal.innerText = formatRupiah(Math.round((kg || 0) * (price || 0)));
    }
  }

  quickSupplyPrices.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(800);
      quickSupplyPrices.forEach(b => b.classList.remove('active-pill'));
      btn.classList.add('active-pill');
      if (supplyPrice) {
        supplyPrice.value = btn.dataset.price;
        updateSupplyTotal();
      }
    });
  });

  [supplyKg, supplyPrice, supplyEkor].forEach(inp => {
    if (inp) inp.addEventListener('input', updateSupplyTotal);
  });
  updateSupplyTotal();

  if (btnSubmitSupply) {
    btnSubmitSupply.onclick = () => {
      playTouchSound(1000);
      const ekor = parseNumber(supplyEkor ? supplyEkor.value : 0);
      const kg = parseNumber(supplyKg ? supplyKg.value : 0);
      const price = parseCurrency(supplyPrice ? supplyPrice.value : 0);
      const paymentInput = document.getElementById('supplyPayment');
      const paymentStatus = paymentInput ? paymentInput.value : 'Lunas Tunai Meja';

      if (!Number.isInteger(ekor) || ekor < 1 || !Number.isFinite(kg) || kg <= 0 || !Number.isSafeInteger(price) || price <= 0 || !Number.isSafeInteger(Math.round(kg * price))) {
        showToast('Masukkan jumlah ekor, berat, dan harga pasokan yang valid.');
        return;
      }

      const now = new Date();
      const newSupply = {
        id: newId('SUP'),
        date: localDateKey(now),
        supplier: "UD. Cheyloo Farm Kamal",
        ekor: ekor,
        kg: kg,
        pricePerKg: price,
        totalModal: Math.round(kg * price),
        paymentStatus: paymentStatus,
        note: "Pasokan subuh karkas segar"
      };

      state.supplies.unshift(newSupply);
      if (!saveState()) return;
      renderSupplies();
      renderRekapKas();
      renderStock();
      supplyEkor.value = '1';
      supplyKg.value = '';
      updateSupplyTotal();
      brieflyDisable(btnSubmitSupply);
      showToast(`Pasokan ${formatRupiah(newSupply.totalModal)} berhasil dicatat.`);
    };
  }
}

function renderSupplies() {
  const container = document.getElementById('suppliesListContainer');
  if (!container) return;

  container.innerHTML = '';
  if (state.supplies.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 14px;">Belum ada catatan pasokan.</div>`;
    return;
  }

  state.supplies.slice(0, 5).forEach(s => {
    const item = document.createElement('div');
    item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-subtle); border-radius: 8px; margin-bottom: 8px;";
    item.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <strong style="font-size: 13px;">${escapeHtml(s.supplier)}</strong>
          <span class="${s.paymentStatus.includes('Lunas') ? 'badge-status-green' : 'badge-status-red'}">${escapeHtml(s.paymentStatus)}</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(s.date)} &bull; ${s.ekor} Ekor / ${s.kg} Kg</p>
      </div>
      <div style="text-align: right;">
        <strong class="font-numeric" style="font-size: 13px;">${formatRupiah(s.totalModal)}</strong>
        <p style="font-size: 10px; color: var(--text-muted);">@${formatRupiah(s.pricePerKg)}/Kg</p>
      </div>
    `;
    container.appendChild(item);
  });
}

function reportTotals() {
  return PoultryCore.reportTotals(state, document.getElementById('reportPeriod').value);
}
function renderRekapKas() {
  const totals = reportTotals();
  const values = {rekapCashSales: totals.cashSales, rekapCashCicilan: totals.cashPayments,
    rekapModalPasokan: totals.cashSupplies, rekapKasBersihLaci: totals.net,
    rekapBonKeluar: totals.bon, reportCashIn: totals.cashIn};
  Object.entries(values).forEach(([id, value]) => document.getElementById(id).textContent = formatRupiah(value));
  document.getElementById('rekapKgSold').textContent = totals.kg.toLocaleString('id-ID', {maximumFractionDigits: 2}) + ' Kg';
  document.getElementById('rekapEkorSold').textContent = totals.ekor + ' Ekor';
  document.getElementById('reportSalesCount').textContent = totals.sales.length + ' transaksi tunai';
  const todayOnly = document.getElementById('reportPeriod').value === 'today';
  document.getElementById('openingCashForm').hidden = !todayOnly;
  document.getElementById('openingCashInput').value = totals.openingCash.toLocaleString('id-ID');
  document.getElementById('drawerTitle').innerHTML = todayOnly ? 'UANG FISIK WAJIB<br>ADA DI LACI MEJA' : 'SALDO ARUS KAS<br>SELURUH CATATAN';
  document.getElementById('btnMatchCash').disabled = !todayOnly;
  document.getElementById('cashFlowTitle').textContent = todayOnly ? 'Rincian Arus Kas Hari Ini' : 'Rincian Arus Kas Seluruh Catatan';
  document.getElementById('totalCashLabel').textContent = todayOnly ? 'Total Uang Masuk Hari Ini:' : 'Total Uang Masuk:';
  document.getElementById('reportRecordCount').textContent = totals.transactions.length + ' Transaksi';
  document.getElementById('reportPaymentNames').textContent = totals.payments.length ? totals.payments.length + ' setoran bon diterima' : 'Belum ada setoran pada periode ini';
  document.getElementById('reportPayCount').textContent = new Set(totals.payments.map(t => t.customerId)).size + ' Pelanggan';
  const badge = document.getElementById('cashDifference');
  badge.disabled = !todayOnly;
  const key = document.getElementById('reportPeriod').value === 'today' ? localDateKey() : 'all';
  const physical = state.cashCounts?.[key];
  badge.classList.remove('is-balanced', 'is-different');
  if (!todayOnly) badge.textContent = 'Pilih Hari ini untuk cocokkan';
  else if (physical == null) badge.textContent = 'Belum dicocokkan';
  else {
    const difference = physical - totals.net;
    badge.textContent = difference === 0 ? 'Rp 0 (Seimbang / Pas)' : formatRupiah(difference) + ' (Selisih)';
    badge.classList.add(difference === 0 ? 'is-balanced' : 'is-different');
  }
}

function exportTransactions() {
  const transactions = reportTotals().transactions;
  const rows = [['ID Transaksi','Tanggal','Jam','Kode Mitra','Nama Pelanggan','Ekor','Berat (Kg)','Potongan','Harga/Kg','Total (Rp)','Pembayaran','Catatan']];
  transactions.forEach(t => rows.push([t.id,t.date,t.time,t.customerId,t.customerName,t.ekor,t.kg,t.part,t.pricePerKg,t.total,t.type,t.notes]));
  const cell = v => {
    let text = String(v ?? '');
    if (typeof v === 'string' && /^[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const content = '\ufeff' + rows.map(r => r.map(cell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([content], {type: 'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = `Rekap_PoultryTrack_${localDateKey()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Rekap transaksi diunduh dalam format CSV.');
}
function initExport() {
  document.getElementById('btnExportCsv').onclick = exportTransactions;
  document.querySelectorAll('[data-export]').forEach(b => b.onclick = exportTransactions);
}

function initSearch() {
  const searchInput = document.getElementById('searchBon');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderBukuBon();
    });
  }
}

function initDataTools() {
  const btnResetData = document.getElementById('btnResetToDefault');
  if (btnResetData) {
    btnResetData.onclick = () => {
      if (confirm("Reset menghapus catatan lokal dan mengembalikan data contoh. Unduh cadangan JSON terlebih dahulu. Tetap reset?")) {
        try {
          lastStorageValue = localStorage.getItem(STORAGE_KEY);
          storageBlocked = false;
        } catch (error) {
          showStorageError('Penyimpanan browser tidak dapat diakses. Reset dibatalkan.');
          return;
        }
        state = PoultryCore.normalizeState(DEFAULT_STATE);
        if (!saveState()) return;
        location.reload();
      }
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initClock();
  initTabs();
  initKasir();
  initModal();
  initSupplies();
  initBonFilters();
  initExport();
  initSearch();
  initDataTools();

  initRedesign();
  initFigmaDetails();
  renderBukuBon();
  renderSupplies();
  renderRekapKas();
  renderQueue();
  renderStock();
  initResilience();
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function localDateKey(date = new Date()) {
  return PoultryCore.localDateKey(date);
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.hidden = true, 4200);
}

function setError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.hidden = !message;
  if (message) el.scrollIntoView({behavior: 'smooth', block: 'center'});
}

function updatePageHeader(target) {
  const titles = {kasir: 'Kasir', antrean: 'Antrean', 'buku-bon': 'Buku Bon', pasokan: 'Stok', 'rekap-kas': 'Laporan', dashboard: 'Dashboard Analitik'};
  const copy = {
    antrean: ['Antrean Pemotongan Karkas', 'Monitor pesanan potong di juru potong lapak agar tidak salah potong saat jam sibuk subuh.'],
    pasokan: ['Manifest Pasokan Masuk', 'Pencatatan pasokan ayam hidup & karkas segar dari peternak sebelum lapak buka.'],
    'rekap-kas': ['Rekap Laci Kasir Subuh', 'Validasi uang fisik di laci meja dengan sistem sebelum lapak ditutup.'],
    dashboard: ['Dashboard Analitik Lapak', 'Konsolidasi performa 5 bulan operasional.']
  };
  document.getElementById('pageTitle').textContent = titles[target] || 'Kasir';
  
  // Sembunyikan brand-card cokelat raksasa saat di tab Dashboard agar tidak tumpuk & tidak terkesan AI
  const brandCard = document.querySelector('.brand-card');
  if (brandCard) brandCard.style.display = (target === 'dashboard') ? 'none' : '';

  document.querySelector('.customer-hero').hidden = target !== 'kasir';
  document.getElementById('bonHeroMetrics').hidden = target !== 'buku-bon';
  document.getElementById('heroCopy').hidden = !copy[target];
  document.getElementById('heroLiveBadge').hidden = target !== 'antrean';
  document.getElementById('heroLogBadge').hidden = target !== 'pasokan';
  document.getElementById('reportHeroBadges').hidden = target !== 'rekap-kas';
  if (copy[target]) {
    document.getElementById('heroTitle').textContent = copy[target][0];
    document.getElementById('heroDescription').textContent = copy[target][1];
  }
  updateLapakStatus();
}

function refreshPartnerInfo() {
  const info = document.getElementById('partnerInfoCard');
  info.hidden = selectedCustomerType !== 'langganan';
  const cust = state.customers.find(c => c.id === document.getElementById('customerSelect').value);
  document.getElementById('partnerInfoName').textContent = cust ? cust.name : 'Pilih mitra langganan';
  document.getElementById('partnerPhone').textContent = cust?.phone || '';
  document.getElementById('partnerPhoneInput').value = cust?.phone && cust.phone !== '-' ? cust.phone : '';
  const list = document.getElementById('partnerPhones');
  list.replaceChildren();
  state.customers.filter(c => c.phone && c.phone !== '-').forEach(c => {
    const option = document.createElement('option');
    option.value = c.phone;
    option.label = c.name;
    list.appendChild(option);
  });
}

function validateFirstStep() {
  const ekor = Number(document.getElementById('inputEkor').value);
  const kg = parseNumber(document.getElementById('inputKg').value);
  if (!Number.isInteger(ekor) || ekor < 1 || !Number.isFinite(kg) || kg <= 0) {
    setError('cashierError', 'Isi jumlah ekor dan berat timbangan yang valid terlebih dahulu.');
    return false;
  }
  if (selectedCustomerType === 'langganan' && !document.getElementById('customerSelect').value) {
    setError('cashierError', 'Pilih mitra langganan sebelum melanjutkan.');
    document.getElementById('customerSelect').focus();
    return false;
  }
  setError('cashierError', '');
  return true;
}

function showCashierStep(step) {
  if (step === 2 && !validateFirstStep()) return;
  document.getElementById('cashierStepOne').hidden = step !== 1;
  document.getElementById('cashierStepTwo').hidden = step !== 2;
  [1, 2].forEach(n => {
    const button = document.getElementById(n === 1 ? 'stepOneBtn' : 'stepTwoBtn');
    button.classList.toggle('active', n === step);
    if (n === step) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
  });
  document.querySelector('.cashier-progress').scrollIntoView({behavior: 'smooth', block: 'start'});
}

let queueFilter = 'active';
let queuePage = 0;
function renderQueue() {
  const queue = state.queue || [];
  const active = queue.filter(q => q.status !== 'done');
  const filtered = queue.filter(q => queueFilter === 'done' ? q.status === 'done' : q.status !== 'done');
  const pages = Math.max(1, Math.ceil(filtered.length / 2));
  queuePage = Math.min(queuePage, pages - 1);
  const visible = filtered.slice(queuePage * 2, queuePage * 2 + 2);
  document.getElementById('queueCount').textContent = '• ' + active.length + ' Antrean Aktif';
  document.getElementById('navQueueBadge').textContent = active.length + ' antrean';
  document.getElementById('queueTotalEkor').textContent = 'Total ' + active.reduce((n, q) => n + (q.ekor || 0), 0) + ' Karkas Antre';
  document.getElementById('queueWaiting').textContent = active.filter(q => q.status === 'processing').length + ' Pesanan Diproses';
  document.querySelector('[data-tab="antrean"] .nav-badge-dot').hidden = active.length === 0;
  const pageButton = document.getElementById('btnQueuePage');
  pageButton.hidden = pages <= 1;
  pageButton.innerHTML = (queuePage === pages - 1 ? '← Kembali ke Antrean' : 'Lihat Detail Antrean ' + uiIcon('arrow'));
  const container = document.getElementById('queueListContainer');
  if (!visible.length) {
    container.innerHTML = '<div class="empty-state"><h3>' + (queueFilter === 'done' ? 'Belum ada pesanan diambil' : 'Antrean sudah selesai') + '</h3><p>Pesanan tampil setelah transaksi disimpan di kasir.</p></div>';
    return;
  }
  const labels = {waiting: '• Waitlist', processing: '• Processing', ready: '• Siap Diambil', done: 'Sudah Diambil'};
  const actions = {waiting: 'Mulai potong', processing: 'Tandai siap diambil', ready: 'Tandai sudah diambil'};
  container.innerHTML = visible.map((q, index) => {
    const position = queuePage * 2 + index;
    const table = q.table || (q.status === 'processing' ? 'Sedang dipotong' : q.status === 'ready' ? 'Siap diambil' : q.status === 'done' ? 'Selesai' : 'Menunggu giliran');
    const items = Array.isArray(q.items) && q.items.length ? q.items : [{ekor: q.ekor, kg: q.kg, part: q.part, request: q.request}];
    const rows = items.map(item => `<div class="queue-line">${uiIcon('check')}<span>${Number(item.ekor || 0)} Karkas (${Number(item.kg || 0).toLocaleString('id-ID')} Kg) - ${escapeHtml(partLabel(item.part))}${item.request ? ' (' + escapeHtml(item.request) + ')' : ''}</span></div>`).join('');
    const name = q.type === 'bon' ? 'Mitra: ' + q.customerName : 'Tunai: ' + (q.customerName || 'Pelanggan Eceran');
    return `<article class="queue-card"><div class="queue-head"><span class="queue-avatar">${position + 1}</span><div><h3>${escapeHtml(name)}</h3></div><strong>${q.ekor} Karkas</strong></div><div class="queue-meta"><span>Order ID: ${escapeHtml(q.id)}</span>${q.priority ? '<span class="priority-badge">Prioritas Tinggi</span>' : ''}<span class="table-badge">${escapeHtml(table)}</span></div><div class="queue-spec">${rows}</div>${q.notes ? '<details><summary>Catatan pesanan</summary><p>' + escapeHtml(q.notes) + '</p></details>' : ''}<div class="queue-footer"><span>${uiIcon('clock')}Masuk: ${escapeHtml(q.time)} WIB</span><button class="queue-next ${escapeHtml(q.status)}" type="button" data-queue-next="${escapeHtml(q.transactionId)}" aria-label="${actions[q.status] || 'Pesanan sudah diambil'}" ${q.status === 'done' ? 'disabled' : ''}>${labels[q.status] || labels.waiting}</button></div></article>`;
  }).join('');
}

function initRedesign() {
  updatePageHeader('kasir');
  document.querySelectorAll('.cust-type-btn').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
  document.querySelectorAll('.pay-type-btn').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
  document.getElementById('btnNextStep').onclick = () => showCashierStep(2);
  document.getElementById('stepTwoBtn').onclick = () => showCashierStep(2);
  document.getElementById('stepOneBtn').onclick = () => showCashierStep(1);
  document.getElementById('btnBackStep').onclick = () => showCashierStep(1);
  document.getElementById('btnShowAllBon').onclick = () => {
    const button = document.getElementById('btnShowAllBon');
    button.dataset.expanded = button.dataset.expanded === 'true' ? 'false' : 'true';
    renderBukuBon();
  };
  document.getElementById('btnNotifications').onclick = () => document.getElementById('lapakModal').showModal();
  document.getElementById('reportPeriod').onchange = renderRekapKas;
  document.getElementById('btnPrintReport').onclick = printCashReport;
  document.getElementById('bonListContainer').addEventListener('click', e => {
    const button = e.target.closest('[data-pay-customer]');
    if (button) openPaymentModal(button.dataset.payCustomer);
  });
  document.getElementById('queueFilters').addEventListener('click', e => {
    const button = e.target.closest('[data-queue-filter]');
    if (!button) return;
    queueFilter = button.dataset.queueFilter;
    queuePage = 0;
    document.querySelectorAll('[data-queue-filter]').forEach(b => b.classList.toggle('active', b === button));
    renderQueue();
  });
  document.getElementById('queueListContainer').addEventListener('click', e => {
    const button = e.target.closest('[data-queue-next]');
    if (!button) return;
    const order = state.queue.find(q => q.transactionId === button.dataset.queueNext);
    if (!order) return;
    order.status = PoultryCore.nextQueueStatus(order.status);
    if (!saveState()) return;
    renderQueue();
    showToast('Status pesanan diperbarui.');
  });
  document.getElementById('customCuts').addEventListener('input', e => {
    if (e.target.value) document.querySelectorAll('input[name="part"]').forEach(r => r.checked = false);
  });
  document.querySelectorAll('input[name="part"]').forEach(r => r.addEventListener('change', () => {
    document.getElementById('customCuts').value = '';
    const request = document.getElementById('cutSize');
    if (r.value === 'utuh') request.value = 'Ayam utuh';
    else if (r.value === 'fillet') request.value = 'Fillet';
    else if (['Ayam utuh', 'Fillet'].includes(request.value)) request.value = 'Campur';
  }));
  const paymentModal = document.getElementById('paymentModal');
  paymentModal.addEventListener('click', e => { if (e.target === paymentModal) document.getElementById('btnModalCancel').click(); });
  document.addEventListener('keydown', e => {
    if (!paymentModal.classList.contains('open')) return;
    if (e.key === 'Escape') document.getElementById('btnModalCancel').click();
    if (e.key === 'Tab') {
      const focusables = Array.from(paymentModal.querySelectorAll('button, input')).filter(el => !el.disabled);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const customerModal = document.getElementById('customerModal');
  document.getElementById('btnAddCustomer').onclick = () => {
    document.getElementById('customerForm').reset();
    setError('customerError', '');
    customerModal.showModal();
    document.getElementById('newCustomerName').focus();
  };
  document.getElementById('btnCloseCustomer').onclick = () => customerModal.close();
  document.getElementById('customerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('newCustomerName').value.trim();
    const phone = document.getElementById('newCustomerPhone').value.trim();
    const debt = parseCurrency(document.getElementById('newCustomerDebt').value);
    const limit = parseCurrency(document.getElementById('newCustomerLimit').value);
    if (!name || !Number.isSafeInteger(debt) || debt < 0 || !Number.isSafeInteger(limit) || limit <= 0) {
      setError('customerError', 'Isi nama, saldo bon awal, dan plafon yang valid.');
      return;
    }
    if (phone && !PoultryCore.normalizePhone(phone)) {
      setError('customerError', 'Nomor WhatsApp tidak valid. Gunakan awalan 08 atau +62.');
      return;
    }
    if (state.customers.some(c => c.id !== 'ECR' && (c.name.trim().toLowerCase() === name.toLowerCase() || (phone && PoultryCore.normalizePhone(c.phone) === PoultryCore.normalizePhone(phone))))) {
      setError('customerError', 'Nama atau nomor WhatsApp mitra sudah terdaftar.');
      return;
    }
    const dueDate = debt > 0 ? new Date(Date.parse(localDateKey()) + 7 * 86400000).toISOString().slice(0, 10) : null;
    const customer = {id: newId('M'), name, phone, initialDebt: debt, currentDebt: debt, plafon: limit, daysLate: 0, dueDate, status: 'aktif', history: []};
    state.customers.push(customer);
    if (!saveState()) return;
    document.getElementById('customerSelect').appendChild(new Option(name, customer.id));
    customerModal.close();
    renderBukuBon();
    showToast('Mitra dan saldo bon awal berhasil disimpan.');
  });
}

const UI_ICONS = {"chicken": "<path d=\"M8 5c-3 0-5 2-5 5s3 6 6 6h3l3 4a3 3 0 0 0 4-4l-3-3v-3c0-3-3-6-6-6Z\"/><path d=\"m15 17 2-2\"/>", "user": "<circle cx=\"12\" cy=\"8\" r=\"3\"/><path d=\"M5 21v-3a7 7 0 0 1 14 0v3Z\"/>", "cash": "<path d=\"M5 3h14l2 18H3L5 3Z\"/><path d=\"M7 7h10M7 11h2m3 0h2m3 0h1M6 15h2m3 0h2m3 0h2M6 18h12\"/>", "book": "<path d=\"M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1ZM12 5v15M5 8h4M5 12h4m6-4h4m-4 4h4\"/>", "scale": "<path d=\"M3 3h18M3 21h18M5 3c0 6 3 6 7 9-4 3-7 3-7 9M19 3c0 6-3 6-7 9 4 3 7 3 7 9M8 18h8\"/>", "box": "<path d=\"M3 3h18v5H3zM5 8v13h14V8M10 12h4\"/>", "chart": "<path d=\"m3 15 4-9 5 6 4-9 5 10M3 21l5-4 5 4m3-2 5-2\"/><circle cx=\"17\" cy=\"16\" r=\"3\"/>", "arrow": "<path d=\"M4 12h16m-6-6 6 6-6 6\"/>", "check": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m7 12 3 3 7-7\"/>", "cut": "<circle cx=\"6\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><path d=\"m8 8 13 13M8 16 21 3\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>", "store": "<path d=\"m3 10 2-7h14l2 7M3 10c0 4 5 4 5 0 0 4 8 4 8 0 0 4 5 4 5 0M5 13v8h14v-8M10 21v-6h4v6\"/>", "phone": "<path d=\"m5 3 4 4-2 3c2 3 4 5 7 7l3-2 4 4-2 3C10 21 3 14 2 5Z\"/>", "chat": "<path d=\"M3 3h18v14H8l-5 4ZM7 7h10M7 11h8\"/>", "list": "<path d=\"M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1\"/>", "receipt": "<path d=\"M5 2v20l3-2 4 2 4-2 3 2V2l-3 2-4-2-4 2ZM8 8h8M8 12h8M8 16h5\"/>", "money": "<rect x=\"2\" y=\"6\" width=\"20\" height=\"13\" rx=\"2\"/><circle cx=\"12\" cy=\"12.5\" r=\"3\"/><path d=\"M5 3h14M5 10v5m14-5v5\"/>", "print": "<path d=\"M7 7V2h10v5M7 17H3V8h18v9h-4M7 14h10v8H7Z\"/>", "search": "<circle cx=\"10\" cy=\"10\" r=\"6\"/><path d=\"m15 15 6 6\"/>", "lock": "<rect x=\"4\" y=\"10\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"M8 10V6a4 4 0 0 1 8 0v4M12 14v4\"/>", "reset": "<path d=\"M4 8a8 8 0 1 1-1 7M4 3v5h5\"/>", "truck": "<path d=\"M2 4h12v13H2Zm12 5h4l4 5v3h-8\"/><circle cx=\"6\" cy=\"18\" r=\"2\"/><circle cx=\"18\" cy=\"18\" r=\"2\"/>", "plus": "<path d=\"M12 5v14M5 12h14\"/>", "minus": "<path d=\"M5 12h14\"/>", "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2\"/>"};

function uiIcon(name) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UI_ICONS[name] || UI_ICONS.receipt}</svg>`;
}

function partLabel(part) {
  return part === 'fillet' ? 'Fillet' : part === 'utuh' ? 'Ayam Utuh' : 'Potong ' + String(part || '4').replace('potong', '');
}

function isLapakOpen() {
  if (typeof state.lapakOpen === 'boolean') return state.lapakOpen;
  const hour = Number(new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Jakarta', hour: '2-digit', hourCycle: 'h23'}).format(new Date()));
  return hour >= 7 && hour < 18;
}

function updateLapakStatus() {
  const open = isLapakOpen();
  document.getElementById('lapakStatus').classList.toggle('is-open', open);
  document.getElementById('lapakStatusText').textContent = open ? 'Lapak Buka' : 'Lapak Tutup';
  document.getElementById('btnToggleLapak').textContent = open ? 'Tutup Lapak' : 'Buka Lapak';
  const closedToday = state.shiftClosedAt && localDateKey(new Date(state.shiftClosedAt)) === localDateKey() && !open;
  document.getElementById('shiftStatusBadge').innerHTML = uiIcon('sun') + (closedToday ? 'Shift Subuh Selesai' : 'Shift Subuh');
  document.getElementById('btnCloseShift').innerHTML = uiIcon('lock') + '<span>' + (closedToday ? 'Kasir Ditutup - Buka Kembali' : 'Tutup Kasir & Simpan Rekap') + '</span>';
}

function runPrint(content, receipt = false) {
  document.body.classList.toggle('print-receipt', receipt);
  document.getElementById('printSurface').innerHTML = content;
  window.print();
}

function printBonReport() {
  const total = state.customers.filter(c => c.id !== 'ECR').reduce((n, c) => n + Number(c.currentDebt || 0), 0);
  const rows = state.customers.filter(c => c.id !== 'ECR').map(c => `<tr><td>${escapeHtml(c.id)}</td><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.phone || '-')}</td><td>${formatRupiah(c.currentDebt)}</td><td>${formatRupiah(c.plafon)}</td></tr>`).join('');
  runPrint(`<h1>PoultryTrack | Rekap Buku Bon</h1><p>Tanggal: ${localDateKey()}</p><p>Pelaku Usaha Mikro / Retailer Unggas Komersial Pasar Tradisional</p><table><thead><tr><th>Kode</th><th>Mitra</th><th>Telepon</th><th>Saldo Bon</th><th>Plafon</th></tr></thead><tbody>${rows}</tbody></table><p class="print-total">Total piutang: ${formatRupiah(total)}</p>`);
}

function printCashReport() {
  const t = reportTotals();
  runPrint(`<h1>PoultryTrack</h1><p>Rekap Laci Kasir</p><p>${localDateKey()} | ${document.getElementById('reportPeriod').value === 'today' ? 'Hari ini' : 'Semua catatan'}</p><table><tbody><tr><td>Saldo awal laci</td><td>${formatRupiah(t.openingCash)}</td></tr><tr><td>Penjualan tunai</td><td>${formatRupiah(t.cashSales)}</td></tr><tr><td>Setoran bon</td><td>${formatRupiah(t.cashPayments)}</td></tr><tr><td>Modal pasokan tunai</td><td>${formatRupiah(t.cashSupplies)}</td></tr><tr><td>Total kas masuk</td><td>${formatRupiah(t.cashIn)}</td></tr><tr><td>Saldo kas</td><td>${formatRupiah(t.net)}</td></tr></tbody></table><p>Karkas terjual: ${t.ekor} ekor</p><p>Berat terjual: ${t.kg.toFixed(2)} Kg</p><p>Tambahan bon: ${formatRupiah(t.bon)}</p>`, true);
}

function printLatestReceipt() {
  const t = state.transactions.filter(t => t.type !== 'cicilan_masuk').sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))[0];
  if (!t) { showToast('Belum ada transaksi untuk dicetak.'); return; }
  runPrint(`<h1>PoultryTrack</h1><p>Struk Transaksi</p><p>${escapeHtml(t.id)}<br>${escapeHtml(t.date)} ${escapeHtml(t.time)} WIB</p><p>${escapeHtml(t.customerName)}</p><table><tbody><tr><td>Karkas</td><td>${t.ekor} Ekor</td></tr><tr><td>Berat</td><td>${Number(t.kg).toFixed(2)} Kg</td></tr><tr><td>Potongan</td><td>${escapeHtml(partLabel(t.part))}</td></tr><tr><td>Harga / Kg</td><td>${formatRupiah(t.pricePerKg)}</td></tr></tbody></table><p>${escapeHtml(t.notes || '')}</p><p class="print-total">Total: ${formatRupiah(t.total)}</p><p>${t.type === 'bon' ? 'DICATAT SEBAGAI BON' : 'TUNAI LUNAS'}</p><p>Terima kasih.</p>`, true);
}

function initFigmaDetails() {
  document.getElementById('btnTara').onclick = () => {
    const input = document.getElementById('inputKg');
    input.value = '0,00';
    input.dispatchEvent(new Event('input', {bubbles: true}));
    input.focus();
    showToast('Input netto dikosongkan. Masukkan berat baru.');
  };
  document.getElementById('inputKg').addEventListener('blur', e => {
    const value = parseNumber(e.target.value);
    if (Number.isFinite(value)) e.target.value = value.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  });
  document.getElementById('inputPrice').addEventListener('blur', e => {
    const value = parseCurrency(e.target.value);
    if (Number.isFinite(value)) e.target.value = value.toLocaleString('id-ID');
  });
  document.getElementById('btnQueuePage').onclick = () => {
    const count = state.queue.filter(q => queueFilter === 'done' ? q.status === 'done' : q.status !== 'done').length;
    const pages = Math.max(1, Math.ceil(count / 2));
    queuePage = (queuePage + 1) % pages;
    renderQueue();
    document.getElementById('antrean').scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  document.getElementById('btnSearchBon').onclick = () => {
    const tools = document.getElementById('bonSearchTools');
    tools.hidden = !tools.hidden;
    document.getElementById('btnSearchBon').setAttribute('aria-expanded', String(!tools.hidden));
    if (!tools.hidden) document.getElementById('searchBon').focus();
  };
  document.getElementById('btnNewPartner').onclick = () => document.getElementById('btnAddCustomer').click();
  document.getElementById('partnerPhoneInput').addEventListener('change', e => {
    const digits = value => String(value || '').replace(/\D/g, '').replace(/^62/, '0');
    const customer = state.customers.find(c => digits(c.phone) === digits(e.target.value) && digits(e.target.value));
    if (customer) {
      const select = document.getElementById('customerSelect');
      select.value = customer.id;
      select.dispatchEvent(new Event('change', {bubbles: true}));
    }
  });
  document.getElementById('customerForm').addEventListener('submit', () => {
    if (document.getElementById('customerModal').open) return;
    if (selectedCustomerType === 'langganan') {
      const select = document.getElementById('customerSelect');
      select.value = state.customers[state.customers.length - 1].id;
      select.dispatchEvent(new Event('change', {bubbles: true}));
    }
    refreshPartnerInfo();
  });
  document.getElementById('btnResetSupply').onclick = () => {
    const values = {supplyEkor: '1', supplyKg: '', supplyPrice: '23.500', supplyPayment: 'Lunas Tunai Meja'};
    Object.entries(values).forEach(([id, value]) => {
      const input = document.getElementById(id);
      input.value = value;
      input.dispatchEvent(new Event('input', {bubbles: true}));
    });
    showToast('Form pasokan direset. Riwayat tetap tersimpan.');
  };
  document.querySelectorAll('[data-add-supply]').forEach(button => button.onclick = () => {
    const input = document.getElementById('supplyKg');
    input.value = ((parseNumber(input.value) || 0) + Number(button.dataset.addSupply)).toFixed(1);
    input.dispatchEvent(new Event('input', {bubbles: true}));
  });
  document.getElementById('btnPrintBon').onclick = printBonReport;
  document.getElementById('btnBonRekap').onclick = printBonReport;
  document.getElementById('btnPrintReceipt').onclick = printLatestReceipt;
  document.getElementById('btnToggleLapak').onclick = () => {
    state.lapakOpen = !isLapakOpen();
    if (!saveState()) return;
    updateLapakStatus();
    document.getElementById('lapakModal').close();
    showToast(state.lapakOpen ? 'Lapak ditandai buka.' : 'Lapak ditandai tutup.');
  };
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.onclick = () => document.getElementById(button.dataset.closeDialog).close());
  const openCashModal = () => {
    const key = document.getElementById('reportPeriod').value === 'today' ? localDateKey() : 'all';
    document.getElementById('cashPhysical').value = state.cashCounts?.[key] ?? '';
    setError('cashMatchError', '');
    document.getElementById('cashModal').showModal();
    document.getElementById('cashPhysical').focus();
  };
  document.getElementById('btnMatchCash').onclick = openCashModal;
  document.getElementById('cashDifference').onclick = openCashModal;
  document.getElementById('cashMatchForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('cashPhysical');
    if (!input.reportValidity()) return;
    const key = document.getElementById('reportPeriod').value === 'today' ? localDateKey() : 'all';
    state.cashCounts = state.cashCounts || {};
    const amount = parseCurrency(input.value);
    if (!Number.isSafeInteger(amount) || amount < 0) { setError('cashMatchError', 'Masukkan uang fisik dalam rupiah yang valid.'); return; }
    state.cashCounts[key] = amount;
    if (!saveState()) return;
    document.getElementById('cashModal').close();
    renderRekapKas();
    showToast('Pencocokan uang fisik disimpan.');
  });
  document.getElementById('btnCloseShift').onclick = () => {
    const alreadyClosed = state.shiftClosedAt && localDateKey(new Date(state.shiftClosedAt)) === localDateKey() && !isLapakOpen();
    if (alreadyClosed) state.lapakOpen = true;
    else {
      const t = PoultryCore.reportTotals(state, 'today');
      state.closings = state.closings || [];
      state.closings.push({date: localDateKey(), closedAt: new Date().toISOString(), openingCash: t.openingCash, cashSales: t.cashSales, cashPayments: t.cashPayments, cashSupplies: t.cashSupplies, net: t.net});
      state.lapakOpen = false;
      state.shiftClosedAt = new Date().toISOString();
    }
    if (!saveState()) return;
    updateLapakStatus();
    showToast(alreadyClosed ? 'Kasir dibuka kembali.' : 'Rekap disimpan dan lapak ditandai tutup.');
  };
  updateLapakStatus();
}

function newId(prefix) {
  const suffix = window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  return prefix + '-' + suffix;
}

function brieflyDisable(button) {
  button.disabled = true;
  setTimeout(() => button.disabled = false, 650);
}

function initResilience() {
  document.getElementById('openingCashForm').addEventListener('submit', event => {
    event.preventDefault();
    const amount = parseCurrency(document.getElementById('openingCashInput').value);
    if (!Number.isSafeInteger(amount) || amount < 0) {
      setError('openingCashError', 'Isi saldo awal dengan nominal rupiah yang valid.');
      return;
    }
    state.openingCash ||= {};
    state.openingCash[localDateKey()] = amount;
    if (!saveState()) return;
    setError('openingCashError', '');
    renderRekapKas();
    showToast('Saldo awal laci hari ini disimpan.');
  });
  document.getElementById('btnBackupData').onclick = () => {
    const content = unreadableBackup && storageBlocked ? unreadableBackup : JSON.stringify(state, null, 2);
    const url = URL.createObjectURL(new Blob([content], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cadangan_PoultryTrack_${localDateKey()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Cadangan seluruh catatan diunduh.');
  };
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    showStorageError('Data berubah di tab lain. Muat ulang halaman sebelum melanjutkan pencatatan.');
  });
  document.querySelectorAll('.cust-type-btn').forEach(button => button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = document.querySelector(`.cust-type-btn[data-type="${button.dataset.type === 'eceran' ? 'langganan' : 'eceran'}"]`);
    next.click();
    next.focus();
  }));
  document.getElementById('modalPayAmount').addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); document.getElementById('btnModalConfirm').click(); }
  });
  document.querySelectorAll('input[name="part"], #withoutSkin').forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('has-keyboard-focus'));
    input.addEventListener('blur', () => input.parentElement.classList.remove('has-keyboard-focus'));
  });
  let date = localDateKey();
  setInterval(() => {
    const today = localDateKey();
    if (today !== date) { date = today; refreshViews(); }
    updateLapakStatus();
  }, 30000);
  window.addEventListener('afterprint', () => document.body.classList.remove('print-receipt'));
}

/* ==============================================================
   DASHBOARD EKSEKUTIF & ANALITIK LAPAK (SLIDE 7 & MUTU MANAJEMEN)
   ============================================================== */
function renderDashboard() {
  const container = document.getElementById('dashboard');
  if (!container) return;

  // Real data 5 bulan (Mei - Sept 2026)
  const monthlyData = [
    { month: 'Mei 2026', omzet: 38150200, cogs: 29525400, profit: 8624800, trx: 326, kg: 1184.2 },
    { month: 'Jun 2026', omzet: 39420500, cogs: 30510100, profit: 8910400, trx: 338, kg: 1221.5 },
    { month: 'Jul 2026', omzet: 37840100, cogs: 29312000, profit: 8528100, trx: 322, kg: 1172.8 },
    { month: 'Agu 2026', omzet: 38890450, cogs: 30114900, profit: 8775550, trx: 331, kg: 1205.4 },
    { month: 'Sep 2026', omzet: 37906800, cogs: 29390014, profit: 8516786, trx: 321, kg: 1151.0 }
  ];

  const totalOmzet = 192208050;
  const totalCogs = 148852414;
  const totalProfit = 43355636;
  const totalKg = 5934.9;
  const totalChickens = 2413;
  const totalTrx = 1638;
  const shrinkageRatio = 2.50; // 2.50%

  // Update KPI counters if present
  const setEl = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setEl('dashTotalOmzet', formatRupiah(totalOmzet));
  setEl('dashTotalProfit', formatRupiah(totalProfit));
  setEl('dashTotalKg', totalKg.toLocaleString('id-ID', { minimumFractionDigits: 1 }) + ' Kg');
  setEl('dashTotalChickens', totalChickens.toLocaleString('id-ID') + ' Ekor');
  setEl('dashShrinkage', shrinkageRatio.toFixed(2) + '%');

  // Calculate live customer debt from state
  const activeCustomers = (state && state.customers) ? state.customers.filter(c => c.status !== 'eceran') : [];
  const totalLiveDebt = activeCustomers.reduce((acc, c) => acc + (c.currentDebt || 0), 0);
  setEl('dashTotalDebt', formatRupiah(totalLiveDebt));

  // Render SVG Monthly Chart
  renderMonthlySvgChart(monthlyData);

  // Render Cut Mix Bars
  renderCutMixDistribution();


  // Render Partner Debt Monitoring
  renderPartnerDebtDashboard(activeCustomers);
}

function renderMonthlySvgChart(data) {
  const chartEl = document.getElementById('monthlyChartSvg');
  if (!chartEl) return;

  const width = 640;
  const height = 240;
  const padLeft = 65;
  const padRight = 25;
  const padTop = 30;
  const padBottom = 40;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = 45000000;
  const barGroupWidth = chartW / data.length;
  const barW = 20;

  let svg = `
    <defs>
      <linearGradient id="omzetBarGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#351900" />
        <stop offset="100%" stop-color="#4A2600" />
      </linearGradient>
      <linearGradient id="profitBarGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
    </defs>
  `;

  // Grid lines & Y-axis labels
  const gridSteps = [0, 10000000, 20000000, 30000000, 40000000];
  gridSteps.forEach(val => {
    const y = padTop + chartH - (val / maxVal) * chartH;
    svg += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3,3" />
      <text x="${padLeft - 10}" y="${y + 4}" font-size="10" font-family="'Plus Jakarta Sans', sans-serif" fill="#64748B" text-anchor="end" font-weight="600">
        ${val === 0 ? 'Rp 0' : 'Rp ' + (val / 1000000) + ' Jt'}
      </text>
    `;
  });

  // Bars
  data.forEach((d, i) => {
    const groupX = padLeft + i * barGroupWidth;
    const centerX = groupX + barGroupWidth / 2;

    const omzetH = (d.omzet / maxVal) * chartH;
    const omzetY = padTop + chartH - omzetH;
    const omzetX = centerX - barW - 3;

    const profitH = (d.profit / maxVal) * chartH;
    const profitY = padTop + chartH - profitH;
    const profitX = centerX + 3;

    svg += `
      <!-- Omzet Bar -->
      <rect x="${omzetX}" y="${omzetY}" width="${barW}" height="${omzetH}" rx="3" fill="url(#omzetBarGrad)">
        <title>${d.month} - Omzet: ${formatRupiah(d.omzet)} (${d.trx} trx)</title>
      </rect>
      <text x="${omzetX + barW/2}" y="${omzetY - 5}" font-size="9.5" font-family="'JetBrains Mono', monospace" font-weight="700" fill="#351900" text-anchor="middle">
        ${(d.omzet / 1000000).toFixed(1)}Jt
      </text>

      <!-- Profit Bar -->
      <rect x="${profitX}" y="${profitY}" width="${barW}" height="${profitH}" rx="3" fill="url(#profitBarGrad)">
        <title>${d.month} - Laba Kotor: ${formatRupiah(d.profit)}</title>
      </rect>
      <text x="${profitX + barW/2}" y="${profitY - 5}" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="700" fill="#D97706" text-anchor="middle">
        ${(d.profit / 1000000).toFixed(1)}Jt
      </text>

      <!-- Month Label -->
      <text x="${centerX}" y="${height - 12}" font-size="11" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" fill="#334155" text-anchor="middle">
        ${d.month}
      </text>
    `;
  });

  chartEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
  chartEl.innerHTML = svg;
}
function renderCutMixDistribution() {
  const container = document.getElementById('cutMixContainer');
  if (!container) return;

  const cuts = [
    { name: 'Potong 4 Bagian', kg: 2279.0, pct: 38.4, rev: 73801200, note: 'Paling diminati warung lalapan & katering' },
    { name: 'Potong 8 Bagian', kg: 1851.7, pct: 31.2, rev: 59902400, note: 'Standar warung rames & depot soto' },
    { name: 'Karkas Utuh Bersih', kg: 1103.9, pct: 18.6, rev: 35704100, note: 'Langganan rumah makan padang & resto' },
    { name: 'Fillet Dada / Giling', kg: 700.3, pct: 11.8, rev: 22800350, note: 'Premium depot bakso & olahan nugget' }
  ];

  container.innerHTML = cuts.map(c => `
    <div class="cut-mix-row">
      <div class="cut-mix-header">
        <span class="cut-mix-name">${c.name}</span>
        <span class="cut-mix-stat font-numeric">${c.kg.toLocaleString('id-ID', {minimumFractionDigits: 1})} Kg (${c.pct.toFixed(1)}%)</span>
      </div>
      <div class="cut-mix-bar-bg">
        <div class="cut-mix-bar-fill" style="width: ${c.pct}%;"></div>
      </div>
      <div class="cut-mix-meta">
        <span>Kontribusi: ${formatRupiah(c.rev)}</span>
        <span class="text-muted">${c.note}</span>
      </div>
    </div>
  `).join('');
}

function renderParetoSvgChart() {
  const chartEl = document.getElementById('paretoChartSvg');
  if (!chartEl) return;

  const issues = [
    { category: 'Kasir Antrean Subuh', count: 38, pct: 38.0, cum: 38.0, vital: true },
    { category: 'Bon Kertas Basah/Hilang', count: 29, pct: 29.0, cum: 67.0, vital: true },
    { category: 'Selisih Timbang Susut', count: 17, pct: 17.0, cum: 84.0, vital: true },
    { category: 'Salah Potong Karkas', count: 9, pct: 9.0, cum: 93.0, vital: false },
    { category: 'Salah Catat Cicilan', count: 7, pct: 7.0, cum: 100.0, vital: false }
  ];

  const width = 580;
  const height = 240;
  const padLeft = 45;
  const padRight = 45;
  const padTop = 25;
  const padBottom = 45;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxCount = 45;
  const barW = chartW / issues.length;

  let svg = `
    <defs>
      <linearGradient id="vitalBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#B91C1C" />
        <stop offset="100%" stop-color="#991B1B" />
      </linearGradient>
      <linearGradient id="trivialBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#94A3B8" />
        <stop offset="100%" stop-color="#64748B" />
      </linearGradient>
    </defs>
  `;

  // 80% Cutoff threshold line
  const cutoffY = padTop + chartH - (80 / 100) * chartH;
  svg += `
    <line x1="${padLeft}" y1="${cutoffY}" x2="${width - padRight}" y2="${cutoffY}" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4,4" />
    <text x="${width - padRight + 4}" y="${cutoffY + 4}" font-size="10" font-weight="700" fill="#D97706">80%</text>
  `;

  // Left Axis (Count) & Right Axis (%)
  svg += `
    <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + chartH}" stroke="#CBD5E1" stroke-width="1" />
    <line x1="${width - padRight}" y1="${padTop}" x2="${width - padRight}" y2="${padTop + chartH}" stroke="#CBD5E1" stroke-width="1" />
  `;

  let points = [];

  issues.forEach((iss, i) => {
    const x = padLeft + i * barW;
    const bWidth = barW * 0.65;
    const bOffset = (barW - bWidth) / 2;
    const bH = (iss.count / maxCount) * chartH;
    const bY = padTop + chartH - bH;

    const lineX = x + barW / 2;
    const lineY = padTop + chartH - (iss.cum / 100) * chartH;
    points.push({ x: lineX, y: lineY, cum: iss.cum });

    svg += `
      <!-- Bar -->
      <rect x="${x + bOffset}" y="${bY}" width="${bWidth}" height="${bH}" rx="3" fill="${iss.vital ? 'url(#vitalBarGrad)' : 'url(#trivialBarGrad)'}">
        <title>${iss.category}: ${iss.count} kasus (${iss.pct}%)</title>
      </rect>
      <!-- Count label -->
      <text x="${x + barW / 2}" y="${bY - 4}" font-size="10" font-weight="700" fill="#334155" text-anchor="middle">${iss.count}</text>
      <!-- X-label -->
      <text x="${x + barW / 2}" y="${height - 20}" font-size="9" font-family="'Plus Jakarta Sans', sans-serif" fill="#475569" text-anchor="middle">
        ${iss.category.split(' ')[0]}
      </text>
      <text x="${x + barW / 2}" y="${height - 8}" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif" fill="#64748B" text-anchor="middle">
        ${iss.category.split(' ').slice(1).join(' ')}
      </text>
    `;
  });

  // Cumulative line
  let polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  svg += `<polyline points="${polylineStr}" fill="none" stroke="#D97706" stroke-width="2.5" />`;

  points.forEach(p => {
    svg += `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="#D97706" stroke-width="2.5" />
      <text x="${p.x}" y="${p.y - 7}" font-size="9.5" font-weight="700" fill="#D97706" text-anchor="middle">${p.cum.toFixed(0)}%</text>
    `;
  });

  chartEl.innerHTML = svg;
}

function renderPartnerDebtDashboard(customers) {
  const container = document.getElementById('dashPartnerList');
  if (!container) return;

  const valid = customers.filter(c => (c.plafon || 0) > 0);
  valid.sort((a, b) => (b.currentDebt || 0) - (a.currentDebt || 0));

  container.innerHTML = valid.map(c => {
    const debt = c.currentDebt || 0;
    const plafon = c.plafon || 1;
    const ratio = Math.min(100, Math.round((debt / plafon) * 100));
    const statusClass = ratio >= 80 ? 'danger' : ratio >= 50 ? 'warning' : 'safe';

    return `
      <div class="dash-partner-item">
        <div class="dash-partner-top">
          <span class="dash-partner-name">${c.name}</span>
          <span class="dash-partner-debt font-numeric ${statusClass}">${formatRupiah(debt)} <small class="text-muted">/ ${formatRupiah(plafon)}</small></span>
        </div>
        <div class="dash-partner-progress-bg">
          <div class="dash-partner-progress-fill ${statusClass}" style="width: ${ratio}%;"></div>
        </div>
        <div class="dash-partner-sub">
          <span>Plafon terpakai: <strong>${ratio}%</strong></span>
          <span>Status: <strong class="partner-badge ${statusClass}">${c.daysLate > 0 ? c.daysLate + ' Hari Tempo' : 'Lancar'}</strong></span>
        </div>
      </div>
    `;
  }).join('');
}
