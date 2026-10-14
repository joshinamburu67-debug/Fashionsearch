# Fashionsearch 👗🔍

A full-stack mobile-first fashion web application that uses **Gemini Vision AI** to recognize costumes from camera/uploads, extracts costume color, length, silhouette, and compares prices across **Amazon (Amazon Associates)** and **Cuelinks fashion apps** (Myntra, Ajio, Flipkart, Meesho, Zara, H&M).

All data is synchronized and exported to the PostgreSQL 17 file **`Fashionsearch.sql`**.

---

## 🌟 Key Highlights

- **Visual Costume Lens**: Upload a picture or click **"Take a Pic"** to capture directly through the device camera.
- **Gemini Vision AI Integration**: Extracts costume name, color palette with hex swatch, length (Crop, Waist, Knee, Midi, Maxi, Floor-length), fabric, pattern, and style.
- **Multi-Store Price Comparison**:
  - **Amazon Associates**: Search links with affiliate tracking tags (`tag=fashionsearch-21`).
  - **Cuelinks API**: Monetized redirects across **Myntra, Ajio, Flipkart, Meesho, Zara, and H&M**.
  - Highlights lowest price with savings badges and instant "Buy Link" CTA.
- **Custom Loading Screen**:
  - Features the letters **F** and **S** where **S wraps around F as a glowing snake**.
  - **Animated Water Bar**: Realistic liquid waves moving from left to right with sloshing water physics instead of a plain loading line.
- **Site Aesthetics**: Clean, luxury light blue and crisp white palette (`#F0F9FF`, `#E0F2FE`, `#38BDF8`, `#0284C7`, `#FFFFFF`).
- **PostgreSQL 17 Integration**: Automatically writes and syncs all searches and product comparisons into the file named `Fashionsearch.sql`.

---

## 🚀 Running the Project

### 1. Backend (FastAPI)
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Tailwind CSS)
```bash
cd frontend
npm run dev
```
Open in browser: `http://localhost:5173`

---

## 🗄️ Database (PostgreSQL 17)

All schema definitions, tables (`searches`, `products`), indexes, and costume search records are exported directly into:
```
Fashionsearch.sql
```
To import this dump into your local PostgreSQL 17 database:
```bash
psql -U postgres -d Fashionsearch -f Fashionsearch.sql
```
