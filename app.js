// PoultryTrack Mobile PWA Engine

let state = {
    currentWeight: 2.0,
    currentCut: "Utuh / Bersih",
    currentPricePerKg: 35000,
    paymentMethod: "Tunai",
    transactions: [],
    queue: [
        { id: 1, customer: "Warung Padang Roda Jaya", count: 15, cut: "Potong 4", time: "04:30 WIB", status: "Sedang Dikerjakan" },
        { id: 2, customer: "Depot Mie Pangsit 88", count: 8, cut: "Fillet Dada", time: "05:00 WIB", status: "Antre" },
        { id: 3, customer: "Katering Berkah Ibu", count: 20, cut: "Potong 8", time: "05:30 WIB", status: "Antre" },
        { id: 4, customer: "Bakso Mas Mul", count: 12, cut: "Giling / Kasar", time: "06:00 WIB", status: "Antre" }
    ]
};

// LocalStorage Persistence
const STORAGE_KEY = "POULTRY_TRACK_TRANSACTIONS_V1";

document.addEventListener("DOMContentLoaded", () => {
    loadLocalTransactions();
    initBottomNav();
    initPresets();
    initCutSelector();
    initPaymentToggle();
    initSaveButton();
    updateDisplay();
    renderQueue();
    renderBon();
    renderRekap();
});

function loadLocalTransactions() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state.transactions = JSON.parse(saved);
        } catch (e) {
            state.transactions = [];
        }
    }
}

function saveLocalTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

// 1. Bottom Navigation Tabs
function initBottomNav() {
    const tabs = document.querySelectorAll(".nav-item");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const targetId = tab.dataset.tab;
            document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");

            if (targetId === "tab-bon") renderBon();
            if (targetId === "tab-rekap") renderRekap();
            if (targetId === "tab-antrean") renderQueue();
        });
    });
}

// 2. Presets Timbangan
function initPresets() {
    const buttons = document.querySelectorAll(".btn-preset[data-weight]");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.currentWeight = parseFloat(btn.dataset.weight);
            updateDisplay();
        });
    });
}

// 3. Cut Selector
function initCutSelector() {
    const buttons = document.querySelectorAll(".btn-cut");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.currentCut = btn.dataset.cut;
            state.currentPricePerKg = parseInt(btn.dataset.price, 10);
            updateDisplay();
        });
    });
}

// 4. Payment Toggle
function initPaymentToggle() {
    const btnCash = document.getElementById("btnPayCash");
    const btnTempo = document.getElementById("btnPayTempo");

    btnCash.addEventListener("click", () => {
        btnCash.classList.add("selected");
        btnTempo.classList.remove("selected");
        state.paymentMethod = "Tunai";
    });

    btnTempo.addEventListener("click", () => {
        btnTempo.classList.add("selected");
        btnCash.classList.remove("selected");
        state.paymentMethod = "Tempo";
    });
}

// 5. Update Screen Display
function updateDisplay() {
    const total = Math.round(state.currentWeight * state.currentPricePerKg);
    document.getElementById("displayWeight").textContent = state.currentWeight.toFixed(1);
    document.getElementById("displayTotal").textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

// 6. Save Transaction
function initSaveButton() {
    document.getElementById("btnSaveTransaction").addEventListener("click", () => {
        const custName = document.getElementById("custNameInput").value.trim() || "Eceran Umum";
        const totalRp = Math.round(state.currentWeight * state.currentPricePerKg);
        const now = new Date();

        const tx = {
            id: "TRX-" + Date.now(),
            time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
            customer: custName,
            weight: state.currentWeight,
            cut: state.currentCut,
            pricePerKg: state.currentPricePerKg,
            totalRp: totalRp,
            payment: state.paymentMethod,
            status: state.paymentMethod === "Tunai" ? "Lunas" : "Belum Lunas"
        };

        state.transactions.unshift(tx);
        saveLocalTransactions();

        // Visual Feedback
        const btn = document.getElementById("btnSaveTransaction");
        const originalText = btn.innerHTML;
        btn.innerHTML = "<span>Tersimpan!</span> <span>✓</span>";
        btn.style.background = "#059669";

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "var(--brand-emerald)";
        }, 1200);

        // Reset customer name to default if not empty
        document.getElementById("custNameInput").value = "Eceran Umum";
    });
}

