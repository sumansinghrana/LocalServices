-- ============================================================
-- LocalServices Hub — Full PostgreSQL Database Backup
-- Source: localhelps.in (Production)
-- Generated: 2026-03-26
-- Import: psql -U postgres -d localservices -f backup.sql
-- ============================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================
-- DROP existing tables (safe clean import)
-- ============================================================

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS vendor_submissions CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS services_config CASCADE;
DROP TABLE IF EXISTS bike_rentals CASCADE;
DROP TABLE IF EXISTS tiffin_services CASCADE;

-- ============================================================
-- CREATE TABLES
-- ============================================================

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    contact TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE vendor_submissions (
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
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    status TEXT
);

CREATE TABLE site_config (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE services_config (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE bike_rentals (
    id SERIAL PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    bike_name TEXT NOT NULL,
    price_per_day REAL NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    availability BOOLEAN DEFAULT TRUE,
    status TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE tiffin_services (
    id SERIAL PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    plan_type TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    status TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INSERT DATA
-- ============================================================

-- bookings (1 row)
INSERT INTO bookings (id, name, phone, address, service, date, created_at) VALUES
(1, 'SUMAN', '99958883102', '1 rooms and 1 kitchen', 'Bathroom Deep Cleaning', '2026-03-27', '2026-03-26 08:03:58.732112');

-- listings (3 rows)
INSERT INTO listings (id, title, type, price, location, contact, description, image_url, created_at) VALUES
(3, 'Rooms available  1RK, 1BHK', 'room', 12000, 'Bidholi, Near Bhatt restaurant ', '9958883102', NULL, NULL, '2026-03-25 10:16:39.038137'),
(4, 'Independent house 2BHK', 'room', 22000, 'Bidholi , Near Bhatt restaurant ', '9958883102', NULL, NULL, '2026-03-25 10:16:43.579392'),
(5, '2BHK independent ', 'room', 25000, '', '9958883102', NULL, NULL, '2026-03-26 08:10:10.204381');

-- vendor_submissions (2 rows)
INSERT INTO vendor_submissions (id, name, phone, submission_type, service_category, service_description, room_title, room_price, room_location, room_type, created_at, status) VALUES
(1, 'Suman Rana', '9958883102', 'room', NULL, NULL, 'Rooms available  1RK, 1BHK', 12000, 'Bidholi, Near Bhatt restaurant ', 'room', '2026-03-25 09:39:04.439673', 'pending'),
(2, 'Suman Rana', '9958883102', 'room', 'other', NULL, 'Independent house 2BHK', 22000, 'Bidholi , Near Bhatt restaurant ', 'room', '2026-03-25 09:40:11.29763', 'pending');

-- site_config (5 rows)
INSERT INTO site_config (id, key, value, updated_at) VALUES
(1, 'phone', '9958883102', '2026-03-25 09:25:51.135039'),
(2, 'whatsapp', '919958883102', '2026-03-25 09:25:51.186098'),
(3, 'location', 'Bidholi Dehradun Near UPES Collage', '2026-03-25 09:25:51.228039'),
(4, 'tagline', '', '2026-03-25 09:25:51.269221'),
(81, 'admin_password', 'admin123', '2026-03-26 07:19:31.547108');

-- services_config (14 rows)
INSERT INTO services_config (id, category, name, active, created_at) VALUES
(1,  'repairs',  'Electrician Visit',       TRUE, '2026-03-25 09:28:39.374586'),
(2,  'repairs',  'Plumber Visit',            TRUE, '2026-03-25 09:28:53.891917'),
(3,  'repairs',  'Carpenter Visit',          TRUE, '2026-03-25 09:29:05.622917'),
(4,  'repairs',  'Fan Installation',         TRUE, '2026-03-25 09:29:13.057957'),
(5,  'repairs',  'Geyser Repair',            TRUE, '2026-03-25 09:29:19.677205'),
(6,  'repairs',  'RO Service',               TRUE, '2026-03-25 09:29:28.946458'),
(7,  'repairs',  'Furniture Assembly',       TRUE, '2026-03-25 09:29:35.337354'),
(8,  'cleaning', 'Bathroom Deep Cleaning',   TRUE, '2026-03-25 09:30:17.820169'),
(9,  'cleaning', 'Kitchen Deep Cleaning',    TRUE, '2026-03-25 09:30:23.849216'),
(10, 'cleaning', 'Full Home Cleaning',       TRUE, '2026-03-25 09:30:32.085877'),
(11, 'cleaning', 'room Cleaning',            TRUE, '2026-03-25 09:30:56.125560'),
(12, 'painting', 'Full Home Painting',       TRUE, '2026-03-25 09:31:28.526434'),
(13, 'painting', 'Few Walls Painting',       TRUE, '2026-03-25 09:31:37.940850'),
(14, 'painting', 'Waterproofing Solutions',  TRUE, '2026-03-25 09:31:48.036760');

-- bike_rentals (2 rows)
INSERT INTO bike_rentals (id, vendor_name, contact, bike_name, price_per_day, location, description, availability, status, created_at) VALUES
(1, 'Demo Vendor', '9999999999', 'Hero Splendor Plus', 200, 'Near UPES Gate, Bidholi', 'Well maintained bike, full tank provided', TRUE, 'active', '2026-03-26 09:19:32.907081'),
(2, 'Demo Vendor', '9999999999', 'Honda Activa 6G',    250, 'Kandoli Chowk, Bidholi',  'Automatic scooter, ideal for city rides',  TRUE, 'active', '2026-03-26 09:19:32.907081');

-- tiffin_services (3 rows)
INSERT INTO tiffin_services (id, vendor_name, contact, plan_type, price, description, location, status, created_at) VALUES
(1, 'Ghar Ka Khana', '9888888888', '1_time', 60,  'Dinner only — 2 chapati, sabzi, dal, rice',           'Bidholi Campus Area', 'active', '2026-03-26 09:19:32.907081'),
(2, 'Ghar Ka Khana', '9888888888', '2_time', 110, 'Lunch + Dinner — full home-style meal',                'Bidholi Campus Area', 'active', '2026-03-26 09:19:32.907081'),
(3, 'Ghar Ka Khana', '9888888888', '3_time', 150, 'Breakfast + Lunch + Dinner — complete daily meal',     'Bidholi Campus Area', 'active', '2026-03-26 09:19:32.907081');

-- ============================================================
-- RESET SEQUENCES (so next INSERT gets the correct next ID)
-- ============================================================

SELECT setval('bookings_id_seq',          (SELECT MAX(id) FROM bookings));
SELECT setval('listings_id_seq',          (SELECT MAX(id) FROM listings));
SELECT setval('vendor_submissions_id_seq', (SELECT MAX(id) FROM vendor_submissions));
SELECT setval('site_config_id_seq',        (SELECT MAX(id) FROM site_config));
SELECT setval('services_config_id_seq',    (SELECT MAX(id) FROM services_config));
SELECT setval('bike_rentals_id_seq',       (SELECT MAX(id) FROM bike_rentals));
SELECT setval('tiffin_services_id_seq',    (SELECT MAX(id) FROM tiffin_services));

-- ============================================================
-- VERIFY (optional — shows row counts after import)
-- ============================================================

SELECT 'bookings'          AS table_name, COUNT(*) AS rows FROM bookings
UNION ALL
SELECT 'listings',          COUNT(*) FROM listings
UNION ALL
SELECT 'vendor_submissions', COUNT(*) FROM vendor_submissions
UNION ALL
SELECT 'site_config',        COUNT(*) FROM site_config
UNION ALL
SELECT 'services_config',    COUNT(*) FROM services_config
UNION ALL
SELECT 'bike_rentals',       COUNT(*) FROM bike_rentals
UNION ALL
SELECT 'tiffin_services',    COUNT(*) FROM tiffin_services
ORDER BY table_name;

-- ============================================================
-- END OF BACKUP
-- ============================================================
