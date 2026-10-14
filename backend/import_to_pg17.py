# Script to import and synchronize all data into PostgreSQL 17 'Fashionsearch' database
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "post@@")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = int(os.getenv("PG_PORT", "5432"))
PG_DB = os.getenv("PG_DB", "Fashionsearch")

SQL_FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Fashionsearch.sql"))

def run_import():
    print(f"Connecting to PostgreSQL 17 server at {PG_HOST}:{PG_PORT}, Database: '{PG_DB}', User: '{PG_USER}'...")
    conn = psycopg2.connect(
        host=PG_HOST,
        port=PG_PORT,
        user=PG_USER,
        password=PG_PASSWORD,
        dbname=PG_DB
    )
    conn.autocommit = True
    cur = conn.cursor()

    # Step 1: Create Schema Tables
    print("Creating tables in PostgreSQL 17...")
    create_tables_sql = """
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS searches CASCADE;

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

    CREATE INDEX IF NOT EXISTS idx_searches_costume_name ON searches (costume_name);
    CREATE INDEX IF NOT EXISTS idx_searches_detected_color ON searches (detected_color);
    CREATE INDEX IF NOT EXISTS idx_searches_detected_length ON searches (detected_length);
    CREATE INDEX IF NOT EXISTS idx_products_search_id ON products (search_id);
    CREATE INDEX IF NOT EXISTS idx_products_store_name ON products (store_name);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
    """
    cur.execute(create_tables_sql)
    print("Tables and indexes successfully created!")

    # Step 2: Seed initial searches and products
    print("Seeding initial curated costumes into PostgreSQL 17...")
    seed_sql = """
    INSERT INTO searches (id, costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, detected_gender, color_hex, summary, source_type)
    VALUES 
    (1, 'Sky Blue Tiered Floral Maxi Dress', 'Sky Blue', 'Maxi (Ankle Length)', 'Dresses', 'Georgette / Chiffon', 'Floral Print', 'Bohemian / Resort', 'Women', '#38BDF8', 'Elegant sky blue tiered maxi dress with floral print and flutter sleeves.', 'sample'),
    (2, 'Oversized Classic Denim Jacket', 'Light Indigo Blue', 'Waist Length', 'Jackets & Coats', '100% Cotton Denim', 'Solid Washed', 'Streetwear / Casual', 'Unisex', '#0284C7', 'Vintage washed relaxed fit denim jacket with trucker pockets.', 'sample'),
    (3, 'Emerald Green Embroidered Anarkali Kurta', 'Emerald Green', 'Floor Length', 'Ethnic Wear', 'Silk Blend', 'Zari Embroidered', 'Festive / Wedding', 'Women', '#059669', 'Traditional floor-length flared Anarkali with gold thread embroidery.', 'sample')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
    VALUES
    (1, 'Amazon', 'VERO MODA Sky Blue Floral A-Line Tiered Maxi Dress', 1299.00, 2499.00, 48, 4.4, 380, 'https://www.amazon.in/dp/B08XYZ1234?tag=fashionsearch-21', 'https://www.amazon.in/dp/B08XYZ1234?tag=fashionsearch-21', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Prime 1-Day Delivery', FALSE, 'Top Rated'),
    (1, 'Myntra', 'SASSAFRAS Light Blue Printed Tiered Maxi Dress', 989.00, 2199.00, 55, 4.3, 512, 'https://www.myntra.com/dresses/sassafras/dress-1', 'https://cuelinks.com/r?url=https://www.myntra.com/dresses/sassafras/dress-1&id=fashionsearch', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'Get it by Tomorrow', TRUE, 'Lowest Price'),
    (1, 'Ajio', 'TRENDS Blue Floral Flared Maxi Gown', 1149.00, 2299.00, 50, 4.1, 210, 'https://www.ajio.com/p/44123', 'https://cuelinks.com/r?url=https://www.ajio.com/p/44123&id=fashionsearch', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 2 Days', FALSE, 'Popular Deal'),
    (1, 'Zara', 'ZARA Voluminous Printed Poplin Dress In Sky Blue', 2990.00, 3990.00, 25, 4.6, 95, 'https://www.zara.com/in/p/printed-dress', 'https://cuelinks.com/r?url=https://www.zara.com/in/p/printed-dress&id=fashionsearch', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', TRUE, 'Standard Shipping', FALSE, 'Premium Style')
    ON CONFLICT DO NOTHING;
    """
    cur.execute(seed_sql)

    # Step 3: Import previous searches and products from SQLite if any exists
    sqlite_db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "Fashionsearch.db"))
    if os.path.exists(sqlite_db_path):
        import sqlite3
        s_conn = sqlite3.connect(sqlite_db_path)
        s_cur = s_conn.cursor()
        print("Migrating search history from local database into PostgreSQL 17...")

        searches = s_cur.execute("SELECT id, costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, detected_gender, color_hex, summary, source_type FROM searches;").fetchall()
        for s in searches:
            cur.execute("""
            INSERT INTO searches (id, costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, detected_gender, color_hex, summary, source_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                costume_name = EXCLUDED.costume_name,
                detected_color = EXCLUDED.detected_color;
            """, s)

        products = s_cur.execute("SELECT search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge FROM products;").fetchall()
        for p in products:
            cur.execute("""
            INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::boolean, %s, %s::boolean, %s);
            """, p)

        # Reset sequence
        cur.execute("SELECT setval('searches_id_seq', (SELECT COALESCE(MAX(id), 1) FROM searches));")
        cur.execute("SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products));")

    # Step 4: Verify row counts in PostgreSQL 17
    cur.execute("SELECT COUNT(*) FROM searches;")
    search_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM products;")
    product_count = cur.fetchone()[0]

    print("=" * 60)
    print(f"SUCCESS: Data successfully loaded into PostgreSQL 17 'Fashionsearch'!")
    print(f"Total Costume Searches in PostgreSQL 17: {search_count}")
    print(f"Total Store Products & Prices in PostgreSQL 17: {product_count}")
    print("=" * 60)

    cur.close()
    conn.close()

if __name__ == "__main__":
    run_import()
