let appData = {};
let trendChart = null;
let cutsChart = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resp = await fetch("data.json?v=20260918_01");
        appData = await resp.json();
        
        renderKPIs();
        initCharts();
        renderBonTable();
        bindCalculator();
    } catch (err) {
        console.error("Failed loading data.json", err);
    }
});

function renderKPIs() {
    document.getElementById("totalOmzetDisplay").textContent = `Rp ${(appData.total_omzet / 1e9).toFixed(2)} Miliar`;
    document.getElementById("totalLabaDisplay").textContent = `Rp ${(appData.total_laba / 1e6).toFixed(1)} Juta`;
    document.getElementById("rataRendemenDisplay").textContent = `${appData.rata_rendemen}%`;
    document.getElementById("totalPiutangDisplay").textContent = `Rp ${(appData.total_piutang / 1e6).toFixed(1)} Juta`;
}

function initCharts() {
    // Trend Chart
    const ctxTrend = document.getElementById("trendChart").getContext("2d");
    trendChart = new Chart(ctxTrend, {
        type: "line",
        data: {
            labels: appData.daily_trend.dates.map(d => d.slice(5)),
            datasets: [
                {
                    label: "Omzet (Juta Rp)",
                    data: appData.daily_trend.omzet.map(v => (v / 1e6).toFixed(1)),
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "Laba Kotor (Juta Rp)",
                    data: appData.daily_trend.laba.map(v => (v / 1e6).toFixed(1)),
                    borderColor: "#10b981",
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } }
            },
            scales: {
                x: { grid: { color: "#1c2638" }, ticks: { color: "#64748b" } },
                y: { grid: { color: "#1c2638" }, ticks: { color: "#94a3b8" } }
            }
        }
    });

    // Cuts Breakdown Chart
    const ctxCuts = document.getElementById("cutsChart").getContext("2d");
    cutsChart = new Chart(ctxCuts, {
        type: "bar",
        data: {
            labels: appData.cuts.labels,
            datasets: [
                {
                    label: "Laba Kotor (Juta Rp)",
                    data: appData.cuts.laba.map(v => (v / 1e6).toFixed(1)),
                    backgroundColor: "#10b981",
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 } } },
                y: { grid: { color: "#1c2638" }, ticks: { color: "#64748b" } }
            }
        }
    });
}

function renderBonTable() {
    const tbody = document.getElementById("bonTableBody");
    tbody.innerHTML = "";
    appData.bon_receivables.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: 500; color: #f8fafc;">${row.customer_name}</td>
            <td style="font-family: var(--font-mono);">${row.jumlah_bon} transaksi</td>
            <td style="font-family: var(--font-mono); font-weight: 600; color: #f43f5e;">Rp ${(row.piutang / 1e6).toFixed(2)} Jt</td>
        `;
        tbody.appendChild(tr);
    });
}

function bindCalculator() {
    const liveWeightInput = document.getElementById("inputLiveWeight");
    const liveCostInput = document.getElementById("inputLiveCost");
    const priceCarcassInput = document.getElementById("inputPriceCarcass");

    function recompute() {
        const liveWeight = parseFloat(liveWeightInput.value) || 0;
        const liveCost = parseFloat(liveCostInput.value) || 0;
        const priceCarcass = parseFloat(priceCarcassInput.value) || 0;

        const carcassWeight = liveWeight * 0.735;
        const cogs = liveWeight * liveCost;
        const revenue = carcassWeight * priceCarcass;
        const profit = revenue - cogs;
        const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;

        document.getElementById("calcCarcassKg").textContent = `${carcassWeight.toFixed(1)} kg`;
        document.getElementById("calcProfitRp").textContent = `Rp ${Math.round(profit).toLocaleString('id-ID')}`;
        document.getElementById("calcMarginPct").textContent = `${marginPct.toFixed(1)}%`;
        document.getElementById("calcProfitRp").style.color = profit >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)";
    }

    liveWeightInput.addEventListener("input", recompute);
    liveCostInput.addEventListener("input", recompute);
    priceCarcassInput.addEventListener("input", recompute);
}
