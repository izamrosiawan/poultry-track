-- ============================================================================
-- POULTRYTRACK ADVANCED ANALYTICAL SQL QUERIES (PostgreSQL & DuckDB)
-- Window Functions, Rolling Metrics, CTEs & Receivables Aging Analysis
-- ============================================================================

-- 1. Rekapitulasi Harian dengan 7-Day Moving Average & Laju Pertumbuhan Omzet
WITH daily_aggregation AS (
    SELECT 
        date,
        COUNT(transaction_id) AS total_transaksi,
        SUM(live_weight_kg) AS total_bobot_hidup_kg,
        SUM(carcass_weight_kg) AS total_karkas_kg,
        ROUND(SUM(carcass_weight_kg) / SUM(live_weight_kg) * 100.0, 2) AS rata_rendemen_pct,
        SUM(revenue_rp) AS omzet_harian_rp,
        SUM(gross_profit_rp) AS laba_harian_rp
    FROM poultry_transactions
    GROUP BY date
)
SELECT 
    date,
    total_transaksi,
    total_karkas_kg,
    rata_rendemen_pct,
    omzet_harian_rp,
    laba_harian_rp,
    ROUND(AVG(omzet_harian_rp) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) AS moving_avg_omzet_7h,
    ROUND(
        (omzet_harian_rp - LAG(omzet_harian_rp, 1) OVER (ORDER BY date)) 
        * 100.0 / NULLIF(LAG(omzet_harian_rp, 1) OVER (ORDER BY date), 0), 
        2
    ) AS pertumbuhan_omzet_dod_pct
FROM daily_aggregation
ORDER BY date ASC;

-- 2. Analisis Konsentrasi & Pemeringkatan Piutang Warung Langganan (Buku Bon)
WITH unpaid_ledger AS (
    SELECT 
        customer_name,
        COUNT(transaction_id) AS total_bon,
        SUM(revenue_rp) AS total_piutang_rp,
        MIN(date) AS bon_pertama,
        MAX(date) AS bon_terakhir,
        ROUND(AVG(revenue_rp), 0) AS rata_bon_rp
    FROM poultry_transactions
    WHERE payment_status = 'Belum Lunas'
    GROUP BY customer_name
)
SELECT 
    customer_name,
    total_bon,
    total_piutang_rp,
    rata_bon_rp,
    bon_pertama,
    bon_terakhir,
    DENSE_RANK() OVER (ORDER BY total_piutang_rp DESC) AS peringkat_eksposur_risiko,
    ROUND(
        total_piutang_rp * 100.0 / SUM(total_piutang_rp) OVER (), 
        2
    ) AS persentase_kontribusi_piutang_pct
FROM unpaid_ledger
ORDER BY total_piutang_rp DESC;

-- 3. Profitabilitas & Kontribusi Margin Berdasarkan Spesifikasi Potongan Karkas
SELECT 
    cut_type,
    COUNT(transaction_id) AS frekuensi_order,
    SUM(carcass_weight_kg) AS volume_karkas_terjual_kg,
    ROUND(AVG(price_per_kg), 0) AS rerata_harga_jual_kg,
    SUM(revenue_rp) AS total_omzet_rp,
    SUM(gross_profit_rp) AS total_laba_kotor_rp,
    ROUND(SUM(gross_profit_rp) * 100.0 / SUM(revenue_rp), 2) AS margin_laba_kotor_pct,
    ROUND(SUM(revenue_rp) * 100.0 / SUM(SUM(revenue_rp)) OVER (), 2) AS porsi_omzet_terhadap_total_pct
FROM poultry_transactions
GROUP BY cut_type
ORDER BY total_laba_kotor_rp DESC;
