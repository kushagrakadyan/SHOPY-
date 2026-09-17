
# 🛍️ SHOPY — Multi-Tenant E-Commerce SaaS Platform

<p align="center">
  <strong>One Platform. Multiple Stores. Seamless Commerce.</strong>
</p>

<p align="center">
  A full-stack MERN-based e-commerce SaaS platform designed to bring multiple vendors and customers together in one unified ecosystem.
</p>

<p align="center">
  🌐 <strong>Live Demo:</strong>
  <a href="https://shopy12.netlify.app/">https://shopy12.netlify.app/</a>
</p>

---

## 📌 Overview

**SHOPY** is a comprehensive **Multi-Tenant E-Commerce SaaS Platform** built using the **MERN Stack**.

The platform is designed to allow multiple independent vendors to operate their own online stores while sharing the same underlying application infrastructure. Vendors can manage their stores, products, inventory, and orders, while customers can discover products, manage their cart and wishlist, place orders, make payments, and track purchases.

The project focuses on building a complete real-world e-commerce ecosystem with **full-stack development, REST APIs, authentication, authorization, database management, real-time communication, personalized recommendations, payment integration, and cloud deployment**.

---

## 🎯 Project Objective

The main objective of SHOPY is to simplify the process of establishing and managing an online business through a centralized SaaS platform.

Instead of every business developing and maintaining a separate e-commerce website, SHOPY provides a shared platform where multiple vendors can manage independent storefronts while customers get a unified shopping experience.

### Core Architecture

```text
                         SHOPY PLATFORM
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
         SUPER ADMIN        VENDOR           CUSTOMER
              │                │                │
       Platform Control    Store Management    Shopping
       Users & Stores      Products            Cart
       Orders              Inventory           Wishlist
       Analytics           Orders              Checkout
                           Analytics           Orders
                                                │
                                                ▼
                                            Payments
# ✨ Key Features

## 🏪 Multi-Tenant Store Management

* Multiple independent vendor stores
* Vendor-specific product management
* Vendor-specific inventory management
* Store configuration and management
* Tenant-aware resource access
* Shared application infrastructure
* Scalable SaaS-oriented architecture

---

## 👥 Role-Based Access Control

SHOPY supports different roles and workflows:

| Role           | Responsibilities                       |
| -------------- | -------------------------------------- |
| 👑 Super Admin | Platform-level management              |
| 🏪 Vendor      | Store, products, inventory and orders  |
| 🛒 Customer    | Product discovery, shopping and orders |

Authentication and authorization are handled using **JWT-based authentication** with protected routes and role-based access control.

---

## 🛍️ Product & Inventory Management

Vendors can manage their product catalog through the platform.

### Product Operations

* Create products
* Update products
* Delete products
* Manage product prices
* Manage stock quantities
* Product categorization
* Product ratings and reviews
* Product image management
* Inventory management

---

## 🔎 Smart Search & Advanced Filters

Customers can quickly find products using:

* Keyword search
* Category filtering
* Price range
* Minimum rating
* Availability
* Sorting

### Sorting Options

* Newest
* Price: Low → High
* Price: High → Low
* Rating
* Name: A → Z

The filtering and sorting pipeline is handled through the backend API.

---

## ❤️ Wishlist

Customers can save products for later.

### Wishlist Features

* Add products to wishlist
* Remove products
* Prevent duplicate entries
* View saved products
* Move wishlist products to cart

The wishlist also works with the recommendation and alert systems.

---

## 🤖 Personalized Product Recommendations

SHOPY includes a deterministic **content-based / hybrid recommendation system**.

The recommendation engine considers signals such as:

* Product category
* Price similarity
* Product ratings
* Number of reviews
* Wishlist preferences
* Previous order information

### Recommendation Flow

```text
Product Information
        +
User Behaviour
        ↓
Recommendation Scoring
        ↓
Relevant Products
        ↓
"You May Also Like"
```

The current recommendation engine uses scoring logic rather than a separately trained deep-learning model.

---

## 👀 Recently Viewed Products

SHOPY provides a recently viewed products feature to improve product discovery.

The system:

* Tracks recently viewed products
* Prevents duplicate entries
* Moves revisited products to the top
* Maintains a limited history
* Stores the information using browser local storage

This provides personalization without unnecessary database requests.

---

## 🛒 Shopping Cart & Checkout

Customers can:

* Add products to cart
* Increase or decrease quantities
* Remove products
* View cart details
* Review order totals
* Enter shipping information
* Proceed to checkout
* Place orders

Frontend application state is managed using **Redux**.

---

## 💳 Secure Payments

SHOPY integrates **Stripe** for online payment processing.

### Payment Flow

```text
Customer
   ↓
