const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../core.js');

function app(initial = null) {
  let raw = initial;
  let failWrites = false;
  let exportBlob;
  const elements = new Map();
  const context = vm.createContext({
    PoultryCore: core, Intl, Date, Number, JSON, Math, Set, console, window: {}, Blob,
    URL: {createObjectURL(blob) { exportBlob = blob; return 'blob:test'; }, revokeObjectURL() {}},
    setTimeout() {},
    document: {
      addEventListener() {},
      body: {appendChild() {}},
      createElement() { return {click() {}, remove() {}}; },
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, {textContent: '', hidden: true, setAttribute() {}});
        return elements.get(id);
      }
    },
    localStorage: {
      getItem() { return raw; },
      setItem(key, value) { if (failWrites) throw new Error('QuotaExceeded'); raw = value; }
    }
  });
  vm.runInContext(fs.readFileSync(require.resolve('../app.js'), 'utf8'), context);
  vm.runInContext('refreshViews = function () {}; loadState();', context);
  return {context, elements, blob: () => exportBlob, read: () => raw, write: value => {raw = value;}, fail: () => {failWrites = true;},
    run: code => vm.runInContext(code, context)};
}

test('data rusak tidak ditimpa dengan data contoh', () => {
  const instance = app('{bad-json');
  assert.equal(instance.run('saveState()'), false);
  assert.equal(instance.read(), '{bad-json');
  assert.equal(instance.elements.get('storageWarning').hidden, false);
});

test('kegagalan simpan membatalkan perubahan saldo dalam memori', () => {
  const instance = app();
  assert.equal(instance.run('saveState()'), true);
  const before = instance.read();
  const debt = instance.run('state.customers[0].currentDebt');
  instance.fail();
  assert.equal(instance.run('state.customers[0].currentDebt += 100; saveState()'), false);
  assert.equal(instance.run('state.customers[0].currentDebt'), debt);
  assert.equal(instance.read(), before);
});

test('tab yang tertinggal tidak menimpa transaksi dari tab lain', () => {
  const instance = app();
  instance.run('saveState()');
  const newer = JSON.parse(instance.read());
  newer.customers[0].currentDebt += 500;
  instance.write(JSON.stringify(newer));
  assert.equal(instance.run('state.customers[0].currentDebt += 100; saveState()'), false);
  assert.equal(JSON.parse(instance.read()).customers[0].currentDebt, newer.customers[0].currentDebt);
  assert.equal(instance.run('state.customers[0].currentDebt'), newer.customers[0].currentDebt);
});

test('struk terakhir mengikuti tanggal terbaru, bukan urutan data contoh', () => {
  const instance = app();
  instance.run('runPrint = function(content) { printed = content; }; printLatestReceipt();');
  assert.match(instance.context.printed, /TRX-103/);
  assert.doesNotMatch(instance.context.printed, /TRX-101/);
});

