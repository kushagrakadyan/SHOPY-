# SHOPY — Multi-Tenant E-Commerce SaaS Platform

SHOPY is a comprehensive **Multi-Tenant E-Commerce SaaS Platform** built using the **MERN Stack**, designed to provide a unified ecosystem where multiple independent vendors can create, customize, and manage their own online stores while customers can discover products, add items to their cart, place orders, and complete secure payments through a seamless shopping experience.

The primary objective of SHOPY is to simplify the process of establishing and managing an online business by providing vendors with a centralized platform instead of requiring every business to develop and maintain a separate e-commerce website. Each vendor can operate within an isolated store environment while sharing the same underlying application infrastructure. This makes SHOPY a scalable SaaS-oriented solution suitable for small and medium-sized businesses looking to establish their digital presence.

## Project Overview

SHOPY follows a **multi-tenant architecture**, where multiple vendors operate independently within the same platform. The system implements role-based access control to provide different functionalities to **Super Admins, Vendors, and Customers**.

Super Admins have centralized control over the platform and can monitor stores, users, products, orders, and overall business performance. Vendors can register their businesses, create and manage their storefronts, add and update products, manage inventory, monitor orders, and analyze sales performance. Customers can browse products across available stores, manage their shopping cart, place orders, make payments, and track their purchases.

The application is designed with a strong focus on **security, scalability, modularity, performance, and maintainability**.

## Key Features

### Multi-Tenant Store Management

* Independent vendor storefronts within a single platform.
* Tenant-specific data isolation.
* Vendor-specific product and inventory management.
* Store configuration and management.
* Scalable architecture for supporting multiple businesses.

### Role-Based Access Control

SHOPY provides separate permissions and workflows for:

* **Super Admin**
* **Vendor**
* **Customer**

Authentication and authorization are handled using secure **JWT-based authentication**, while passwords are protected using **Bcrypt.js** hashing.

### Product & Inventory Management

Vendors can:

* Create new products.
* Update product information.
* Delete products.
* Manage prices.
* Manage stock quantities.
* Upload product images.
* Manage product variants.
* Monitor inventory.

Product images and media assets are managed using **Cloudinary**.

### Shopping & Checkout

Customers can:

* Browse products.
* View product details.
* Add products to cart.
* Update quantities.
* Remove products.
* Review cart information.
* Proceed through the checkout process.
* Place orders.
* Receive transaction confirmations.

Global cart state is managed using **Redux Toolkit**.

### Secure Payments

SHOPY integrates **Stripe API** to support secure online payments. Payment processing, transaction verification, and order status updates are handled through backend services and Stripe webhooks.

### Order Management

The platform maintains complete order information including:

* Customer details.
* Store/vendor information.
* Ordered products.
* Quantities.
* Prices.
* Payment status.
* Order status.
* Transaction details.

### Sales Analytics

SHOPY provides analytical dashboards for administrators and vendors to monitor important business metrics such as:

* Revenue.
* Order volume.
* Sales trends.
* Product performance.
* Store performance.

Interactive charts and visualizations can be implemented using **Recharts or Chart.js**.

### Email Notifications

**Nodemailer** is used for automated email transactions such as:

* Registration confirmations.
* Order confirmations.
* Payment notifications.
* Order status updates.

## Technology Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Recharts / Chart.js

### Backend

* Node.js
* Express.js
* JWT
* Bcrypt.js
* Helmet.js

### Database

* MongoDB
* Mongoose

### External Integrations

* Stripe API — Payment Processing
* Cloudinary — Image and Media Storage
* Nodemailer — Email Notifications


**High-Level Architecture**

                    ┌──────────────┐
                    │    User      │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ React        │
                    │ Redux        │
                    │ Tailwind CSS │
                    └──────┬───────┘
                           ↓
                       REST API
                           ↓
                    ┌──────────────┐
                    │ Node.js      │
                    │ Express.js   │
                    │ JWT / RBAC   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ MongoDB      │
                    │ Mongoose     │
                    └──────────────┘
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
        Cloudinary       Stripe       Nodemailer
### Deployment

The application can be deployed using modern cloud platforms such as:

* Vercel for the frontend.
* Render or AWS for backend services.
* MongoDB Atlas for cloud database hosting.

## Security

Security is an important part of SHOPY's architecture. The platform uses JWT-based authentication, password hashing with Bcrypt.js, role-based authorization, secure API handling, tenant-specific data isolation, HTTP security headers through Helmet.js, and protected payment workflows.

The multi-tenant architecture ensures that vendors can access and manage only the resources belonging to their respective stores, preventing unauthorized access to another tenant's data.

## Project Architecture

The project follows a modular structure separating frontend, backend, database models, controllers, routes, middleware, services, and reusable components. This separation allows the team to develop different modules independently while maintaining a clean and scalable codebase.

The development workflow follows GitHub-based team collaboration where every team member works on an individual branch. Completed features are reviewed and integrated into the main branch through pull requests.

## Development Goal

The ultimate goal of SHOPY is to create a production-ready e-commerce SaaS platform that demonstrates real-world software engineering practices including **full-stack development, REST API design, authentication, authorization, database modeling, multi-tenancy, third-party API integration, payment processing, cloud storage, analytics, Git-based collaboration, testing, and deployment**.

SHOPY is being developed as a collaborative team project with a strong emphasis on clean architecture, meaningful GitHub contributions, modular development, secure implementation, and continuous integration of frontend and backend components.

**SHOPY — One Platform. Multiple Stores. Seamless Commerce.**
