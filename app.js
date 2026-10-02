/**
 * PoultryTrack - Sistem Kasir & Buku Bon Lapak Ayam Potong
 * Dibuat khusus untuk operasional cepat lapak pasar tradisional subuh.
 * 100% Offline-ready (localStorage) | Zero-Latency Haptic Click | WhatsApp Bill Integration
 */

// Key Storage
const STORAGE_KEY = 'POULTRYTRACK_APP_STATE_V1';

// Default State Fallback
const DEFAULT_STATE = {
  activeDate: new Date().toISOString().split('T')[0],
  customers: [
    { id: "AL", name: "AL (Warung Nasi Padang)", phone: "081234567890", initialDebt: 850000, currentDebt: 850000, history: [] },
    { id: "War", name: "War (Pecel Lele & Ayam Cak War)", phone: "081298765432", initialDebt: 620000, currentDebt: 620000, history: [] },
    { id: "K", name: "K (Kantin Bu Kus)", phone: "081311223344", initialDebt: 450000, currentDebt: 450000, history: [] },
    { id: "J", name: "J (Pak Joko Soto)", phone: "081555667788", initialDebt: 380000, currentDebt: 380000, history: [] },
    { id: "M", name: "M (Mie Ayam Bang Mul)", phone: "081777889900", initialDebt: 510000, currentDebt: 510000, history: [] },
    { id: "S", name: "S (Sate Taichan Mas Sam)", phone: "081888990011", initialDebt: 720000, currentDebt: 720000, history: [] },
    { id: "R", name: "R (Rumah Makan Roso)", phone: "081999001122", initialDebt: 300000, currentDebt: 300000, history: [] },
    { id: "B", name: "B (Bakso & Pangsit Bu Sri)", phone: "082111223344", initialDebt: 250000, currentDebt: 250000, history: [] },
    { id: "YA", name: "YA (Ayam Bakar Pak Yanto)", phone: "082222334455", initialDebt: 540000, currentDebt: 540000, history: [] },
    { id: "ATUL", name: "ATUL (Warung Bu Atul)", phone: "082333445566", initialDebt: 180000, currentDebt: 180000, history: [] },
    { id: "SPI", name: "SPI (Spesialis Opor Ibu)", phone: "082444556677", initialDebt: 410000, currentDebt: 410000, history: [] },
    { id: "Mic", name: "Mic (Katering Michael)", phone: "082555667788", initialDebt: 920000, currentDebt: 920000, history: [] },
    { id: "ECR", name: "ECR (Lapak Eceran Subuh)", phone: "-", initialDebt: 0, currentDebt: 0, history: [] }
  ],
  supplies: [
    { id: "SUP-001", date: "2026-09-25", supplier: "UD. Cheyloo Farm Kamal", ekor: 120, kg: 198.5, pricePerKg: 28500, totalModal: 5657250, paymentStatus: "Lunas Tunai", note: "Ayam segar utuh" },
    { id: "SUP-002", date: "2026-09-26", supplier: "UD. Cheyloo Farm Kamal", ekor: 135, kg: 221.0, pricePerKg: 28500, totalModal: 6298500, paymentStatus: "Lunas Tunai", note: "Kualitas bobot merata" },
    { id: "SUP-003", date: "2026-09-27", supplier: "UD. Cheyloo Farm Kamal", ekor: 110, kg: 182.0, pricePerKg: 29000, totalModal: 5278000, paymentStatus: "Lunas Tunai", note: "Harga pakan naik sedikit" }
  ],
  transactions: [
    { id: "TRX-101", date: "2026-09-27", time: "04:15", customerId: "AL", customerName: "AL (Warung Nasi Padang)", ekor: 15, kg: 24.5, part: "utuh", pricePerKg: 35000, total: 857500, type: "bon", notes: "Bon harian" },
    { id: "TRX-102", date: "2026-09-27", time: "04:40", customerId: "War", customerName: "War (Pecel Lele & Ayam Cak War)", ekor: 10, kg: 16.0, part: "potong8", pricePerKg: 35000, total: 560000, type: "tunai", notes: "Lunas uang pas" },
    { id: "TRX-103", date: "2026-09-27", time: "05:10", customerId: "ECR", customerName: "ECR (Lapak Eceran Subuh)", ekor: 2, kg: 3.2, part: "potong4", pricePerKg: 36000, total: 115200, type: "tunai", notes: "Ibu rumah tangga" }
  ]
};

