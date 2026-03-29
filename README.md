# Movie Ticket Booking System

## Overview
A complete full-stack movie ticket booking system where users can browse movies, select seats, and book tickets, while administrators manage movies, theaters, shows, and view bookings. The system includes real-time seat availability, interactive seat selection, and comprehensive admin controls with financial reporting.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Render/Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (Frontend), Render (Backend & Database)

## Features

### Customer Features
- User registration and login with JWT authentication
- Browse movies with posters, genre, duration, language, and ratings
- View theaters showing selected movies
- Select showtimes with dynamic pricing
- Interactive seat selection with color-coded status (green - available, red - booked, blue - selected)
- Booking confirmation with ticket generation
- View booking history with all past reservations
- Profile management with personal details

### Admin Features
- Admin authentication with secure password hashing
- Dashboard with real-time statistics (total movies, theaters, shows, bookings, users, unread messages)
- Movie management with Cloudinary image upload
- Theater and hall management with auto-seat generation
- Show management with date and time scheduling
- View all user bookings with search and filter options
- Contact messages management with read/unread status
- System status monitoring (server, database, Cloudinary, API health)
- Financial reports with revenue tracking and CSV export
- User account lock/unlock for account restrictions
- Data archive to clean up old bookings (30+ days)


## Environment Variables

### Backend (.env)
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

text

### Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000

text

## Local Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sabinpabt23/movie-booking-app.git
cd movie-booking-app
Install dependencies

bash
npm install
Set up PostgreSQL database

Create a database named movie_booking_db

Run the SQL schema provided in the documentation

Configure environment variables

Copy .env.example to .env and fill in your database and Cloudinary credentials

Create .env.local for frontend with API URL

Start the backend server

bash
npm run server
Start the frontend development server

bash
npm run dev
Access the application

Frontend: http://localhost:3000

Backend API: http://localhost:5000/api/test

API Documentation: http://localhost:5000/api-docs

Admin Login: http://localhost:3000/admin/login

Admin Access
Email: admin@example.com

Password: admin123

Database Schema
The database includes the following tables:

user - Customer accounts

movie - Movie details with Cloudinary poster URLs

theater - Theater information

hall - Individual halls within theaters

show - Showtimes linking movies to halls

seat - Individual seats within halls

show_seat - Seat status for each show

booking - User bookings

ticket - Generated tickets for bookings

contact_messages - User inquiries

admin - Admin accounts

Deployment
The application is deployed on:

Frontend: Vercel (https://movie-booking-app.vercel.app)

Backend: Render (https://movie-booking-app-qhgc.onrender.com)

Database: Render PostgreSQL

API Documentation
Swagger documentation is available at /api-docs endpoint when running the backend server.

Contributors
Sabin Pant
