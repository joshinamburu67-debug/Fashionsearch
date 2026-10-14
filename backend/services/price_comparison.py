from services.amazon_service import generate_amazon_products
from services.cuelinks_service import generate_cuelinks_fashion_products

def compare_fashion_prices(costume_data: dict) -> dict:
    """
    Combines Amazon Associates and Cuelinks fashion products,
    ranks them by price, marks the lowest price, and provides price comparison metrics.
    """
    amazon_items = generate_amazon_products(costume_data)
    cuelinks_items = generate_cuelinks_fashion_products(costume_data)

    all_products = amazon_items + cuelinks_items

    if not all_products:
        return {
            "products": [],
            "stats": {
                "lowest_price": 0,
                "highest_price": 0,
                "average_price": 0,
                "best_deal_store": "N/A",
                "max_savings_percent": 0
            }
        }

    # Sort ascending by price
    all_products.sort(key=lambda p: p["price"])

    # Mark the lowest price item
    lowest_price_item = all_products[0]
    lowest_price_item["is_lowest_price"] = True
    lowest_price_item["badge"] = "Lowest Price ⚡"

    # Compute statistics
    prices = [p["price"] for p in all_products]
    discounts = [p.get("discount_percent", 0) for p in all_products]

    stats = {
        "lowest_price": min(prices),
        "highest_price": max(prices),
        "average_price": round(sum(prices) / len(prices), 2),
        "best_deal_store": lowest_price_item["store_name"],
        "max_savings_percent": max(discounts) if discounts else 0,
        "total_stores_compared": len(set(p["store_name"] for p in all_products))
    }

    return {
        "products": all_products,
        "stats": stats
    }
