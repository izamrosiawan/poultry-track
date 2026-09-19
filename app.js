// PoultryTrack Dual-Engine Controller
// Integrates Live Wet-Market Touch POS Workstation & Quantitative Analytics Dashboard

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// In-Memory Dataset fallback for 100% offline & file:/// execution
const FALLBACK_DATA = {
  "total_omzet": 1267636702,
  "total_laba": 253773420,
  "total_piutang": 915065872,
  "rata_rendemen": 73.47,
  "total_transaksi": 1937,
  "daily_trend": {
    "dates": [
      "2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20",
      "2026-08-21", "2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25",
      "2026-08-26", "2026-08-27", "2026-08-28", "2026-08-29"
    ],
    "omzet": [
      19381423, 15030574, 12129105, 12721180, 14697928, 9147244,
      21774988, 18489697, 8174578, 12270989, 10049380, 14486944,
      10145310, 15981718
    ],
    "laba": [
      4283045, 3893735, 2077085, 2827120, 3728509, 1813544,
      5317009, 3221479, 1763998, 2589229, 1943481, 2604526,
      1661452, 3109741
    ],
    "rendemen": [
      73.78, 73.42, 73.86, 73.32, 73.48, 73.49,
      73.67, 73.62, 74.18, 74.21, 73.67, 73.72,
      73.41, 73.24
    ]
  },
  "cuts": {
    "labels": ["Campur", "Fillet Dada", "Karkas Utuh", "Potong 12", "Potong 4", "Potong 8"],
    "omzet": [103300044, 240082063, 235186339, 163400267, 237066883, 288601106],
    "laba": [14839372, 90214785, 33506209, 29096005, 33789537, 52327512],
    "volume_kg": [2951.4, 5001.7, 6719.6, 4476.7, 6773.3, 7906.9]
  },
  "bon_receivables": [
    {
      "customer_name": "Warung Padang Roda Jaya",
      "piutang": 172245197,
      "jumlah_bon": 154,
      "bon_tertua": "2026-06-01",
      "bon_terbaru": "2026-08-29",
      "status": "Perhatian",
      "profil": "Mengambil karkas setiap subuh dengan akumulasi 154 lembar bon aktif.",
      "rekomendasi": "Terapkan plafon piutang maksimal Rp 175 Juta dan wajibkan cicilan harian minimum 30% dari omzet penjualan hari sebelumnya."
    },
    {
      "customer_name": "Pecel Lele & Ayam Lamongan Cak Har",
      "piutang": 144269440,
      "jumlah_bon": 131,
      "bon_tertua": "2026-06-01",
      "bon_terbaru": "2026-08-29",
      "status": "Waspada",
      "profil": "Rotasi karkas potong 4 intensif; jadwal pelunasan mingguan setiap Jumat.",
      "rekomendasi": "Konfirmasi setoran kas mingguan sebelum membuka alokasi pasokan akhir pekan."
    },
    {
      "customer_name": "Bakso Solo Mas Mul",
      "piutang": 131755617,
      "jumlah_bon": 123,
      "bon_tertua": "2026-06-01",
      "bon_terbaru": "2026-08-29",
      "status": "Waspada",
      "profil": "Pelanggan daging giling dan fillet dada; pembayaran stabil dengan jeda tempo 4 hari.",
      "rekomendasi": "Pertahankan volume pasokan harian selama perputaran bon tidak melewati 5 hari."
    },
    {
      "customer_name": "Depot Mie Pangsit 88",
      "piutang": 122983765,
      "jumlah_bon": 118,
      "bon_tertua": "2026-06-01",
      "bon_terbaru": "2026-08-29",
      "status": "Aman",
      "profil": "Spesialis potongan fillet dada higienis; track record pembayaran disiplin.",
      "rekomendasi": "Beri diskon volume 1% bila pembayaran diselesaikan tunai pada hari pengiriman."
    },
    {
      "customer_name": "Katering Berkah Ibu",
      "piutang": 117558375,
      "jumlah_bon": 111,
      "bon_tertua": "2026-06-02",
      "bon_terbaru": "2026-08-29",
      "status": "Aman",
      "profil": "Pesanan potong 8 dan potong 12 jumlah besar saat ada agenda pesta atau syukuran.",
      "rekomendasi": "Terapkan uang muka deposit 40% untuk pesanan di atas 30 ekor karkas."
    },
    {
      "customer_name": "Warung Nasi Sunda Ibu Imas",
      "piutang": 116837835,
      "jumlah_bon": 103,
      "bon_tertua": "2026-06-01",
      "bon_terbaru": "2026-08-29",
      "status": "Aman",
      "profil": "Konsumsi karkas pejantan dan potong 4 konsisten; reputasi pembayaran baik.",
      "rekomendasi": "Pertahankan kerja sama kemitraan pasokan subuh tanpa penyesuaian termin."
    },
    {
      "customer_name": "Ayam Geprek Sambal Bawang",
      "piutang": 109415643,
      "jumlah_bon": 98,
      "bon_tertua": "2026-06-01",
      "bon_terbaru": "2026-08-29",
      "status": "Aman",
      "profil": "Penyerapan karkas potong 8 konsisten setiap hari dengan perputaran bon 3 hari.",
      "rekomendasi": "Pertahankan batas kredit aktif saat ini."
    }
  ]
};

