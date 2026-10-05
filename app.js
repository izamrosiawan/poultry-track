const STORAGE_KEY = 'POULTRYTRACK_APP_STATE_V1';

const DEFAULT_STATE = {
  activeDate: new Date().toISOString().split('T')[0],
  customers: [
    { id: "AL", name: "AL (Bu Aliyah - Katering/Resto)", phone: "081234567801", initialDebt: 1622000, currentDebt: 1622000, plafon: 2000000, daysLate: 0, status: "aktif", history: [] },
    { id: "War", name: "War (Warung Bu Warsiti - Lalapan)", phone: "081234567802", initialDebt: 560000, currentDebt: 560000, plafon: 1000000, daysLate: 0, status: "aktif", history: [] },
    { id: "K", name: "K (Pak Kusno - Depot Bakso)", phone: "081234567803", initialDebt: 400000, currentDebt: 400000, plafon: 800000, daysLate: 0, status: "aktif", history: [] },
    { id: "J", name: "J (Bu Jamilah - Nasi Barokah)", phone: "081234567804", initialDebt: 340000, currentDebt: 340000, plafon: 600000, daysLate: 0, status: "aktif", history: [] },
    { id: "M", name: "M (Mas Munir - Penyetan Malam)", phone: "081234567805", initialDebt: 237000, currentDebt: 237000, plafon: 500000, daysLate: 0, status: "aktif", history: [] },
    { id: "S", name: "S (Bu Siti - Warung Rames)", phone: "081234567806", initialDebt: 380000, currentDebt: 380000, plafon: 800000, daysLate: 0, status: "aktif", history: [] },
    { id: "R", name: "R (Bu Rahma - Soto Lamongan)", phone: "081234567807", initialDebt: 240000, currentDebt: 240000, plafon: 500000, daysLate: 0, status: "aktif", history: [] },
    { id: "B", name: "B (Bu Budi - Katering Kotak)", phone: "081234567808", initialDebt: 272000, currentDebt: 272000, plafon: 600000, daysLate: 0, status: "aktif", history: [] },
    { id: "YA", name: "YA (Bu Yanti - Rumah Makan Padang)", phone: "081234567809", initialDebt: 505000, currentDebt: 505000, plafon: 1000000, daysLate: 2, status: "tempo", history: [] },
    { id: "ATUL", name: "ATUL (Bu Atul - Warung Serba Ada)", phone: "081234567810", initialDebt: 150000, currentDebt: 150000, plafon: 400000, daysLate: 0, status: "aktif", history: [] },
    { id: "SPI", name: "SPI (Pak Ismail - Soto Ayam)", phone: "081234567811", initialDebt: 170000, currentDebt: 170000, plafon: 300000, daysLate: 1, status: "tempo", history: [] },
    { id: "Mic", name: "Mic (Bu Mieke - Langganan Tunai)", phone: "081234567812", initialDebt: 0, currentDebt: 0, plafon: 500000, daysLate: 0, status: "lancar", history: [] },
    { id: "ECR", name: "ECR (Pembeli Pasar - Eceran Meja)", phone: "-", initialDebt: 0, currentDebt: 0, plafon: 0, daysLate: 0, status: "eceran", history: [] }
  ],
  supplies: [
    { id: "SUP-188", date: "2026-10-05", supplier: "UD. Cheyloo Farm Kamal", ekor: 180, kg: 300.5, pricePerKg: 23500, totalModal: 7061750, paymentStatus: "Lunas Tunai Meja", note: "Subuh 04:30 WIB • Siap potong" },
    { id: "SUP-187", date: "2026-10-04", supplier: "UD. Cheyloo Farm Kamal", ekor: 150, kg: 282.0, pricePerKg: 28000, totalModal: 7896000, paymentStatus: "Lunas Tunai Meja", note: "Ayam segar utuh" },
    { id: "SUP-186", date: "2026-10-03", supplier: "CV. Unggas Jaya", ekor: 80, kg: 148.5, pricePerKg: 28000, totalModal: 4158000, paymentStatus: "Tempo 7 Hari", note: "Kualitas bobot merata" }
  ],
  transactions: [
    { id: "TRX-101", date: "2026-10-05", time: "05:15", customerId: "AL", customerName: "AL (Warung Nasi Padang)", ekor: 15, kg: 28.5, part: "utuh", pricePerKg: 35000, total: 997500, type: "bon", notes: "Bon harian rutin" },
    { id: "TRX-102", date: "2026-10-05", time: "05:40", customerId: "ECR", customerName: "Eceran Tunai", ekor: 3, kg: 5.4, part: "potong4", pricePerKg: 35000, total: 189000, type: "tunai", notes: "Uang pas" },
    { id: "TRX-103", date: "2026-10-05", time: "06:10", customerId: "Siti", customerName: "Siti (Katering Bu Siti)", ekor: 8, kg: 15.1, part: "potong8", pricePerKg: 34500, total: 520950, type: "bon", notes: "Katering pesanan" }
  ]
};

