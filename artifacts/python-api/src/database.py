import os
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get("DATABASE_URL", "")

def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS listings (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            price REAL NOT NULL,
            location TEXT NOT NULL,
            contact TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS vendor_submissions (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            submission_type TEXT NOT NULL,
            service_category TEXT,
            service_description TEXT,
            room_title TEXT,
            room_price REAL,
            room_location TEXT,
            room_type TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)
    cur.execute("ALTER TABLE vendor_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS site_config (
            id SERIAL PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW()
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS services_config (
            id SERIAL PRIMARY KEY,
            category TEXT NOT NULL,
            name TEXT NOT NULL,
            active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS bike_rentals (
            id SERIAL PRIMARY KEY,
            vendor_name TEXT NOT NULL,
            contact TEXT NOT NULL,
            bike_name TEXT NOT NULL,
            price_per_day REAL NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            availability BOOLEAN DEFAULT TRUE,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS tiffin_services (
            id SERIAL PRIMARY KEY,
            vendor_name TEXT NOT NULL,
            contact TEXT NOT NULL,
            plan_type TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            location TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    # Site config seed
    cur.execute("""
        INSERT INTO site_config (key, value)
        VALUES
            ('phone', '+91-9999999999'),
            ('whatsapp', '919999999999'),
            ('location', 'Bidholi, Dehradun'),
            ('tagline', 'Trusted local services near UPES'),
            ('admin_password', 'admin123')
        ON CONFLICT (key) DO NOTHING
    """)

    # Services seed
    cur.execute("SELECT COUNT(*) as cnt FROM services_config")
    row = cur.fetchone()
    if row["cnt"] == 0:
        services = [
            ("repairs", "Electrician"),
            ("repairs", "Plumber"),
            ("repairs", "Carpenter"),
            ("cleaning", "Home Cleaning"),
            ("cleaning", "Sofa & Carpet Cleaning"),
            ("cleaning", "Kitchen Deep Clean"),
            ("painting", "Wall Painting"),
            ("painting", "Waterproofing"),
            ("moving", "Packers & Movers"),
            ("moving", "Bike Transport"),
            ("moving", "Mini Truck Rental"),
        ]
        cur.executemany(
            "INSERT INTO services_config (category, name) VALUES (%s, %s)",
            services
        )

    # Seed demo bikes if empty
    cur.execute("SELECT COUNT(*) as cnt FROM bike_rentals")
    brow = cur.fetchone()
    if brow["cnt"] == 0:
        bikes = [
            ("Demo Vendor", "9999999999", "Hero Splendor Plus", 200.0, "Near UPES Gate, Bidholi",
             "Well maintained bike, full tank provided", True, "active"),
            ("Demo Vendor", "9999999999", "Honda Activa 6G", 250.0, "Kandoli Chowk, Bidholi",
             "Automatic scooter, ideal for city rides", True, "active"),
        ]
        cur.executemany(
            """INSERT INTO bike_rentals
               (vendor_name,contact,bike_name,price_per_day,location,description,availability,status)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
            bikes
        )

    # Seed demo tiffin if empty
    cur.execute("SELECT COUNT(*) as cnt FROM tiffin_services")
    trow = cur.fetchone()
    if trow["cnt"] == 0:
        tiffins = [
            ("Ghar Ka Khana", "9888888888", "1_time", 60.0,
             "Dinner only — 2 chapati, sabzi, dal, rice", "Bidholi Campus Area", "active"),
            ("Ghar Ka Khana", "9888888888", "2_time", 110.0,
             "Lunch + Dinner — full home-style meal", "Bidholi Campus Area", "active"),
            ("Ghar Ka Khana", "9888888888", "3_time", 150.0,
             "Breakfast + Lunch + Dinner — complete daily meal", "Bidholi Campus Area", "active"),
        ]
        cur.executemany(
            """INSERT INTO tiffin_services
               (vendor_name,contact,plan_type,price,description,location,status)
               VALUES (%s,%s,%s,%s,%s,%s,%s)""",
            tiffins
        )

    conn.commit()
    cur.close()
    conn.close()