// State for Live POS Workstation
const posStore = {
  weight: 2.0,
  cut: "Karkas Utuh",
  pricePerKg: 35000,
  paymentMethod: "Tunai",
  transactions: [
    { id: "TX-101", time: "04:15", customer: "Warung Padang Roda Jaya", weight: 15.0, cut: "Potong 4", total: 525000, payment: "Tempo", status: "Belum Lunas" },
    { id: "TX-102", time: "04:22", customer: "Eceran Pak Slamet", weight: 2.0, cut: "Karkas Utuh", total: 70000, payment: "Tunai", status: "Lunas" },
    { id: "TX-103", time: "04:28", customer: "Depot Mie Pangsit 88", weight: 8.0, cut: "Fillet Dada", total: 384000, payment: "Tempo", status: "Belum Lunas" }
  ],
  queue: [
    { id: 1, customer: "Warung Padang Roda Jaya", chickens: 15, cut: "Potong 4", time: "04:45 WIB", status: "Dikerjakan" },
    { id: 2, customer: "Depot Mie Pangsit 88", chickens: 8, cut: "Fillet Dada", time: "05:10 WIB", status: "Antre" },
    { id: 3, customer: "Katering Berkah Ibu", chickens: 25, cut: "Potong 8", time: "05:30 WIB", status: "Antre" },
    { id: 4, customer: "Bakso Solo Mas Mul", chickens: 12, cut: "Campur / Giling", time: "06:00 WIB", status: "Antre" }
  ]
};

// Web Audio Low-Latency Synthetic Tactile Audio Feedback
let audioCtx = null;
function playTactileClick(freq = 750, duration = 0.025) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
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
    // Graceful fallback for environments with restricted audio autoplay
  }
}

let dashboardData = FALLBACK_DATA;
let mainChart = null;
let currentChartMode = 'revenue';

const PRESETS = {
  baseline: { weight: 20, yield: 73.5, cost: 22000, sell: 36500 },
  harganaik: { weight: 20, yield: 73.5, cost: 25300, sell: 36500 },
  rendementurun: { weight: 20, yield: 70.0, cost: 22000, sell: 36500 },
  katering: { weight: 50, yield: 74.0, cost: 21500, sell: 36000 }
};

