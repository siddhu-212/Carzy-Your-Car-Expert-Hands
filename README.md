# 🚗 CarZy – Automotive Services Marketplace Platform

## 🌐 Live Demo

🔗 https://carzy-gxvw.onrender.com

---

# 📌 Overview

**CarZy** is a full-stack automotive services marketplace platform developed as a **semester group project** at **VIT Bhopal University**.

The platform connects car owners with local automotive service providers through a centralized digital system where users can:

- Discover nearby garages
- Compare automotive services
- Book appointments online
- Manage bookings efficiently

The project focuses on providing a lightweight and user-friendly solution for automotive service booking, especially for **Tier-2 and Tier-3 cities**.

---

# ✨ Features

## 👤 Customer Features
- Browse available garages
- Filter garages by city and service category
- Book automotive services online
- View booking history
- Cancel bookings

## 🛠️ Vendor Features
- Vendor registration and login
- Manage garage bookings
- View customer requests
- Dedicated vendor dashboard

## 🛡️ Admin Features
- Admin authentication
- Monitor all bookings
- View registered vendors
- System management dashboard

---

## 📄 Project Report

# 📄 Project Report

Download the detailed project report here:

[CarZy Project Report PDF](docs/CarZy_Project_Report.pdf)

---

# 🧰 Tech Stack

## 🎨 Frontend
- HTML5
- CSS3
- JavaScript

## ⚙️ Backend
- Node.js
- Express.js

## 🗄️ Database
- SQLite

## 🔗 Other Technologies
- REST APIs
- Single Page Application (SPA) Architecture
- Local Storage Authentication

---

# 🏗️ System Architecture

The project follows a **3-layer client-server architecture**:

1. **Presentation Layer (Frontend)**  
   Handles user interaction and UI rendering.

2. **Application Layer (Backend)**  
   Manages APIs, authentication, and business logic.

3. **Data Layer (Database)**  
   Stores garages, bookings, vendors, and customer data.

---

# 📂 Project Structure

```bash
carzy-split/
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   └── carzy.db
│
├── docs/
│   └── CarZy_Project_Report.pdf
│
└── README.md
```

---

# 👥 User Roles

| Role | Functionalities |
|------|----------------|
| **Customer** | Browse garages, book services, cancel bookings |
| **Vendor** | Manage garage bookings |
| **Admin** | Monitor system activities and vendors |

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

## 2️⃣ Navigate to Project Directory

```bash
cd carzy-split
```

## 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

## 4️⃣ Start the Server

```bash
npm start
```

## 5️⃣ Open the Application

Visit:

```bash
http://localhost:3000
```

---

# 🔌 API Endpoints

## Garage APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/garages` | Get all garages |
| GET | `/api/garages/:id` | Get garage by ID |

---

## Booking APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

---

## Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customer/signup` | Customer registration |
| POST | `/api/customer/login` | Customer login |
| POST | `/api/vendor/signup` | Vendor registration |
| POST | `/api/vendor/login` | Vendor login |

---

## Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/bookings` | View all bookings |

---

# 📊 Key Highlights

- ✅ Full-stack web application
- ✅ 17 REST API endpoints
- ✅ Responsive frontend design
- ✅ Role-based authentication
- ✅ SQLite relational database
- ✅ SPA (Single Page Application)
- ✅ Lightweight architecture without cloud dependency

---

# 🔮 Future Enhancements

- JWT Authentication
- Password hashing using bcrypt
- Online payment gateway integration
- Cloud deployment
- Email/SMS notifications
- Real-time slot availability management
- Mobile application support
- Customer review and rating system

---

# 👨‍💻 Team Members

- **Siddhant Kumar**
- **Devender Singh**
- **Ashwarya Raj Singh**
- **Nitin G. Deshpande**

---

# 🏫 Institution

**VIT Bhopal University**  
School of Computer Science Engineering and Artificial Intelligence (SCAI)

---

# 📄 License

This project was developed for educational purposes as part of a semester academic project.