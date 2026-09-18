// PoultryTrack Industrial Touch POS Controller

const store = {
    weight: 2.0,
    cut: "Karkas Utuh",
    pricePerKg: 35000,
    paymentMethod: "Tunai",
    transactions: [],
    queue: [
        { id: 1, customer: "Warung Padang Roda Jaya", chickens: 15, cut: "Potong 4", time: "04:30 WIB", status: "Dikerjakan" },
        { id: 2, customer: "Depot Mie Pangsit 88", chickens: 8, cut: "Fillet Dada", time: "05:00 WIB", status: "Antre" },
        { id: 3, customer: "Katering Berkah Ibu", chickens: 20, cut: "Potong 8", time: "05:30 WIB", status: "Antre" },
        { id: 4, customer: "Bakso Solo Mas Mul", chickens: 12, cut: "Campur / Giling", time: "06:00 WIB", status: "Antre" }
    ]
};

// Web Audio Low-Latency Synthetic Tactile Click
let audioCtx = null;
function playTouchClick(freq = 750, duration = 0.025) {
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
        // Audio fallback gracefully suppressed
    }
}

const STORAGE_KEY = "POULTRY_TRACK_DATA_V3";

document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
    initClock();
    initNavigation();
    initKeypad();
    initCuts();
    initPaymentToggle();
    initSubmitButton();
    renderAll();
});

function initClock() {
    function tick() {
        const now = new Date();
        const str = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
        const el = document.getElementById("headerClock");
        if (el) el.textContent = str;
    }
    tick();
    setInterval(tick, 10000);
}

function loadTransactions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            store.transactions = JSON.parse(raw);
        } catch (e) {
            store.transactions = [];
        }
    }
}

function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.transactions));
}

function initNavigation() {
    const tabs = document.querySelectorAll(".dock-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            playTouchClick(600, 0.02);
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const target = tab.dataset.target;
            document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add("active");

            if (target === "view-bon") renderDebt();
            if (target === "view-rekap") renderRekap();
            if (target === "view-antrean") renderQueue();
        });
    });
}

function initKeypad() {
    const keys = document.querySelectorAll(".btn-key[data-weight]");
    keys.forEach(k => {
        k.addEventListener("click", () => {
            playTouchClick(750, 0.025);
            keys.forEach(key => key.classList.remove("active"));
            k.classList.add("active");
            store.weight = parseFloat(k.dataset.weight);
            updateScaleDisplay();
        });
    });
}

function initCuts() {
    const cutButtons = document.querySelectorAll(".btn-cut-option");
    cutButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            playTouchClick(850, 0.025);
            cutButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            store.cut = btn.dataset.cut;
            store.pricePerKg = parseInt(btn.dataset.price, 10);
            
            const hint = document.getElementById("cutRateDisplay");
            if (hint) hint.textContent = `Rp ${store.pricePerKg.toLocaleString("id-ID")} / kg`;
            updateScaleDisplay();
        });
    });
}

function initPaymentToggle() {
    const btnCash = document.getElementById("toggleCash");
    const btnTempo = document.getElementById("toggleTempo");

    if (btnCash && btnTempo) {
        btnCash.addEventListener("click", () => {
            playTouchClick(700, 0.025);
            btnCash.className = "btn-payment selected-cash";
            btnTempo.className = "btn-payment";
            store.paymentMethod = "Tunai";
        });

        btnTempo.addEventListener("click", () => {
            playTouchClick(520, 0.025);
            btnTempo.className = "btn-payment selected-tempo";
            btnCash.className = "btn-payment";
            store.paymentMethod = "Tempo";
        });
    }
}

function updateScaleDisplay() {
    const total = Math.round(store.weight * store.pricePerKg);
    const weightEl = document.getElementById("valWeight");
    const totalEl = document.getElementById("valTotal");
    
    if (weightEl) weightEl.textContent = store.weight.toFixed(2);
    if (totalEl) totalEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function initSubmitButton() {
    const btn = document.getElementById("btnSubmit");
    if (!btn) return;

    btn.addEventListener("click", () => {
        playTouchClick(1000, 0.04);
        const nameInput = document.getElementById("inputCustomer");
        const customer = nameInput.value.trim() || "Eceran Umum";
        const total = Math.round(store.weight * store.pricePerKg);
        const now = new Date();

        const tx = {
            id: "TRX-" + Date.now(),
            time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
            customer: customer,
            weight: store.weight,
            cut: store.cut,
            pricePerKg: store.pricePerKg,
            total: total,
            payment: store.paymentMethod,
            status: store.paymentMethod === "Tunai" ? "Lunas" : "Belum Lunas"
        };

        store.transactions.unshift(tx);
        persist();

        // Hardware touch state feedback
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<span>Transaksi Berhasil</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        btn.style.backgroundColor = "#059669";

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.backgroundColor = "";
        }, 700);

        nameInput.value = "Eceran Umum";
        renderRekap();
        renderDebt();
    });
}

