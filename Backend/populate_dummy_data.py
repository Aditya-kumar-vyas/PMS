from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["financial_dashboard"]

# Clear existing data
db.transactions.delete_many({})
db.portfolios.delete_many({})
db.cashflows.delete_many({})
db.tax_summaries.delete_many({})
db.market_summaries.delete_many({})

# Helper functions
def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

def format_date(date_obj):
    return date_obj.strftime("%d-%b-%y")

def random_price():
    return round(random.uniform(500, 3000), 2)

def random_quantity():
    return random.randint(1, 50)

# Generate transactions
transactions = []
for i in range(25):
    txn_type = random.choice(["Buy", "Sell", "Deposit", "Withdrawal", "Dividend"])
    instrument = random.choice(["Adani Green Energy Ltd", "Hindustan Unilever Ltd", "Shriram Finance", "Cash"])
    security_code = {
        "Adani Green Energy Ltd": "ADANIGREEN",
        "Hindustan Unilever Ltd": "HINDUNILVR",
        "Shriram Finance": "SHRIRAMFIN",
        "Cash": None,
    }[instrument]
    product = "Equity" if instrument != "Cash" else "Current account"
    account = "Dummy-123"
    date = random_date(datetime(2024, 1, 1), datetime(2024, 12, 31))
    formatted_date = format_date(date)  # Format date here
    quantity = random_quantity() if txn_type in ["Buy", "Sell"] else None
    price = random_price() if txn_type in ["Buy", "Sell"] else None
    amount = round(quantity * price, 2) if txn_type in ["Buy", "Sell"] else random.uniform(5000, 50000)
    brokerage = round(amount * 0.001, 2) if txn_type in ["Buy", "Sell"] else 0
    tax = round(amount * 0.0005, 2) if txn_type in ["Buy", "Sell"] else 0

    transactions.append({
        "date": formatted_date,  # Use the formatted date here
        "refNo": f"Txn{i+1:03}",
        "account": account,
        "instrument": instrument,
        "product": product,
        "securityCode": security_code,
        "txnType": txn_type,
        "quantity": quantity,
        "price": price,
        "amount": amount,
        "brokerage": brokerage,
        "tax": tax,
    })

# Generate portfolios (no change needed for date)
portfolios = [
    {
        "account": "Dummy-123",
        "instrument": "Adani Green Energy Ltd",
        "product": "Equity",
        "securityCode": "ADANIGREEN",
        "quantity": 50,
        "avgPrice": 1200.0,
        "currentPrice": 1500.0,
        "marketValue": 75000.0,
    },
    {
        "account": "Dummy-123",
        "instrument": "Hindustan Unilever Ltd",
        "product": "Equity",
        "securityCode": "HINDUNILVR",
        "quantity": 20,
        "avgPrice": 2000.0,
        "currentPrice": 2500.0,
        "marketValue": 50000.0,
    },
    {
        "account": "Dummy-123",
        "instrument": "Cash",
        "product": "Current account",
        "securityCode": None,
        "quantity": None,
        "avgPrice": None,
        "currentPrice": None,
        "marketValue": 100000.0,
    },
]

# Generate cash flows (no change needed for date)
cashflows = [
    {
        "account": "Dummy-123",
        "date": random_date(datetime(2024, 1, 1), datetime(2024, 12, 31)),
        "transactionType": random.choice(["Deposit", "Withdrawal"]),
        "amount": round(random.uniform(1000, 50000), 2),
        "balance": round(random.uniform(50000, 150000), 2),
    }
    for _ in range(15)
]

# Generate tax summaries (no change needed for date)
tax_summaries = [
    {
        "account": "Dummy-123",
        "year": 2024,
        "totalBrokerage": 1500.0,
        "totalTax": 750.0,
        "realizedProfit": 20000.0,
        "realizedLoss": 5000.0,
    },
]

# Generate market summaries (no change needed for date)
market_summaries = [
    {
        "indexName": "NIFTY50",
        "currentLevel": 18200.5,
        "change": 50.3,
        "percentageChange": 0.28,
        "lastUpdated": datetime.now(),
    },
    {
        "indexName": "SENSEX",
        "currentLevel": 61000.75,
        "change": 75.25,
        "percentageChange": 0.12,
        "lastUpdated": datetime.now(),
    },
]

# Insert data into collections
db.transactions.insert_many(transactions)
db.portfolios.insert_many(portfolios)
db.cashflows.insert_many(cashflows)
db.tax_summaries.insert_many(tax_summaries)
db.market_summaries.insert_many(market_summaries)

print("Comprehensive dummy data populated successfully!")
