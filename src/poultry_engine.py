"""
poultry_engine.py
Core calculation engine for poultry retail operations and carcass yield analytics.
"""

from typing import Dict, Any, List


def calculate_carcass_yield(live_weight_kg: float, carcass_weight_kg: float) -> Dict[str, float]:
    """
    Calculate carcass yield percentage and weight loss from live chicken to dressed meat.
    Formula:
        yield_ratio = carcass_weight_kg / live_weight_kg
        weight_loss_kg = live_weight_kg - carcass_weight_kg
    """
    if live_weight_kg <= 0:
        raise ValueError("Live weight must be strictly positive.")
    if carcass_weight_kg < 0:
        raise ValueError("Carcass weight cannot be negative.")
    if carcass_weight_kg > live_weight_kg:
        raise ValueError("Carcass weight cannot exceed live weight.")

    weight_loss_kg = round(live_weight_kg - carcass_weight_kg, 2)
    yield_ratio = round(carcass_weight_kg / live_weight_kg, 4)
    yield_percentage = round(yield_ratio * 100.0, 2)

    return {
        "live_weight_kg": live_weight_kg,
        "carcass_weight_kg": carcass_weight_kg,
        "weight_loss_kg": weight_loss_kg,
        "yield_ratio": yield_ratio,
        "yield_percentage": yield_percentage
    }


def calculate_transaction_financials(
    live_weight_kg: float,
    carcass_weight_kg: float,
    live_cost_per_kg: float,
    selling_price_per_kg: float
) -> Dict[str, Any]:
    """
    Calculate COGS, revenue, gross profit, and gross margin percentage.
    """
    yield_info = calculate_carcass_yield(live_weight_kg, carcass_weight_kg)
    cogs_rp = int(round(live_weight_kg * live_cost_per_kg, 0))
    revenue_rp = int(round(carcass_weight_kg * selling_price_per_kg, 0))
    gross_profit_rp = revenue_rp - cogs_rp
    gross_margin_pct = round((gross_profit_rp / revenue_rp) * 100.0, 2) if revenue_rp > 0 else 0.0

    return {
        **yield_info,
        "live_cost_per_kg": live_cost_per_kg,
        "selling_price_per_kg": selling_price_per_kg,
        "cogs_rp": cogs_rp,
        "revenue_rp": revenue_rp,
        "gross_profit_rp": gross_profit_rp,
        "gross_margin_pct": gross_margin_pct
    }


def assess_credit_aging(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate total outstanding receivables and aging breakdown.
    """
    total_receivable = 0
    unpaid_count = 0
    breakdown_by_customer = {}

    for tx in transactions:
        if tx.get("payment_status") == "Belum Lunas":
            rev = tx.get("revenue_rp", 0)
            total_receivable += rev
            unpaid_count += 1
            cust = tx.get("customer_name", "Unknown")
            breakdown_by_customer[cust] = breakdown_by_customer.get(cust, 0) + rev

    return {
        "total_receivable_rp": total_receivable,
        "unpaid_count": unpaid_count,
        "breakdown_by_customer": breakdown_by_customer
    }