test('ekspor CSV menyertakan periode terpilih dan menetralkan formula pada nama', async () => {
  const instance = app();
  instance.run(`document.getElementById('reportPeriod').value = 'today';
    state.transactions = [{id: 'CSV-1', date: localDateKey(), customerName: '=SUM(A1:A2)', type: 'tunai', total: 42000}];
    showToast = function() {}; exportTransactions();`);
  const csv = await instance.blob().text();
  assert.match(csv, /ID Transaksi/);
  assert.match(csv, /CSV-1/);
  assert.match(csv, /'\=SUM\(A1:A2\)/);
  assert.doesNotMatch(csv, /TRX-101/);
});

test('rekap bon mencakup semua mitra dan meloloskan karakter HTML sebagai teks', () => {
  const instance = app();
  instance.run(`state.customers.push({id: 'X', name: '<img src=x onerror=alert(1)>', currentDebt: 100, plafon: 1000});
    runPrint = function(content) { printed = content; }; printBonReport();`);
  assert.match(instance.context.printed, /&lt;img/);
  assert.doesNotMatch(instance.context.printed, /<img/);
  assert.match(instance.context.printed, /Bu Mieke/);
});

test('tabel Buku Bon menjaga status, aksi setoran, dan hasil pencarian', () => {
  const instance = app();
  instance.run(`
    document.querySelector = () => ({hidden: true});
    document.querySelectorAll = () => [];
    document.getElementById('btnShowAllBon').dataset = {};
    document.getElementById('searchBon').value = 'CariMitRa';
    state.customers = [
      {id: 'M-1', name: 'CariMitra <uji>', phone: '', currentDebt: 5000, plafon: 10000},
      {id: 'M-2', name: 'CariMitra Lunas', phone: '', currentDebt: 0, plafon: 10000},
      {id: 'M-3', name: 'Mitra lain', phone: '', currentDebt: 12000, plafon: 15000}
    ];
    renderBukuBon();
  `);
  const table = instance.elements.get('bonListContainer').innerHTML;
  assert.match(table, /<table class="bon-table"/);
  assert.match(table, /CariMitra &lt;uji&gt;/);
  assert.match(table, /50% dipakai/);
  assert.match(table, /data-pay-customer="M-1"\s*>/);
  assert.match(table, /data-pay-customer="M-2" disabled>/);
  assert.doesNotMatch(table, /M-3/);
});

test('grafik mengikuti pilihan metrik dan bulan', () => {
  const instance = app();
  instance.run(`
    const dialog = document.getElementById('detailDialog');
    dialog.showModal = function() { this.open = true; };
    function chartButton(dataset) {
      return {
        dataset,
        attributes: {},
        style: {values: {}, setProperty(key, value) { this.values[key] = value; }},
        valueLabel: {},
        querySelector() { return this.valueLabel; },
        setAttribute(key, value) { this.attributes[key] = value; }
      };
    }
    const monthButtons = monthlySales.map((_, index) => chartButton({month: String(index)}));
    const metricButtons = ['omzet', 'profit', 'trx'].map(metric => chartButton({metric}));
    const chart = document.getElementById('monthlyChart');
    const controls = document.getElementById('chartMetrics');
    chart.querySelectorAll = () => monthButtons;
    controls.querySelectorAll = () => metricButtons;
    chart.addEventListener = controls.addEventListener = function(type, handler) { this[type] = handler; };
    document.getElementById('btnDashBon').addEventListener = () => {};
    const projectList = document.getElementById('projectMetrics');
    projectList.addEventListener = function(type, handler) { this[type] = handler; };
    initDashboard();
    const initialMonth = document.getElementById('monthDetailTitle').textContent;
    controls.click({target: {closest: () => metricButtons[2]}});
    const openedOnFilter = Boolean(dialog.open);
    chart.click({target: {closest: () => monthButtons[0]}});
  `);
  assert.equal(instance.run('initialMonth'), 'Sep 2026');
  assert.equal(instance.elements.get('monthDetailTitle').textContent, 'Mei 2026');
  assert.equal(instance.elements.get('monthRevenue').textContent, 'Rp 38.150.200');
  assert.equal(instance.run('openedOnFilter'), false);
  assert.equal(instance.run('dialog.open'), true);
  assert.equal(instance.elements.get('detailTitle').textContent, 'Mei 2026');
  assert.equal(instance.elements.get('detailValue').textContent, '326');
  assert.match(instance.elements.get('detailRows').innerHTML, /Rp 38.150.200/);
  assert.equal(instance.elements.get('detailPager').hidden, false);
  assert.equal(instance.run("monthButtons[0].attributes['aria-label']"), 'Mei: 326 transaksi');
  assert.equal(instance.run("monthButtons[0].attributes['aria-pressed']"), 'true');
  assert.equal(instance.run("metricButtons[2].attributes['aria-pressed']"), 'true');
  assert.equal(instance.run("monthButtons[1].style.values['--bar-height']"), '100%');
  assert.equal(instance.elements.get('dashTotalOmzet').textContent, 'Rp 192.208.050');
  instance.run("document.getElementById('detailNext').onclick()");
  assert.equal(instance.elements.get('detailTitle').textContent, 'Juni 2026');
  assert.equal(instance.elements.get('monthTransactions').textContent, '338');
  assert.equal(instance.elements.get('monthDetailTitle').textContent, 'Jun 2026');
  assert.equal(instance.elements.get('detailValue').textContent, '338');
  instance.run("document.getElementById('detailPrevious').onclick()");
  assert.equal(instance.elements.get('detailTitle').textContent, 'Mei 2026');
  assert.equal(instance.elements.get('detailPrevious').disabled, true);
  instance.run("projectList.click({target: {closest: () => ({dataset: {project: 'spi'}})}})");
  assert.equal(instance.elements.get('detailValue').textContent, '0,94');
  assert.match(instance.elements.get('detailRows').innerHTML, /Rp 15,0 jt/);
  assert.equal(instance.elements.get('detailPager').hidden, true);
});

test('rincian piutang menampilkan nama mitra sebagai teks', () => {
  const instance = app();
  instance.run(`
    state.customers = [
      {id: 'M-1', name: 'Mitra <uji>', currentDebt: 5000, plafon: 10000},
      {id: 'M-2', name: 'Lunas', currentDebt: 0, plafon: 10000}
    ];
    renderDashboard();
  `);
  const detail = instance.elements.get('dashPartnerList').innerHTML;
  assert.match(detail, /<details class="dash-disclosure">/);
  assert.match(detail, /Mitra &lt;uji&gt;/);
  assert.doesNotMatch(detail, /Lunas/);
  assert.equal(instance.elements.get('dashDebtorCount').textContent, '1 mitra');
});

test('rincian stok menghitung sisa dan kekurangan tanpa mengubah pesanan', () => {
  const instance = app();
  instance.run(`
    const dialog = document.getElementById('detailDialog');
    dialog.showModal = function() { this.open = true; };
    state.supplies = [{date: localDateKey(), ekor: 10, kg: 12.75}];
    state.transactions = [];
    document.getElementById('inputEkor').value = '2';
    document.getElementById('inputKg').value = '1,50';
    openStockDetail();
  `);
  const rows = instance.elements.get('detailRows');
  assert.match(rows.innerHTML, /8 ekor · 11,25 kg/);
  assert.equal(instance.elements.get('detailStockAction').hidden, false);
  assert.equal(instance.elements.get('inputKg').value, '1,50');
  instance.run("document.getElementById('inputKg').value = '13,00'; openStockDetail()");
  assert.match(rows.innerHTML, /Kekurangan/);
  assert.match(rows.innerHTML, /0,25 kg/);
  instance.run("document.getElementById('inputKg').value = ''; openStockDetail()");
  assert.doesNotMatch(rows.innerHTML, /NaN|Sisa setelah pesanan|Kekurangan/);
  assert.equal(instance.run('state.transactions.length'), 0);
});
