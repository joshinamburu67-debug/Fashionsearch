import os
import io
import base64
import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

from database import engine, Base, get_db, ACTIVE_DB_TYPE, PG_DB
from models import SearchRecord, ProductResult
from services.gemini_service import analyze_costume_with_gemini
from services.price_comparison import compare_fashion_prices
from data_exporter import init_postgres_file, append_search_to_postgres_file, SQL_FILE_PATH

# Create DB tables
Base.metadata.create_all(bind=engine)
# Initialize the PostgreSQL 17 file
init_postgres_file()

# Uploads directory
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Fashionsearch API",
    description="Mobile-first Costume Image Recognition and Multi-Store Price Comparison (Amazon + Cuelinks)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images statically
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def read_root():
    return {
        "app": "Fashionsearch",
        "status": "online",
        "database": ACTIVE_DB_TYPE,
        "postgres_17_file": "Fashionsearch.sql",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    sql_size = os.path.getsize(SQL_FILE_PATH) if os.path.exists(SQL_FILE_PATH) else 0
    return {
        "status": "healthy",
        "db_engine": ACTIVE_DB_TYPE,
        "database_name": PG_DB,
        "postgres_17_export_file": SQL_FILE_PATH,
        "sql_file_size_bytes": sql_size,
        "gemini_configured": True
    }

@app.post("/api/search/upload")
async def search_costume_by_upload(
    file: UploadFile = File(...),
    source_type: str = Form("upload"),  # "upload" or "camera"
    db: Session = Depends(get_db)
):
    """
    Accepts an uploaded image of a costume or photo taken from camera,
    analyzes color, length, and costume name with Gemini Vision AI,
    and returns multi-store price comparisons across Amazon and other fashion apps via Cuelinks.
    """
    try:
        content = await file.read()
        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        saved_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(saved_path, "wb") as f:
            f.write(content)

        image_url = f"/uploads/{unique_filename}"

        # 1. Analyze with Gemini AI
        analysis = await analyze_costume_with_gemini(
            image_bytes=content,
            mime_type=file.content_type or "image/jpeg"
        )

        # 2. Compare Prices across Amazon Associates & Cuelinks Stores
        comparison = compare_fashion_prices(analysis)
        products = comparison["products"]

        # 3. Store in Database
        search_record = SearchRecord(
            image_url=image_url,
            costume_name=analysis.get("costume_name", "Fashion Costume"),
            detected_color=analysis.get("detected_color", "Blue"),
            detected_length=analysis.get("detected_length", "Regular"),
            detected_category=analysis.get("detected_category", "Apparel"),
            detected_fabric=analysis.get("detected_fabric", "Blend"),
            detected_pattern=analysis.get("detected_pattern", "Solid"),
            detected_style=analysis.get("detected_style", "Casual"),
            detected_gender=analysis.get("detected_gender", "Women"),
            color_hex=analysis.get("color_hex", "#38BDF8"),
            summary=analysis.get("summary", ""),
            source_type=source_type
        )
        db.add(search_record)
        db.commit()
        db.refresh(search_record)

        for prod in products:
            p_obj = ProductResult(
                search_id=search_record.id,
                store_name=prod.get("store_name"),
                title=prod.get("title"),
                price=prod.get("price"),
                original_price=prod.get("original_price"),
                discount_percent=prod.get("discount_percent", 0),
                rating=prod.get("rating", 4.2),
                review_count=prod.get("review_count", 100),
                product_url=prod.get("product_url"),
                affiliate_url=prod.get("affiliate_url"),
                image_url=prod.get("image_url"),
                in_stock=prod.get("in_stock", True),
                delivery_info=prod.get("delivery_info", "2-4 days"),
                is_lowest_price=prod.get("is_lowest_price", False),
                badge=prod.get("badge")
            )
            db.add(p_obj)
        db.commit()

        # 4. Upload data into the PostgreSQL 17 file named Fashionsearch.sql
        append_search_to_postgres_file(analysis, products)

        return {
            "search_id": search_record.id,
            "image_url": image_url,
            "costume_analysis": analysis,
            "comparison": comparison
        }

    except Exception as e:
        db.rollback()
        print(f"Upload and search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search/base64")
async def search_costume_by_base64(
    data: dict,
    db: Session = Depends(get_db)
):
    """Handles snapshot taken directly from camera stream as dataURL."""
    try:
        raw_base64 = data.get("image", "")
        source_type = data.get("source_type", "camera")

        if "," in raw_base64:
            header, encoded = raw_base64.split(",", 1)
            mime_type = header.split(";")[0].replace("data:", "")
        else:
            encoded = raw_base64
            mime_type = "image/jpeg"

        image_bytes = base64.b64decode(encoded)
        unique_filename = f"cam_{uuid.uuid4().hex}.jpg"
        saved_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(saved_path, "wb") as f:
            f.write(image_bytes)

        image_url = f"/uploads/{unique_filename}"

        # Analyze with Gemini
        analysis = await analyze_costume_with_gemini(image_bytes, mime_type=mime_type)

        # Price comparison
        comparison = compare_fashion_prices(analysis)
        products = comparison["products"]

        # Store in Database
        search_record = SearchRecord(
            image_url=image_url,
            costume_name=analysis.get("costume_name", "Fashion Costume"),
            detected_color=analysis.get("detected_color", "Blue"),
            detected_length=analysis.get("detected_length", "Regular"),
            detected_category=analysis.get("detected_category", "Apparel"),
            detected_fabric=analysis.get("detected_fabric", "Blend"),
            detected_pattern=analysis.get("detected_pattern", "Solid"),
            detected_style=analysis.get("detected_style", "Casual"),
            detected_gender=analysis.get("detected_gender", "Women"),
            color_hex=analysis.get("color_hex", "#38BDF8"),
            summary=analysis.get("summary", ""),
            source_type=source_type
        )
        db.add(search_record)
        db.commit()
        db.refresh(search_record)

        for prod in products:
            p_obj = ProductResult(
                search_id=search_record.id,
                store_name=prod.get("store_name"),
                title=prod.get("title"),
                price=prod.get("price"),
                original_price=prod.get("original_price"),
                discount_percent=prod.get("discount_percent", 0),
                rating=prod.get("rating", 4.2),
                review_count=prod.get("review_count", 100),
                product_url=prod.get("product_url"),
                affiliate_url=prod.get("affiliate_url"),
                image_url=prod.get("image_url"),
                in_stock=prod.get("in_stock", True),
                delivery_info=prod.get("delivery_info", "2-4 days"),
                is_lowest_price=prod.get("is_lowest_price", False),
                badge=prod.get("badge")
            )
            db.add(p_obj)
        db.commit()

        # Append to PostgreSQL 17 file
        append_search_to_postgres_file(analysis, products)

        return {
            "search_id": search_record.id,
            "image_url": image_url,
            "costume_analysis": analysis,
            "comparison": comparison
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/searches")
def get_searches(db: Session = Depends(get_db)):
    """Fetches recent searches and their product comparisons."""
    searches = db.query(SearchRecord).order_by(SearchRecord.created_at.desc()).limit(15).all()
    results = []
    for s in searches:
        results.append({
            "id": s.id,
            "costume_name": s.costume_name,
            "detected_color": s.detected_color,
            "detected_length": s.detected_length,
            "detected_category": s.detected_category,
            "color_hex": s.color_hex,
            "image_url": s.image_url,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "product_count": len(s.products)
        })
    return results

@app.get("/api/searches/{search_id}")
def get_search_detail(search_id: int, db: Session = Depends(get_db)):
    """Retrieves full details for a previous search."""
    search = db.query(SearchRecord).filter(SearchRecord.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search record not found")
    
    products = []
    for p in search.products:
        products.append({
            "store_name": p.store_name,
            "title": p.title,
            "price": p.price,
            "original_price": p.original_price,
            "discount_percent": p.discount_percent,
            "rating": p.rating,
            "review_count": p.review_count,
            "product_url": p.product_url,
            "affiliate_url": p.affiliate_url,
            "image_url": p.image_url,
            "in_stock": p.in_stock,
            "delivery_info": p.delivery_info,
            "is_lowest_price": p.is_lowest_price,
            "badge": p.badge
        })

    return {
        "id": search.id,
        "costume_name": search.costume_name,
        "detected_color": search.detected_color,
        "detected_length": search.detected_length,
        "detected_category": search.detected_category,
        "detected_fabric": search.detected_fabric,
        "detected_pattern": search.detected_pattern,
        "detected_style": search.detected_style,
        "color_hex": search.color_hex,
        "image_url": search.image_url,
        "products": products
    }

@app.get("/api/sample-costumes")
def get_sample_costumes():
    """Curated demo costume cards that users can tap to test instantly."""
    return [
        {
            "id": "sample-1",
            "costume_name": "Sky Blue Tiered Floral Maxi Dress",
            "detected_color": "Sky Blue",
            "detected_length": "Maxi (Floor/Ankle Length)",
            "detected_category": "Dresses",
            "detected_fabric": "Chiffon / Georgette",
            "detected_pattern": "Floral Botanical",
            "detected_style": "Bohemian Resort",
            "color_hex": "#38BDF8",
            "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
            "summary": "Graceful tiered silhouette in light sky blue with cascading floral accents."
        },
        {
            "id": "sample-2",
            "costume_name": "Vintage Washed Oversized Denim Jacket",
            "detected_color": "Ice Blue Denim",
            "detected_length": "Waist Length",
            "detected_category": "Jackets & Coats",
            "detected_fabric": "100% Cotton Denim",
            "detected_pattern": "Distressed Solid",
            "detected_style": "Urban Streetwear",
            "color_hex": "#0284C7",
            "image_url": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
            "summary": "Classic trucker cut with drop shoulders and metallic button fixtures."
        },
        {
            "id": "sample-3",
            "costume_name": "Emerald Royal Silk Anarkali Gown",
            "detected_color": "Emerald Green",
            "detected_length": "Floor Length",
            "detected_category": "Ethnic Wear",
            "detected_fabric": "Chanderi Silk Blend",
            "detected_pattern": "Gold Zari Weave",
            "detected_style": "Royal Festive",
            "color_hex": "#059669",
            "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
            "summary": "Opulent pleated ethnic gown with intricate embroidery along the neckline."
        },
        {
            "id": "sample-4",
            "costume_name": "Pastel Coral Ribbed Knit Crop Top",
            "detected_color": "Coral Peach",
            "detected_length": "Cropped (Above Navel)",
            "detected_category": "Tops & Tees",
            "detected_fabric": "Ribbed Stretch Cotton",
            "detected_pattern": "Solid Ribbed",
            "detected_style": "Y2K Aesthetic",
            "color_hex": "#F43F5E",
            "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
            "summary": "Fitted sleeveless crop top paired with high-waist aesthetic bottom."
        }
    ]

@app.get("/api/database/download-sql")
def download_sql_file():
    """Provides direct download of the PostgreSQL 17 Fashionsearch.sql file."""
    if not os.path.exists(SQL_FILE_PATH):
        init_postgres_file()
    return FileResponse(
        path=SQL_FILE_PATH,
        filename="Fashionsearch.sql",
        media_type="application/sql"
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)