function renderQueue() {
    const container = document.getElementById("queueContainer");
    const badge = document.getElementById("queueBadgeCount");
    if (!container) return;
    
    if (badge) badge.textContent = `${store.queue.length} Pesanan Aktif`;
    container.innerHTML = "";

    if (store.queue.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.82rem; padding: 28px;">Semua antrean potong telah selesai dikerjakan.</div>`;
        return;
    }

    store.queue.forEach(item => {
        const div = document.createElement("div");
        div.className = "card-item-row";
        div.innerHTML = `
            <div>
                <div class="item-header-title">${item.customer}</div>
                <div class="item-meta-line">
                    <strong style="color: var(--text-primary);">${item.chickens} Ekor</strong> • Spesifikasi: <span style="color: var(--text-secondary);">${item.cut}</span>
                </div>
                <div class="item-time-stamp">Target pengambilan: ${item.time}</div>
            </div>
            <div>
                <button type="button" class="btn-action-touch" onclick="markDone(${item.id})">
                    <span>${item.status === 'Dikerjakan' ? 'Selesai' : 'Siap'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.markDone = function(id) {
    playTouchClick(850, 0.025);
    store.queue = store.queue.filter(q => q.id !== id);
    renderQueue();
};

function renderDebt() {
    const container = document.getElementById("debtContainer");
    const badgeTotal = document.getElementById("badgeTotalDebt");
    if (!container) return;

    container.innerHTML = "";
    const unpaid = store.transactions.filter(t => t.status === "Belum Lunas");
    let totalDebt = 0;

    if (unpaid.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.82rem; padding: 28px;">Semua piutang bon telah lunas. Tidak ada tagihan tertahan.</div>`;
        if (badgeTotal) badgeTotal.textContent = "Rp 0";
        return;
    }

    unpaid.forEach(t => {
        totalDebt += t.total;
        const div = document.createElement("div");
        div.className = "card-item-row";
        div.innerHTML = `
            <div>
                <div class="item-header-title">${t.customer}</div>
                <div class="item-meta-line">
                    ${t.weight.toFixed(2)} kg (${t.cut})
                </div>
                <div class="item-time-stamp">${t.time} WIB</div>
            </div>
            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                <div class="tabular-stat text-rose" style="font-size: 0.94rem;">
                    Rp ${t.total.toLocaleString("id-ID")}
                </div>
                <button type="button" class="btn-action-touch" onclick="settleDebt('${t.id}')">
                    <span>Lunaskan</span>
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    if (badgeTotal) badgeTotal.textContent = `Rp ${totalDebt.toLocaleString("id-ID")}`;
}

window.settleDebt = function(id) {
    playTouchClick(950, 0.03);
    const item = store.transactions.find(t => t.id === id);
    if (item) {
        item.status = "Lunas";
        persist();
        renderDebt();
        renderRekap();
    }
};

function renderRekap() {
    let kg = 0;
    let cash = 0;
    let debt = 0;

    store.transactions.forEach(t => {
        kg += t.weight;
        if (t.status === "Lunas") {
            cash += t.total;
        } else {
            debt += t.total;
        }
    });

    const statKg = document.getElementById("statTotalKg");
    const statCash = document.getElementById("statCashRp");
    const statDebt = document.getElementById("statDebtRp");
    const statRev = document.getElementById("statTotalRev");

    if (statKg) statKg.textContent = `${kg.toFixed(2)} kg`;
    if (statCash) statCash.textContent = `Rp ${cash.toLocaleString("id-ID")}`;
    if (statDebt) statDebt.textContent = `Rp ${debt.toLocaleString("id-ID")}`;
    if (statRev) statRev.textContent = `Rp ${(cash + debt).toLocaleString("id-ID")}`;
}

const btnArchive = document.getElementById("btnArchiveDay");
if (btnArchive) {
    btnArchive.addEventListener("click", () => {
        if (confirm("Mulai sesi hari baru? Semua data transaksi aktif akan diarsipkan.")) {
            playTouchClick(450, 0.04);
            store.transactions = [];
            persist();
            renderDebt();
            renderRekap();
        }
    });
}

function renderAll() {
    updateScaleDisplay();
    renderQueue();
    renderDebt();
    renderRekap();
}