document.addEventListener("DOMContentLoaded", () => {
  initHeroCanvas();
  initBonTable();
  initSimulatorListeners();
  calculateSimulator();
  renderAnalyticsChart();

  // POS Engine Setup
  initPosClock();
  initPosNavigation();
  initPosKeypad();
  initPosCuts();
  initPosPaymentToggle();
  initPosSubmit();
  renderPosAll();

  // Dynamic Data Load
  fetch("data.json")
    .then(r => r.json())
    .then(data => {
      if (data && data.daily_trend && data.cuts) {
        dashboardData = data;
        initBonTable();
        renderAnalyticsChart();
      }
    })
    .catch(() => {
      // Fallback active
    });

  if (window.lucide) {
    lucide.createIcons();
  }

  if (typeof renderMathInElement !== "undefined") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }
});

/* ==========================================================================
   1. HERO CANVAS ANIMATION
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodes = [];
  const count = Math.min(Math.floor(width / 35), 45);

  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5, 150, 105, 0.35)";
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(5, 150, 105, ${0.16 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ==========================================================================
   2. POS WORKSTATION CONTROLLER
   ========================================================================== */
function initPosClock() {
  function tick() {
    const now = new Date();
    const str = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    const el = document.getElementById("posHeaderClock");
    if (el) el.textContent = str;
  }
  tick();
  setInterval(tick, 10000);
}

function initPosNavigation() {
  const tabs = document.querySelectorAll(".pos-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      playTactileClick(600, 0.02);
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.target;
      document.querySelectorAll(".pos-tab-content").forEach(c => c.classList.remove("active"));
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add("active");

      if (target === "pos-view-debt") renderPosDebt();
      if (target === "pos-view-rekap") renderPosRekap();
      if (target === "pos-view-queue") renderPosQueue();
      if (window.lucide) lucide.createIcons();
    });
  });
}

function initPosKeypad() {
  const keys = document.querySelectorAll(".btn-pos-key");
  keys.forEach(k => {
    k.addEventListener("click", () => {
      playTactileClick(750, 0.025);
      keys.forEach(key => key.classList.remove("active"));
      k.classList.add("active");
      posStore.weight = parseFloat(k.dataset.weight);
      updatePosScale();
    });
  });
}

function initPosCuts() {
  const cutButtons = document.querySelectorAll(".btn-pos-cut");
  cutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      playTactileClick(850, 0.025);
      cutButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      posStore.cut = btn.dataset.cut;
      posStore.pricePerKg = parseInt(btn.dataset.price, 10);
      
      const hint = document.getElementById("posCutRateHint");
      if (hint) hint.textContent = `Rp ${posStore.pricePerKg.toLocaleString("id-ID")} / kg`;
      updatePosScale();
    });
  });
}

function initPosPaymentToggle() {
  const btnCash = document.getElementById("posToggleCash");
  const btnTempo = document.getElementById("posToggleTempo");

  if (btnCash && btnTempo) {
    btnCash.addEventListener("click", () => {
      playTactileClick(700, 0.025);
      btnCash.className = "btn-pos-payment selected-cash";
      btnTempo.className = "btn-pos-payment";
      posStore.paymentMethod = "Tunai";
    });

    btnTempo.addEventListener("click", () => {
      playTactileClick(520, 0.025);
      btnTempo.className = "btn-pos-payment selected-tempo";
      btnCash.className = "btn-pos-payment";
      posStore.paymentMethod = "Tempo";
    });
  }
}