let state = null;
let audioCtx = null;
let currentBonFilter = 'all';

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
  if (isNaN(num)) return "Rp 0";
  return "Rp " + Math.round(num).toLocaleString('id-ID');
}

function parseNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (e) {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
  }
}

function initClock() {
  function update() {
    const now = new Date();
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
      clockEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
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

      bnavItems.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === target);
      });

      tabPanes.forEach(p => {
        p.classList.toggle('active', p.id === target);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (target === 'buku-bon') renderBukuBon();
      if (target === 'pasokan') renderSupplies();
      if (target === 'rekap-kas') renderRekapKas();
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
    customerSelect.innerHTML = '<option value="">-- Pilih Mitra Warung / Katering --</option>';
    state.customers.filter(c => c.id !== 'ECR').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.id} - ${c.name} (Sisa Bon: ${formatRupiah(c.currentDebt)})`;
      customerSelect.appendChild(opt);
    });
  }
  populateCustomerSelect();

  custTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTouchSound();
      custTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCustomerType = btn.dataset.type;

      if (selectedCustomerType === 'langganan') {
        if (langgananGroup) langgananGroup.style.display = 'block';
        selectPaymentType('bon');
      } else {
        if (langgananGroup) langgananGroup.style.display = 'none';
        if (custBalanceBadge) custBalanceBadge.style.display = 'none';
        selectPaymentType('tunai');
      }
    });
  });

  if (customerSelect) {
    customerSelect.addEventListener('change', () => {
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
        let val = parseNumber(targetEl.value);
        val = Math.max(0, val + step);
        targetEl.value = step % 1 === 0 ? val : val.toFixed(2);
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
        kgInput.value = btn.dataset.kg;
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
    const kg = parseNumber(kgInput ? kgInput.value : 0);
    const price = parseNumber(priceInput ? priceInput.value : 0);
    const subtotal = kg * price;
    if (subtotalDisplay) {
      subtotalDisplay.innerText = formatRupiah(subtotal);
    }
    if (formulaDisplay) {
      formulaDisplay.innerHTML = `${kg.toFixed(2)} Kg &times; ${formatRupiah(price)}`;
    }
  }
  recalculateSubtotal();

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

  if (btnResetTrx) {
    btnResetTrx.addEventListener('click', () => {
      playTouchSound();
      if (ekorInput) ekorInput.value = 3;
      if (kgInput) kgInput.value = "5.40";
      if (priceInput) priceInput.value = 35000;
      const noteInput = document.getElementById('inputNote');
      if (noteInput) noteInput.value = '';
      selectPaymentType('tunai');
      custTypeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === 'eceran'));
      if (langgananGroup) langgananGroup.style.display = 'none';
      if (custBalanceBadge) custBalanceBadge.style.display = 'none';
      recalculateSubtotal();
    });
  }

  if (btnSubmitTrx) {
    btnSubmitTrx.addEventListener('click', () => {
      playTouchSound(1000, 0.08);

      const ekor = parseNumber(ekorInput ? ekorInput.value : 1);
      const kg = parseNumber(kgInput ? kgInput.value : 0);
      const price = parseNumber(priceInput ? priceInput.value : 0);
      const total = kg * price;

      if (kg <= 0 || price <= 0) {
        alert("Mohon masukkan berat (Kg) dan harga per Kg yang valid!");
        return;
      }

      let customerId = 'ECR';
      let customerName = 'Eceran Tunai';

      if (selectedCustomerType === 'langganan') {
        customerId = customerSelect ? customerSelect.value : '';
        if (!customerId) {
          alert("Harap pilih nama mitra warung / langganan bon!");
          return;
        }
        const custObj = state.customers.find(c => c.id === customerId);
        if (custObj) customerName = custObj.name;
      }

      const checkedPart = document.querySelector('input[name="part"]:checked');
      const part = checkedPart ? checkedPart.value : 'utuh';
      const noteInput = document.getElementById('inputNote');
      const notes = noteInput ? noteInput.value.trim() : '';

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];

      const newTrx = {
        id: "TRX-" + Date.now().toString().slice(-4),
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
        notes: notes
      };

      state.transactions.unshift(newTrx);

      if (selectedPaymentType === 'bon') {
        const cust = state.customers.find(c => c.id === customerId);
        if (cust) {
          cust.currentDebt += total;
        }
      }

      saveState();
      populateCustomerSelect();
      renderBukuBon();
      renderRekapKas();

      alert(`Transaksi ${newTrx.id} Berhasil Disimpan!\nTotal: ${formatRupiah(total)} (${selectedPaymentType.toUpperCase()})`);

      if (btnResetTrx) btnResetTrx.click();
    });
  }
}

function renderBukuBon() {
  const container = document.getElementById('bonListContainer');
  const headerTotalDebt = document.getElementById('headerTotalDebt');
  const headerDebtorCount = document.getElementById('headerDebtorCount');
  const navDebtorBadge = document.getElementById('navDebtorBadge');
  const searchInput = document.getElementById('searchBon');

  if (!container) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const debtors = state.customers.filter(c => c.id !== 'ECR');

  let totalDebt = 0;
  let activeDebtorsCount = 0;

  debtors.forEach(c => {
    totalDebt += c.currentDebt;
    if (c.currentDebt > 0) activeDebtorsCount++;
  });

  if (headerTotalDebt) headerTotalDebt.innerText = formatRupiah(totalDebt);
  if (headerDebtorCount) headerDebtorCount.innerText = activeDebtorsCount.toString();
  if (navDebtorBadge) navDebtorBadge.innerText = activeDebtorsCount.toString();

  let filtered = debtors.filter(c => {
    const matchQuery = c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query);
    if (!matchQuery) return false;

    if (currentBonFilter === 'tempo') {
      return (c.daysLate || 0) > 0 && c.currentDebt > 0;
    }
    if (currentBonFilter === 'kritis') {
      const ratio = c.plafon > 0 ? (c.currentDebt / c.plafon) : 0;
      return ratio >= 0.85 && c.currentDebt > 0;
    }
    return true;
  });

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = `<div class="surface-card text-center" style="text-align: center; color: var(--text-muted); padding: 24px;">Tidak ada data mitra warung yang cocok.</div>`;
    return;
  }

  filtered.forEach(c => {
    const isLunas = c.currentDebt <= 0;
    const card = document.createElement('div');
    card.className = 'debtor-item-card';

    const ratio = c.plafon > 0 ? Math.min(100, Math.round((c.currentDebt / c.plafon) * 100)) : 0;
    const isOverdue = (c.daysLate || 0) > 0 && !isLunas;

    card.innerHTML = `
      <div class="debtor-item-header">
        <div>
          <h3 class="debtor-name">${c.name}</h3>
          <p class="debtor-sub">Kode: ${c.id} &bull; Plafon: ${formatRupiah(c.plafon || 2000000)} (${ratio}%)</p>
        </div>
        <div class="text-right">
          <span class="${isOverdue ? 'badge-status-red' : (isLunas ? 'badge-status-green' : 'meta-tag')}">
            ${isOverdue ? `Telat ${c.daysLate} Hari` : (isLunas ? 'LUNAS' : 'BON AKTIF')}
          </span>
          <div class="debtor-amount ${isLunas ? 'text-success' : 'text-danger'} font-numeric mt-1">
            ${formatRupiah(c.currentDebt)}
          </div>
        </div>
      </div>
      <div class="debtor-actions-grid">
        <button type="button" class="btn-card-pay" onclick="openPaymentModal('${c.id}')">
          Setor Cicilan Tunai
        </button>
        <a class="btn-card-wa" href="https://wa.me/?text=Halo%20${encodeURIComponent(c.name)},%20mengingatkan%20catatan%20bon%20lapak%20ayam%20sebesar%20${encodeURIComponent(formatRupiah(c.currentDebt))}." target="_blank">
          Kirim WA
        </a>
      </div>
    `;
    container.appendChild(card);
  });
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
    const presets = [50000, 100000, 200000, cust.currentDebt].filter(p => p > 0);
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

  if (modal) modal.classList.add('open');
};

function initModal() {
  const modal = document.getElementById('paymentModal');
  const btnClose = document.getElementById('btnModalClose');
  const btnCancel = document.getElementById('btnModalCancel');
  const btnConfirm = document.getElementById('btnModalConfirm');
  const amountInput = document.getElementById('modalPayAmount');

  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  if (btnClose) btnClose.onclick = closeModal;
  if (btnCancel) btnCancel.onclick = closeModal;

  if (btnConfirm) {
    btnConfirm.onclick = () => {
      playTouchSound(950);
      const cId = modal ? modal.dataset.customerId : null;
      const amount = parseNumber(amountInput ? amountInput.value : 0);

      if (!cId || amount <= 0) {
        alert("Masukkan jumlah cicilan setoran tunai yang valid!");
        return;
      }

      const cust = state.customers.find(c => c.id === cId);
      if (!cust) return;

      if (amount > cust.currentDebt) {
        alert(`Jumlah cicilan melebihi sisa bon (${formatRupiah(cust.currentDebt)})!`);
        return;
      }

      cust.currentDebt = Math.max(0, cust.currentDebt - amount);

      const now = new Date();
      const newTrx = {
        id: "PAY-" + Date.now().toString().slice(-4),
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
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
      saveState();
      closeModal();
      renderBukuBon();
      renderRekapKas();
      alert(`Setoran tunai ${formatRupiah(amount)} untuk ${cust.name} berhasil dicatat!`);
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
    const price = parseNumber(supplyPrice ? supplyPrice.value : 0);
    if (supplyModalTotal) {
      supplyModalTotal.innerText = formatRupiah(kg * price);
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
      const price = parseNumber(supplyPrice ? supplyPrice.value : 0);
      const paymentInput = document.getElementById('supplyPayment');
      const paymentStatus = paymentInput ? paymentInput.value : 'Lunas Tunai Meja';

      if (kg <= 0 || price <= 0) {
        alert("Masukkan berat timbangan bersih dan harga peternak yang valid!");
        return;
      }

      const now = new Date();
      const newSupply = {
        id: "SUP-" + Date.now().toString().slice(-4),
        date: now.toISOString().split('T')[0],
        supplier: "UD. Cheyloo Farm Kamal",
        ekor: ekor,
        kg: kg,
        pricePerKg: price,
        totalModal: kg * price,
        paymentStatus: paymentStatus,
        note: "Pasokan subuh karkas segar"
      };

      state.supplies.unshift(newSupply);
      saveState();
      renderSupplies();
      renderRekapKas();
      alert(`Nota pasokan ${newSupply.id} berhasil ditambahkan!\nTotal: ${formatRupiah(newSupply.totalModal)}`);
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
          <strong style="font-size: 13px;">${s.supplier}</strong>
          <span class="${s.paymentStatus.includes('Lunas') ? 'badge-status-green' : 'badge-status-red'}">${s.paymentStatus}</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${s.date} &bull; ${s.ekor} Ekor / ${s.kg} Kg</p>
      </div>
      <div style="text-align: right;">
        <strong class="font-numeric" style="font-size: 13px;">${formatRupiah(s.totalModal)}</strong>
        <p style="font-size: 10px; color: var(--text-muted);">@${formatRupiah(s.pricePerKg)}/Kg</p>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderRekapKas() {
  const elCashSales = document.getElementById('rekapCashSales');
  const elCashCicilan = document.getElementById('rekapCashCicilan');
  const elModalPasokan = document.getElementById('rekapModalPasokan');
  const elKasBersihLaci = document.getElementById('rekapKasBersihLaci');
  const elKgSold = document.getElementById('rekapKgSold');
  const elEkorSold = document.getElementById('rekapEkorSold');
  const elBonKeluar = document.getElementById('rekapBonKeluar');

  let cashSales = 0;
  let cashCicilan = 0;
  let bonBaru = 0;
  let totalKg = 0;
  let totalEkor = 0;

  state.transactions.forEach(t => {
    if (t.type === 'tunai') {
      cashSales += t.total;
    } else if (t.type === 'cicilan_masuk') {
      cashCicilan += t.total;
    } else if (t.type === 'bon') {
      bonBaru += t.total;
    }

    if (t.type !== 'cicilan_masuk') {
      totalKg += (t.kg || 0);
      totalEkor += (t.ekor || 0);
    }
  });

  let modalPasokanTunai = 0;
  state.supplies.forEach(s => {
    if (s.paymentStatus.includes('Lunas') || s.paymentStatus.includes('Tunai')) {
      modalPasokanTunai += s.totalModal;
    }
  });

  const kasBersih = (cashSales + cashCicilan) - modalPasokanTunai;

  if (elCashSales) elCashSales.innerText = formatRupiah(cashSales);
  if (elCashCicilan) elCashCicilan.innerText = formatRupiah(cashCicilan);
  if (elModalPasokan) elModalPasokan.innerText = formatRupiah(modalPasokanTunai);
  if (elKasBersihLaci) elKasBersihLaci.innerText = formatRupiah(kasBersih);

  if (elKgSold) elKgSold.innerText = `${totalKg.toFixed(1)} Kg`;
  if (elEkorSold) elEkorSold.innerText = `${totalEkor} Ekor`;
  if (elBonKeluar) elBonKeluar.innerText = formatRupiah(bonBaru);
}

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
      if (confirm("Apakah Anda yakin ingin mereset data transaksi ke kondisi awal?")) {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
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

  renderBukuBon();
  renderSupplies();
  renderRekapKas();
});
