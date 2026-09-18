-- 1. Rekap Penjualan dan Laba Kotor Harian
SELECT 
    date,
    COUNT(transaction_id) AS total_transaksi,
    SUM(live_weight_kg) AS total_bobot_hidup_kg,
    SUM(carcass_weight_kg) AS total_karkas_kg,
    ROUND(SUM(carcass_weight_kg) / SUM(live_weight_kg) * 100.0, 2) AS rata_rendemen_pct,
    SUM(revenue_rp) AS total_omzet_rp,
    SUM(gross_profit_rp) AS total_laba_kotor_rp
FROM poultry_transactions
GROUP BY date
ORDER BY date ASC;

-- 2. Monitoring Piutang Pelanggan (Buku Bon Langganan)
SELECT 
    customer_name,
    COUNT(transaction_id) AS total_bon_tertunggak,
    SUM(revenue_rp) AS total_piutang_rp,
    MIN(date) AS tanggal_bon_tertua,
    MAX(date) AS tanggal_bon_terbaru
FROM poultry_transactions
WHERE payment_status = 'Belum Lunas'
GROUP BY customer_name
ORDER BY total_piutang_rp DESC;

-- 3. Analisis Profitabilitas Berdasarkan Jenis Potongan
SELECT 
    cut_type,
    COUNT(transaction_id) AS volume_transaksi,
    ROUND(AVG(price_per_kg), 0) AS rerata_harga_jual_kg,
    SUM(revenue_rp) AS total_omzet_rp,
    SUM(gross_profit_rp) AS total_laba_kotor_rp,
    ROUND(SUM(gross_profit_rp) * 100.0 / SUM(revenue_rp), 2) AS margin_laba_pct
FROM poultry_transactions
GROUP BY cut_type
ORDER BY total_laba_kotor_rp DESC;