// 7. Render Antrean Juru Potong
function renderQueue() {
    const container = document.getElementById("queueListContainer");
    container.innerHTML = "";

    state.queue.forEach(item => {
        const div = document.createElement("div");
        div.className = "item-card";
        div.innerHTML = `
            <div class="item-left">
                <div class="item-name">${item.customer}</div>
                <div class="item-detail">🍗 <strong>${item.count} Ekor</strong> — Potongan: <span style="color: var(--brand-blue);">${item.cut}</span></div>
                <div class="item-detail" style="color: var(--text-muted);">Jadwal Ambil: ${item.time}</div>
            </div>
            <div>
                <button type="button" class="btn-preset" style="padding: 6px 10px; font-size: 0.75rem;" onclick="markQueueDone(${item.id})">
                    ${item.status === 'Sedang Dikerjakan' ? 'Selesai ➔' : 'Siap'}
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.markQueueDone = function(id) {
    state.queue = state.queue.filter(q => q.id !== id);
    renderQueue();
};

// 8. Render Buku Bon
function renderBon() {
    const container = document.getElementById("bonListContainer");
    container.innerHTML = "";

    // Group bon by customer
    const bonTxs = state.transactions.filter(t => t.status === "Belum Lunas");
    
    // Add default dummy bon if empty for illustration
    if (bonTxs.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 24px;">Tidak ada catatan bon hari ini. Transaksi lunas semua! 🎉</div>`;
        document.getElementById("totalBonBadge").textContent = "Rp 0";
        return;
    }

    let totalBon = 0;
    bonTxs.forEach(t => {
        totalBon += t.totalRp;
        const div = document.createElement("div");
        div.className = "item-card";
        div.innerHTML = `
            <div class="item-left">
                <div class="item-name">${t.customer}</div>
                <div class="item-detail">${t.time} WIB • ${t.weight.toFixed(1)} kg (${t.cut})</div>
            </div>
            <div style="text-align: right;">
                <div style="font-family: var(--font-mono); font-weight: 700; color: var(--brand-rose); font-size: 0.95rem;">
                    Rp ${t.totalRp.toLocaleString("id-ID")}
                </div>
                <button type="button" class="btn-preset" style="padding: 4px 8px; font-size: 0.7rem; margin-top: 4px;" onclick="payOffBon('${t.id}')">
                    Lunaskan
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById("totalBonBadge").textContent = `Total: Rp ${totalBon.toLocaleString("id-ID")}`;
}

window.payOffBon = function(id) {
    const found = state.transactions.find(t => t.id === id);
    if (found) {
        found.status = "Lunas";
        saveLocalTransactions();
        renderBon();
        renderRekap();
    }
};

// 9. Render Rekap Kasir
function renderRekap() {
    let totalKg = 0;
    let cashRp = 0;
    let bonRp = 0;

    state.transactions.forEach(t => {
        totalKg += t.weight;
        if (t.status === "Lunas") {
            cashRp += t.totalRp;
        } else {
            bonRp += t.totalRp;
        }
    });

    const totalRev = cashRp + bonRp;

    document.getElementById("rekapTotalKg").textContent = `${totalKg.toFixed(1)} kg`;
    document.getElementById("rekapCashRp").textContent = `Rp ${cashRp.toLocaleString("id-ID")}`;
    document.getElementById("rekapBonRp").textContent = `Rp ${bonRp.toLocaleString("id-ID")}`;
    document.getElementById("rekapTotalRevenue").textContent = `Rp ${totalRev.toLocaleString("id-ID")}`;
}

// Reset Day
document.getElementById("btnResetDay").addEventListener("click", () => {
    if (confirm("Mulai hari baru? Transaksi hari ini akan diarsipkan.")) {
        state.transactions = [];
        saveLocalTransactions();
        renderBon();
        renderRekap();
    }
});
