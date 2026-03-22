-- =====================================================
-- MOVIE TICKET BOOKING SYSTEM - PostgreSQL Schema
-- =====================================================

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS TICKET CASCADE;
DROP TABLE IF EXISTS SHOW_SEAT CASCADE;
DROP TABLE IF EXISTS BOOKING CASCADE;
DROP TABLE IF EXISTS SEAT CASCADE;
DROP TABLE IF EXISTS SHOW CASCADE;
DROP TABLE IF EXISTS HALL CASCADE;
DROP TABLE IF EXISTS THEATER CASCADE;
DROP TABLE IF EXISTS MOVIE CASCADE;
DROP TABLE IF EXISTS CONTACT_MESSAGES CASCADE;
DROP TABLE IF EXISTS ADMIN CASCADE;
DROP TABLE IF EXISTS "USER" CASCADE;

-- =====================================================
-- 1. USER TABLE
-- =====================================================
CREATE TABLE "USER" (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    user_dob DATE,
    user_reg_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- =====================================================
-- 2. MOVIE TABLE
-- =====================================================
CREATE TABLE movie (
    movie_id SERIAL PRIMARY KEY,
    movie_title VARCHAR(200) NOT NULL UNIQUE,
    movie_description TEXT NOT NULL,
    movie_duration INTEGER NOT NULL CHECK (movie_duration > 0),
    movie_genre VARCHAR(50) NOT NULL,
    movie_rating DECIMAL(3,1) CHECK (movie_rating >= 0 AND movie_rating <= 10),
    movie_poster TEXT,
    movie_release_date DATE NOT NULL,
    movie_language VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. THEATER TABLE
-- =====================================================
CREATE TABLE theater (
    theater_id SERIAL PRIMARY KEY,
    theater_name VARCHAR(100) NOT NULL,
    theater_location VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. HALL TABLE
-- =====================================================
CREATE TABLE hall (
    hall_id SERIAL PRIMARY KEY,
    theater_id INTEGER NOT NULL REFERENCES theater(theater_id) ON DELETE CASCADE,
    hall_number VARCHAR(10) NOT NULL,
    hall_capacity INTEGER NOT NULL CHECK (hall_capacity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(theater_id, hall_number)
);

-- =====================================================
-- 5. SHOW TABLE
-- =====================================================
CREATE TABLE show (
    show_id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES movie(movie_id) ON DELETE CASCADE,
    hall_id INTEGER NOT NULL REFERENCES hall(hall_id) ON DELETE CASCADE,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL CHECK (ticket_price > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hall_id, show_date, show_time)
);

-- =====================================================
-- 6. SEAT TABLE
-- =====================================================
CREATE TABLE seat (
    seat_id SERIAL PRIMARY KEY,
    hall_id INTEGER NOT NULL REFERENCES hall(hall_id) ON DELETE CASCADE,
    seat_number VARCHAR(5) NOT NULL,
    UNIQUE(hall_id, seat_number)
);

-- =====================================================
-- 7. BOOKING TABLE
-- =====================================================
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
    show_id INTEGER NOT NULL REFERENCES show(show_id) ON DELETE CASCADE,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2)
);

-- =====================================================
-- 8. SHOW_SEAT TABLE
-- =====================================================
CREATE TABLE show_seat (
    show_id INTEGER NOT NULL REFERENCES show(show_id) ON DELETE CASCADE,
    seat_id INTEGER NOT NULL REFERENCES seat(seat_id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('available', 'selected', 'booked')),
    booking_id INTEGER REFERENCES booking(booking_id) ON DELETE SET NULL,
    selected_session_id VARCHAR(100),
    selected_expiry TIMESTAMP,
    PRIMARY KEY (show_id, seat_id)
);

-- =====================================================
-- 9. TICKET TABLE
-- =====================================================
CREATE TABLE ticket (
    ticket_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL UNIQUE REFERENCES booking(booking_id) ON DELETE CASCADE,
    ticket_issue_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. CONTACT_MESSAGES TABLE
-- =====================================================
CREATE TABLE contact_messages (
    message_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. ADMIN TABLE
-- =====================================================
CREATE TABLE ADMIN (
    admin_id SERIAL PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    admin_role VARCHAR(20) DEFAULT 'super_admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- =====================================================
-- INSERT DEFAULT ADMIN USER
-- =====================================================
INSERT INTO ADMIN (admin_name, admin_email, admin_password, admin_role) 
VALUES ('Super Admin', 'admin@example.com', 'admin123', 'super_admin');

-- =====================================================
-- VERIFY TABLES
-- =====================================================
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;