function updatePosScale() {
  const total = Math.round(posStore.weight * posStore.pricePerKg);
  const wEl = document.getElementById("posValWeight");
  const tEl = document.getElementById("posValTotal");
  if (wEl) wEl.textContent = posStore.weight.toFixed(2);
  if (tEl) tEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function initPosSubmit() {
  const btn = document.getElementById("posBtnSubmit");
  if (!btn) return;

  btn.addEventListener("click", () => {
    playTactileClick(1000, 0.04);
    const nameInput = document.getElementById("posInputCustomer");
    const customer = nameInput.value.trim() || "Eceran Umum";
    const total = Math.round(posStore.weight * posStore.pricePerKg);
    const now = new Date();

    const tx = {
      id: "TX-" + Date.now().toString().slice(-4),
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      customer: customer,
      weight: posStore.weight,
      cut: posStore.cut,
      pricePerKg: posStore.pricePerKg,
      total: total,
      payment: posStore.paymentMethod,
      status: posStore.paymentMethod === "Tunai" ? "Lunas" : "Belum Lunas"
    };

    posStore.transactions.unshift(tx);

    // Feedback animation
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>Transaksi Tersimpan!</span> <i data-lucide="check" style="width: 18px; height: 18px;"></i>`;
    btn.style.backgroundColor = "#047857";
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = "";
      if (window.lucide) lucide.createIcons();
    }, 800);

    nameInput.value = "Eceran Umum";
    renderPosRekap();
    renderPosDebt();
  });
}

function renderPosQueue() {
  const container = document.getElementById("posQueueContainer");
  const badge = document.getElementById("posQueueCounterBadge");
  const navBadge = document.getElementById("posBadgeQueue");
  if (!container) return;

  if (badge) badge.textContent = `${posStore.queue.length} Pesanan Aktif`;
  if (navBadge) navBadge.textContent = posStore.queue.length.toString();
  container.innerHTML = "";

  if (posStore.queue.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 24px;">Semua antrean potong telah selesai dikerjakan.</div>`;
    return;
  }

  posStore.queue.forEach(item => {
    const div = document.createElement("div");
    div.className = "pos-item-row";
    div.innerHTML = `
      <div>
        <div class="pos-item-title">${item.customer}</div>
        <div class="pos-item-meta">
          <strong>${item.chickens} Ekor</strong> &bull; Spesifikasi: <span style="color: var(--color-primary); font-weight: 600;">${item.cut}</span>
        </div>
        <div class="pos-item-time">Target pengambilan: ${item.time}</div>
      </div>
      <div>
        <button type="button" class="btn-pos-action-sm" onclick="markPosQueueDone(${item.id})">
          ${item.status === 'Dikerjakan' ? 'Tandai Siap' : 'Selesai'}
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

window.markPosQueueDone = function(id) {
  playTactileClick(900, 0.025);
  posStore.queue = posStore.queue.filter(q => q.id !== id);
  renderPosQueue();
};

function renderPosDebt() {
  const container = document.getElementById("posDebtContainer");
  const badge = document.getElementById("posBadgeTotalDebt");
  if (!container) return;

  container.innerHTML = "";
  const unpaid = posStore.transactions.filter(t => t.status === "Belum Lunas");
  let totalDebt = 0;

  if (unpaid.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 24px;">Semua piutang bon telah lunas.</div>`;
    if (badge) badge.textContent = "Rp 0";
    return;
  }

  unpaid.forEach(t => {
    totalDebt += t.total;
    const div = document.createElement("div");
    div.className = "pos-item-row";
    div.innerHTML = `
      <div>
        <div class="pos-item-title">${t.customer}</div>
        <div class="pos-item-meta">${t.weight.toFixed(2)} kg &bull; ${t.cut}</div>
        <div class="pos-item-time">${t.time} WIB</div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
        <div style="font-family: var(--font-mono); font-weight: 800; color: var(--color-danger); font-size: 0.95rem;">
          Rp ${t.total.toLocaleString("id-ID")}
        </div>
        <button type="button" class="btn-pos-action-sm" onclick="settlePosDebt('${t.id}')">
          Lunaskan
        </button>
      </div>
    `;
    container.appendChild(div);
  });

  if (badge) badge.textContent = `Rp ${totalDebt.toLocaleString("id-ID")}`;
}

window.settlePosDebt = function(id) {
  playTactileClick(950, 0.03);
  const item = posStore.transactions.find(t => t.id === id);
  if (item) {
    item.status = "Lunas";
    renderPosDebt();
    renderPosRekap();
  }
};

function renderPosRekap() {
  let kg = 0;
  let cash = 0;
  let debt = 0;

  posStore.transactions.forEach(t => {
    kg += t.weight;
    if (t.status === "Lunas") cash += t.total;
    else debt += t.total;
  });

  const sKg = document.getElementById("posStatTotalKg");
  const sCash = document.getElementById("posStatCashRp");
  const sDebt = document.getElementById("posStatDebtRp");
  const sRev = document.getElementById("posStatTotalRev");

  if (sKg) sKg.textContent = `${kg.toFixed(2)} kg`;
  if (sCash) sCash.textContent = `Rp ${cash.toLocaleString("id-ID")}`;
  if (sDebt) sDebt.textContent = `Rp ${debt.toLocaleString("id-ID")}`;
  if (sRev) sRev.textContent = `Rp ${(cash + debt).toLocaleString("id-ID")}`;
}

const btnArchive = document.getElementById("posBtnArchiveDay");
if (btnArchive) {
  btnArchive.addEventListener("click", () => {
    if (confirm("Mulai sesi hari baru? Seluruh catatan transaksi kasir akan diarsipkan.")) {
      playTactileClick(450, 0.04);
      posStore.transactions = [];
      renderPosDebt();
      renderPosRekap();
    }
  });
}

function renderPosAll() {
  updatePosScale();
  renderPosQueue();
  renderPosDebt();
  renderPosRekap();
}

/* ==========================================================================
   3. STRESS-TEST SIMULATOR LAB
   ========================================================================== */
function initSimulatorListeners() {
  const sliders = ["sim-live-weight", "sim-yield-pct", "sim-cost-live", "sim-sell-price"];
  sliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculateSimulator);
    }
  });
}

