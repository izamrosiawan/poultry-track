const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core.js');

test('berat Indonesia dan titik desimal terbaca tanpa menelan input rusak', () => {
  assert.equal(core.parseNumber('5,40'), 5.4);
  assert.equal(core.parseNumber('5.40'), 5.4);
  assert.equal(core.parseNumber('1.234,56'), 1234.56);
  for (const value of ['', 'abc', '1,2,3', '5kg', 'Infinity']) assert.ok(Number.isNaN(core.parseNumber(value)));
});

test('harga memakai pemisah ribuan Indonesia', () => {
  assert.equal(core.parseCurrency('42.000'), 42000);
  assert.equal(core.parseCurrency('Rp 1.250.000'), 1250000);
  assert.equal(core.parseCurrency('23500'), 23500);
  assert.ok(Number.isNaN(core.parseCurrency('42..000')));
});

const sample = {
  customers: [{id: 'A', name: 'Mitra A', currentDebt: 500, plafon: 1000, daysLate: 2}],
  transactions: [
    {id: '2', date: '2026-11-02', time: '08:00', type: 'bon', total: 300, ekor: 2, kg: 3},
    {id: '1', date: '2026-11-02', time: '07:00', type: 'tunai', total: 200, ekor: 1, kg: 1.5},
    {id: '3', date: '2026-11-02', type: 'cicilan_masuk', total: 100, ekor: 0, kg: 0},
    {id: '4', date: '2026-11-01', type: 'tunai', total: 999, ekor: 1, kg: 1.5}
  ],
  supplies: [
    {date: '2026-11-02', ekor: 10, kg: 20, totalModal: 150, paymentStatus: 'Lunas Tunai Meja'},
    {date: '2026-11-02', ekor: 2, kg: 3, totalModal: 999, paymentStatus: 'Tempo 7 Hari'},
    {date: '2026-11-03', ekor: 100, kg: 100, totalModal: 999, paymentStatus: 'Lunas'}
  ]
};

test('laporan memisahkan penjualan tunai, setoran, bon, dan pasokan tempo', () => {
  const result = core.reportTotals(sample, 'today', '2026-11-02');
  assert.equal(result.cashIn, 300);
  assert.equal(result.net, 150);
  assert.equal(result.cashSupplies, 150);
  assert.equal(result.bon, 300);
  assert.equal(result.ekor, 3);
  assert.equal(result.kg, 4.5);
  assert.equal(core.reportTotals(sample, 'all', '2026-11-02').cashSales, 1199);
});

test('saldo awal laci ditambahkan sekali pada laporan harian', () => {
  const data = {...sample, openingCash: {'2026-11-02': 1000}};
  const today = core.reportTotals(data, 'today', '2026-11-02');
  assert.equal(today.openingCash, 1000);
  assert.equal(today.net, 1150);
  assert.equal(core.reportTotals(data, 'all', '2026-11-02').openingCash, 0);
});

test('stok berubah menurut pasokan dan penjualan, setoran bukan barang terjual', () => {
  const result = core.inventory(sample, '2026-11-02');
  assert.equal(result.ekor, 8);
  assert.equal(result.kg, 17);
});

test('migrasi data lama tidak mengubah sumber dan membuat antrean FIFO tanpa setoran', () => {
  const original = JSON.stringify(sample);
  const normalized = core.normalizeState(sample, '2026-11-02');
  assert.equal(JSON.stringify(sample), original);
  assert.deepEqual(normalized.queue.map(q => q.id), ['4', '1', '2']);
  assert.equal(normalized.schemaVersion, 2);
  assert.equal(normalized.debtAsOf, '2026-11-02');
  assert.throws(() => core.normalizeState({customers: []}, '2026-11-02'));
});

test('migrasi menolak identitas duplikat dan angka antrean yang rusak', () => {
  assert.throws(() => core.normalizeState({...sample, customers: [...sample.customers, sample.customers[0]]}));
  assert.throws(() => core.normalizeState({...sample, queue: [{id: 'x', ekor: '<img>', kg: 1}]}));
});

test('saldo lunas menghapus tanda jatuh tempo; penuaan mengikuti tanggal Jakarta', () => {
  assert.equal(core.daysLate({currentDebt: 0, daysLate: 8}, '2026-11-01', '2026-11-03'), 0);
  assert.equal(core.daysLate({currentDebt: 500, daysLate: 2}, '2026-11-01', '2026-11-03'), 4);
  assert.equal(core.localDateKey(new Date('2026-11-01T18:01:00Z')), '2026-11-02');
});

test('bon baru menjadi terlambat setelah tanggal tempo yang disimpan', () => {
  assert.equal(core.daysLate({currentDebt: 100, dueDate: '2026-11-09'}, '2026-11-02', '2026-11-08'), 0);
  assert.equal(core.daysLate({currentDebt: 100, dueDate: '2026-11-09'}, '2026-11-02', '2026-11-11'), 2);
});

test('status antrean hanya maju satu tahap dan pengambilan akhir tidak berulang', () => {
  assert.equal(core.nextQueueStatus('waiting'), 'processing');
  assert.equal(core.nextQueueStatus('processing'), 'ready');
  assert.equal(core.nextQueueStatus('ready'), 'done');
  assert.equal(core.nextQueueStatus('done'), 'done');
});

test('nomor WhatsApp hanya dibuka bila format valid', () => {
  assert.equal(core.normalizePhone('0812-3456-7890'), '6281234567890');
  assert.equal(core.normalizePhone('+62 812 3456 7890'), '6281234567890');
  assert.equal(core.normalizePhone('-'), '');
  assert.equal(core.normalizePhone('123'), '');
});
