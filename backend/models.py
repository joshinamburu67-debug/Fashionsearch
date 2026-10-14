from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class SearchRecord(Base):
    __tablename__ = "searches"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    image_url = Column(Text, nullable=True)
    costume_name = Column(String(255), index=True)
    detected_color = Column(String(100))
    detected_length = Column(String(100))
    detected_category = Column(String(100))
    detected_fabric = Column(String(100), nullable=True)
    detected_pattern = Column(String(100), nullable=True)
    detected_style = Column(String(100), nullable=True)
    detected_gender = Column(String(50), default="Unisex")
    color_hex = Column(String(50), default="#38BDF8")
    summary = Column(Text, nullable=True)
    source_type = Column(String(50), default="upload")  # "upload", "camera", "sample"

    # Relationships
    products = relationship("ProductResult", back_populates="search", cascade="all, delete-orphan")

class ProductResult(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey("searches.id", ondelete="CASCADE"), index=True)
    store_name = Column(String(100), index=True)  # Amazon, Myntra, Ajio, Flipkart, Zara, H&M
    title = Column(String(300))
    price = Column(Float)
    original_price = Column(Float, nullable=True)
    discount_percent = Column(Integer, default=0)
    rating = Column(Float, default=4.2)
    review_count = Column(Integer, default=120)
    product_url = Column(Text)
    affiliate_url = Column(Text)
    image_url = Column(Text)
    in_stock = Column(Boolean, default=True)
    delivery_info = Column(String(100), default="Delivery in 2-4 days")
    is_lowest_price = Column(Boolean, default=False)
    badge = Column(String(50), nullable=True)  # "Best Value", "Lowest Price", "Top Rated"

    search = relationship("SearchRecord", back_populates="products")