// Global App State
let state = null;

// Audio Haptic Click Generator (Web Audio API)
let audioCtx = null;
function playTouchSound(freq = 750, duration = 0.025) {
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
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Silent fail if audio not allowed
  }
}

// Helpers
function formatRupiah(num) {
  if (isNaN(num)) return "Rp 0";
  return "Rp " + Math.round(num).toLocaleString('id-ID');
}

function parseNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

// Persistence
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (e) {
      state = DEFAULT_STATE;
    }
  } else {
    state = DEFAULT_STATE;
    saveState();
  }
}

// Live Clock & Date
function initClock() {
  function update() {
    const now = new Date();
    const clockEl = document.getElementById('liveClock');
    const dateEl = document.getElementById('liveDate');
    
    if (clockEl) {
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
      clockEl.innerText = timeStr;
    }
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      dateEl.innerText = now.toLocaleDateString('id-ID', options);
    }
  }
  update();
  setInterval(update, 1000);
}

// Tab Switching
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(600);
      const target = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const pane = document.getElementById(target);
      if (pane) pane.classList.add('active');

      // Refresh content if needed
      if (target === 'buku-bon') renderBukuBon();
      if (target === 'pasokan') renderSupplies();
      if (target === 'rekap-kas') renderRekapKas();
      if (target === 'riwayat') renderRiwayat();
    });
  });
}

