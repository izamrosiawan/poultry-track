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
        if (!elements.has(id)) elements.set(id, {textContent: '', hidden: true});
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
