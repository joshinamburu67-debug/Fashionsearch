# Configuration and Database Setup for Fashionsearch
import os
import json
from datetime import datetime
from typing import Generator
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from dotenv import load_dotenv

import urllib.parse
load_dotenv()

# Database URLs
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "post@@")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")
PG_DB = os.getenv("PG_DB", "Fashionsearch")

encoded_password = urllib.parse.quote_plus(PG_PASSWORD)
raw_db_url = os.getenv("DATABASE_URL")

if raw_db_url:
    if raw_db_url.startswith("postgres://"):
        DATABASE_URL = raw_db_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+"):
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    else:
        DATABASE_URL = raw_db_url

    # Auto-add sslmode=require for Render remote databases if not present
    if ("render.com" in DATABASE_URL or "dpg-" in DATABASE_URL) and "sslmode" not in DATABASE_URL:
        separator = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL += f"{separator}sslmode=require"
else:
    DATABASE_URL = f"postgresql+psycopg2://{PG_USER}:{encoded_password}@{PG_HOST}:{PG_PORT}/{PG_DB}"

Base = declarative_base()

# Attempt connection to PostgreSQL 17, with graceful fallback to local SQLite
engine = None
SessionLocal = None
ACTIVE_DB_TYPE = "sqlite"

try:
    # Test PostgreSQL connection with 10s timeout
    pg_test_engine = create_engine(
        DATABASE_URL,
        connect_args={"connect_timeout": 10},
        pool_pre_ping=True
    )
    with pg_test_engine.connect() as conn:
        pass
    engine = pg_test_engine
    ACTIVE_DB_TYPE = "postgresql_17"
    print(">>> Successfully connected to PostgreSQL 17 database:", PG_DB)
except Exception as e:
    # Fallback to local SQLite while generating PostgreSQL 17 SQL dumps
    sqlite_url = "sqlite:///./Fashionsearch.db"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    ACTIVE_DB_TYPE = "sqlite_fallback"
    print(f">>> Note: PostgreSQL 17 connection ({e}) not ready with default credentials; using SQLite fallback while maintaining full PostgreSQL 17 compatibility and export.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
