# 🛍️ E-Commerce Platform

A full-stack e-commerce solution built with Django REST Framework and React, featuring JWT authentication, shopping cart functionality, and order management.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## 🚀 Overview

This is a complete e-commerce platform that allows users to browse products, manage a shopping cart, place orders, and track their order history. The application features a clean, responsive design with a modern user interface.

**Repository:** [https://github.com/ArshiaDSh/E-commerce](https://github.com/ArshiaDSh/E-commerce)

**Backend:** Django REST API running on `http://localhost:8000`  
**Frontend:** React application running on `http://localhost:3000`

---

## ✨ Features

### Customer Features

- ✅ **User Authentication** - JWT-based registration and login
- ✅ **Product Browsing** - View all products with search functionality
- ✅ **Product Details** - Detailed product pages with quantity selection
- ✅ **Shopping Cart** - Add/remove items, update quantities (UUID-based cart)
- ✅ **Order Management** - Place orders and view order history
- ✅ **Order Status Tracking** - View order status (Pending, Shipped, Delivered, Failed)
- ✅ **Persistent Cart** - Cart stored in localStorage and persisted across sessions

### Technical Features

- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **Responsive Design** - Mobile-first design with Tailwind CSS
- ✅ **Toast Notifications** - User-friendly feedback for actions
- ✅ **Protected Routes** - User route protection

---

## 💻 Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Django 4.2** | Web framework |
| **Django REST Framework** | API development |
| **Simple JWT** | JWT authentication |
| **django-cors-headers** | CORS handling |
| **SQLite** | Database (development) |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **React Router v6** | Routing |
| **Redux Toolkit** | State management |
| **Axios** | API calls |
| **Tailwind CSS** | Styling |
| **React Hot Toast** | Notifications |
| **Vite** | Build tool |

---

## 🔧 Backend Setup

### Prerequisites

- Python 3.10+
- pip
- virtualenv (recommended)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/ArshiaDSh/E-commerce.git
cd E-commerce/Backend
```

2. **Create and activate a virtual environment**

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Run migrations**

```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create a superuser (admin)**

```bash
python manage.py createsuperuser
```

6. **Start the development server**

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

### Backend Environment Variables

Create a `.env` file in the backend root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 🎨 Frontend Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation Steps

1. **Navigate to the frontend directory**

```bash
cd E-commerce/Frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api/
```

4. **Start the development server**

```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | JWT login (returns access/refresh tokens) |
| POST | `/api/auth/refresh/` | Refresh JWT token |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List all products (with filtering) |
| GET | `/api/products/{id}/` | Retrieve a specific product |
| POST | `/api/products/` | Create product (admin only) |
| PUT/PATCH | `/api/products/{id}/` | Update product (admin only) |
| DELETE | `/api/products/{id}/` | Delete product (admin only) |

### Cart (UUID-based)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/carts/{cart_id}/` | Get cart with items |
| POST | `/api/carts/` | Create a new cart |
| DELETE | `/api/carts/{cart_id}/` | Delete cart |
| GET | `/api/carts/{cart_id}/items/` | List cart items |
| POST | `/api/carts/{cart_id}/items/` | Add item to cart |
| PATCH | `/api/carts/{cart_id}/items/{item_id}/` | Update item quantity |
| DELETE | `/api/carts/{cart_id}/items/{item_id}/` | Remove item |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List user's orders |
| POST | `/api/orders/` | Create a new order |
| GET | `/api/orders/{id}/` | Get order details |

---

## 📁 Project Structure

### Backend Structure

```
Backend/
├── ecommerce_backend/
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py
├── core/
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── serializers.py       # DRF serializers
│   ├── urls.py              # API routes
│   └── admin.py             # Django admin configuration
├── media/                   # User uploaded files
├── static/                  # Static files
├── manage.py
└── requirements.txt
```

### Frontend Structure

```
Frontend/
├── src/
│   ├── api/                 # API services
│   │   ├── axios.js         # Axios configuration
│   │   └── index.js         # API endpoints
│   ├── components/          # React components
│   │   ├── common/          # Reusable components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── store/               # Redux store
│   │   └── slices/          # Redux slices
│   │       ├── authSlice.js
│   │       ├── cartSlice.js
│   │       └── productSlice.js
│   ├── routes/              # Routing configuration
│   │   ├── index.jsx
│   │   └── PrivateRoute.jsx
│   ├── utils/               # Helper functions
│   │   ├── apiHelpers.js
│   │   └── imageHelpers.js
│   └── main.jsx             # Application entry point
├── .env                     # Environment variables
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🌍 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Required |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Allowed hosts | `localhost,127.0.0.1` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 🔗 Quick Links

- [GitHub Repository](https://github.com/ArshiaDSh/E-commerce)
- [Backend API Documentation](#-api-endpoints)
- [Installation Guide](#-backend-setup)

---

**Built with ❤️ by ArshiaDSh**