// Kasir Calculator Logic
let selectedPaymentType = 'tunai'; // 'tunai' or 'bon'
let selectedCustomerType = 'eceran'; // 'eceran' or 'langganan'

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
  const quickWeights = document.querySelectorAll('.qw-btn');
  const quickPrices = document.querySelectorAll('.qp-btn');
  const steppers = document.querySelectorAll('.stepper-btn');
  const payTypeBtns = document.querySelectorAll('.pay-type-btn');
  const btnSubmitTrx = document.getElementById('btnSubmitTrx');
  const btnResetTrx = document.getElementById('btnResetTrx');

  // Populate Customer Select
  function populateCustomerSelect() {
    customerSelect.innerHTML = '<option value="">-- Pilih Nama Mitra Langganan --</option>';
    state.customers.filter(c => c.id !== 'ECR').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.id} - ${c.name} (Sisa Bon: ${formatRupiah(c.currentDebt)})`;
      customerSelect.appendChild(opt);
    });
  }
  populateCustomerSelect();

  // Switch Eceran / Langganan
  custTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound();
      custTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCustomerType = btn.dataset.type;

      if (selectedCustomerType === 'langganan') {
        langgananGroup.style.display = 'block';
      } else {
        langgananGroup.style.display = 'none';
        customerSelect.value = '';
        custBalanceBadge.style.display = 'none';
      }
      recalculateSubtotal();
    });
  });

  customerSelect.addEventListener('change', () => {
    const cust = state.customers.find(c => c.id === customerSelect.value);
    if (cust) {
      custBalanceBadge.style.display = 'inline-block';
      custBalanceAmount.innerText = formatRupiah(cust.currentDebt);
      // Default to bon if langganan, but user can choose tunai
      selectPaymentType('bon');
    } else {
      custBalanceBadge.style.display = 'none';
    }
  });

  // Stepper buttons (+/-)
  steppers.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(800);
      const targetId = btn.dataset.target;
      const step = parseFloat(btn.dataset.step) || 1;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        let val = parseNumber(targetEl.value);
        val = Math.max(0, val + step);
        targetEl.value = step % 1 === 0 ? val : val.toFixed(1);
        recalculateSubtotal();
      }
    });
  });

  // Quick weight buttons
  quickWeights.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(900);
      kgInput.value = btn.dataset.kg;
      recalculateSubtotal();
    });
  });

  // Quick price buttons
  quickPrices.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(900);
      priceInput.value = btn.dataset.price;
      recalculateSubtotal();
    });
  });

  // Calculation on input
  [ekorInput, kgInput, priceInput].forEach(inp => {
    inp.addEventListener('input', recalculateSubtotal);
  });

  function recalculateSubtotal() {
    const kg = parseNumber(kgInput.value);
    const price = parseNumber(priceInput.value);
    const subtotal = kg * price;
    subtotalDisplay.innerText = formatRupiah(subtotal);
  }

  // Payment Type
  function selectPaymentType(type) {
    selectedPaymentType = type;
    payTypeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.pay === type);
    });
  }

  payTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound(650);
      selectPaymentType(btn.dataset.pay);
    });
  });

  // Reset form
  btnResetTrx.addEventListener('click', () => {
    playTouchSound(450);
    resetForm();
  });

  function resetForm() {
    ekorInput.value = 1;
    kgInput.value = 1.6;
    priceInput.value = 35000;
    document.getElementById('inputNote').value = '';
    document.getElementById('partUtuh').checked = true;
    selectPaymentType('tunai');
    custTypeBtns[0].click(); // Set back to Eceran
    recalculateSubtotal();
  }

  // Submit Transaction
  btnSubmitTrx.addEventListener('click', () => {
    playTouchSound(1000);
    const kg = parseNumber(kgInput.value);
    const ekor = parseNumber(ekorInput.value);
    const price = parseNumber(priceInput.value);
    const total = kg * price;

    if (kg <= 0 || price <= 0) {
      alert("Masukkan berat (kg) dan harga yang valid!");
      return;
    }

    let customerId = 'ECR';
    let customerName = 'Lapak Eceran Subuh';

    if (selectedCustomerType === 'langganan') {
      customerId = customerSelect.value;
      if (!customerId) {
        alert("Silakan pilih mitra langganan terlebih dahulu!");
        return;
      }
      const custObj = state.customers.find(c => c.id === customerId);
      customerName = custObj ? custObj.name : customerId;
    }

    // Part selection
    const partRadio = document.querySelector('input[name="part"]:checked');
    const part = partRadio ? partRadio.value : 'utuh';
    const notes = document.getElementById('inputNote').value.trim();

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newTrx = {
      id: "TRX-" + Date.now().toString().slice(-5),
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
      notes: notes || (selectedPaymentType === 'bon' ? 'Bon belanja' : 'Tunai lunas')
    };

    // If bon, add to customer balance
    if (selectedPaymentType === 'bon' && customerId !== 'ECR') {
      const custObj = state.customers.find(c => c.id === customerId);
      if (custObj) {
        custObj.currentDebt = (custObj.currentDebt || 0) + total;
        custObj.history.push({
          date: dateStr,
          time: timeStr,
          type: "BON_BARU",
          amount: total,
          remaining: custObj.currentDebt,
          ref: newTrx.id
        });
      }
    }

    state.transactions.unshift(newTrx);
    saveState();
    populateCustomerSelect();

    // Show quick alert toast or message
    alert(`Transaksi ${newTrx.id} Berhasil Disimpan!\nTotal: ${formatRupiah(total)} (${newTrx.type.toUpperCase()})`);
    resetForm();
    renderBukuBon();
    renderRekapKas();
  });
}

// Buku Bon & Pelunasan Cicilan
function renderBukuBon() {
  const container = document.getElementById('bonListContainer');
  const searchInput = document.getElementById('searchBon');
  const totalDebtHeader = document.getElementById('headerTotalDebt');
  const totalDebtorCount = document.getElementById('headerDebtorCount');
  
  if (!container) return;

  const validCustomers = state.customers.filter(c => c.id !== 'ECR');
  const totalDebt = validCustomers.reduce((acc, c) => acc + (c.currentDebt || 0), 0);
  const activeDebtors = validCustomers.filter(c => (c.currentDebt || 0) > 0).length;

  if (totalDebtHeader) totalDebtHeader.innerText = formatRupiah(totalDebt);
  if (totalDebtorCount) totalDebtorCount.innerText = `${activeDebtors} Mitra`;

  const query = (searchInput ? searchInput.value : '').toLowerCase();

  const filtered = validCustomers.filter(c => 
    c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
  );

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">Tidak ada data mitra langganan yang cocok.</div>`;
    return;
  }

  filtered.forEach(c => {
    const isLunas = c.currentDebt <= 0;
    const card = document.createElement('div');
    card.className = `bon-card ${isLunas ? 'lunas' : ''}`;
    card.innerHTML = `
      <div class="bon-card-header">
        <div>
          <span class="badge-code">${c.id}</span>
          <strong class="bon-name">${c.name}</strong>
        </div>
        <div class="bon-badge ${isLunas ? 'lunas' : 'terhutang'}">
          ${isLunas ? 'LUNAS' : 'BON AKTIF'}
        </div>
      </div>
      <div class="bon-balance-box">
        <span class="label">Sisa Saldo Bon:</span>
        <span class="value ${isLunas ? 'text-green' : 'text-red'}">${formatRupiah(c.currentDebt)}</span>
      </div>
      <div class="bon-card-actions">
        <button class="action-btn pay-btn" onclick="openPaymentModal('${c.id}')">
          <i class="icon-cash"></i> Setor Cicilan Tunai
        </button>
        <button class="action-btn wa-btn" onclick="sendWhatsAppReminder('${c.id}')">
          <i class="icon-wa"></i> Kirim Rincian WA
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Payment Modal Logic
window.openPaymentModal = function(customerId) {
  playTouchSound(700);
  const cust = state.customers.find(c => c.id === customerId);
  if (!cust) return;

  const modal = document.getElementById('paymentModal');
  document.getElementById('modalCustName').innerText = `${cust.id} - ${cust.name}`;
  document.getElementById('modalCurrentDebt').innerText = formatRupiah(cust.currentDebt);
  const amountInput = document.getElementById('modalPayAmount');
  amountInput.value = '';
  modal.dataset.customerId = customerId;

  // Preset quick pay buttons in modal
  const modalQuickPay = document.getElementById('modalQuickPayOptions');
  modalQuickPay.innerHTML = '';

  const presets = [50000, 100000, 200000, cust.currentDebt].filter(p => p > 0);
  presets.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'quick-pill';
    b.textContent = p === cust.currentDebt ? `Lunas Semua (${formatRupiah(p)})` : formatRupiah(p);
    b.onclick = () => {
      playTouchSound();
      amountInput.value = p;
    };
    modalQuickPay.appendChild(b);
  });

  modal.classList.add('open');
};

function initModal() {
  const modal = document.getElementById('paymentModal');
  const btnClose = document.getElementById('btnModalClose');
  const btnCancel = document.getElementById('btnModalCancel');
  const btnConfirm = document.getElementById('btnModalConfirm');

  [btnClose, btnCancel].forEach(b => {
    if (b) b.onclick = () => {
      playTouchSound(400);
      modal.classList.remove('open');
    };
  });

  btnConfirm.onclick = () => {
    playTouchSound(1000);
    const customerId = modal.dataset.customerId;
    const cust = state.customers.find(c => c.id === customerId);
    const amount = parseNumber(document.getElementById('modalPayAmount').value);

    if (!cust || amount <= 0) {
      alert("Masukkan nominal cicilan yang valid!");
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    cust.currentDebt = Math.max(0, cust.currentDebt - amount);
    cust.history.push({
      date: dateStr,
      time: timeStr,
      type: "SETOR_CICILAN",
      amount: amount,
      remaining: cust.currentDebt
    });

    // Catat sebagai transaksi kas masuk cicilan
    state.transactions.unshift({
      id: "PAY-" + Date.now().toString().slice(-5),
      date: dateStr,
      time: timeStr,
      customerId: cust.id,
      customerName: cust.name,
      ekor: 0,
      kg: 0,
      part: "-",
      pricePerKg: 0,
      total: amount,
      type: "cicilan_masuk",
      notes: `Setoran cicilan bon tunai (${formatRupiah(amount)})`
    });

    saveState();
    modal.classList.remove('open');
    renderBukuBon();
    renderRekapKas();
    alert(`Berhasil mencatat setoran cicilan Rp ${amount.toLocaleString('id-ID')} dari ${cust.name}.\nSisa saldo bon sekarang: ${formatRupiah(cust.currentDebt)}`);
  };
}

// WhatsApp Reminders
window.sendWhatsAppReminder = function(customerId) {
  playTouchSound(800);
  const cust = state.customers.find(c => c.id === customerId);
  if (!cust) return;

  const phone = (cust.phone || '').replace(/[^0-9]/g, '');
  const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

  const msg = `Halo ${cust.name}, catatan rincian bon belanja ayam potong di lapak:\n` +
              `Total Sisa Saldo Bon: *${formatRupiah(cust.currentDebt)}*.\n` +
              `Terima kasih atas kerja samanya, semoga usahanya semakin lancar dan berkah selalu! 🙏🐔`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
};

// Pasokan Masuk Supplier UD. Cheyloo Farm
function initSupplies() {
  const btnSubmitSupply = document.getElementById('btnSubmitSupply');
  const supplyEkor = document.getElementById('supplyEkor');
  const supplyKg = document.getElementById('supplyKg');
  const supplyPrice = document.getElementById('supplyPrice');
  const supplyModalTotal = document.getElementById('supplyModalTotal');

  function updateSupplyTotal() {
    const kg = parseNumber(supplyKg.value);
    const p = parseNumber(supplyPrice.value);
    supplyModalTotal.innerText = formatRupiah(kg * p);
  }

  [supplyKg, supplyPrice].forEach(inp => {
    if (inp) inp.addEventListener('input', updateSupplyTotal);
  });

  if (btnSubmitSupply) {
    btnSubmitSupply.onclick = () => {
      playTouchSound(1000);
      const supplier = document.getElementById('supplySupplier').value.trim() || 'UD. Cheyloo Farm Kamal';
      const ekor = parseNumber(supplyEkor.value);
      const kg = parseNumber(supplyKg.value);
      const price = parseNumber(supplyPrice.value);
      const paymentStatus = document.getElementById('supplyPayment').value;
      const note = document.getElementById('supplyNote').value.trim();

      if (kg <= 0 || price <= 0) {
        alert("Masukkan berat kg dan harga timbang supplier yang valid!");
        return;
      }

      const now = new Date();
      const newSupply = {
        id: "SUP-" + Date.now().toString().slice(-4),
        date: now.toISOString().split('T')[0],
        supplier: supplier,
        ekor: ekor,
        kg: kg,
        pricePerKg: price,
        totalModal: kg * price,
        paymentStatus: paymentStatus,
        note: note || "Pasokan ayam segar"
      };

      state.supplies.unshift(newSupply);
      saveState();
      renderSupplies();
      renderRekapKas();
      alert(`Nota pasokan ${newSupply.id} berhasil dicatat!\nTotal modal: ${formatRupiah(newSupply.totalModal)}`);

      // Reset
      supplyEkor.value = 100;
      supplyKg.value = 160;
      supplyPrice.value = 28500;
      document.getElementById('supplyNote').value = '';
      updateSupplyTotal();
    };
  }
}

function renderSupplies() {
  const container = document.getElementById('suppliesListContainer');
  if (!container) return;

  container.innerHTML = '';
  if (state.supplies.length === 0) {
    container.innerHTML = `<div class="empty-state">Belum ada catatan nota pasokan masuk.</div>`;
    return;
  }

  state.supplies.forEach(s => {
    const item = document.createElement('div');
    item.className = 'supply-item-card';
    item.innerHTML = `
      <div class="supply-item-header">
        <div>
          <span class="supply-tag">${s.id}</span>
          <strong>${s.supplier}</strong>
          <span class="supply-date">${s.date}</span>
        </div>
        <span class="supply-badge-status ${s.paymentStatus.includes('Lunas') ? 'lunas' : 'tempo'}">${s.paymentStatus}</span>
      </div>
      <div class="supply-specs-grid">
        <div><small>Jumlah Ekor</small><br><strong>${s.ekor} Ekor</strong></div>
        <div><small>Berat Timbang</small><br><strong>${s.kg} Kg</strong></div>
        <div><small>Harga / Kg</small><br><strong>${formatRupiah(s.pricePerKg)}</strong></div>
        <div><small>Total Modal Faktur</small><br><strong class="text-modal">${formatRupiah(s.totalModal)}</strong></div>
      </div>
      ${s.note ? `<div class="supply-note"><small>Catatan: ${s.note}</small></div>` : ''}
    `;
    container.appendChild(item);
  });
}

// Rekap Tutup Buku Kas Harian
function renderRekapKas() {
  const todayStr = new Date().toISOString().split('T')[0];

  // Penjualan tunai hari ini
  const cashSalesToday = state.transactions
    .filter(t => t.date === todayStr && t.type === 'tunai')
    .reduce((sum, t) => sum + t.total, 0);

  // Setoran cicilan bon hari ini
  const cashCicilanToday = state.transactions
    .filter(t => t.date === todayStr && t.type === 'cicilan_masuk')
    .reduce((sum, t) => sum + t.total, 0);

  // Total Kas Masuk Laci Meja
  const totalKasMasuk = cashSalesToday + cashCicilanToday;

  // Bon Piutang Keluar Hari ini
  const bonKeluarToday = state.transactions
    .filter(t => t.date === todayStr && t.type === 'bon')
    .reduce((sum, t) => sum + t.total, 0);

  // Total Modal Pasokan Hari ini yang dibayar tunai
  const modalPasokanToday = state.supplies
    .filter(s => s.date === todayStr && s.paymentStatus.includes('Tunai'))
    .reduce((sum, s) => sum + s.totalModal, 0);

  // Kas Bersih Laci Meja
  const kasBersihLaci = totalKasMasuk - modalPasokanToday;

  // Total Kg & Ekor Terjual Hari Ini
  const totalKgSold = state.transactions
    .filter(t => t.date === todayStr && t.type !== 'cicilan_masuk')
    .reduce((sum, t) => sum + (t.kg || 0), 0);

  const totalEkorSold = state.transactions
    .filter(t => t.date === todayStr && t.type !== 'cicilan_masuk')
    .reduce((sum, t) => sum + (t.ekor || 0), 0);

  // Update DOM Elements
  const elCashSales = document.getElementById('rekapCashSales');
  const elCashCicilan = document.getElementById('rekapCashCicilan');
  const elTotalKasMasuk = document.getElementById('rekapTotalKasMasuk');
  const elModalPasokan = document.getElementById('rekapModalPasokan');
  const elKasBersihLaci = document.getElementById('rekapKasBersihLaci');
  const elBonKeluar = document.getElementById('rekapBonKeluar');
  const elKgSold = document.getElementById('rekapKgSold');
  const elEkorSold = document.getElementById('rekapEkorSold');

  if (elCashSales) elCashSales.innerText = formatRupiah(cashSalesToday);
  if (elCashCicilan) elCashCicilan.innerText = formatRupiah(cashCicilanToday);
  if (elTotalKasMasuk) elTotalKasMasuk.innerText = formatRupiah(totalKasMasuk);
  if (elModalPasokan) elModalPasokan.innerText = formatRupiah(modalPasokanToday);
  if (elKasBersihLaci) elKasBersihLaci.innerText = formatRupiah(kasBersihLaci);
  if (elBonKeluar) elBonKeluar.innerText = formatRupiah(bonKeluarToday);
  if (elKgSold) elKgSold.innerText = `${totalKgSold.toFixed(1)} Kg`;
  if (elEkorSold) elEkorSold.innerText = `${totalEkorSold} Ekor`;
}

// Riwayat Transaksi & Filter
function renderRiwayat() {
  const container = document.getElementById('historyTableBody');
  if (!container) return;

  container.innerHTML = '';
  if (state.transactions.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="empty-table">Belum ada riwayat transaksi.</td></tr>`;
    return;
  }

  state.transactions.forEach(t => {
    const tr = document.createElement('tr');
    const isCicilan = t.type === 'cicilan_masuk';
    const isBon = t.type === 'bon';

    tr.innerHTML = `
      <td><strong>${t.time}</strong><br><small class="text-muted">${t.date}</small></td>
      <td><span class="badge-code">${t.customerId}</span> ${t.customerName}</td>
      <td>${isCicilan ? '-' : `${t.ekor} Ekor (${t.kg} Kg)`}</td>
      <td>${isCicilan ? '-' : t.part}</td>
      <td>${isCicilan ? '-' : formatRupiah(t.pricePerKg)}</td>
      <td><strong>${formatRupiah(t.total)}</strong></td>
      <td>
        <span class="status-pill ${isBon ? 'pill-bon' : (isCicilan ? 'pill-cicilan' : 'pill-tunai')}">
          ${isBon ? 'BON' : (isCicilan ? 'SETOR CICILAN' : 'TUNAI')}
        </span>
      </td>
    `;
    container.appendChild(tr);
  });
}

