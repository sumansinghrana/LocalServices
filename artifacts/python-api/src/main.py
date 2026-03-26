import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import Optional
from datetime import datetime

from database import get_connection, init_db
from models import (
    BookingCreate, ListingCreate, VendorSubmitInput,
    SiteConfigUpdate, ServiceCreate,
    PasswordVerify, PasswordChange,
    BikeRentalCreate, TiffinCreate,
)

app = FastAPI(title="LocalHelps.in API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()


# ─── Health ──────────────────────────────────────────────────────────────────

@app.get("/api/healthz")
def health():
    return {"status": "ok"}


# ─── Bookings ─────────────────────────────────────────────────────────────────

@app.post("/api/bookings")
def create_booking(body: BookingCreate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO bookings (name, phone, address, service, date) VALUES (%s,%s,%s,%s,%s) RETURNING *",
        (body.name, body.phone, body.address, body.service, body.date)
    )
    row = dict(cur.fetchone())
    conn.commit(); cur.close(); conn.close()
    return _camel(row)

@app.get("/api/bookings")
def list_bookings():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM bookings ORDER BY created_at DESC")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.delete("/api/bookings/{id}")
def delete_booking(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM bookings WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Booking not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}


# ─── Listings ─────────────────────────────────────────────────────────────────

@app.post("/api/listings")
def create_listing(body: ListingCreate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO listings (title,type,price,location,contact,description,image_url) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING *",
        (body.title, body.type, body.price, body.location, body.contact, body.description, body.imageUrl)
    )
    row = dict(cur.fetchone())
    conn.commit(); cur.close(); conn.close()
    return _camel(row)

@app.get("/api/listings")
def list_listings(type: Optional[str] = None, minPrice: Optional[float] = None, maxPrice: Optional[float] = None):
    conn = get_connection()
    cur = conn.cursor()
    query = "SELECT * FROM listings WHERE 1=1"
    params = []
    if type:
        query += " AND type=%s"; params.append(type)
    if minPrice is not None:
        query += " AND price>=%s"; params.append(minPrice)
    if maxPrice is not None:
        query += " AND price<=%s"; params.append(maxPrice)
    query += " ORDER BY created_at DESC"
    cur.execute(query, params)
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.delete("/api/listings/{id}")
def delete_listing(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM listings WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Listing not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}


# ─── Vendor Submissions ───────────────────────────────────────────────────────

@app.post("/api/vendor-submit")
def vendor_submit(body: VendorSubmitInput):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO vendor_submissions
           (name,phone,submission_type,service_category,service_description,
            room_title,room_price,room_location,room_type)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (body.name, body.phone, body.submissionType, body.serviceCategory,
         body.serviceDescription, body.roomTitle, body.roomPrice,
         body.roomLocation, body.roomType)
    )
    conn.commit(); cur.close(); conn.close()
    return {"success": True, "message": "Submission received. We will contact you soon!"}

