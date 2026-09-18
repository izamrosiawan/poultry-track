import pytest
from src.poultry_engine import calculate_carcass_yield, calculate_transaction_financials, assess_credit_aging

def test_calculate_carcass_yield_normal():
    res = calculate_carcass_yield(10.0, 7.4)
    assert res["live_weight_kg"] == 10.0
    assert res["carcass_weight_kg"] == 7.4
    assert res["weight_loss_kg"] == 2.6
    assert res["yield_ratio"] == 0.74
    assert res["yield_percentage"] == 74.0

def test_calculate_carcass_yield_invalid_input():
    with pytest.raises(ValueError):
        calculate_carcass_yield(-5.0, 3.0)
    with pytest.raises(ValueError):
        calculate_carcass_yield(10.0, 12.0)

def test_calculate_transaction_financials():
    # 20 kg live @ 22,000 = 440,000 COGS
    # 14.8 kg carcass @ 35,000 = 518,000 Revenue
    # Gross Profit = 78,000
    fin = calculate_transaction_financials(20.0, 14.8, 22000, 35000)
    assert fin["cogs_rp"] == 440000
    assert fin["revenue_rp"] == 518000
    assert fin["gross_profit_rp"] == 78000
    assert fin["gross_margin_pct"] > 15.0

def test_assess_credit_aging():
    mock_txs = [
        {"customer_name": "Warung Padang", "payment_status": "Belum Lunas", "revenue_rp": 500000},
        {"customer_name": "Warung Padang", "payment_status": "Lunas", "revenue_rp": 300000},
        {"customer_name": "Bakso Solo", "payment_status": "Belum Lunas", "revenue_rp": 250000},
    ]
    aging = assess_credit_aging(mock_txs)
    assert aging["total_receivable_rp"] == 750000
    assert aging["unpaid_count"] == 2
    assert aging["breakdown_by_customer"]["Warung Padang"] == 500000
    assert aging["breakdown_by_customer"]["Bakso Solo"] == 250000
