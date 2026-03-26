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
    cur.execute("""
        ALTER TABLE vendor_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'
    """)

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
        INSERT INTO site_config (key, value)
        VALUES
            ('phone', '+91-9999999999'),
            ('whatsapp', '919999999999'),
            ('location', 'Bidholi, Dehradun'),
            ('tagline', 'Trusted local services near UPES'),
            ('admin_password', 'admin123')
        ON CONFLICT (key) DO NOTHING
    """)

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
            ("moving", "Packers & Movers"),
            ("moving", "Bike Transport"),
            ("moving", "Mini Truck Rental"),
        ]
        cur.executemany(
            "INSERT INTO services_config (category, name) VALUES (%s, %s)",
            services
        )

    conn.commit()
    cur.close()
    conn.close()