window.setPreset = function(presetName) {
  const p = PRESETS[presetName];
  if (!p) return;

  const w = document.getElementById("sim-live-weight");
  const y = document.getElementById("sim-yield-pct");
  const c = document.getElementById("sim-cost-live");
  const s = document.getElementById("sim-sell-price");

  if (w) w.value = p.weight;
  if (y) y.value = p.yield;
  if (c) c.value = p.cost;
  if (s) s.value = p.sell;

  document.querySelectorAll(".scenario-pills .pill-btn").forEach(btn => btn.classList.remove("active"));
  if (window.event && window.event.target) {
    window.event.target.classList.add("active");
  }

  calculateSimulator();
};

function calculateSimulator() {
  const liveWeight = parseFloat(document.getElementById("sim-live-weight")?.value || 20);
  const yieldPct = parseFloat(document.getElementById("sim-yield-pct")?.value || 73.5);
  const costLive = parseFloat(document.getElementById("sim-cost-live")?.value || 22000);
  const sellPrice = parseFloat(document.getElementById("sim-sell-price")?.value || 36500);

  const lblW = document.getElementById("val-live-weight");
  const lblY = document.getElementById("val-yield-pct");
  const lblC = document.getElementById("val-cost-live");
  const lblS = document.getElementById("val-sell-price");

  if (lblW) lblW.textContent = `${liveWeight.toFixed(1)} kg`;
  if (lblY) lblY.textContent = `${yieldPct.toFixed(1)}%`;
  if (lblC) lblC.textContent = `Rp ${costLive.toLocaleString("id-ID")} / kg`;
  if (lblS) lblS.textContent = `Rp ${sellPrice.toLocaleString("id-ID")} / kg`;

  const carcassWeight = (liveWeight * (yieldPct / 100));
  const cogs = Math.round(liveWeight * costLive);
  const revenue = Math.round(carcassWeight * sellPrice);
  const profit = revenue - cogs;
  const marginPct = revenue > 0 ? ((profit / revenue) * 100) : 0;

  const revEl = document.getElementById("sim-revenue-val");
  const proEl = document.getElementById("sim-profit-val");
  const marEl = document.getElementById("sim-margin-val");
  const scoreEl = document.getElementById("sim-score-val");
  const gaugeEl = document.getElementById("sim-gauge");
  const badgeEl = document.getElementById("sim-status-badge");
  const headlineEl = document.getElementById("sim-headline");
  const descEl = document.getElementById("sim-desc");

  if (revEl) revEl.textContent = `Rp ${revenue.toLocaleString("id-ID")}`;
  if (proEl) proEl.textContent = `Rp ${profit.toLocaleString("id-ID")}`;
  if (marEl) marEl.textContent = `${marginPct.toFixed(1)}%`;
  if (scoreEl) scoreEl.textContent = Math.round(yieldPct).toString();

  const deg = Math.min(Math.max((yieldPct - 60) * 12, 0), 360);
  let gaugeColor = "#059669";

  if (profit < 0 || marginPct < 5) {
    gaugeColor = "#dc2626";
    if (badgeEl) {
      badgeEl.className = "badge-status badge-siaga";
      badgeEl.textContent = "Kritis";
    }
    if (headlineEl) headlineEl.textContent = "MARGIN TERTEKAN (POTENSI RUGI OPERASIONAL)";
    if (descEl) descEl.textContent = "Kenaikan HPP atau penurunan rendemen menekan margin di bawah batas aman. Diperlukan penyesuaian harga jual karkas atau efisiensi tenaga potong.";
  } else if (marginPct < 15 || yieldPct < 71.5) {
    gaugeColor = "#d97706";
    if (badgeEl) {
      badgeEl.className = "badge-status badge-waspada";
      badgeEl.textContent = "Waspada";
    }
    if (headlineEl) headlineEl.textContent = "MARGIN MENIPIS (PERLU MONITORING)";
    if (descEl) descEl.textContent = "Margin kotor cukup untuk menutup operasional dasar, namun rentan terhadap susut bobot susulan dan biaya bongkar muat es.";
  } else {
    gaugeColor = "#059669";
    if (badgeEl) {
      badgeEl.className = "badge-status badge-aman";
      badgeEl.textContent = "Optimal";
    }
    if (headlineEl) headlineEl.textContent = "OPERASIONAL EFISIEN & MENGUNTUNGKAN";
    if (descEl) descEl.textContent = "Rasio rendemen berada pada rentang ideal. Spread margin kotor mampu menutup biaya operasional es, tenaga juru potong, dan plastik karkas.";
  }

  if (gaugeEl) {
    gaugeEl.style.background = `conic-gradient(${gaugeColor} ${deg}deg, rgba(148, 163, 184, 0.15) ${deg}deg 360deg)`;
  }
}

