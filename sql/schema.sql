-- ============================================================================
-- POULTRYTRACK RELATIONAL DATABASE SCHEMA (PostgreSQL / DuckDB Compatible)
-- Standards: 3NF Relational Integrity & Strict Column Typing
-- ============================================================================

DROP TABLE IF EXISTS poultry_transactions;

CREATE TABLE poultry_transactions (
    transaction_id VARCHAR(32) PRIMARY KEY,
    date DATE NOT NULL,
    time VARCHAR(8) NOT NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_type VARCHAR(32) NOT NULL,
    cut_type VARCHAR(64) NOT NULL,
    chickens_count INTEGER NOT NULL CHECK (chickens_count > 0),
    live_weight_kg NUMERIC(8, 2) NOT NULL CHECK (live_weight_kg > 0),
    carcass_weight_kg NUMERIC(8, 2) NOT NULL CHECK (carcass_weight_kg > 0),
    weight_loss_kg NUMERIC(8, 2) NOT NULL CHECK (weight_loss_kg >= 0),
    yield_ratio NUMERIC(6, 4) NOT NULL CHECK (yield_ratio > 0 AND yield_ratio <= 1.0),
    price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg > 0),
    cogs_rp NUMERIC(12, 2) NOT NULL CHECK (cogs_rp >= 0),
    revenue_rp NUMERIC(12, 2) NOT NULL CHECK (revenue_rp > 0),
    gross_profit_rp NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    payment_status VARCHAR(32) NOT NULL
);

-- Indeks performa untuk analitik agregasi cepat
CREATE INDEX idx_poultry_tx_date ON poultry_transactions (date);
CREATE INDEX idx_poultry_tx_customer ON poultry_transactions (customer_name);
CREATE INDEX idx_poultry_tx_payment_status ON poultry_transactions (payment_status);
CREATE INDEX idx_poultry_tx_cut_type ON poultry_transactions (cut_type);
