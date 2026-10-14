-- =========================================================
-- Fashionsearch Database Dump
-- Compatible with PostgreSQL 17.x
-- Created for Fashion Costume Price Comparison Platform
-- Date: 2026-10-14T14:48:03.541832
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

-- Seed Initial Costume Search Data
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


-- Search Event: Crimson Red / Coral Elegant A-Line Midi Dress (2026-10-14T14:55:44.494377)
WITH new_search AS (
  INSERT INTO searches (costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, summary, source_type)
  VALUES ('Crimson Red / Coral Elegant A-Line Midi Dress', 'Crimson Red / Coral', 'Midi (Calf Length)', 'Casual Dresses', 'Cotton Blend', 'Minimalist Solid', 'Contemporary Casual', 'Detected Crimson Red / Coral costume in Midi (Calf Length) styling with Cotton Blend fabric.', 'upload')
  RETURNING id
)
INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
VALUES
  ((SELECT id FROM new_search), 'Meesho', 'StyleNest Boutique Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 869.42, 2098.6, 58, 4.0, 320, 'https://www.meesho.com/search?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.meesho.com%2Fsearch%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 3-5 Days', TRUE, 'Lowest Price ⚡'),
  ((SELECT id FROM new_search), 'Flipkart', 'Tokyo Talkies Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1019.32, 3297.8, 69, 4.1, 1120, 'https://www.flipkart.com/search?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.flipkart.com%2Fsearch%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery', FALSE, 'Super Saver'),
  ((SELECT id FROM new_search), 'Myntra', 'SASSAFRAS Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1079.28, 2848.1, 62, 4.4, 730, 'https://www.myntra.com/Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.myntra.com%2FCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'Express: Get it by Tomorrow', FALSE, 'Lowest Price'),
  ((SELECT id FROM new_search), 'Amazon', 'Symbol Premium Casual Crimson Red / Coral Casual Dresses (Midi (Calf Length))', 1169.22, 2104.6, 44, 4.2, 890, 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery by Tomorrow', FALSE, 'Top Seller'),
  ((SELECT id FROM new_search), 'Ajio', 'TRENDS Woman Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1229.18, 2548.3, 51, 4.2, 410, 'https://www.ajio.com/search/?text=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.ajio.com%2Fsearch%2F%3Ftext%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 2 Days', FALSE, 'Hot Deal'),
  ((SELECT id FROM new_search), 'Amazon', 'VERO MODA Crimson Red / Coral Elegant A-Line Midi Dress with Midi (Calf Length) cut', 1424.05, 2278.48, 37, 4.5, 428, 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Prime 1-Day Delivery', FALSE, 'Amazon's Choice'),
  ((SELECT id FROM new_search), 'H&M', 'H&M Divided Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 2023.65, 2398.4, 15, 4.5, 560, 'https://www2.hm.com/en_in/search-results.html?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww2.hm.com%2Fen_in%2Fsearch-results.html%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'Fast Shipping', FALSE, 'Trending Now'),
  ((SELECT id FROM new_search), 'Zara', 'ZARA Woman Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 3147.9, 3597.6, 12, 4.7, 180, 'https://www.zara.com/in/en/search?searchTerm=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.zara.com%2Fin%2Fen%2Fsearch%3FsearchTerm%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', TRUE, 'Standard 3-4 Days', FALSE, 'Runway Designer');

-- Search Event: Crimson Red / Coral Elegant A-Line Midi Dress (2026-10-14T14:56:14.188099)
WITH new_search AS (
  INSERT INTO searches (costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, summary, source_type)
  VALUES ('Crimson Red / Coral Elegant A-Line Midi Dress', 'Crimson Red / Coral', 'Midi (Calf Length)', 'Casual Dresses', 'Cotton Blend', 'Minimalist Solid', 'Contemporary Casual', 'Detected Crimson Red / Coral costume in Midi (Calf Length) styling with Cotton Blend fabric.', 'upload')
  RETURNING id
)
INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
VALUES
  ((SELECT id FROM new_search), 'Meesho', 'StyleNest Boutique Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 869.42, 2098.6, 58, 4.0, 320, 'https://www.meesho.com/search?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.meesho.com%2Fsearch%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 3-5 Days', TRUE, 'Lowest Price ⚡'),
  ((SELECT id FROM new_search), 'Flipkart', 'Tokyo Talkies Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1019.32, 3297.8, 69, 4.1, 1120, 'https://www.flipkart.com/search?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.flipkart.com%2Fsearch%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery', FALSE, 'Super Saver'),
  ((SELECT id FROM new_search), 'Myntra', 'SASSAFRAS Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1079.28, 2848.1, 62, 4.4, 730, 'https://www.myntra.com/Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.myntra.com%2FCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'Express: Get it by Tomorrow', FALSE, 'Lowest Price'),
  ((SELECT id FROM new_search), 'Amazon', 'Amazon Brand - Inkast Casual Crimson Red / Coral Casual Dresses (Midi (Calf Length))', 1169.22, 2104.6, 44, 4.2, 890, 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery by Tomorrow', FALSE, 'Top Seller'),
  ((SELECT id FROM new_search), 'Ajio', 'TRENDS Woman Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1229.18, 2548.3, 51, 4.2, 410, 'https://www.ajio.com/search/?text=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.ajio.com%2Fsearch%2F%3Ftext%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 2 Days', FALSE, 'Hot Deal'),
  ((SELECT id FROM new_search), 'Amazon', 'VERO MODA Crimson Red / Coral Elegant A-Line Midi Dress with Midi (Calf Length) cut', 1424.05, 2278.48, 37, 4.5, 428, 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Prime 1-Day Delivery', FALSE, 'Amazon's Choice'),
  ((SELECT id FROM new_search), 'H&M', 'H&M Divided Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 2023.65, 2398.4, 15, 4.5, 560, 'https://www2.hm.com/en_in/search-results.html?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww2.hm.com%2Fen_in%2Fsearch-results.html%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'Fast Shipping', FALSE, 'Trending Now'),
  ((SELECT id FROM new_search), 'Zara', 'ZARA Woman Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 3147.9, 3597.6, 12, 4.7, 180, 'https://www.zara.com/in/en/search?searchTerm=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.zara.com%2Fin%2Fen%2Fsearch%3FsearchTerm%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', TRUE, 'Standard 3-4 Days', FALSE, 'Runway Designer');

-- Search Event: Crimson Red / Coral Elegant A-Line Midi Dress (2026-10-14T15:21:29.776691)
WITH new_search AS (
  INSERT INTO searches (costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, summary, source_type)
  VALUES ('Crimson Red / Coral Elegant A-Line Midi Dress', 'Crimson Red / Coral', 'Midi (Calf Length)', 'Casual Dresses', 'Cotton Blend', 'Minimalist Solid', 'Contemporary Casual', 'Detected Crimson Red / Coral costume in Midi (Calf Length) styling with Cotton Blend fabric.', 'upload')
  RETURNING id
)
INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
VALUES
  ((SELECT id FROM new_search), 'Meesho', 'StyleNest Boutique Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 869.42, 2098.6, 58, 4.0, 320, 'https://www.meesho.com/search?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.meesho.com%2Fsearch%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 3-5 Days', TRUE, 'Lowest Price ⚡'),
  ((SELECT id FROM new_search), 'Flipkart', 'Tokyo Talkies Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1019.32, 3297.8, 69, 4.1, 1120, 'https://www.flipkart.com/search?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.flipkart.com%2Fsearch%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery', FALSE, 'Super Saver'),
  ((SELECT id FROM new_search), 'Myntra', 'SASSAFRAS Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1079.28, 2848.1, 62, 4.4, 730, 'https://www.myntra.com/Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.myntra.com%2FCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'Express: Get it by Tomorrow', FALSE, 'Lowest Price'),
  ((SELECT id FROM new_search), 'Amazon', 'Harpa Casual Crimson Red / Coral Casual Dresses (Midi (Calf Length))', 1169.22, 2104.6, 44, 4.2, 890, 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery by Tomorrow', FALSE, 'Top Seller'),
  ((SELECT id FROM new_search), 'Ajio', 'TRENDS Woman Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 1229.18, 2548.3, 51, 4.2, 410, 'https://www.ajio.com/search/?text=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.ajio.com%2Fsearch%2F%3Ftext%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 2 Days', FALSE, 'Hot Deal'),
  ((SELECT id FROM new_search), 'Amazon', 'ONLY Crimson Red / Coral Elegant A-Line Midi Dress with Midi (Calf Length) cut', 1424.05, 2278.48, 37, 4.5, 428, 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Prime 1-Day Delivery', FALSE, 'Amazon's Choice'),
  ((SELECT id FROM new_search), 'H&M', 'H&M Divided Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 2023.65, 2398.4, 15, 4.5, 560, 'https://www2.hm.com/en_in/search-results.html?q=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww2.hm.com%2Fen_in%2Fsearch-results.html%3Fq%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'Fast Shipping', FALSE, 'Trending Now'),
  ((SELECT id FROM new_search), 'Zara', 'ZARA Woman Crimson Red / Coral Elegant A-Line Midi Dress (Midi (Calf Length))', 3147.9, 3597.6, 12, 4.7, 180, 'https://www.zara.com/in/en/search?searchTerm=Crimson+Red+%2F+Coral+Crimson+Red+%2F+Coral+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.zara.com%2Fin%2Fen%2Fsearch%3FsearchTerm%3DCrimson%2BRed%2B%252F%2BCoral%2BCrimson%2BRed%2B%252F%2BCoral%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', TRUE, 'Standard 3-4 Days', FALSE, 'Runway Designer');

-- Search Event: Pastel Sky Blue Elegant A-Line Midi Dress (2026-10-14T15:21:53.147626)
WITH new_search AS (
  INSERT INTO searches (costume_name, detected_color, detected_length, detected_category, detected_fabric, detected_pattern, detected_style, summary, source_type)
  VALUES ('Pastel Sky Blue Elegant A-Line Midi Dress', 'Pastel Sky Blue', 'Midi (Calf Length)', 'Casual Dresses', 'Cotton Blend', 'Minimalist Solid', 'Contemporary Casual', 'Detected Pastel Sky Blue costume in Midi (Calf Length) styling with Cotton Blend fabric.', 'upload')
  RETURNING id
)
INSERT INTO products (search_id, store_name, title, price, original_price, discount_percent, rating, review_count, product_url, affiliate_url, image_url, in_stock, delivery_info, is_lowest_price, badge)
VALUES
  ((SELECT id FROM new_search), 'Meesho', 'StyleNest Boutique Pastel Sky Blue Elegant A-Line Midi Dress (Midi (Calf Length))', 869.42, 2098.6, 58, 4.0, 320, 'https://www.meesho.com/search?q=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.meesho.com%2Fsearch%3Fq%3DPastel%2BSky%2BBlue%2BPastel%2BSky%2BBlue%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 3-5 Days', TRUE, 'Lowest Price ⚡'),
  ((SELECT id FROM new_search), 'Flipkart', 'Tokyo Talkies Pastel Sky Blue Elegant A-Line Midi Dress (Midi (Calf Length))', 1019.32, 3297.8, 69, 4.1, 1120, 'https://www.flipkart.com/search?q=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.flipkart.com%2Fsearch%3Fq%3DPastel%2BSky%2BBlue%2BPastel%2BSky%2BBlue%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery', FALSE, 'Super Saver'),
  ((SELECT id FROM new_search), 'Myntra', 'SASSAFRAS Pastel Sky Blue Elegant A-Line Midi Dress (Midi (Calf Length))', 1079.28, 2848.1, 62, 4.4, 730, 'https://www.myntra.com/Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.myntra.com%2FPastel%2BSky%2BBlue%2BPastel%2BSky%2BBlue%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'Express: Get it by Tomorrow', FALSE, 'Lowest Price'),
  ((SELECT id FROM new_search), 'Amazon', 'Amazon Brand - Inkast Casual Pastel Sky Blue Casual Dresses (Midi (Calf Length))', 1169.22, 2104.6, 44, 4.2, 890, 'https://www.amazon.in/s?k=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Delivery by Tomorrow', FALSE, 'Top Seller'),
  ((SELECT id FROM new_search), 'Ajio', 'TRENDS Woman Pastel Sky Blue Elegant A-Line Midi Dress (Midi (Calf Length))', 1229.18, 2548.3, 51, 4.2, 410, 'https://www.ajio.com/search/?text=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.ajio.com%2Fsearch%2F%3Ftext%3DPastel%2BSky%2BBlue%2BPastel%2BSky%2BBlue%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80', TRUE, 'Delivery in 2 Days', FALSE, 'Hot Deal'),
  ((SELECT id FROM new_search), 'Amazon', 'VERO MODA Pastel Sky Blue Elegant A-Line Midi Dress with Midi (Calf Length) cut', 1424.05, 2278.48, 37, 4.5, 428, 'https://www.amazon.in/s?k=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://www.amazon.in/s?k=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress+Midi+%28Calf+Length%29&tag=fashionsearch-21', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'FREE Prime 1-Day Delivery', FALSE, 'Amazon's Choice'),
  ((SELECT id FROM new_search), 'H&M', 'H&M Divided Pastel Sky Blue Elegant A-Line Midi Dress (Midi (Calf Length))', 2023.65, 2398.4, 15, 4.5, 560, 'https://www2.hm.com/en_in/search-results.html?q=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww2.hm.com%2Fen_in%2Fsearch-results.html%3Fq%3DPastel%2BSky%2BBlue%2BPastel%2BSky%2BBlue%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', TRUE, 'Fast Shipping', FALSE, 'Trending Now'),
  ((SELECT id FROM new_search), 'Zara', 'ZARA Woman Pastel Sky Blue Elegant A-Line Midi Dress (Midi (Calf Length))', 3147.9, 3597.6, 12, 4.7, 180, 'https://www.zara.com/in/en/search?searchTerm=Pastel+Sky+Blue+Pastel+Sky+Blue+Elegant+A-Line+Midi+Dress', 'https://linksredirect.com/?pub_id=194820&subid=fashionsearch&url=https%3A%2F%2Fwww.zara.com%2Fin%2Fen%2Fsearch%3FsearchTerm%3DPastel%2BSky%2BBlue%2BPastel%2BSky%2BBlue%2BElegant%2BA-Line%2BMidi%2BDress', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80', TRUE, 'Standard 3-4 Days', FALSE, 'Runway Designer');