Shopping Cart
   ↓
Checkout
   ↓
Stripe Payment
   ↓
Payment Verification
   ↓
Order Creation
   ↓
Order Confirmation
```

Payment credentials and secrets are handled through environment variables.

---

## 📦 Order Management

The platform maintains complete order information including:

* Customer details
* Vendor/store information
* Ordered products
* Quantities
* Prices
* Shipping information
* Payment status
* Order status
* Transaction information

### Order Lifecycle

```text
Processing
    ↓
 Shipped
    ↓
Delivered
```

---

## 🔔 Real-Time Order Notifications

SHOPY uses **Socket.IO** for real-time communication.

When an order status changes, the relevant customer can receive an immediate notification without manually refreshing the page.

### Flow

```text
Admin Updates Order
        ↓
Backend Updates Database
        ↓
Socket.IO Event
        ↓
Customer Browser
        ↓
Real-Time Notification
```

---

## 💰 Price Drop Alerts

Customers can receive notifications when a wishlist product becomes cheaper.

Example:

```text
Previous Price → ₹50,000
New Price      → ₹45,000
                    ↓
             Price Drop Alert 🔔
```

The alert is triggered when:

```text
New Price < Previous Price
```

---

## 📦 Back-in-Stock Alerts

Customers can also receive notifications when an unavailable wishlist product becomes available again.

Example:

```text
Previous Stock → 0
New Stock      → 10
                    ↓
          Back-in-Stock Alert 🔔
```

The alert is triggered when:

```text
Previous Stock <= 0
AND
New Stock > 0
```

These alerts use the existing real-time Socket.IO infrastructure.

---

# 🔐 Authentication & Security

Security is an important part of the platform.

SHOPY includes:

* JWT-based authentication
* Password hashing
* Role-based authorization
* Protected API routes
* Secure authentication cookies
* CORS configuration
* Environment-based secrets
* Centralized API error handling
* Tenant-aware resource access
* Protected administrative operations

Sensitive credentials are never intended to be stored directly in source code.

---

# 📧 Email Notifications

The backend supports transactional email functionality.

Email-based workflows can include:

* Registration confirmation
* Password reset
* Order confirmation
* Order status updates
* Payment-related notifications

Email credentials are configured through environment variables.

---

# 🖼️ Media Management

Product images and media can be managed through cloud storage services such as **Cloudinary**.

This allows product media to be handled separately from the application source code.

---

# 📊 Analytics

The platform architecture supports business analytics for administrators and vendors.

Important business metrics include:

* Revenue
* Order volume
* Sales trends
* Product performance
* Store performance

Dashboard visualizations can be built using charting libraries such as Recharts or Chart.js.

---

# 🏗️ System Architecture

```text
                         USERS
                           │
                           ▼
                ┌────────────────────┐
                │   React Frontend   │
                │  Redux + Router    │
                └─────────┬──────────┘
                          │
                     REST APIs
                          │
                          ▼
                ┌────────────────────┐
                │ Node.js + Express  │
                │      Backend       │
                └──────┬───────┬─────┘
                       │       │
                       │       └──────────────┐
                       ▼                      ▼
              ┌────────────────┐     ┌────────────────┐
              │    MongoDB     │     │    Socket.IO   │
              │    Database    │     │ Real-Time Data │
              └────────────────┘     └────────────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ External Services  │
              │ Stripe             │
              │ Cloudinary         │
              │ Email Services     │
              │ OAuth / Redis      │
              └────────────────────┘
```

---

# 🔄 Frontend–Backend Integration

The frontend communicates with the backend through REST APIs.

```text
React Component
       ↓
Redux Action
       ↓
Axios
       ↓
Express Route
       ↓
Controller
       ↓
Mongoose
       ↓
MongoDB
```

For real-time features:

```text
Node.js Backend
       ↓
    Socket.IO
       ↓
Authenticated User Room
       ↓
React Frontend
       ↓