/* ==========================================================================
   4. CREDIT RISK MATRIX (BUKU BON)
   ========================================================================== */
function initBonTable() {
  const tbody = document.querySelector("#bon-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = dashboardData.bon_receivables || FALLBACK_DATA.bon_receivables;
  list.forEach((cust, idx) => {
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    if (idx === 0) tr.style.backgroundColor = "rgba(5, 150, 105, 0.06)";

    let badgeClass = "badge-aman";
    const status = cust.status || (cust.piutang > 150000000 ? "Perhatian" : (cust.piutang > 125000000 ? "Waspada" : "Aman"));
    if (status === "Perhatian") badgeClass = "badge-siaga";
    else if (status === "Waspada") badgeClass = "badge-waspada";

    tr.innerHTML = `
      <td><strong>${cust.customer_name}</strong></td>
      <td style="font-family: var(--font-mono); font-weight: 700;">Rp ${(cust.piutang / 1000000).toFixed(1)} Juta</td>
      <td style="font-family: var(--font-mono);">${cust.jumlah_bon} Bon</td>
      <td><span class="badge-status ${badgeClass}">${status}</span></td>
    `;

    tr.addEventListener("click", () => {
      document.querySelectorAll("#bon-table tr").forEach(r => (r.style.backgroundColor = ""));
      tr.style.backgroundColor = "rgba(5, 150, 105, 0.06)";
      selectCustomer(cust, status);
    });

    tbody.appendChild(tr);
  });
}

function selectCustomer(cust, status) {
  const nameEl = document.getElementById("detail-cust-name");
  const badgeEl = document.getElementById("detail-cust-badge");
  const driverEl = document.getElementById("detail-prov-driver");
  const actionEl = document.getElementById("detail-prov-action");
  const debtEl = document.getElementById("detail-cust-debt");
  const countEl = document.getElementById("detail-cust-count");

  if (nameEl) nameEl.textContent = cust.customer_name;
  if (badgeEl) {
    badgeEl.textContent = status;
    badgeEl.className = `badge-status ${status === "Perhatian" ? "badge-siaga" : (status === "Waspada" ? "badge-waspada" : "badge-aman")}`;
  }
  if (driverEl) driverEl.textContent = cust.profil || `Akumulasi transaksi tempo harian dengan ${cust.jumlah_bon} bon tercatat aktif.`;
  if (actionEl) actionEl.textContent = cust.rekomendasi || `Pertahankan pemantauan harian dan batasi plafon maksimal saldo beredar.`;
  if (debtEl) debtEl.textContent = `Rp ${(cust.piutang / 1000000).toFixed(1)}M`;
  if (countEl) countEl.textContent = `${cust.jumlah_bon} Bon`;
}

/* ==========================================================================
   5. ANALYTICS CHART CONTROLLER
   ========================================================================== */
window.switchChartMode = function(mode, btnEl) {
  currentChartMode = mode;
  document.querySelectorAll(".chart-filter-bar .chart-pill").forEach(p => p.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderAnalyticsChart();
};

function renderAnalyticsChart() {
  const canvas = document.getElementById("mainAnalyticsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (mainChart) {
    mainChart.destroy();
  }

  const dt = dashboardData.daily_trend || FALLBACK_DATA.daily_trend;
  const cuts = dashboardData.cuts || FALLBACK_DATA.cuts;

  if (currentChartMode === 'revenue') {
    mainChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dt.dates.map(d => d.substring(5)),
        datasets: [
          {
            label: 'Omzet Harian (Rp)',
            data: dt.omzet,
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.08)',
            borderWidth: 2.2,
            fill: true,
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            label: 'Laba Kotor (Rp)',
            data: dt.laba,
            borderColor: '#d97706',
            backgroundColor: 'rgba(217, 119, 6, 0.06)',
            borderWidth: 2,
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: Rp ${item.raw.toLocaleString('id-ID')}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'JetBrains Mono', size: 10 } } },
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
            ticks: {
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (val) => `Rp ${(val / 1000000).toFixed(0)}M`
            }
          }
        }
      }
    });
  } else if (currentChartMode === 'cuts') {
    mainChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cuts.labels,
        datasets: [
          {
            label: 'Omzet (Rp)',
            data: cuts.omzet,
            backgroundColor: 'rgba(5, 150, 105, 0.82)',
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'Laba Kotor (Rp)',
            data: cuts.laba,
            backgroundColor: 'rgba(217, 119, 6, 0.85)',
            borderRadius: 6,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: Rp ${item.raw.toLocaleString('id-ID')}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
            ticks: {
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (val) => `Rp ${(val / 1000000).toFixed(0)}M`
            }
          }
        }
      }
    });
  } else if (currentChartMode === 'yield') {
    mainChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dt.dates.map(d => d.substring(5)),
        datasets: [
          {
            label: 'Rasio Rendemen (%)',
            data: dt.rendemen,
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            borderWidth: 2.2,
            pointBackgroundColor: '#0284c7',
            fill: true,
            tension: 0.25
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: (item) => `Rendemen: ${item.raw}%`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'JetBrains Mono', size: 10 } } },
          y: {
            min: 71,
            max: 76,
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
            ticks: {
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (val) => `${val}%`
            }
          }
        }
      }
    });
  }
}
