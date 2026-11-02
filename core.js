(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PoultryCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function parseNumber(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
    let text = String(value ?? '').trim();
    if (!text) return NaN;
    if (text.includes(',')) {
      if (!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(text)) return NaN;
      text = text.replace(/\./g, '').replace(',', '.');
    }
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) return NaN;
    return Number(text);
  }

  function parseCurrency(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
    const text = String(value ?? '').trim().replace(/^Rp\s*/i, '');
    if (!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(text)) return NaN;
    return Number(text.replace(/\./g, '').replace(',', '.'));
  }

  function localDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(date);
    const get = type => parts.find(p => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  function normalizePhone(value) {
    const raw = String(value ?? '').trim();
    if (!/^[+\d\s()-]+$/.test(raw)) return '';
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '62' + digits.slice(1);
    return /^628\d{8,11}$/.test(digits) ? digits : '';
  }

  function daysLate(customer, asOf, today = localDateKey()) {
    if (Number(customer.currentDebt) <= 0) return 0;
    if (customer.dueDate && Number.isFinite(Date.parse(customer.dueDate))) {
      return Math.max(0, Math.floor((Date.parse(today) - Date.parse(customer.dueDate)) / 86400000));
    }
    const elapsed = Math.max(0, Math.floor((Date.parse(today) - Date.parse(asOf || today)) / 86400000));
    return Number(customer.daysLate || 0) > 0 ? Number(customer.daysLate) + elapsed : 0;
  }

  function nextQueueStatus(status) {
    return {waiting: 'processing', processing: 'ready', ready: 'done'}[status] || 'done';
  }

  function normalizeState(input, today = localDateKey()) {
    if (!input || !['customers', 'transactions', 'supplies'].every(key => Array.isArray(input[key]))) throw new Error('Format data tidak valid.');
    const state = JSON.parse(JSON.stringify(input));
    const records = [...state.customers, ...state.transactions, ...state.supplies];
    if (records.some(record => !record || typeof record !== 'object' || Array.isArray(record))) throw new Error('Catatan tidak valid.');
    const numericFields = ['currentDebt', 'initialDebt', 'plafon', 'daysLate', 'total', 'totalModal', 'kg', 'ekor', 'pricePerKg'];
    for (const record of records) for (const key of numericFields) {
      if (key in record) {
        const value = Number(record[key]);
        if (!Number.isFinite(value) || value < 0) throw new Error('Angka dalam catatan tidak valid.');
        record[key] = value;
      }
    }
    for (const customer of state.customers) {
      if (typeof customer.id !== 'string' || !customer.id || typeof customer.name !== 'string' || !customer.name) throw new Error('Identitas mitra tidak valid.');
      customer.currentDebt ??= 0;
      customer.plafon ??= 0;
      if (customer.dueDate != null && (typeof customer.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(customer.dueDate) || !Number.isFinite(Date.parse(customer.dueDate)))) throw new Error('Tanggal tempo tidak valid.');
    }
    if (new Set(state.customers.map(c => c.id)).size !== state.customers.length) throw new Error('Kode mitra duplikat.');
    for (const key of ['openingCash', 'cashCounts']) {
      if (state[key] == null) continue;
      if (typeof state[key] !== 'object' || Array.isArray(state[key])) throw new Error('Format saldo kas tidak valid.');
      for (const amount of Object.values(state[key])) {
        if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Saldo kas tidak valid.');
      }
    }
    if (!Array.isArray(state.queue)) {
      state.queue = state.transactions.filter(t => t.type !== 'cicilan_masuk').map((t, i) => ({...t, transactionId: t.id, status: i === 0 ? 'processing' : 'waiting'}));
    }
    const ids = new Set();
    state.queue = state.queue.filter(q => q && typeof q === 'object' && q.type !== 'cicilan_masuk').map(q => ({
      ...q, transactionId: q.transactionId || q.id,
      status: ['waiting', 'processing', 'ready', 'done'].includes(q.status) ? q.status : 'waiting'
    })).filter(q => {
      if (!q.transactionId || ids.has(q.transactionId)) return false;
      ids.add(q.transactionId);
      return true;
    }).sort((a, b) => `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`));
    for (const order of state.queue) {
      for (const row of [order, ...(Array.isArray(order.items) ? order.items : [])]) {
        for (const key of ['ekor', 'kg']) {
          row[key] = Number(row[key] || 0);
          if (!Number.isFinite(row[key]) || row[key] < 0) throw new Error('Angka antrean tidak valid.');
        }
      }
    }
    state.schemaVersion = 2;
    state.debtAsOf ||= today;
    return state;
  }

  function reportTotals(state, period = 'today', today = localDateKey()) {
    const transactions = state.transactions.filter(t => t.date <= today && (period !== 'today' || t.date === today));
    const supplies = state.supplies.filter(s => s.date <= today && (period !== 'today' || s.date === today));
    const sum = (rows, key) => Math.round(rows.reduce((total, row) => total + Number(row[key] || 0), 0) * 100) / 100;
    const sales = transactions.filter(t => t.type === 'tunai');
    const payments = transactions.filter(t => t.type === 'cicilan_masuk');
    const credit = transactions.filter(t => t.type === 'bon');
    const productSales = transactions.filter(t => ['tunai', 'bon'].includes(t.type));
    const cashSales = sum(sales, 'total');
    const cashPayments = sum(payments, 'total');
    const cashSupplies = sum(supplies.filter(s => /lunas|tunai/i.test(s.paymentStatus) && !/tempo|belum/i.test(s.paymentStatus)), 'totalModal');
    const openingCash = period === 'today' ? Number(state.openingCash?.[today] || 0) : 0;
    return {transactions, supplies, sales, payments, cashSales, cashPayments, cashSupplies,
      kg: sum(productSales, 'kg'), ekor: sum(productSales, 'ekor'), bon: sum(credit, 'total'),
      openingCash, cashIn: cashSales + cashPayments, net: openingCash + cashSales + cashPayments - cashSupplies};
  }

  function inventory(state, today = localDateKey()) {
    const supplied = state.supplies.filter(s => s.date <= today);
    const sold = state.transactions.filter(t => t.date <= today && ['tunai', 'bon'].includes(t.type));
    const balance = key => Math.round((supplied.reduce((n, s) => n + Number(s[key] || 0), 0) - sold.reduce((n, t) => n + Number(t[key] || 0), 0)) * 100) / 100;
    return {ekor: balance('ekor'), kg: balance('kg')};
  }

  return {parseNumber, parseCurrency, localDateKey, normalizePhone, daysLate, nextQueueStatus, normalizeState, reportTotals, inventory};
});
