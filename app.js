// PoultryTrack Touch Controller & Tactile Engine

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
        { id: 4, customer: "Bakso Mas Mul", chickens: 12, cut: "Campur / Giling", time: "06:00 WIB", status: "Antre" }
    ]
};

// Web Audio Synthetic Tactile Click (Low latency feedback)
let audioCtx = null;
function playTouchClick(freq = 800, duration = 0.03) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Fallback gracefully on devices blocking Web Audio
    }
}

const STORAGE_KEY = "POULTRY_TRACK_DATA_V2";

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
            document.getElementById(target).classList.add("active");

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
            playTouchClick(900, 0.025);
            cutButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            store.cut = btn.dataset.cut;
            store.pricePerKg = parseInt(btn.dataset.price, 10);
            document.getElementById("cutRateDisplay").textContent = `Rp${store.pricePerKg.toLocaleString("id-ID")}/kg`;
            updateScaleDisplay();
        });
    });
}

function initPaymentToggle() {
    const btnCash = document.getElementById("toggleCash");
    const btnTempo = document.getElementById("toggleTempo");

    btnCash.addEventListener("click", () => {
        playTouchClick(700, 0.025);
        btnCash.className = "btn-payment selected-cash";
        btnTempo.className = "btn-payment";
        store.paymentMethod = "Tunai";
    });

    btnTempo.addEventListener("click", () => {
        playTouchClick(500, 0.025);
        btnTempo.className = "btn-payment selected-tempo";
        btnCash.className = "btn-payment";
        store.paymentMethod = "Tempo";
    });
}

function updateScaleDisplay() {
    const total = Math.round(store.weight * store.pricePerKg);
    document.getElementById("valWeight").textContent = store.weight.toFixed(1);
    document.getElementById("valTotal").textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function initSubmitButton() {
    const btn = document.getElementById("btnSubmit");
    btn.addEventListener("click", () => {
        playTouchClick(1100, 0.05);
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

        // Tactile Success Feedback
        const originalContent = btn.innerHTML;
        btn.innerHTML = "<span>✓ Tersimpan!</span>";
        btn.style.backgroundColor = "#059669";

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.backgroundColor = "var(--accent-emerald)";
        }, 800);

        nameInput.value = "Eceran Umum";
        renderRekap();
    });
}

function renderQueue() {
    const container = document.getElementById("queueContainer");
    container.innerHTML = "";

    store.queue.forEach(item => {
        const div = document.createElement("div");
        div.className = "card-item-row";
        div.innerHTML = `
            <div>
                <div style="font-weight: 700; font-size: 0.95rem;">${item.customer}</div>
                <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                    🍗 <strong>${item.chickens} Ekor</strong> • Potongan: <span style="color: var(--accent-blue);">${item.cut}</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Jadwal Ambil: ${item.time}</div>
            </div>
            <div>
                <button type="button" class="btn-mini-settle" onclick="markDone(${item.id})">
                    ${item.status === 'Dikerjakan' ? 'Selesai ➔' : 'Siap'}
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.markDone = function(id) {
    playTouchClick(900, 0.03);
    store.queue = store.queue.filter(q => q.id !== id);
    renderQueue();
};

function renderDebt() {
    const container = document.getElementById("debtContainer");
    container.innerHTML = "";

    const unpaid = store.transactions.filter(t => t.status === "Belum Lunas");
    let totalDebt = 0;

    if (unpaid.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 28px;">Semua bon sudah lunas. Tidak ada tagihan tertunda! 🎉</div>`;
        document.getElementById("badgeTotalDebt").textContent = "Rp 0";
        return;
    }

    unpaid.forEach(t => {
        totalDebt += t.total;
        const div = document.createElement("div");
        div.className = "card-item-row";
        div.innerHTML = `
            <div>
                <div style="font-weight: 700; font-size: 0.92rem;">${t.customer}</div>
                <div style="font-size: 0.76rem; color: var(--text-secondary);">${t.time} WIB • ${t.weight.toFixed(1)} kg (${t.cut})</div>
            </div>
            <div style="text-align: right;">
                <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-rose); font-size: 0.96rem;">
                    Rp ${t.total.toLocaleString("id-ID")}
                </div>
                <button type="button" class="btn-mini-settle" onclick="settleDebt('${t.id}')">Lunaskan</button>
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById("badgeTotalDebt").textContent = `Rp ${totalDebt.toLocaleString("id-ID")}`;
}

window.settleDebt = function(id) {
    playTouchClick(1000, 0.04);
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

    document.getElementById("statTotalKg").textContent = `${kg.toFixed(1)} kg`;
    document.getElementById("statCashRp").textContent = `Rp ${cash.toLocaleString("id-ID")}`;
    document.getElementById("statDebtRp").textContent = `Rp ${debt.toLocaleString("id-ID")}`;
    document.getElementById("statTotalRev").textContent = `Rp ${(cash + debt).toLocaleString("id-ID")}`;
}

document.getElementById("btnArchiveDay").addEventListener("click", () => {
    if (confirm("Mulai sesi hari baru? Semua transaksi hari ini akan diarsipkan.")) {
        playTouchClick(400, 0.05);
        store.transactions = [];
        persist();
        renderDebt();
        renderRekap();
    }
});

function renderAll() {
    updateScaleDisplay();
    renderQueue();
    renderDebt();
    renderRekap();
}
