# Exporter to generate and update PostgreSQL 17 file named 'Fashionsearch.sql'
import os
import json
from datetime import datetime

SQL_FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Fashionsearch.sql"))

POSTGRES_17_HEADER = """-- =========================================================
-- Fashionsearch Database Dump
-- Compatible with PostgreSQL 17.x
-- Created for Fashion Costume Price Comparison Platform
-- Date: {timestamp}
-- Database Name: Fashionsearch
-- =========================================================

-- Drop tables if exists
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS searches CASCADE;

-- Create Searches Table
CREATE TABLE IF NOT EXISTS searches (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    costume_name VARCHAR(255) NOT NULL,
    detected_color VARCHAR(100) NOT NULL,
    detected_length VARCHAR(100) NOT NULL,
    detected_category VARCHAR(100) NOT NULL,
    detected_fabric VARCHAR(100),
    detected_pattern VARCHAR(100),
    detected_style VARCHAR(100),
    detected_gender VARCHAR(50) DEFAULT 'Unisex',
    color_hex VARCHAR(50) DEFAULT '#38BDF8',
    summary TEXT,
    source_type VARCHAR(50) DEFAULT 'upload'
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    search_id INTEGER REFERENCES searches(id) ON DELETE CASCADE,
    store_name VARCHAR(100) NOT NULL,
    title VARCHAR(300) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percent INTEGER DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 4.2,
    review_count INTEGER DEFAULT 100,
    product_url TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    delivery_info VARCHAR(100) DEFAULT 'Delivery in 2-4 days',
    is_lowest_price BOOLEAN DEFAULT FALSE,
    badge VARCHAR(50)
);

-- Create Indexes for High Performance Search
CREATE INDEX IF NOT EXISTS idx_searches_costume_name ON searches (costume_name);
CREATE INDEX IF NOT EXISTS idx_searches_detected_color ON searches (detected_color);
CREATE INDEX IF NOT EXISTS idx_searches_detected_length ON searches (detected_length);
CREATE INDEX IF NOT EXISTS idx_products_search_id ON products (search_id);
CREATE INDEX IF NOT EXISTS idx_products_store_name ON products (store_name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);

"""

def init_postgres_file():
    """Initializes the Fashionsearch.sql file with PostgreSQL 17 schema and sample seed records."""
    if not os.path.exists(SQL_FILE_PATH) or os.path.getsize(SQL_FILE_PATH) < 200:
        content = POSTGRES_17_HEADER.format(timestamp=datetime.utcnow().isoformat())
        # Add initial seed records
        content += """-- Seed Initial Costume Search Data
INSERT INTO searches (id, costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, detected_gender, color_hex, summary, source_type)
VALUES 
(1, 'Sky Blue Tiered Floral Maxi Dress', 'Sky Blue', 'Maxi (Ankle Length)', 'Dresses', 'Georgette / Chiffon', 'Floral Print', 'Bohemian / Resort', 'Women', '#38BDF8', 'Elegant sky blue tiered maxi dress with floral print and flutter sleeves.', 'sample'),
(2, 'Oversized Classic Denim Jacket', 'Light Indigo Blue', 'Waist Length', 'Jackets & Coats', '100% Cotton Denim', 'Solid Washed', 'Streetwear / Casual', 'Unisex', '#0284C7', 'Vintage washed relaxed fit denim jacket with trucker pockets.', 'sample'),
(3, 'Emerald Green Embroidered Anarkali Kurta', 'Emerald Green', 'Floor Length', 'Ethnic Wear', 'Silk Blend', 'Zari Embroidered', 'Festive / Wedding', 'Women', '#059669', 'Traditional floor-length flared Anarkali with gold thread embroidery.', 'sample')
ON CONFLICT (id) DO NOTHING;

-- Seed Products for Search 1 (Sky Blue Maxi Dress)
INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
VALUES
(1, 'Amazon', 'VERO MODA Sky Blue Floral A-Line Tiered Maxi Dress', 1299.00, 2499.00, 48, 4.4, 380, 'https://www.amazon.in/dp/B08XYZ1234?tag=fashionsearch-21', 'https://www.amazon.in/dp/B08XYZ1234?tag=fashionsearch-21', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Prime 1-Day Delivery', FALSE, 'Top Rated'),
(1, 'Myntra', 'SASSAFRAS Light Blue Printed Tiered Maxi Dress', 989.00, 2199.00, 55, 4.3, 512, 'https://www.myntra.com/dresses/sassafras/dress-1', 'https://cuelinks.com/r?url=https://www.myntra.com/dresses/sassafras/dress-1&id=fashionsearch', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'Get it by Tomorrow', TRUE, 'Lowest Price'),
(1, 'Ajio', 'TRENDS Blue Floral Flared Maxi Gown', 1149.00, 2299.00, 50, 4.1, 210, 'https://www.ajio.com/p/44123', 'https://cuelinks.com/r?url=https://www.ajio.com/p/44123&id=fashionsearch', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 2 Days', FALSE, 'Popular Deal'),
(1, 'Zara', 'ZARA Voluminous Printed Poplin Dress In Sky Blue', 2990.00, 3990.00, 25, 4.6, 95, 'https://www.zara.com/in/p/printed-dress', 'https://cuelinks.com/r?url=https://www.zara.com/in/p/printed-dress&id=fashionsearch', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', TRUE, 'Standard Shipping', FALSE, 'Premium Style')
ON CONFLICT DO NOTHING;

"""
        with open(SQL_FILE_PATH, "w", encoding="utf-8") as f:
            f.write(content)
        print(f">>> Fashionsearch.sql PostgreSQL 17 file created at: {SQL_FILE_PATH}")