// Export CSV / Excel Compatible
function initExport() {
  const btnExport = document.getElementById('btnExportCsv');
  if (!btnExport) return;

  btnExport.onclick = () => {
    playTouchSound(900);
    const rows = [
      ["ID Transaksi", "Tanggal", "Jam", "Kode Mitra", "Nama Pelanggan", "Ekor", "Berat (Kg)", "Potongan", "Harga/Kg", "Total (Rp)", "Jenis Pembayaran", "Catatan"]
    ];

    state.transactions.forEach(t => {
      rows.push([
        t.id,
        t.date,
        t.time,
        t.customerId,
        `"${(t.customerName || '').replace(/"/g, '""')}"`,
        t.ekor || 0,
        t.kg || 0,
        t.part || '-',
        t.pricePerKg || 0,
        t.total || 0,
        t.type,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_PoultryTrack_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}

// Search Filter Buku Bon
function initSearch() {
  const searchInput = document.getElementById('searchBon');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderBukuBon();
    });
  }
}

// Backup & Reset Data Tools
function initDataTools() {
  const btnResetData = document.getElementById('btnResetToDefault');
  if (btnResetData) {
    btnResetData.onclick = () => {
      if (confirm("Apakah Anda yakin ingin mereset data ke setelan awal pabrik lapak pasar? Semua data transaksi baru akan diganti ke data default.")) {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
        location.reload();
      }
    };
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initClock();
  initTabs();
  initKasir();
  initModal();
  initSupplies();
  initExport();
  initSearch();
  initDataTools();

  // Initial renders
  renderBukuBon();
  renderSupplies();
  renderRekapKas();
  renderRiwayat();
});
