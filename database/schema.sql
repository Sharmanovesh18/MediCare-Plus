-- Hospital Management System Database Schema --

CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Patients) Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    dob DATE,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience INT NOT NULL, -- years
    fees DECIMAL(10, 2) NOT NULL,
    about TEXT,
    availability JSON, -- Example: {"Mon": ["09:00", "17:00"], "Tue": ["09:00", "12:00"]}
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Insert Mock Data --

-- Initial Admin (Password: admin123 - hashed later, but for demo: $2b$10$7/r7N.0k4y9V/kG...)
INSERT INTO admins (name, email, password) VALUES ('Hospital Admin', 'admin@hospital.com', '$2b$10$7/r7N.0k4y9V/kG8z... (bcrypt hash)');

-- Initial Doctors
INSERT INTO doctors (name, email, password, specialization, experience, fees, about, image_url) 
VALUES 
('Dr. Richard James', 'richard@hospital.com', '$2b$10$7/r7N.0k4y9V...', 'General Physician', 5, 500, 'Experienced in general medicine.', 'https://img.freepik.com/free-photo/handsome-young-male-doctor-with-white-coat-standing-with-hand-pocket-isolated-white-background_662251-2936.jpg'),
('Dr. Sarah Connor', 'sarah@hospital.com', '$2b$10$7/r7N.0k4y9V...', 'Gynecologist', 8, 800, 'Expert in maternal health.', 'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827775.jpg'),
('Dr. Michael Scott', 'michael@hospital.com', '$2b$10$7/r7N.0k4y9V...', 'Dermatologist', 10, 1000, 'Skin care specialist.', 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg');
