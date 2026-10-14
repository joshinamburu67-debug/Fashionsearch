import urllib.parse
import random

AMAZON_ASSOCIATE_TAG = "fashionsearch-21"

FASHION_BRANDS = [
    "VERO MODA", "ONLY", "Levi's", "Biba", "W for Woman", "FabIndia", 
    "MANGO", "Allen Solly", "Marks & Spencer", "H&M Essentials", "ZARA Studio"
]

def generate_amazon_products(costume_data: dict) -> list:
    """
    Generates Amazon Associates search links and matching product cards
    based on Gemini's costume name, color, length, and category.
    """
    costume_name = costume_data.get("costume_name", "Fashion Costume")
    color = costume_data.get("detected_color", "Blue")
    length = costume_data.get("detected_length", "Regular")
    category = costume_data.get("detected_category", "Apparel")

    # Clean query for search
    query = f"{color} {costume_name} {length}".strip()
    encoded_query = urllib.parse.quote_plus(query)
    
    # Base Amazon Associate search url
    search_url = f"https://www.amazon.in/s?k={encoded_query}&tag={AMAZON_ASSOCIATE_TAG}"

    # Sample curated images matching colors
    fashion_images = [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
    ]

    base_price = 1499.0
    if "jacket" in costume_name.lower():
        base_price = 2299.0
    elif "kurta" in costume_name.lower() or "anarkali" in costume_name.lower():
        base_price = 1899.0
    elif "crop" in costume_name.lower():
        base_price = 799.0

    products = []
    
    # Product 1: Best Match Prime Deal
    p1_price = round(base_price * 0.95, 2)
    p1_orig = round(p1_price * 1.6, 2)
    p1_discount = int(((p1_orig - p1_price) / p1_orig) * 100)
    brand1 = random.choice(["VERO MODA", "ONLY", "MANGO"])
    products.append({
        "store_name": "Amazon",
        "title": f"{brand1} {costume_name} with {length} cut",
        "price": p1_price,
        "original_price": p1_orig,
        "discount_percent": p1_discount,
        "rating": 4.5,
        "review_count": 428,
        "product_url": search_url,
        "affiliate_url": search_url,
        "image_url": fashion_images[0],
        "in_stock": True,
        "delivery_info": "FREE Prime 1-Day Delivery",
        "is_lowest_price": False,
        "badge": "Amazon's Choice"
    })

    # Product 2: Budget Amazon alternative
    p2_price = round(base_price * 0.78, 2)
    p2_orig = round(p2_price * 1.8, 2)
    p2_discount = int(((p2_orig - p2_price) / p2_orig) * 100)
    brand2 = random.choice(["Symbol Premium", "Amazon Brand - Inkast", "Harpa"])
    products.append({
        "store_name": "Amazon",
        "title": f"{brand2} Casual {color} {category} ({length})",
        "price": p2_price,
        "original_price": p2_orig,
        "discount_percent": p2_discount,
        "rating": 4.2,
        "review_count": 890,
        "product_url": search_url,
        "affiliate_url": search_url,
        "image_url": fashion_images[1],
        "in_stock": True,
        "delivery_info": "FREE Delivery by Tomorrow",
        "is_lowest_price": False,
        "badge": "Top Seller"
    })

    return products