@app.get("/api/vendor-submissions")
def list_vendor_submissions():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM vendor_submissions ORDER BY created_at DESC")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.delete("/api/vendor-submissions/{id}")
def delete_vendor_submission(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM vendor_submissions WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Submission not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.post("/api/vendor-submissions/{id}/approve")
def approve_vendor(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE vendor_submissions SET status='approved' WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Submission not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.post("/api/vendor-submissions/{id}/reject")
def reject_vendor(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE vendor_submissions SET status='rejected' WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Submission not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.get("/api/providers")
def list_providers(category: Optional[str] = None):
    conn = get_connection()
    cur = conn.cursor()
    query = "SELECT * FROM vendor_submissions WHERE status='approved' AND submission_type='service'"
    params = []
    if category:
        query += " AND service_category=%s"
        params.append(category)
    query += " ORDER BY created_at DESC"
    cur.execute(query, params)
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows


# ─── Site Config ──────────────────────────────────────────────────────────────

@app.get("/api/config")
def get_config():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM site_config")
    data = {row["key"]: row["value"] for row in cur.fetchall()}
    cur.close(); conn.close()
    return data

@app.put("/api/config")
def update_config(body: SiteConfigUpdate):
    conn = get_connection()
    cur = conn.cursor()
    updates = body.model_dump(exclude_none=True)
    for key, value in updates.items():
        cur.execute(
            "INSERT INTO site_config (key,value) VALUES (%s,%s) ON CONFLICT (key) DO UPDATE SET value=%s, updated_at=NOW()",
            (key, value, value)
        )
    conn.commit(); cur.close(); conn.close()
    return {"success": True}


# ─── Services Config ──────────────────────────────────────────────────────────

@app.get("/api/services-config")
def get_services():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM services_config WHERE active=TRUE ORDER BY category, name")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.get("/api/services-config/categories")
def get_categories():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT category FROM services_config WHERE active=TRUE ORDER BY category")
    rows = [r["category"] for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.post("/api/services-config")
def add_service(body: ServiceCreate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO services_config (category, name) VALUES (%s,%s) RETURNING *",
        (body.category, body.name)
    )
    row = _camel(dict(cur.fetchone()))
    conn.commit(); cur.close(); conn.close()
    return row

@app.delete("/api/services-config/{id}")
def delete_service(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE services_config SET active=FALSE WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Service not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}


# ─── Admin Password ───────────────────────────────────────────────────────────

@app.post("/api/admin/verify")
def verify_password(body: PasswordVerify):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT value FROM site_config WHERE key='admin_password'")
    row = cur.fetchone()
    cur.close(); conn.close()
    if not row or row["value"] != body.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"success": True}

@app.post("/api/admin/change-password")
def change_password(body: PasswordChange):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT value FROM site_config WHERE key='admin_password'")
    row = cur.fetchone()
    if not row or row["value"] != body.currentPassword:
        cur.close(); conn.close()
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    cur.execute(
        "UPDATE site_config SET value=%s, updated_at=NOW() WHERE key='admin_password'",
        (body.newPassword,)
    )
    conn.commit(); cur.close(); conn.close()
    return {"success": True, "message": "Password updated successfully"}


# ─── Bike Rentals ─────────────────────────────────────────────────────────────

@app.get("/api/bikes")
def list_bikes():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM bike_rentals WHERE status='active' AND availability=TRUE ORDER BY created_at DESC")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.get("/api/bikes/all")
def list_all_bikes():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM bike_rentals ORDER BY created_at DESC")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.post("/api/bikes")
def create_bike(body: BikeRentalCreate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO bike_rentals (vendor_name,contact,bike_name,price_per_day,location,description)
           VALUES (%s,%s,%s,%s,%s,%s) RETURNING *""",
        (body.vendorName, body.contact, body.bikeName, body.pricePerDay, body.location, body.description)
    )
    row = _camel(dict(cur.fetchone()))
    conn.commit(); cur.close(); conn.close()
    return row

@app.post("/api/bikes/{id}/approve")
def approve_bike(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE bike_rentals SET status='active' WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Bike not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.post("/api/bikes/{id}/reject")
def reject_bike(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE bike_rentals SET status='rejected' WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Bike not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.delete("/api/bikes/{id}")
def delete_bike(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM bike_rentals WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Bike not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}


# ─── Tiffin Services ──────────────────────────────────────────────────────────

@app.get("/api/tiffin")
def list_tiffin():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tiffin_services WHERE status='active' ORDER BY price ASC")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.get("/api/tiffin/all")
def list_all_tiffin():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tiffin_services ORDER BY created_at DESC")
    rows = [_camel(dict(r)) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows

@app.post("/api/tiffin")
def create_tiffin(body: TiffinCreate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO tiffin_services (vendor_name,contact,plan_type,price,description,location)
           VALUES (%s,%s,%s,%s,%s,%s) RETURNING *""",
        (body.vendorName, body.contact, body.planType, body.price, body.description, body.location)
    )
    row = _camel(dict(cur.fetchone()))
    conn.commit(); cur.close(); conn.close()
    return row

@app.post("/api/tiffin/{id}/approve")
def approve_tiffin(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE tiffin_services SET status='active' WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Tiffin not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.post("/api/tiffin/{id}/reject")
def reject_tiffin(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE tiffin_services SET status='rejected' WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Tiffin not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}

@app.delete("/api/tiffin/{id}")
def delete_tiffin(id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM tiffin_services WHERE id=%s RETURNING id", (id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Tiffin not found")
    conn.commit(); cur.close(); conn.close()
    return {"success": True}


# ─── Sitemap ──────────────────────────────────────────────────────────────────

@app.get("/sitemap.xml")
def sitemap():
    base = "https://localhelps.in"
    urls = [
        "/", "/pg-hostel", "/book", "/vendor-submit",
        "/services/repairs", "/services/cleaning",
        "/services/painting", "/services/moving",
        "/bike-rental", "/tiffin",
    ]
    items = "\n".join(
        f"""  <url><loc>{base}{u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>"""
        for u in urls
    )
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{items}
</urlset>"""
    return Response(content=xml, media_type="application/xml")


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])

def _camel(row: dict) -> dict:
    return {
        _to_camel(k): (v.isoformat() if isinstance(v, datetime) else v)
        for k, v in row.items()
    }