Notifications / Live Updates
```

A centralized Axios configuration is used for consistent API communication and authentication handling.

---

# 🧩 Technology Stack

## Frontend

* React.js
* Redux
* React Router DOM
* Axios
* CSS
* Responsive UI

## Backend

* Node.js
* Express.js
* JWT
* Password Hashing
* REST APIs
* Socket.IO

## Database

* MongoDB
* Mongoose

## External Integrations

* **Stripe** — Payment processing
* **Cloudinary** — Image and media storage
* **Nodemailer / Email Services** — Transactional emails
* **Google OAuth** — Authentication where configured
* **Redis / Upstash** — Caching/infrastructure where configured

## Deployment

* **Netlify** — Frontend
* **Render / AWS / Cloud Platform** — Backend
* **MongoDB Atlas** — Cloud database

---

# 📁 Project Structure

```text
SHOPY/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── migrations/
│   ├── mails/
│   ├── tests/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── actions/
│       ├── components/
│       ├── constants/
│       ├── reducers/
│       ├── utils/
│       ├── images/
│       ├── App.js
│       └── store.js
│
├── Dockerfile
├── netlify.toml
├── package.json
└── README.md
```

---

# 🚀 Deployment Architecture

The production application separates the frontend and backend services.

```text
                   Internet
                      │
                      ▼
          ┌──────────────────────┐
          │       Netlify        │
          │    React Frontend    │
          └──────────┬───────────┘
                     │
                 HTTPS API
                     │
                     ▼
          ┌──────────────────────┐
          │   Cloud Backend      │
          │ Node + Express       │
          │ Socket.IO            │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │    MongoDB Atlas     │
          │      Database        │
          └──────────────────────┘
```

### 🌐 Live Frontend

**SHOPY:** [https://shopy12.netlify.app/](https://shopy12.netlify.app/)

> The frontend is deployed on Netlify. Complete production functionality requires the backend, database, and required third-party services to be properly configured with their respective environment variables.

---

# ⚙️ Environment Variables

## Frontend

```env
REACT_APP_API_URL=<production-backend-url>
REACT_APP_SOCKET_URL=<production-backend-url>
```

## Backend

```env
NODE_ENV=production
FRONTEND_URL=<frontend-url>

DB_HOSTED_URI=<mongodb-atlas-uri>

JWT_SECRET_KEY=<strong-secret>
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES=90

RESULT_PER_PAGE=12
```

Additional environment variables may be required for enabled services such as:

* Stripe
* Cloudinary
* Google OAuth
* SMTP / Email
* Redis
* Other external APIs

> ⚠️ Never commit real API keys, passwords, database credentials, JWT secrets, or production environment files to GitHub.

---

# 🧪 Testing & Validation

The project follows a validation workflow covering:

* Backend syntax checks
* API route validation
* Authentication flows
* Product APIs
* Order APIs
* Wishlist functionality
* Recommendation functionality
* Socket.IO functionality
* API error handling
* Frontend build validation
* Git integration checks
* Environment and secret checks

---

# 🔀 Git & Team Development Workflow

SHOPY is developed collaboratively using Git and GitHub.

```text
Feature / Module
       ↓
Individual Branch
       ↓
Development
       ↓
Testing
       ↓
Code Review
       ↓
Merge
       ↓
Main Branch
       ↓
Deployment
```

This workflow allows team members to work independently while maintaining a structured and maintainable codebase.

---

# 👥 Team Project

SHOPY is a collaborative team project involving work across:

* Frontend development
* Backend development
* Database management
* Authentication
* API integration
* E-commerce functionality
* Real-time communication
* Recommendation systems
* Testing
* Deployment
* Documentation

The project emphasizes teamwork, modular development, clean architecture, and integration of independently developed components.

---

# 🎓 Learning Outcomes

Through SHOPY, the team gained practical experience in:

* MERN stack development
* Full-stack application architecture
* REST API development
* React component design
* Redux state management
* MongoDB and Mongoose
* Authentication and authorization
* Multi-tenant architecture
* Payment integration
* Real-time communication
* Cloud deployment
* Git and GitHub collaboration
* API error handling
* Production configuration
* Software engineering practices

---

# 🔮 Future Enhancements

Potential future improvements include:

* Advanced vendor analytics
* More sophisticated ML-based recommendations
* Product comparison
* AI shopping assistant
* Inventory forecasting
* Vendor subscription management
* Advanced dashboard analytics
* Automated CI/CD pipelines
* Enhanced tenant customization
* Advanced caching and performance optimization

---

# 📌 Project Status

**SHOPY is an actively developed collaborative project.**

The core e-commerce functionality and multiple advanced features have been implemented, with the architecture designed to support further SaaS capabilities and production integrations.

---

# 🌐 Live Project

<p align="center">

### 🛍️ SHOPY

**One Platform. Multiple Stores. Seamless Commerce.**

<br>

<a href="https://shopy12.netlify.app/">
  🚀 Visit SHOPY
</a>

</p>

---

## ⭐ If you find this project interesting, feel free to explore the repository and the live application.

**Built with ❤️ by the SHOPY Team**

```
```