def append_search_to_postgres_file(search_data: dict, products: list):
    """Appends newly performed costume search and its scraped/compared products to the Fashionsearch.sql file."""
    try:
        init_postgres_file()
        escaped_name = search_data.get("costume_name", "").replace("'", "''")
        escaped_color = search_data.get("detected_color", "").replace("'", "''")
        escaped_len = search_data.get("detected_length", "").replace("'", "''")
        escaped_cat = search_data.get("detected_category", "").replace("'", "''")
        escaped_fab = search_data.get("detected_fabric", "").replace("'", "''")
        escaped_pat = search_data.get("detected_pattern", "").replace("'", "''")
        escaped_sty = search_data.get("detected_style", "").replace("'", "''")
        escaped_sum = search_data.get("summary", "").replace("'", "''")
        source = search_data.get("source_type", "upload")

        sql_lines = [
            f"\n-- Search Event: {escaped_name} ({datetime.utcnow().isoformat()})",
            "WITH new_search AS (",
            f"  INSERT INTO searches (costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, summary, source_type)",
            f"  VALUES ('{escaped_name}', '{escaped_color}', '{escaped_len}', '{escaped_cat}', '{escaped_fab}', '{escaped_pat}', '{escaped_sty}', '{escaped_sum}', '{source}')",
            "  RETURNING id",
            ")",
            "INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)",
            "VALUES"
        ]

        product_values = []
        for p in products:
            p_title = p.get("title", "").replace("'", "''")
            p_store = p.get("store_name", "").replace("'", "''")
            p_price = p.get("price", 999.0)
            p_orig = p.get("original_price") or (p_price * 1.5)
            p_disc = p.get("discount_percent", 30)
            p_rat = p.get("rating", 4.3)
            p_rev = p.get("review_count", 150)
            p_url = p.get("product_url", "").replace("'", "''")
            p_aff = p.get("affiliate_url", "").replace("'", "''")
            p_img = p.get("image_url", "").replace("'", "''")
            p_low = "TRUE" if p.get("is_lowest_price") else "FALSE"
            p_del = p.get("delivery_info", "Fast Delivery").replace("'", "''")
            p_badge_val = p.get('badge', '').replace("'", "''") if p.get('badge') else None
            p_bdg = f"'{p_badge_val}'" if p_badge_val else "NULL"

            val = f"  ((SELECT id FROM new_search), '{p_store}', '{p_title}', {p_price}, {p_orig}, {p_disc}, {p_rat}, {p_rev}, '{p_url}', '{p_aff}', '{p_img}', TRUE, '{p_del}', {p_low}, {p_bdg})"
            product_values.append(val)

        sql_lines.append(",\n".join(product_values) + ";\n")

        with open(SQL_FILE_PATH, "a", encoding="utf-8") as f:
            f.write("\n".join(sql_lines))

    except Exception as e:
        print(f"Error appending to Fashionsearch.sql: {e}")
