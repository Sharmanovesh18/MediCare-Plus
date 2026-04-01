# Medicare Plus - Hospital Management System

A complete Full Stack Hospital Management System built with React, Node.js, Express, and MySQL.

## 🚀 Features

- **Authentication System**: JWT-based login for Admin and Patients.
- **Admin Dashboard**: Manage doctors (Add/View/Delete) and view all appointments.
- **Patient Dashboard**: Register, search doctors by specialization, and book appointments.
- **Appointment System**: Real-time slot selection with double-booking prevention.
- **Modern UI**: Clean and responsive design using Tailwind CSS and Lucide Icons.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Auth**: JSON Web Tokens (JWT) and Bcrypt.js.

## 📋 Prerequisites

- **Node.js** installed on your machine.
- **MySQL** Server running locally.

## ⚙️ Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Run the script provided in `database/schema.sql` to create the database and tables.
3. Update specific records if needed.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Rename `.env.example` to `.env` (or create one) and fill in your details:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hospital_management
   JWT_SECRET=any_random_string
   ADMIN_EMAIL=admin@hospital.com
   ADMIN_PASSWORD=admin123
   ```
3. Run: `npm install`
4. Run: `npm start` (or `npm run dev` if you have nodemon)

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Ensure you have a `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
3. Run: `npm install`
4. Run: `npm run dev`

## 📂 Folder Structure

- `backend/`: Express server, routes, controllers, and DB config.
- `frontend/`: React application with components, pages, and context.
- `database/`: MySQL schema script.

## 👩‍⚕️ Demo Credentials

- **Admin Login**: `admin@hospital.com` / `admin123`
- **Patient Login**: Create a new account via the "Sign Up" page.
